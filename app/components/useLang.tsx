'use client'
import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/legal/types'

const KEY = 'netedu-legal-lang'

/** Turkish for Turkish browsers, English otherwise; remembers a manual switch. */
export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>('tr')

  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem(KEY) } catch { /* private mode */ }
    if (saved === 'tr' || saved === 'en') setLangState(saved)
    else if (!navigator.language?.toLowerCase().startsWith('tr')) setLangState('en')
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
  }

  return [lang, setLang]
}

export function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs" role="group" aria-label="Language">
      {(['tr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1 rounded-md ${lang === l ? 'bg-indigo-900 text-white' : 'text-gray-600 hover:text-indigo-900'}`}
        >
          {l === 'tr' ? 'Türkçe' : 'English'}
        </button>
      ))}
    </div>
  )
}
