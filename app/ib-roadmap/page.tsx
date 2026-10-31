import type { Metadata } from 'next'
import { seo, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/app/components/JsonLd'
import Link from 'next/link'
import { UNIVERSITIES } from '../universities/index'
import type { SubjectArea } from '../universities/schema'

/**
 * Public explainer for the roadmap feature, aimed at "IB university roadmap /
 * timeline / what to do in grade 9-12" searches.
 *
 * The year-by-year timeline here is deliberately generic — it's the shape
 * every IB applicant shares. The personal version (built from the student's
 * own target, grades and activities) is the product, and every section points
 * there. The one hard number on the page — how many courses make an HL
 * subject compulsory — is computed from the same university data the matcher
 * uses, at build time, so it can never drift from what /universities shows.
 */

export const metadata: Metadata = seo('/ib-roadmap', {
  title: 'IB University Roadmap: What to Do in Grades 9, 10, 11 and 12 | NetEdu',
  description:
    'A year-by-year plan for IB students applying to university: choosing HL subjects, IA and Extended Essay, IELTS and admissions tests (UCAT, LNAT, TMUA), personal statements and deadlines — plus a personal roadmap built from your own profile.',
})

/** How many UK courses in one area make a given HL subject a hard requirement. */
function hlStat(area: SubjectArea, keyword: string) {
  const offered = UNIVERSITIES.filter((u) => u.country === 'United Kingdom')
    .map((u) => u.areas.find((a) => a.area === area && a.offered))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
  const requiring = offered.filter(
    (a) =>
      (a.hlRequired || []).some((s) => s.toLowerCase().includes(keyword)) ||
      (a.hlRequiredAnyOf || []).some((alt) => alt.subjects.some((s) => s.toLowerCase().includes(keyword)))
  )
  return { total: offered.length, requiring: requiring.length }
}

const STATS: { area: SubjectArea; label: string; subject: string; keyword: string }[] = [
  { area: 'Medicine', label: 'Medicine', subject: 'Chemistry', keyword: 'chem' },
  { area: 'Engineering', label: 'Engineering', subject: 'Mathematics', keyword: 'math' },
  { area: 'Computer Science', label: 'Computer Science', subject: 'Mathematics', keyword: 'math' },
  { area: 'Economics & Business', label: 'Economics & Business', subject: 'Mathematics', keyword: 'math' },
]

const YEARS: { grade: string; title: string; items: { tag: string; text: React.ReactNode }[] }[] = [
  {
    grade: 'Grade 9',
    title: 'Explore',
    items: [
      { tag: 'Academic', text: 'Your grades from here on can end up on a transcript — the Turkish national diploma average, for one, counts all four high-school years.' },
      { tag: 'Activities', text: 'Pick one or two activities you could realistically keep going for years. Depth over a long list is what reads well later.' },
      { tag: 'Research', text: 'Read beyond the syllabus in the subjects you might want to study. Start noticing what you actually enjoy.' },
    ],
  },
  {
    grade: 'Grade 10',
    title: 'Choose your HL subjects with the end in mind',
    items: [
      { tag: 'Academic', text: <>Before choosing Diploma subjects, check what your target courses demand at Higher Level — a missing HL subject can rule a course out entirely, however strong the rest of your application is. <Link href="/universities" className="underline">Look up any course here</Link>.</> },
      { tag: 'Test Prep', text: "If English isn't your first language, find out which English tests your target countries accept and the scores they ask for." },
      { tag: 'Activities', text: 'Move from taking part to contributing: a role, a project you run, something with a result you can describe.' },
    ],
  },
  {
    grade: 'Grade 11 (DP1)',
    title: 'Build the evidence',
    items: [
      { tag: 'Academic', text: <>Internal Assessments start in most schools this year. Pick topics you can actually get data or sources for, and know how each one is marked — <Link href="/ib-ia" className="underline">IA rubrics by subject</Link>.</> },
      { tag: 'Research', text: 'Most schools start the Extended Essay in DP1. A topic linked to the course you want to study doubles as evidence of interest.' },
      { tag: 'Test Prep', text: 'Get an IELTS or TOEFL score in hand before applications open, and find out whether your courses need an admissions test — UCAT for most UK Medicine, LNAT for many Law courses, TMUA or ESAT for some Mathematics, Economics, Computer Science and Engineering courses.' },
      { tag: 'Applications', text: <>Finish DP1 with a shortlist split into reach, match and safety — <Link href="/universities" className="underline">by university and department</Link>.</> },
      { tag: 'Portfolio', text: 'Use the summer: a project, summer school or work experience connected to your course, and a first draft of your personal statement or essays.' },
    ],
  },
  {
    grade: 'Grade 12 (DP2)',
    title: 'Apply',
    items: [
      { tag: 'Applications', text: 'UK applications for Oxford, Cambridge and most Medicine courses close on 15 October; most other UK courses close in January. Other countries run on their own calendars — each university page lists what we hold.' },
      { tag: 'Academic', text: 'UK offers are made against your predicted grades, so DP1 results and teacher predictions matter as much as the final exams.' },
      { tag: 'Test Prep', text: 'Sit any admissions tests on time — several have registration deadlines well before the test itself.' },
      { tag: 'Applications', text: 'Shortlisted applicants for Oxford, Cambridge and most Medicine courses are interviewed, usually in late autumn or winter.' },
      { tag: 'Academic', text: 'Finish IAs and the Extended Essay early, then final exams in May. Results come out in July, when conditional offers are confirmed.' },
    ],
  },
]

const tagColors: Record<string, string> = {
  Academic: 'bg-blue-50 text-blue-700 border-blue-200',
  'Test Prep': 'bg-purple-50 text-purple-700 border-purple-200',
  Portfolio: 'bg-green-50 text-green-700 border-green-200',
  Research: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Activities: 'bg-red-50 text-red-700 border-red-200',
  Applications: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

function Cta({ label }: { label: string }) {
  return (
    <Link
      href="/auth"
      className="inline-block text-center bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800"
    >
      {label}
    </Link>
  )
}

export default function IbRoadmapPage() {
  const stats = STATS.map((s) => ({ ...s, ...hlStat(s.area, s.keyword) })).filter((s) => s.total > 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd([{ name: 'NetEdu', path: '/' }, { name: 'IB roadmap', path: '/ib-roadmap' }])} />
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/universities" className="text-xs text-gray-500 hover:text-indigo-700">Universities</Link>
          <Link href="/ib-ia" className="text-xs text-gray-500 hover:text-indigo-700">IA rubrics</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">The IB university roadmap, year by year</h1>
        <p className="text-xs text-gray-400 mb-4">
          <Link href={'/tr/ib-roadmap'} hrefLang="tr" className="hover:text-indigo-700">IB öğrencileri için 9-12. sınıf üniversite başvuru yol haritası — Türkçe oku →</Link>
        </p>
        <p className="text-gray-600 mb-5">
          What to do in each year from Grade 9 to graduation if you're an IB student applying to university — and
          the decisions that quietly close doors if you make them late.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10">
          <Cta label="Build my roadmap →" />
          <p className="text-xs text-gray-500">Free: a plan built from your own target, grades and activities.</p>
        </div>

        {stats.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-1">Why Grade 10 matters more than it looks</h2>
            <p className="text-sm text-gray-500 mb-4">
              Your Higher Level choices are made two years before you apply — and for many courses they're a hard
              requirement, not a preference. From the UK courses NetEdu tracks:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.area} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-indigo-900">
                    {s.requiring} of {s.total}
                  </p>
                  <p className="text-sm text-gray-600">
                    {s.label} courses require HL {s.subject}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-8">
          {YEARS.map((y, i) => (
            <div key={y.grade} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-indigo-900 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-900">{y.grade}</p>
                  <h2 className="font-semibold text-gray-800">{y.title}</h2>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {y.items.map((it, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${tagColors[it.tag] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {it.tag}
                    </span>
                    <p className="text-sm text-gray-700">{it.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-3">This is everyone's roadmap. Yours should be different.</h2>
          <p className="text-sm text-gray-700 mb-3">
            The timeline above is the shape every IB applicant shares. NetEdu builds the version that's specific to
            you, from your grade, GPA, diploma, English score, target university and department, and the
            activities you already have:
          </p>
          <div className="flex flex-col gap-1.5 text-sm text-gray-700">
            <p>· Your strengths and weaknesses for the course you're aiming at</p>
            <p>· This week's tasks, and goals for the next three months</p>
            <p>· A plan through graduation, in two-month periods with four concrete tasks each, that you tick off as you go</p>
            <p>· Warnings when something needs doing now</p>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Free shows the first two periods of your current year; Pro opens the full plan through graduation.
          </p>
        </div>

        <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-8">
          <p className="font-semibold mb-1">Turn this timeline into your own plan.</p>
          <p className="text-sm text-indigo-200 mb-4">
            Tell NetEdu where you are and where you want to go — it builds the roadmap in between, task by task.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50"
          >
            Build my roadmap →
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-2">
          <Link href="/universities" className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700">
            University requirements
          </Link>
          <Link href="/ib-ia" className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-700">
            IB IA rubrics
          </Link>
        </div>
      </div>
    </main>
  )
}
