'use client'
import { useState } from 'react'

interface Annotation {
  id: string
  name: string
  score: number
  max: number
  quote: string
  quoteNote: string
  comment: string
}

const palette = [
  { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', dot: 'bg-blue-500' },
  { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', dot: 'bg-purple-500' },
  { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-700', dot: 'bg-rose-500' },
]

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function AnnotatedText({ content, annotations }: { content: string; annotations: Annotation[] }) {
  const [active, setActive] = useState<string | null>(null)

  const valid = annotations.filter(a => a.quote && content.includes(a.quote))
  const missing = annotations.filter(a => a.quote && !content.includes(a.quote))

  // Build segments
  let segments: { text: string; ann?: Annotation; colorIdx?: number }[] = [{ text: content }]

  valid.forEach((ann, idx) => {
    const next: typeof segments = []
    segments.forEach(seg => {
      if (seg.ann) { next.push(seg); return }
      const parts = seg.text.split(new RegExp(`(${escapeRegex(ann.quote)})`, 'g'))
      parts.forEach(p => {
        if (p === ann.quote) next.push({ text: p, ann, colorIdx: idx % palette.length })
        else if (p) next.push({ text: p })
      })
    })
    segments = next
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Your work, annotated</h3>
          <span className="text-xs text-gray-400">{valid.length} passages highlighted</span>
        </div>
        <div className="text-sm text-gray-700 leading-loose whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2">
          {segments.map((seg, i) =>
            seg.ann ? (
              <mark key={i}
                onClick={() => setActive(active === seg.ann!.id ? null : seg.ann!.id)}
                className={`cursor-pointer px-0.5 rounded border-b-2 transition-all ${palette[seg.colorIdx!].bg} ${palette[seg.colorIdx!].border} ${active === seg.ann.id ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}`}>
                {seg.text}
                <sup className={`ml-0.5 text-xs font-bold ${palette[seg.colorIdx!].text}`}>{seg.ann.id}</sup>
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Examiner notes</p>
        {valid.map((ann, idx) => (
          <button key={ann.id}
            onClick={() => setActive(active === ann.id ? null : ann.id)}
            className={`text-left p-4 rounded-2xl border transition-all ${active === ann.id ? `${palette[idx % palette.length].bg} ${palette[idx % palette.length].border}` : 'bg-white border-gray-100 hover:border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full ${palette[idx % palette.length].dot} text-white text-xs font-bold flex items-center justify-center`}>
                {ann.id}
              </span>
              <span className="text-xs font-medium text-gray-700 flex-1">{ann.name}</span>
              <span className="text-xs font-bold text-indigo-900">{ann.score}/{ann.max}</span>
            </div>
            <p className="text-xs text-gray-600 italic mb-1.5 leading-relaxed">"{ann.quote}"</p>
            <p className="text-xs text-gray-500 leading-relaxed">{ann.quoteNote}</p>
          </button>
        ))}
        {missing.length > 0 && (
          <p className="text-xs text-gray-400 px-1">
            {missing.length} note{missing.length > 1 ? 's' : ''} couldn't be pinned to exact text — see the breakdown below.
          </p>
        )}
      </div>
    </div>
  )
}