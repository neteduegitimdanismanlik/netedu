'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { subjectGroups, subjectState } from '../rubrics/subject-map'
import { PaddleCheckoutButton } from '../../components/PaddleCheckoutButton'
import { PRO_MONTHLY_USD, PRO_ANNUAL_USD } from '../../lib/billing-config'
import type { BillingInterval } from '../../lib/billing-config'

const CONTACT = 'neteduegitimdanismanlik@gmail.com'

/**
 * The subject list is derived from the rubric registry, never hand-written —
 * a subject added to the checker shows up here on the next deploy, and a
 * subject that is not really loaded can never be advertised by accident.
 */
const allSubjects = subjectGroups.flatMap((g) => g.subjects)
const coveredSubjects = [
  ...allSubjects.filter((s) => {
    const state = subjectState(s)
    return state === 'ready' || state === 'unverified'
  }),
  'Extended Essay',
  'University essays',
  'Oral exam prep',
]

const proMailto = `mailto:${CONTACT}?subject=${encodeURIComponent(
  'NetEdu Pro — access request'
)}&body=${encodeURIComponent(
  'Hi,\n\nI am having trouble upgrading to NetEdu Pro through the site and would like help.\n\nStudent name:\nSchool:\nEmail used on NetEdu:\n\nThank you.'
)}`

const freeFeatures = [
  'Roadmap — your first term',
  '3 matched universities',
  'Browse and create CAS projects',
  'Portfolio and Academic Identity Score',
]

const proFeatures = [
  'Your full roadmap',
  'All matched universities',
  'IA Checker',
  'Topic Finder',
  'Oral exam and interview prep',
  'CAS project chat — work with other students',
  'Parent panel and weekly reports',
]

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">One plan. Everything in it.</h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Start free and explore the whole platform. Upgrade when you want your coursework
            marked and your topics tested before you commit to them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Free */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col">
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Free</h2>
              <p className="text-xs text-gray-400">Everything you need to get started</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">€0</span>
              <span className="text-sm text-gray-400"> /month</span>
            </div>
            <ul className="flex flex-col gap-3 mb-7 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className="text-green-500 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="w-full py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 text-center block"
            >
              Start free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-2xl border-2 border-indigo-900 shadow-lg p-7 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-xs font-semibold px-4 py-1 rounded-full">
              Full access
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Pro</h2>
              <p className="text-xs text-gray-400">For the year that decides where you go</p>
            </div>

            <div className="flex gap-1.5 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  billingInterval === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('annual')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  billingInterval === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                Annual
              </button>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${billingInterval === 'monthly' ? PRO_MONTHLY_USD : PRO_ANNUAL_USD}
              </span>
              <span className="text-sm text-gray-400"> {billingInterval === 'monthly' ? '/month' : '/year'}</span>
              {billingInterval === 'annual' && (
                <p className="text-xs text-gray-400 mt-1">
                  ${PRO_MONTHLY_USD}/mo billed once a year — priced for the school year, not the summer.
                </p>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-3">Everything in Free, plus:</p>
            <ul className="flex flex-col gap-3 mb-7 flex-1">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className="text-indigo-700 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <PaddleCheckoutButton interval={billingInterval} />
            <a href={proMailto} className="mt-3 text-xs text-gray-400 hover:text-gray-600 text-center block">
              Having trouble paying? Contact us →
            </a>
          </div>
        </div>

        {/* Subject coverage — visible to everyone, free or not */}
        <div className="mt-14 bg-white rounded-2xl border border-gray-100 p-7">
          <h2 className="font-bold text-gray-900 text-lg mb-1">What the Checker marks</h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Each one against its own official IB criteria — not a generic essay checker.
          </p>
          <div className="flex flex-wrap gap-2">
            {coveredSubjects.map((s) => (
              <span
                key={s}
                className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Not sure yet?</h2>
          <p className="text-sm text-indigo-200 mb-6">
            Start free. Nothing to enter but your profile, and you can see how it works before you decide.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-indigo-900 font-semibold px-8 py-3 rounded-xl text-sm hover:bg-indigo-50"
          >
            Continue with Free →
          </Link>
        </div>
      </div>
    </main>
  )
}
