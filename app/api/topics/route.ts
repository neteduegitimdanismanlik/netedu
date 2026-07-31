// app/api/topics/route.ts
//
// Topic Finder engine. Two modes:
//   suggest — builds 6 topics from the profile, at least 3 tied to the student's own life
//   test    — judges the student's idea: strong / workable / risky / unworkable
//
// Design decisions:
// - NO new Supabase columns. `level` only goes into the prompt.
// - Rubrics and rules come from data files; no hardcoded lists here.
// - Errors never turn into a silently empty result (the bug we fixed in the checker).

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRubric } from '../../rubrics/schema';
import {
  getTopicRules,
  topicRulesNeedLevel,
  type TopicRuleSet,
} from '../../rubrics/topic-rules';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OUTPUT_LANGUAGE = 'English';
const MAX_IDEA_CHARS = 4000;

type Mode = 'suggest' | 'test';

interface RequestBody {
  mode?: Mode;
  rubricId?: string;
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
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
    .map((c) => `- ${c.id} ${c.name} (max ${c.max})`)
    .join('\n');
  const guidance = rubric.guidance ? `\nMarking guidance:\n${rubric.guidance}` : '';
  const lvl = level ? `\nCourse level: ${level}` : '';
  return `Assessment: ${rubric.label}, total ${rubric.totalMax}.${lvl}
Criteria:
${criteria}${guidance}`;
}

function sharedPreamble(set: TopicRuleSet, rubricId: string, level?: string): string {
  const levelNote = level && set.levelNotes?.[level] ? `\n${set.levelNotes[level]}` : '';
  return `You are advising an IB student on choosing a topic. You are not encouraging; you are deciding.
Your job is to surface, now, the problem the student would otherwise discover fifteen hours into the work.

${describeRubric(rubricId, level)}

Scope of this tool: ${set.scopeNote}${levelNote}

Topic rules (apply these by id):
${describeRules(set)}

Title guidance:
${set.titleGuidance.map((t) => `- ${t}`).join('\n')}

Data guidance:
${set.dataGuidance.map((t) => `- ${t}`).join('\n')}

Write all student-facing strings in ${OUTPUT_LANGUAGE}. Keep rule ids and context ids exactly as given.
Never invent a rule id that is not in the list above.
Respond with JSON only. No preamble, no markdown fences.`;
}

function suggestPrompt(
  set: TopicRuleSet,
  rubricId: string,
  level: string | undefined,
  profile: StudentProfile | null,
  contextIds?: string[]
): string {
  const empty = profileIsEmpty(profile);
  return `${sharedPreamble(set, rubricId, level)}

Student profile:
${describeProfile(profile)}

Available contexts:
${describeContexts(set, contextIds)}

Task: propose exactly 6 topics.
${
  empty
    ? 'The profile is empty. Propose generic but well-formed topics and set "generic": true. Do not pretend to know the student.'
    : 'At least 3 of the 6 must be anchored in something specific from the profile above — name the connection explicitly. Set "generic": false.'
}
Each topic must be narrow enough to finish, and must require mathematics at or near course level.
Do not propose a topic whose mathematics would sit entirely in prior learning.

JSON shape:
{
  "generic": boolean,
  "note": "one sentence on what these suggestions are based on",
  "topics": [
    {
      "title": "a working title that states the question, not the field",
      "contextId": "one of the context ids above",
      "personalHook": "why this one belongs to this student, or null if generic",
      "mathematics": "the specific mathematics it would use",
      "data": "what data is needed and whether the student can realistically get it",
      "watchOut": "the single most likely way this topic goes wrong",
      "firstStep": "what to do in the next hour to test whether it works"
    }
  ]
}`;
}

function testPrompt(
  set: TopicRuleSet,
  rubricId: string,
  level: string | undefined,
  idea: string,
  profile: StudentProfile | null
): string {
  return `${sharedPreamble(set, rubricId, level)}

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

JSON shape:
{
  "verdict": "strong" | "workable" | "risky" | "unworkable",
  "summary": "two sentences, plain, no encouragement filler",
  "triggeredRules": [
    { "ruleId": "exact id from the rule list", "why": "what in the idea triggers it" }
  ],
  "fixes": ["concrete change, each one actionable today"],
  "sharpenedTitle": "the idea restated as a title that states the question",
  "mathematicsNeeded": "the mathematics this would actually require, named specifically",
  "dataRealism": "whether the data can be obtained at the size the technique needs, or null if no data involved",
  "nextSteps": ["what to do next, in order"]
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
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  // The checker bug: without an res.ok check, a 401/429/529 turned into an empty result.
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

    const profile = body.userId ? await fetchProfile(body.userId) : null;

    let prompt: string;
    if (mode === 'test') {
      const idea = (body.idea ?? '').trim();
      if (idea.length < 20) {
        return NextResponse.json(
          { error: 'Say a bit more about the idea — a sentence or two at minimum.' },
          { status: 400 }
        );
      }
      prompt = testPrompt(set, rubricId, level, idea.slice(0, MAX_IDEA_CHARS), profile);
    } else {
      prompt = suggestPrompt(set, rubricId, level, profile, body.contextIds);
    }

    const raw = await callClaude(prompt);
    const parsed = parseJson<Record<string, unknown>>(raw);

    return NextResponse.json({
      mode,
      rubricId,
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