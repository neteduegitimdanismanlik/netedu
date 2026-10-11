'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLang, LangSwitch } from '../../components/useLang'
import type { Lang } from '@/lib/legal/types'

const T: Record<Lang, Record<string, string>> = {
  tr: {
    title: 'Veli onayı',
    lead: "Çocuğunuz NetEdu'ya kayıt oldu ve 18 yaşından küçük olduğu için onayınızı istiyoruz. NetEdu, IB öğrencilerine üniversite başvurusu ve ödevlerinde rehberlik eder; öğrencinin yazdığı metinlere yapay zekâ ile geri bildirim verir, öğrenci yerine ödev yazmaz.",
    whatTitle: 'Onay verdiğinizde çocuğunuz:',
    what1: 'Ödev metinlerini yükleyip IB kriterlerine göre yapay zekâ geri bildirimi alabilir.',
    what2: 'Konu önerisi, mülakat ve sözlü sınav hazırlığı gibi özellikleri kullanabilir.',
    data: 'Yüklenen metinler ve profil bilgileri, geri bildirim üretmek için yurt dışındaki hizmet sağlayıcılarımızda (Anthropic, Supabase, Vercel) işlenir. Diğer öğrenciler çocuğunuzun adını görmez, yalnızca baş harflerini görür. Ayrıntılar:',
    notice: 'Aydınlatma Metni',
    name: 'Adınız ve soyadınız',
    box: "Aydınlatma Metni'ni okudum. Velisi olduğum çocuğumun NetEdu'yu bu metinde açıklanan şekilde kullanmasına onay veriyorum.",
    approve: 'Onay ver',
    saving: 'Kaydediliyor…',
    errBox: 'Onay vermek için kutuyu işaretleyin.',
    errName: 'Adınızı ve soyadınızı yazın.',
    unknown: 'Bu kayıttan haberiniz yoksa onay vermeyin; bize yazın, hesabı sileriz:',
    doneTitle: 'Onayınız kaydedildi',
    done: 'Çocuğunuz artık ödev yükleyip geri bildirim alabilir. Onayınızı istediğiniz zaman bize yazarak geri çekebilirsiniz; bu durumda hesap ve yüklenen içerikler silinir.',
  },
  en: {
    title: 'Parent approval',
    lead: "Your child has signed up to NetEdu and, because they are under 18, we need your approval. NetEdu guides IB students through university applications and coursework. It gives AI feedback on the student's own writing and never writes work for them.",
    whatTitle: 'Once you approve, your child can:',
    what1: 'Upload their coursework and get AI feedback against the IB criteria.',
    what2: 'Use topic suggestions and interview and oral exam practice.',
    data: "Uploaded texts and profile details are processed by our service providers abroad (Anthropic, Supabase, Vercel) to generate feedback. Other students never see your child's name, only their initials. Details:",
    notice: 'Privacy Notice',
    name: 'Your full name',
    box: 'I have read the Privacy Notice and, as their parent, I approve my child using NetEdu as it describes.',
    approve: 'Approve',
    saving: 'Saving…',
    errBox: 'Tick the box to approve.',
    errName: 'Enter your full name.',
    unknown: "If you don't know about this sign-up, don't approve. Write to us and we'll delete the account:",
    doneTitle: 'Your approval is saved',
    done: 'Your child can now upload work and get feedback. You can withdraw your approval at any time by writing to us; the account and its content are then deleted.',
  },
}

const CONTACT = 'neteduegitimdanismanlik@gmail.com'

export default function ParentConsentPage() {
  const { token } = useParams<{ token: string }>()
  const [lang, setLang] = useLang()
  const t = T[lang]
  const [name, setName] = useState('')
  const [read, setRead] = useState(false)
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function approve() {
    setError(null)
    if (!read) { setError(t.errBox); return }
    if (name.trim().length < 3) { setError(t.errName); return }
    setState('saving')
    const res = await fetch('/api/parent-consent/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, parentName: name, lang }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) { setError(json.error || 'Error'); setState('idle'); return }
    setState('done')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div lang={lang} className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-lg shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
          </Link>
          <LangSwitch lang={lang} onChange={setLang} />
        </div>

        {state === 'done' ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t.doneTitle}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{t.done}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{t.lead}</p>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
              <p className="font-medium">{t.whatTitle}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t.what1}</li>
                <li>{t.what2}</li>
              </ul>
              <p className="pt-1">
                {t.data}{' '}
                <Link href="/privacy" target="_blank" className="text-indigo-700 underline">{t.notice}</Link>
              </p>
            </div>

            <label htmlFor="parent-name" className="mt-6 block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
            <input
              id="parent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <label className="mt-4 flex items-start gap-2.5 text-sm text-gray-700">
              <input type="checkbox" checked={read} onChange={(e) => setRead(e.target.checked)} className="mt-0.5 h-4 w-4 accent-indigo-900" />
              <span>{t.box}</span>
            </label>

            {error && <div className="mt-4 text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600">{error}</div>}

            <button
              onClick={approve}
              disabled={state === 'saving'}
              className="mt-6 w-full bg-indigo-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-800 disabled:opacity-50 text-sm"
            >
              {state === 'saving' ? t.saving : t.approve}
            </button>

            <p className="mt-6 text-xs text-gray-500">
              {t.unknown} <a href={`mailto:${CONTACT}`} className="underline">{CONTACT}</a>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
