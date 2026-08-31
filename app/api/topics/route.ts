// app/api/topics/route.ts
//
// Topic Finder engine. Two modes:
//   suggest — builds 3 topics from the profile, at least 2 tied to the student's own life
//   test    — judges the student's idea: strong / workable / risky / unworkable
//
// Design decisions:
// - NO new Supabase columns. `level` and `subject` only go into the prompt.
// - Rubrics, rules and exemplars come from data files; no hardcoded lists here.
// - Errors never turn into a silently empty result (the bug we fixed in the checker).
// - Output is deliberately short: generation time scales with length.

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { callerId } from '@/lib/api-auth';
import { getRubric } from '../../rubrics/schema';
import {
  getTopicRules,
  topicRulesNeedLevel,
  type TopicRuleSet,
} from '../../rubrics/topic-rules';
import { getExemplars } from '../../rubrics/topic-exemplars';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OUTPUT_LANGUAGE = 'English';
const MAX_IDEA_CHARS = 4000;
const TOPIC_COUNT = 3;

type Mode = 'suggest' | 'test';

interface RequestBody {
  mode?: Mode;
  rubricId?: string;
  subject?: string;
  level?: string;
  userId?: string;
  /** test mode */
  idea?: string;
  /** suggest mode — context ids the student wants to narrow to */
  contextIds?: string[];
}

interface StudentProfile {
  clubs?: string;
  volunteering?: string;
  research?: string;
  awards?: string;
  school?: string;
  nationality?: string;
}

/* ------------------------------------------------------------------ */
/* Supabase                                                            */
/* ------------------------------------------------------------------ */

function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Reads the student from the profiles table.
 * The primary key may be `id` or `user_id` — tries both, and uses select('*')
 * so an unknown column never fails the request.
 */
async function fetchProfile(userId: string): Promise<StudentProfile | null> {
  const supabase = supabaseClient();
  if (!supabase) return null;

  for (const column of ['id', 'user_id'] as const) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq(column, userId)
        .maybeSingle();
      if (!error && data) return data as StudentProfile;
    } catch {
      // try the next column
    }
  }
  return null;
}

function profileIsEmpty(p: StudentProfile | null): boolean {
  if (!p) return true;
  const fields = [p.clubs, p.volunteering, p.research, p.awards, p.school, p.nationality];
  return !fields.some((f) => typeof f === 'string' && f.trim().length > 0);
}

function describeProfile(p: StudentProfile | null): string {
  if (!p) return '(no profile on file)';
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    if (value && value.trim()) lines.push(`- ${label}: ${value.trim()}`);
  };
  add('Clubs and activities', p.clubs);
  add('Volunteering', p.volunteering);
  add('Research or projects', p.research);
  add('Awards', p.awards);
  add('School', p.school);
  add('Nationality / country', p.nationality);
  return lines.length ? lines.join('\n') : '(no profile on file)';
}

/* ------------------------------------------------------------------ */
/* Prompt pieces                                                       */
/* ------------------------------------------------------------------ */

function describeRules(set: TopicRuleSet): string {
  return set.rules
    .map(
      (r) =>
        `- id "${r.id}" [${r.severity}] ${r.label}${
          r.hits?.length ? ` (criteria ${r.hits.join(', ')})` : ''
        }: ${r.detail}`
    )
    .join('\n');
}

function describeContexts(set: TopicRuleSet, only?: string[]): string {
  const list =
    only && only.length
      ? set.contexts.filter((c) => only.includes(c.id))
      : set.contexts;
  return list.map((c) => `- id "${c.id}" ${c.label}: ${c.hint}`).join('\n');
}

function describeRubric(rubricId: string, level?: string): string {
  const rubric = getRubric(rubricId);
  if (!rubric) return '';
  const criteria = rubric.criteria
  .map((c: any) => `- ${c.id} ${c.name} (max ${c.max})`)
    .join('\n');
  const guidance = rubric.guidance ? `\nMarking guidance:\n${rubric.guidance}` : '';
  const lvl = level ? `\nCourse level: ${level}` : '';
  return `Assessment: ${rubric.label}, total ${rubric.totalMax}.${lvl}
Criteria:
${criteria}${guidance}`;
}

/**
 * Worked examples at the expected standard. These calibrate specificity —
 * they are never to be reused or lightly reworded as the student's topic.
 */
function describeExemplars(subject: string, rubricId: string): string {
  const list = getExemplars(subject, rubricId);
  if (!list.length) return '';
  const body = list
    .map(
      (e, i) =>
        `${i + 1}. ${e.title}
   Why it works: ${e.why}
   Data: ${e.data}
   The trap: ${e.watchOut}`
    )
    .join('\n\n');
  return `

Calibration — worked examples at the standard expected. They show how specific a title must be
and the kind of trap worth naming. Do NOT reuse or lightly reword them; the student's topic must
come from their own profile and interests.

${body}`;
}

function sharedPreamble(
  set: TopicRuleSet,
  rubricId: string,
  level?: string,
  subject?: string
): string {
  const levelNote = level && set.levelNotes?.[level] ? `\n${set.levelNotes[level]}` : '';
  const subjectLine = subject ? `\nSubject: ${subject}\n` : '';
  return `You are advising an IB student on choosing a topic. You are not encouraging; you are deciding.
Your job is to surface, now, the problem the student would otherwise discover fifteen hours into the work.
${subjectLine}
${describeRubric(rubricId, level)}

Scope of this tool: ${set.scopeNote}${levelNote}

Topic rules (apply these by id):
${describeRules(set)}

Title guidance:
${set.titleGuidance.map((t) => `- ${t}`).join('\n')}

Data guidance:
${set.dataGuidance.map((t) => `- ${t}`).join('\n')}${describeExemplars(subject ?? '', rubricId)}

Write all student-facing strings in ${OUTPUT_LANGUAGE}. Keep rule ids and context ids exactly as given.
Never invent a rule id that is not in the list above.

Be brief. Every field is one sentence unless stated otherwise. No hedging, no restating the question,
no filler openers. A student reads this on a phone between lessons.

Respond with JSON only. No preamble, no markdown fences.`;
}

function suggestPrompt(
  set: TopicRuleSet,
  rubricId: string,
  level: string | undefined,
  profile: StudentProfile | null,
  contextIds?: string[],
  subject?: string
): string {
  const empty = profileIsEmpty(profile);
  return `${sharedPreamble(set, rubricId, level, subject)}

Student profile:
${describeProfile(profile)}

Available contexts:
${describeContexts(set, contextIds)}

Task: propose exactly ${TOPIC_COUNT} topics. Three good ones beat six padded ones.
${
  empty
    ? 'The profile is empty. Propose generic but well-formed topics and set "generic": true. Do not pretend to know the student.'
    : `At least 2 of the ${TOPIC_COUNT} must be anchored in something specific from the profile above — name the connection explicitly. Set "generic": false.`
}
Each topic must be narrow enough to finish in the time available, and must sit at the level the course expects.
Do not propose a topic whose method would sit entirely in prior learning.

JSON shape:
{
  "generic": boolean,
  "note": "one short sentence on what these are based on",
  "topics": [
    {
      "title": "a working title that states the question, not the field",
      "contextId": "one of the context ids above",
      "personalHook": "one sentence on why this belongs to this student, or null if generic",
      "mathematics": "one sentence naming the specific method or mathematics required",
      "data": "one sentence on what data is needed and whether it is obtainable",
      "watchOut": "one sentence on the most likely way this goes wrong",
      "firstStep": "one sentence on what to do in the next hour"
    }
  ]
}`;
}

function testPrompt(
  set: TopicRuleSet,
  rubricId: string,
  level: string | undefined,
  idea: string,
  profile: StudentProfile | null,
  subject?: string
): string {
  return `${sharedPreamble(set, rubricId, level, subject)}

Student profile (context only, may be empty):
${describeProfile(profile)}

The student's idea:
"""
${idea}
"""

Task: judge this idea. Be direct. A comfortable "workable" on a doomed idea is a failure.

Verdicts:
- "strong": the idea holds against every rule; there is room to score across all criteria.
- "workable": it runs, but at least one thing must be narrowed or strengthened first.
- "risky": there is a serious gap; hours will be wasted if it is not fixed.
- "unworkable": the criteria cannot be applied to this as written. The idea must change.

Report at most 3 triggered rules — the ones that matter most. At most 3 fixes, at most 3 next steps.

JSON shape:
{
  "verdict": "strong" | "workable" | "risky" | "unworkable",
  "summary": "two sentences, plain, no encouragement filler",
  "triggeredRules": [
    { "ruleId": "exact id from the rule list", "why": "one sentence on what in the idea triggers it" }
  ],
  "fixes": ["one concrete change per item, one sentence each"],
  "sharpenedTitle": "the idea restated as a title that states the question",
  "mathematicsNeeded": "one sentence naming the method or mathematics this actually requires",
  "dataRealism": "one sentence on whether the data is obtainable at the size the technique needs, or null if no data involved",
  "nextSteps": ["one sentence per step, in order"]
}

If no rule is triggered, return an empty triggeredRules array. Do not pad it.`;
}

/* ------------------------------------------------------------------ */
/* Anthropic                                                           */
/* ------------------------------------------------------------------ */

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set.');

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  // Without an res.ok check, a 401/429/529 turns into an empty result.
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  if (data?.error) {
    throw new Error(`Anthropic: ${data.error?.message ?? 'unknown error'}`);
  }

  const out = Array.isArray(data?.content)
    ? data.content
        .map((b: { type?: string; text?: string }) => (b?.type === 'text' ? b.text ?? '' : ''))
        .join('')
        .trim()
    : '';

  if (!out) throw new Error('The model returned an empty response.');
  return out;
}

function parseJson<T>(raw: string): T {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('The model did not return valid JSON.');
  }
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const mode: Mode = body.mode === 'test' ? 'test' : 'suggest';
    const rubricId = (body.rubricId ?? '').trim();
    const subject = body.subject?.trim() || undefined;

    if (!rubricId) {
      return NextResponse.json({ error: 'rubricId is required.' }, { status: 400 });
    }

    const set = getTopicRules(rubricId);
    if (!set) {
      return NextResponse.json(
        {
          error:
            'Topic rules are not loaded for this subject yet. A wrong rule is worse than no rule.',
        },
        { status: 400 }
      );
    }

    const level = body.level?.trim() || undefined;
    if (topicRulesNeedLevel(rubricId) && !level) {
      return NextResponse.json(
        { error: 'This subject needs an SL/HL selection.' },
        { status: 400 }
      );
    }
    if (level && set.levelNotes && !set.levelNotes[level]) {
      return NextResponse.json({ error: `Invalid level: ${level}` }, { status: 400 });
    }

    // Profile lookup uses the verified session id, never a client-supplied one,
    // so nobody can pull another student's profile into their own prompt.
    const verifiedUserId = await callerId(req);
    const profile = verifiedUserId ? await fetchProfile(verifiedUserId) : null;

    let prompt: string;
    if (mode === 'test') {
      const idea = (body.idea ?? '').trim();
      if (idea.length < 20) {
        return NextResponse.json(
          { error: 'Say a bit more about the idea — a sentence or two at minimum.' },
          { status: 400 }
        );
      }
      prompt = testPrompt(set, rubricId, level, idea.slice(0, MAX_IDEA_CHARS), profile, subject);
    } else {
      prompt = suggestPrompt(set, rubricId, level, profile, body.contextIds, subject);
    }

    const raw = await callClaude(prompt);
    const parsed = parseJson<Record<string, unknown>>(raw);

    return NextResponse.json({
      mode,
      rubricId,
      subject: subject ?? null,
      level: level ?? null,
      profileUsed: !profileIsEmpty(profile),
      ...parsed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/topics]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}