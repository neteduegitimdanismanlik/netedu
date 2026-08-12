import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getRubric, calculateGrade } from '@/app/rubrics/schema'
import { getMarkingModel, getPitfalls } from '@/app/rubrics/checker-guards'
import { getSubjectNotes } from '@/app/rubrics/subject-notes'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 4000-word EE is roughly 24k characters. The old 12k limit silently cut every
// long piece in half, so conclusions were never marked. Raising this multiplies
// input cost by 3 (three-shot averaging) — that is the intended trade.
const MAX_CONTENT_CHARS = 60000
const MAX_STORED_CHARS = 60000

/* ------------------------------------------------------------------ */
/* Marking guards                                                      */
/* ------------------------------------------------------------------ */

/**
 * Marking behaviour that is not rubric text: how to apply best-fit, what
 * separates the top band from the middle, and the mistakes a model reliably
 * makes on this rubric. Subject-specific entries are filtered in; the
 * six-versus-four block is trimmed to the criteria actually being marked.
 */
function buildGuardBlock(rubricId: string, subject: string, criteriaIds: string[]): string {
  const model = getMarkingModel(rubricId)
  if (!model) return ''

  const parts: string[] = []

  parts.push(`HOW TO APPLY THE BANDS
${model.bestFit.map(r => `- ${r}`).join('\n')}
${model.zeroRules.map(r => `- ${r}`).join('\n')}`)

 const subj = (subject || '').toLowerCase()
  const relevant = model.sixVersusFour.filter(
    s => criteriaIds.includes(s.criterionId) &&
         (!s.subjects || s.subjects.some(x => subj.includes(x.toLowerCase())))
  )
  if (relevant.length) {
    parts.push(`TOP BAND VERSUS MIDDLE BAND
${relevant.map(s => `Criterion ${s.criterionId}
  Top band: ${s.six}
  Middle band: ${s.four}
  What moves the work up: ${s.movingLine}`).join('\n\n')}`)
  }

  const pitfalls = getPitfalls(rubricId, subject)
  if (pitfalls.length) {
    parts.push(`COMMON MARKING ERRORS — do not make these
${pitfalls.map(p => `[${p.severity}] Wrong assumption: ${p.claim}
  Actually: ${p.reality}`).join('\n\n')}`)
  }

  const notes = getSubjectNotes(rubricId, subject)
  if (notes.length) {
    parts.push(`SUBJECT-SPECIFIC EXPECTATIONS — ${subject}
${notes.map(n => `- ${n}`).join('\n')}`)
  }

  return '\n\n' + parts.join('\n\n') + '\n'
}

/* ------------------------------------------------------------------ */
/* Exemplar calibration                                                */
/* ------------------------------------------------------------------ */

/**
 * Pulls calibration anchors from approved alumni submissions for the same
 * rubric. Deliberately fetches examiner_notes only, never extracted_text:
 * short anchors beat full exemplars in the prompt, and other students' work
 * must not end up in the model's context.
 * Returns '' when nothing is approved yet, so this is a no-op until the admin
 * screen has been used.
 */
async function buildCalibrationBlock(rubricId: string, subject: string) {
  try {
    const { data, error } = await supabase
      .from('alumni_submissions')
      .select('subject, level, score, topic_tags, examiner_notes')
      .eq('rubric_id', rubricId)
      .eq('approved', true)
      .not('examiner_notes', 'is', null)
      .limit(8)

    if (error || !data || data.length === 0) return ''

    // Same subject first, then anything else on the same rubric.
    const subj = (subject || '').toLowerCase()
    const sorted = [...data].sort((a, b) => {
      const aMatch = (a.subject || '').toLowerCase().includes(subj) ? 0 : 1
      const bMatch = (b.subject || '').toLowerCase().includes(subj) ? 0 : 1
      return aMatch - bMatch
    })

    const lines = sorted.slice(0, 5).map((r) => {
      const meta = [r.subject, r.level, r.score ? `awarded ${r.score}` : null]
        .filter(Boolean)
        .join(' · ')
      const tags = r.topic_tags?.length ? ` [${r.topic_tags.join(', ')}]` : ''
      return `- ${meta}${tags}\n  ${String(r.examiner_notes).trim()}`
    })

    return `
CALIBRATION REFERENCE (moderated work on this rubric, for standard-setting only):
${lines.join('\n')}

Use these only to calibrate how strict the bands are. Do not compare the student
to them by name, do not mention them in your output, and never quote from them.
`
  } catch {
    return ''
  }
}

/* ------------------------------------------------------------------ */
/* Single scoring run                                                  */
/* ------------------------------------------------------------------ */

async function scoreOnce(
  rubric: any,
  subject: string,
  title: string,
  content: string,
  level: string,
  calibration: string,
  guards: string
) {
  const criteriaText = rubric.criteria.map((c: any) =>
    `Criterion ${c.id}: ${c.name} (max ${c.max})\n${c.description}\nBands:\n${c.bands.map((b: any) => `  ${b.range}: ${b.descriptor}`).join('\n')}`
  ).join('\n\n')

  const levelLine = level
    ? `LEVEL: ${level}  (where a criterion is level-dependent, apply the ${level} expectation)`
    : `LEVEL: not supplied  (judge level-dependent criteria conservatively and say so in the comment)`

  const prompt = `You are an experienced ${rubric.framework} examiner marking a ${rubric.documentType}.

SUBJECT: ${subject}
${levelLine}
TITLE / RESEARCH QUESTION: ${title}

OFFICIAL RUBRIC:
${criteriaText}
${guards}${calibration}
STUDENT WORK:
"""
${content.slice(0, MAX_CONTENT_CHARS)}
"""

Mark strictly against the band descriptors above. Award each criterion a whole-number score within its maximum. Judge the whole piece, including its closing sections.

For "quote": copy an exact sentence WORD-FOR-WORD from the STUDENT WORK above — it must appear verbatim in that text so it can be located. Never paraphrase it, and never take it from the calibration reference.

Return ONLY raw JSON, no markdown, no backticks:
{
  "criteria": [${rubric.criteria.map((c: any) => `{"id":"${c.id}","score":<0-${c.max}>,"comment":"<2 sentences citing specific evidence>","quote":"<exact sentence copied word-for-word from the student work, max 20 words>","quoteNote":"<one short sentence explaining why this passage matters>"}`).join(',')}],
  "summary": "<3 sentence overall assessment>",
  "strengths": ["<specific strength>", "<specific strength>", "<specific strength>"],
  "weaknesses": ["<specific weakness>", "<specific weakness>", "<specific weakness>"],
  "improvements": ["<concrete actionable step>", "<concrete actionable step>", "<concrete actionable step>"]
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await res.json()

  // An API failure used to fall through to '{}', which produced a report where
  // every criterion scored 0. Fail loudly instead.
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || `Anthropic API returned ${res.status}`)
  }

  const text = (data.content?.[0]?.text || '')
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  if (!text) throw new Error('Empty response from model')

  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed.criteria)) throw new Error('Response missing criteria array')
  return parsed
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

/** Prefers a quote that actually occurs in the text, so AnnotatedText can find it. */
function pickQuote(candidates: { quote?: string; quoteNote?: string }[], content: string) {
  const haystack = normalize(content)
  const exact = candidates.find((c) => c.quote && content.includes(c.quote))
  if (exact) return { quote: exact.quote!, quoteNote: exact.quoteNote || '', verbatim: true }

  const loose = candidates.find((c) => c.quote && haystack.includes(normalize(c.quote)))
  if (loose) return { quote: loose.quote!, quoteNote: loose.quoteNote || '', verbatim: true }

  const any = candidates.find((c) => c.quote)
  return { quote: any?.quote || '', quoteNote: any?.quoteNote || '', verbatim: false }
}

/* ------------------------------------------------------------------ */
/* POST                                                              */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    const { rubricId, subject, title, content, userId, fileUrl, level } = await req.json()

    const rubric = getRubric(rubricId)
    if (!rubric) return NextResponse.json({ error: 'Rubric not found' }, { status: 400 })

    if (!content || content.trim().length < 200) {
      return NextResponse.json(
        { error: 'Metin çok kısa. Değerlendirme için en az birkaç paragraf gerekiyor.' },
        { status: 400 }
      )
    }

    const calibration = await buildCalibrationBlock(rubric.id, subject)
    const guards = buildGuardBlock(rubric.id, subject, rubric.criteria.map((c: any) => c.id))

    // Three-shot averaging. allSettled so one malformed run cannot sink the request.
    const settled = await Promise.allSettled([
      scoreOnce(rubric, subject, title, content, level || '', calibration, guards),
      scoreOnce(rubric, subject, title, content, level || '', calibration, guards),
      scoreOnce(rubric, subject, title, content, level || '', calibration, guards),
    ])

    const runs = settled
      .filter((s): s is PromiseFulfilledResult<any> => s.status === 'fulfilled')
      .map((s) => s.value)

    if (runs.length === 0) {
      const reason = settled
        .map((s) => (s.status === 'rejected' ? s.reason?.message : null))
        .filter(Boolean)[0]
      return NextResponse.json(
        { error: `Değerlendirme başarısız: ${reason || 'bilinmeyen hata'}` },
        { status: 502 }
      )
    }

    const criteriaScores = rubric.criteria.map((c: any) => {
      const entries = runs
        .map((r) => r.criteria?.find((x: any) => x.id === c.id))
        .filter(Boolean) as any[]

      // A criterion missing from a run is unknown, not zero — ignore it.
      const scores = entries
        .map((e) => Number(e.score))
        .filter((n) => Number.isFinite(n))
        .map((n) => Math.max(0, Math.min(n, c.max)))

      if (scores.length === 0) {
        return {
          id: c.id, name: c.name, score: 0, max: c.max,
          comment: 'Bu kriter için değerlendirme alınamadı.',
          quote: '', quoteNote: '', spread: 0, missing: true,
        }
      }

      const mean = scores.reduce((a, b) => a + b, 0) / scores.length
      const score = Math.min(Math.round(mean), c.max)

      // Comment comes from the run closest to the average, so the prose and the
      // number agree. Previously it was always run 0.
      const representative = entries
        .slice()
        .sort(
          (a, b) =>
            Math.abs(Number(a.score) - mean) - Math.abs(Number(b.score) - mean)
        )[0]

      const ordered = [representative, ...entries.filter((e) => e !== representative)]
      const { quote, quoteNote, verbatim } = pickQuote(ordered, content)

      return {
        id: c.id,
        name: c.name,
        score,
        max: c.max,
        comment: representative?.comment || '',
        quote,
        quoteNote,
        quoteVerbatim: verbatim,
        spread: Math.max(...scores) - Math.min(...scores),
        runsUsed: scores.length,
      }
    })

    const total = criteriaScores.reduce((sum, c) => sum + c.score, 0)
    const grade = calculateGrade(rubric, total)
    const best = runs[0]

    const report = {
      rubric_id: rubric.id,
      framework: rubric.framework,
      document_type: rubric.documentType,
      subject, title,
      content_preview: content.slice(0, 500),
      full_content: content.slice(0, MAX_STORED_CHARS),
      word_count: content.trim().split(/\s+/).length,
      file_url: fileUrl || null,
      total_score: total,
      total_max: rubric.totalMax,
      grade,
      criteria_scores: criteriaScores,
      summary: best.summary,
      strengths: best.strengths,
      weaknesses: best.weaknesses,
      improvements: best.improvements,
    }

    let saved = null
    if (userId) {
      const { data } = await supabase
        .from('checker_reports')
        .insert({ ...report, user_id: userId })
        .select()
        .single()
      saved = data
    }

    return NextResponse.json({
      ...report,
      id: saved?.id || null,
      rubricLabel: rubric.label,
      runsCompleted: runs.length,
      calibrated: calibration.length > 0,
      guarded: guards.length > 0,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/* ------------------------------------------------------------------ */
/* GET                                                                */
/* ------------------------------------------------------------------ */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ reports: [] })

    const { data } = await supabase
      .from('checker_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return NextResponse.json({ reports: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}