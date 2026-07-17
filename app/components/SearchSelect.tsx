'use client'
import { useState, useRef, useEffect } from 'react'

interface SearchSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  allowCustom?: boolean
}

export default function SearchSelect({ options, value, onChange, placeholder = 'Search...', allowCustom = true }: SearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<any>(null)

  useEffect(() => {
    function handleClick(e: any) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => { setOpen(!open); setSearch('') }}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 text-left bg-white flex justify-between items-center">
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value || placeholder}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-4 py-3 border-b border-gray-100 text-sm outline-none"
          />
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && !allowCustom && (
              <p className="px-4 py-3 text-sm text-gray-400">No results</p>
            )}
            {filtered.map((option, i) => (
              <button key={i} type="button"
                onClick={() => { onChange(option); setOpen(false); setSearch('') }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${value === option ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-gray-700'}`}>
                {option}
              </button>
            ))}
            {allowCustom && search && !filtered.includes(search) && (
              <button type="button"
                onClick={() => { onChange(search); setOpen(false); setSearch('') }}
                className="w-full text-left px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50 border-t border-gray-100">
                + Use "{search}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}