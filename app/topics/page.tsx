'use client';

// app/topics/page.tsx
//
// Topic Finder. Two modes: suggest topics / test an idea.
// Subject-driven: the student picks their subject, the rubric is resolved from it.
// Only subjects with BOTH a rubric and a topic rule set are offered.

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../../lib/supabase';
import { resolveIaRubric, subjectGroups } from '../rubrics/subject-map';
import {
  listTopicRuleSets,
  topicRulesNeedLevel,
  getTopicRules,
  getRule,
  VERDICT_LABELS,
  VERDICT_DESCRIPTIONS,
  type TopicVerdict,
} from '../rubrics/topic-rules';

type Mode = 'suggest' | 'test';

interface SuggestedTopic {
  title: string;
  contextId?: string;
  personalHook?: string | null;
  mathematics?: string;
  data?: string;
  watchOut?: string;
  firstStep?: string;
}

interface SuggestResult {
  mode: 'suggest';
  generic?: boolean;
  note?: string;
  topics?: SuggestedTopic[];
  profileUsed?: boolean;
}

interface TriggeredRule {
  ruleId: string;
  why: string;
}

interface TestResult {
  mode: 'test';
  verdict?: TopicVerdict;
  summary?: string;
  triggeredRules?: TriggeredRule[];
  fixes?: string[];
  sharpenedTitle?: string;
  mathematicsNeeded?: string;
  dataRealism?: string | null;
  nextSteps?: string[];
  profileUsed?: boolean;
}

type Result = (SuggestResult | TestResult) & { rubricId?: string; level?: string | null };

const VERDICT_STYLES: Record<TopicVerdict, string> = {
  strong: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  workable: 'bg-indigo-50 text-indigo-900 border-indigo-300',
  risky: 'bg-amber-50 text-amber-900 border-amber-300',
  unworkable: 'bg-rose-50 text-rose-900 border-rose-300',
};

const LEVELS = ['SL', 'HL'];

interface Choice {
  key: string;
  label: string;
  subject: string;
  rubricId: string;
}

export default function TopicsPage() {
  const { groups, choices } = useMemo(() => {
    const groups: { group: string; items: Choice[] }[] = [];
    const choices: Choice[] = [];

    for (const g of subjectGroups) {
      const items: Choice[] = [];
      for (const subject of g.subjects) {
        const r = resolveIaRubric(subject);
        if (r.kind !== 'rubric') continue;
        if (!getTopicRules(r.rubricId)) continue;
        const c = { key: `subject:${subject}`, label: subject, subject, rubricId: r.rubricId };
        items.push(c);
        choices.push(c);
      }
      if (items.length) groups.push({ group: g.group, items });
    }

    const subjectRubricIds = new Set(choices.map((c) => c.rubricId));
    const others: Choice[] = listTopicRuleSets()
      .filter((s) => !subjectRubricIds.has(s.rubricId))
      .map((s) => ({ key: `rubric:${s.rubricId}`, label: s.label, subject: '', rubricId: s.rubricId }));
    if (others.length) {
      groups.push({ group: 'Other assessments', items: others });
      choices.push(...others);
    }

    return { groups, choices };
  }, []);

  const [mode, setMode] = useState<Mode>('suggest');
  const [choiceKey, setChoiceKey] = useState(choices[0]?.key ?? '');
  const [level, setLevel] = useState('');
  const [contextIds, setContextIds] = useState<string[]>([]);
  const [idea, setIdea] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const choice = choices.find((c) => c.key === choiceKey);
  const rubricId = choice?.rubricId ?? '';
  const subject = choice?.subject ?? '';
  const activeSet = rubricId ? getTopicRules(rubricId) : undefined;
  const needsLevel = rubricId ? topicRulesNeedLevel(rubricId) : false;

  useEffect(() => {
    let cancelled = false;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!cancelled) setUserId(data?.user?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setUserId(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setContextIds([]);
    setResult(null);
    setError(null);
    if (!rubricId || !topicRulesNeedLevel(rubricId)) setLevel('');
  }, [choiceKey, rubricId]);

  useEffect(() => {
    if (!loading) return;
    setElapsed(0);
    const started = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  function toggleContext(id: string) {
    setContextIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const canSubmit =
    Boolean(rubricId) &&
    (!needsLevel || Boolean(level)) &&
    (mode === 'suggest' || idea.trim().length >= 20) &&
    !loading;

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          rubricId,
          subject: subject || undefined,
          level: level || undefined,
          userId: userId || undefined,
          idea: mode === 'test' ? idea : undefined,
          contextIds: mode === 'suggest' && contextIds.length ? contextIds : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setResult(data as Result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showBack backHref="/coach" backLabel="Coach Corner" />

      <header className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Coach Corner</p>
          <h1 className="mt-2 text-3xl font-semibold">Topic Finder</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Choosing a topic is the hardest part of the IA. This tool rules ideas out
            early: it tells you now what you would otherwise find out fifteen hours in.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 inline-flex rounded-lg border border-slate-300 bg-white p-1">
          {(['suggest', 'test'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setResult(null);
                setError(null);
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === m
                  ? 'bg-indigo-900 text-white'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              {m === 'suggest' ? 'Suggest topics' : 'Test my idea'}
            </button>
          ))}
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">
            Your subject
          </label>
          <select
            value={choiceKey}
            onChange={(e) => setChoiceKey(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {groups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.items.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">
            Only subjects with topic rules loaded appear here. A wrong rule is worse than no rule —
            if your subject is missing, we haven&apos;t read its guide yet.
          </p>

          {needsLevel && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700">Level</label>
              <div className="mt-2 flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      level === l
                        ? 'border-indigo-900 bg-indigo-900 text-white'
                        : 'border-slate-300 text-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {activeSet?.levelNotes && level && (
                <p className="mt-2 text-xs text-slate-500">{activeSet.levelNotes[level]}</p>
              )}
            </div>
          )}

          {mode === 'suggest' && activeSet && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700">
                Narrow it down{' '}
                <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeSet.contexts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.hint}
                    onClick={() => toggleContext(c.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      contextIds.includes(c.id)
                        ? 'border-indigo-900 bg-indigo-900 text-white'
                        : 'border-slate-300 text-slate-600 hover:border-indigo-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'test' && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700">
                Your idea
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={5}
                placeholder="What are you thinking of doing? Include the data you would collect and the method you expect to use."
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <p className="mt-1 text-xs text-slate-500">
                {idea.trim().length < 20
                  ? 'Write at least a sentence or two.'
                  : `${idea.trim().length} characters`}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={run}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-lg bg-indigo-900 px-4 py-3 font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading
              ? 'Working…'
              : mode === 'suggest'
              ? 'Suggest topics'
              : 'Assess this idea'}
          </button>

          {activeSet && (
            <p className="mt-3 text-center text-xs text-slate-500">{activeSet.scopeNote}</p>
          )}
        </section>

        <div ref={resultsRef}>
          {loading && <Waiting mode={mode} elapsed={elapsed} />}

          {error && (
            <div className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="font-medium">Request didn&apos;t complete</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {!loading && result && result.mode === 'suggest' && (
            <SuggestView result={result as SuggestResult} rubricId={rubricId} />
          )}
          {!loading && result && result.mode === 'test' && (
            <TestView result={result as TestResult} rubricId={rubricId} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Waiting({ mode, elapsed }: { mode: Mode; elapsed: number }) {
  const expected = mode === 'suggest' ? 20 : 15;
  const over = elapsed > expected + 15;
  const cards = mode === 'suggest' ? 3 : 1;

  return (
    <section className="mt-8" aria-live="polite">
      <div className="mb-4 flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
        <span>
          {mode === 'suggest'
            ? 'Reading your profile and working through the rules…'
            : 'Checking your idea against the rules…'}
        </span>
        <span className="tabular-nums text-indigo-700">
          {elapsed}s <span className="text-indigo-400">/ ~{expected}s</span>
        </span>
      </div>

      {over && (
        <p className="mb-4 text-xs text-slate-500">
          Taking longer than usual. It will either finish or show an error — nothing is lost.
        </p>
      )}

      <div className="space-y-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-5 w-2/3 rounded bg-slate-200" />
            <div className="mt-4 h-3 w-full rounded bg-slate-100" />
            <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SuggestView({ result, rubricId }: { result: SuggestResult; rubricId: string }) {
  const set = getTopicRules(rubricId);
  const topics = result.topics ?? [];

  return (
    <section className="mt-8">
      {result.generic && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Your profile is empty, so these suggestions are generic. Fill in your onboarding
          and portfolio details and the suggestions will be tied to your own life.
        </div>
      )}
      {result.note && <p className="mb-4 text-sm text-slate-600">{result.note}</p>}

      <div className="space-y-4">
        {topics.map((t, i) => {
          const context = set?.contexts.find((c) => c.id === t.contextId);
          return (
            <article
              key={`${t.title}-${i}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>
                {context && (
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-900">
                    {context.label}
                  </span>
                )}
              </div>

              {t.personalHook && (
                <p className="mt-3 border-l-2 border-indigo-900 pl-3 text-sm text-slate-700">
                  {t.personalHook}
                </p>
              )}

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Field label="Method required" value={t.mathematics} />
                <Field label="Data" value={t.data} />
                <Field label="Watch out" value={t.watchOut} />
                <Field label="First step" value={t.firstStep} />
              </dl>
            </article>
          );
        })}
      </div>

      {topics.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
          No suggestions came back. Try again.
        </p>
      )}
    </section>
  );
}

function TestView({ result, rubricId }: { result: TestResult; rubricId: string }) {
  const verdict = result.verdict;
  const style = verdict ? VERDICT_STYLES[verdict] : 'bg-slate-50 text-slate-900 border-slate-300';

  return (
    <section className="mt-8 space-y-4">
      <div className={`rounded-xl border p-5 ${style}`}>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Verdict</p>
        <h2 className="mt-1 text-2xl font-semibold">
          {verdict ? VERDICT_LABELS[verdict] : '—'}
        </h2>
        <p className="mt-1 text-sm opacity-80">
          {verdict ? VERDICT_DESCRIPTIONS[verdict] : 'No verdict returned.'}
        </p>
        {result.summary && <p className="mt-3 text-sm">{result.summary}</p>}
      </div>

      {result.sharpenedTitle && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Sharpened title
          </p>
          <p className="mt-2 text-lg font-medium text-slate-900">{result.sharpenedTitle}</p>
        </div>
      )}

      {result.triggeredRules && result.triggeredRules.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Rules this idea hits
          </p>
          <ul className="mt-3 space-y-3">
            {result.triggeredRules.map((tr, i) => {
              const rule = getRule(rubricId, tr.ruleId);
              return (
                <li key={`${tr.ruleId}-${i}`} className="border-l-2 border-slate-300 pl-3">
                  <p className="text-sm font-medium text-slate-900">
                    {rule?.label ?? tr.ruleId}
                    {rule && (
                      <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600">
                        {rule.severity}
                        {rule.hits?.length ? ` · criterion ${rule.hits.join(', ')}` : ''}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{tr.why}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {result.mathematicsNeeded && (
          <Panel label="Method required" body={result.mathematicsNeeded} />
        )}
        {result.dataRealism && (
          <Panel label="Is the data realistic?" body={result.dataRealism} />
        )}
      </div>

      {result.fixes && result.fixes.length > 0 && (
        <ListPanel label="Fixes" items={result.fixes} />
      )}
      {result.nextSteps && result.nextSteps.length > 0 && (
        <ListPanel label="Next steps" items={result.nextSteps} ordered />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-slate-700">{value}</dd>
    </div>
  );
}

function Panel({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-700">{body}</p>
    </div>
  );
}

function ListPanel({
  label,
  items,
  ordered,
}: {
  label: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <List
        className={`mt-3 space-y-2 text-sm text-slate-700 ${
          ordered ? 'list-decimal pl-5' : 'list-disc pl-5'
        }`}
      >
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </List>
    </div>
  );
}