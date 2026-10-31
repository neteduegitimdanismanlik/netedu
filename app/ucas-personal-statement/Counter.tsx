'use client'
import { useState } from 'react'
import { QUESTIONS } from './questions'

/**
 * Character counter for the three-question UCAS personal statement.
 * UCAS counts characters including spaces, 4,000 across all three answers,
 * with at least 350 in each; the questions themselves aren't counted.
 * Nothing typed here leaves the browser.
 */

const TOTAL = 4000
const MIN = 350


const TEXT = {
  en: {
    title: 'Character counter',
    intro: 'Paste or draft your answers — counted the way UCAS counts them, spaces included. Nothing you type here is saved or sent anywhere.',
    chars: (n: string) => `${n} characters`,
    short: (min: number, more: number) => ` — at least ${min} needed (${more} more)`,
    minimum: (min: number) => ` · minimum ${min}`,
    over: (n: string) => `${n} characters over the limit.`,
    left: (n: string) => `${n} characters left across all three answers.`,
    locale: 'en-GB',
  },
  tr: {
    title: 'Karakter sayacı',
    intro: 'Cevaplarını yapıştır ya da burada yaz — UCAS\'in saydığı gibi, boşluklar dahil sayılır. Yazdığın hiçbir şey kaydedilmez ya da bir yere gönderilmez.',
    chars: (n: string) => `${n} karakter`,
    short: (min: number, more: number) => ` — en az ${min} gerekli (${more} daha)`,
    minimum: (min: number) => ` · en az ${min}`,
    over: (n: string) => `Sınırı ${n} karakter aştın.`,
    left: (n: string) => `Üç cevap için toplam ${n} karakter kaldı.`,
    locale: 'tr-TR',
  },
}

export default function Counter({ lang = 'en', translations }: { lang?: 'en' | 'tr'; translations?: string[] }) {
  const t = TEXT[lang]
  const fmt = (n: number) => n.toLocaleString(t.locale)
  const [answers, setAnswers] = useState(['', '', ''])
  const lengths = answers.map((a) => a.length)
  const used = lengths.reduce((s, n) => s + n, 0)
  const left = TOTAL - used

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2 className="font-semibold text-gray-800">{t.title}</h2>
        <p className={`text-sm font-semibold ${left < 0 ? 'text-red-600' : 'text-indigo-900'}`}>
          {fmt(used)} / {fmt(TOTAL)}
        </p>
      </div>
      <p className="text-xs text-gray-500 mb-4">{t.intro}</p>
      <div className="flex flex-col gap-4">
        {QUESTIONS.map((q, i) => {
          const n = lengths[i]
          const short = n > 0 && n < MIN
          return (
            <div key={q}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {i + 1}. {q}
                {translations?.[i] && <span className="block text-xs font-normal text-gray-400 mt-0.5">{translations[i]}</span>}
              </label>
              <textarea
                value={answers[i]}
                onChange={(e) => setAnswers((prev) => prev.map((a, j) => (j === i ? e.target.value : a)))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-y"
              />
              <p className={`text-xs mt-1 ${short ? 'text-amber-700' : 'text-gray-400'}`}>
                {t.chars(fmt(n))}
                {short ? t.short(MIN, MIN - n) : n === 0 ? t.minimum(MIN) : ''}
              </p>
            </div>
          )
        })}
      </div>
      <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${left < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
        {left < 0 ? t.over(fmt(Math.abs(left))) : t.left(fmt(left))}
      </div>
    </div>
  )
}
