import { NextResponse } from 'next/server'
import { getRubric } from '@/app/rubrics/schema'
import { getMarkingModel } from '@/app/rubrics/checker-guards'
import { getTopicRules } from '@/app/rubrics/topic-rules'
import { languageAOralPrep } from '@/app/rubrics/language-a-oral'

const MAX_CHARS = 20000

/* ------------------------------------------------------------------ */
/* Shared context                                                      */
/* ------------------------------------------------------------------ */

/**
 * What the criteria are actually asking for, in prose. This is not a marking
 * block — no bands, no ceilings, no scores. The model needs to know what each
 * criterion rewards so it can brief the student, not so it can grade them.
 */
function buildCriteriaBlock(rubric: any): string {
  return rubric.criteria
    .map((c: any) => `${c.name}: ${c.description}`)
    .join('\n\n')
}

/** Selection and procedure traps, drawn from the topic rules. */
function buildRulesBlock(rubricId: string): string {
  const set = getTopicRules(rubricId)
  if (!set) return ''
  const ordered = [...set.rules].sort((a, b) => {
    const w = { fatal: 0, major: 1, minor: 2 }
    return w[a.severity] - w[b.severity]
  })
  return `WHAT GOES WRONG AT THE SELECTION AND PREPARATION STAGE
${ordered.map(r => `- [${r.severity}] ${r.label}: ${r.detail}`).join('\n')}

GUIDANCE ON WHAT TO BRING
${set.dataGuidance.map(d => `- ${d}`).join('\n')}`
}

/**
 * The pitfalls exist to stop the model reasoning badly about a transcript.
 * They matter more here than in the checker, because a transcript is a much
 * weaker signal than a written submission.
 */
function buildPitfallBlock(rubricId: string): string {
  const model = getMarkingModel(rubricId)
  if (!model) return ''
  const critical = model.pitfalls.filter(p => p.severity === 'critical' || p.severity === 'high')
  if (!critical.length) return ''
  return `THINGS YOU MUST NOT DO
${critical.map(p => `- Wrong assumption: ${p.claim}\n  Actually: ${p.reality}`).join('\n\n')}`
}

const NEVER_SCORE = `This is a preparation tool, not a marking tool. Never produce a score, a mark,
a band, a grade, a percentage, or any number that could be read as one. Never say the student
would get a particular level. If you are tempted to quantify, describe instead.`

const TRANSCRIPT_LIMITS = `The recording is turned into text by browser speech recognition. That means
pronunciation, intonation, accent, fluency, pauses, hesitation, self-correction and speaking pace are
NOT available to you — never comment on any of them, and never infer them from the text. Speech
recognition also mishears accented speech more often, so an odd word or broken phrase is more likely
a transcription artefact than a mistake the student made. Do not treat isolated strange wording as a
language error.`

/* ------------------------------------------------------------------ */
/* Anthropic call                                                      */
/* ------------------------------------------------------------------ */

async function ask(prompt: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || `Anthropic API returned ${res.status}`)
  }

  const text = (data.content?.[0]?.text || '')
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  if (!text) throw new Error('Empty response from model')
  return JSON.parse(text)
}

/* ------------------------------------------------------------------ */
/* Mode: brief — before the student records                            */
/* ------------------------------------------------------------------ */

async function buildBrief(rubric: any, courseId: string, material: string) {
  const isLanguageA = rubric.id === 'ib-oral-language-a'
  const seedQuestions = isLanguageA
    ? `\nQUESTION PATTERNS THAT WORK IN THIS COURSE (adapt them to this student's material, do not copy them):
${languageAOralPrep.questions.flatMap(q => q.items).slice(0, 10).map(q => `- ${q}`).join('\n')}`
    : ''

  const prompt = `You are an experienced IB teacher preparing a student for their individual oral.

COURSE: ${rubric.label}
TIMING AND TASK: ${rubric.guidance}

WHAT EACH CRITERION IS LOOKING FOR:
${buildCriteriaBlock(rubric)}

${buildRulesBlock(rubric.id)}

${buildPitfallBlock(rubric.id)}
${seedQuestions}

WHAT THE STUDENT HAS BROUGHT:
"""
${material.slice(0, MAX_CHARS)}
"""

${NEVER_SCORE}

Brief this student before they rehearse. Work only from what they actually brought — if their
material is thin or vague, say so plainly rather than inventing detail for them. Be specific to
their texts and their issue, never generic.

Return ONLY raw JSON, no markdown, no backticks:
{
  "readiness": "<3 to 4 sentences: is what they have brought workable as it stands? Name the single most useful change they could make before recording. Do not hedge.>",
  "risks": ["<a specific risk in THEIR material, tied to something they wrote>", "<another>", "<another>"],
  "questions": ["<a question a teacher could realistically ask them, about their specific texts>", "<8 more, covering: testing their focus, returning to each text separately, comparing the two, and widening out>"],
  "checklist": ["<a concrete thing to verify before pressing record, specific to this course>", "<4 more>"]
}`

  return ask(prompt)
}

/* ------------------------------------------------------------------ */
/* Mode: review — after the student records                            */
/* ------------------------------------------------------------------ */

async function reviewTranscript(rubric: any, material: string, transcript: string) {
  const prompt = `You are an experienced IB teacher reading a transcript of a student's rehearsal for their
individual oral.

COURSE: ${rubric.label}
TIMING AND TASK: ${rubric.guidance}

WHAT EACH CRITERION IS LOOKING FOR:
${buildCriteriaBlock(rubric)}

${buildPitfallBlock(rubric.id)}

WHAT THE STUDENT SAID THEY WERE WORKING FROM:
"""
${material.slice(0, MAX_CHARS)}
"""

TRANSCRIPT OF THE REHEARSAL:
"""
${transcript.slice(0, MAX_CHARS)}
"""

${NEVER_SCORE}

${TRANSCRIPT_LIMITS}

Comment on content only, and only on what the transcript can actually show. The useful observations
here are: whether the focus stayed where it should, whether both texts or both parts got comparable
attention, whether the student argued or mostly retold, and whether claims were tied to evidence.
Quote short phrases from the transcript so the student can find the moment you mean.

If the transcript is too short or too fragmentary to say anything useful, say that instead of
manufacturing observations.

Return ONLY raw JSON, no markdown, no backticks:
{
  "observations": [
    {"heading": "<short heading, e.g. Balance between your two texts>", "detail": "<3 to 4 sentences, quoting a short phrase from the transcript>"},
    {"heading": "<another aspect>", "detail": "<3 to 4 sentences>"},
    {"heading": "<another aspect>", "detail": "<3 to 4 sentences>"}
  ],
  "nextTime": ["<one concrete change for the next rehearsal>", "<another>", "<another>"],
  "notAssessed": ["<something a real examiner would judge that a transcript cannot show>", "<another>", "<another>"]
}`

  return ask(prompt)
}

/* ------------------------------------------------------------------ */
/* POST                                                                */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    const { mode, rubricId, material, transcript } = await req.json()

    const rubric = getRubric(rubricId)
    if (!rubric) {
      return NextResponse.json({ error: 'Rubric not found' }, { status: 400 })
    }

    if (mode === 'brief') {
      if (!material || material.trim().length < 30) {
        return NextResponse.json(
          { error: 'Tell us a little more about what you are working with first.' },
          { status: 400 }
        )
      }
      const result = await buildBrief(rubric, '', material)
      return NextResponse.json(result)
    }

    if (mode === 'review') {
      if (!transcript || transcript.trim().length < 100) {
        return NextResponse.json(
          { error: 'The recording was too short to say anything useful about. Try again and speak for longer.' },
          { status: 400 }
        )
      }
      const result = await reviewTranscript(rubric, material || '', transcript)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}