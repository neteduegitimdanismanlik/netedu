'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'

const plans = [
  {
    name: 'Free',
    price: 0,
    tagline: 'Start your journey',
    features: [
      '3 university matches',
      '1-month roadmap preview',
      'View CAS events',
      'Basic profile',
    ],
    cta: 'Current plan',
    highlight: false,
  },
  {
    name: 'Basic',
    price: 15,
    tagline: 'For focused students',
    features: [
      '20+ university matches',
      '6-month detailed roadmap',
      'Full Alumni Corner access',
      'Apply to CAS events',
      'Email support',
    ],
    cta: 'Upgrade to Basic',
    highlight: false,
  },
  {
    name: 'Mid',
    price: 29,
    tagline: 'Most popular',
    features: [
      'Everything in Basic',
      'Portfolio + Academic Identity Score',
      'Create CAS events',
      'Essay & IA Checker',
      'EE Preparation sessions',
      'Alumni Q&A access',
    ],
    cta: 'Upgrade to Mid',
    highlight: true,
  },
  {
    name: 'Max',
    price: 49,
    tagline: 'The complete package',
    features: [
      'Everything in Mid',
      'Full 3-year roadmap',
      'University Interview Coach',
      'Oral Exam Prep',
      'Parent Panel + weekly reports',
      'Priority support',
    ],
    cta: 'Upgrade to Max',
    highlight: false,
  },
]

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-6xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose your plan</h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Start free, upgrade when you're ready. All plans help you get closer to your dream university.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 mt-6">
            <button onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-indigo-900 text-white' : 'text-gray-500'}`}>
              Monthly
            </button>
            <button onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-indigo-900 text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-xs opacity-75">(save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const price = billing === 'yearly' ? Math.round(plan.price * 0.8) : plan.price
            return (
              <div key={i} className={`bg-white rounded-2xl p-6 flex flex-col relative ${
                plan.highlight
                  ? 'border-2 border-indigo-900 shadow-lg'
                  : 'border border-gray-100'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  <p className="text-xs text-gray-400">{plan.tagline}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-sm text-gray-400">/month</span>
                  {billing === 'yearly' && plan.price > 0 && (
                    <p className="text-xs text-green-600 mt-1">Billed yearly (${price * 12}/year)</p>
                  )}
                </div>
                <ul className="flex flex-col gap-3 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                    plan.price === 0
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : plan.highlight
                        ? 'bg-indigo-900 text-white hover:bg-indigo-800'
                        : 'border border-indigo-900 text-indigo-900 hover:bg-indigo-50'
                  }`}
                  onClick={() => plan.price > 0 && alert('Payments coming soon! For early access, contact us at neteduegitimdanismanlik@gmail.com')}>
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Frequently asked questions</h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription at any time. You will keep access until the end of your billing period.' },
              { q: 'Is there a student discount?', a: 'Our prices are already designed for students. Yearly billing saves you an extra 20%.' },
              { q: 'What payment methods do you accept?', a: 'Credit/debit cards. Payment system launching soon — contact us for early access.' },
              { q: 'Can I switch plans later?', a: 'Absolutely. Upgrade or downgrade anytime, and we will prorate the difference.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Not sure which plan?</h2>
          <p className="text-sm text-indigo-200 mb-6">Start free and explore. Upgrade when you need more.</p>
          <Link href="/dashboard" className="inline-block bg-white text-indigo-900 font-semibold px-8 py-3 rounded-xl text-sm hover:bg-indigo-50">
            Continue with Free →
          </Link>
        </div>
      </div>
    </main>
  )
}