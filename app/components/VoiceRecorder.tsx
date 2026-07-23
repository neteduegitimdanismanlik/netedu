'use client'
import { useState, useRef, useEffect } from 'react'

interface Props {
  onTranscript: (text: string) => void
  language?: string
  maxSeconds?: number
  label?: string
}

export default function VoiceRecorder({ onTranscript, language = 'en-US', maxSeconds = 300, label = 'Record your answer' }: Props) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<any>(null)
  const finalRef = useRef('')

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = language

    rec.onresult = (e: any) => {
      let inter = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalRef.current += t + ' '
        else inter += t
      }
      setTranscript(finalRef.current)
      setInterim(inter)
    }
    rec.onerror = () => {}
    recognitionRef.current = rec
    return () => { try { rec.stop() } catch {} }
  }, [language])

  function start() {
    finalRef.current = ''
    setTranscript(''); setInterim(''); setSeconds(0)
    try { recognitionRef.current?.start() } catch {}
    setRecording(true)
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s + 1 >= maxSeconds) { stop(); return maxSeconds }
        return s + 1
      })
    }, 1000)
  }

  function stop() {
    try { recognitionRef.current?.stop() } catch {}
    clearInterval(timerRef.current)
    setRecording(false)
    const finalText = (finalRef.current + ' ' + interim).trim()
    if (finalText) onTranscript(finalText)
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const words = transcript.trim() ? transcript.trim().split(/\s+/).length : 0

  if (!supported) return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
      <p className="text-sm text-amber-700">Voice recording needs Chrome, Edge or Safari. Please switch browser or type your answer instead.</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="text-center mb-4">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3 transition-all ${recording ? 'bg-red-500 animate-pulse' : 'bg-indigo-900'}`}>
          <span className="text-3xl">{recording ? '⏺' : '🎙'}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 tabular-nums">{mm}:{ss}</p>
        <p className="text-xs text-gray-400 mt-1">
          {recording ? 'Recording — speak clearly' : label}
        </p>
      </div>

      {(transcript || interim) && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-40 overflow-y-auto">
          <p className="text-sm text-gray-700 leading-relaxed">
            {transcript}<span className="text-gray-400">{interim}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">{words} words</p>
        </div>
      )}

      <button onClick={recording ? stop : start}
        className={`w-full py-3 rounded-xl font-medium text-sm text-white ${recording ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-900 hover:bg-indigo-800'}`}>
        {recording ? '⏹ Stop & analyse' : '🎙 Start recording'}
      </button>
    </div>
  )
}