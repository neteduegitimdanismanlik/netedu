'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toSignedUrl, openStoredFile } from '../../../lib/storage';
import { rubrics } from '../../rubrics/schema';

/* ------------------------------------------------------------------ */
/* Tipler                                                              */
/* ------------------------------------------------------------------ */

type Submission = {
  id: string | number;
  created_at: string | null;
  full_name: string | null;
  email: string | null;
  graduation_year: number | string | null;
  work_type: string | null;
  subject: string | null;
  level: string | null;
  score: string | number | null;
  criterion_scores: Record<string, number | string> | null;
  title: string | null;
  file_url: string | null;
  examiner_feedback: string | null;
  advice: string | null;
  consent: boolean | null;
  // RAG için eklenen sütunlar
  extracted_text: string | null;
  rubric_id: string | null;
  approved: boolean | null;
  examiner_notes: string | null;
  topic_tags: string[] | null;
  session: string | null;
  syllabus_version: string | null;
  verification: string | null;
};

type Draft = {
  extracted_text: string;
  rubric_id: string;
  examiner_notes: string;
  topic_tags: string[];
  session: string;
  syllabus_version: string;
  verification: string;
};

/* ------------------------------------------------------------------ */
/* Sabitler                                                            */
/* ------------------------------------------------------------------ */

// Rubrik listesi schema.ts'ten türetiliyor — yeni bir çerçeve eklendiğinde
// (A-Level, AP) bu ekran kendiliğinden görür, burada değişiklik gerekmez.
const RUBRIC_OPTIONS = rubrics.map((r) => ({
  id: r.id,
  label: `${r.label} (${r.totalMax})`,
}));

const VERIFICATION_OPTIONS = [
  { id: 'self-reported', label: 'Öğrencinin beyanı' },
  { id: 'examiner-marked', label: 'Examiner notu var' },
  { id: 'school-verified', label: 'Okul doğrulaması' },
  { id: 'unverified', label: 'Doğrulanmadı' },
];

const TOPIC_LIBRARY: Record<string, string[]> = {
  // IB'nin "Mathematics assessed student work" dizininde kullandığı altı kategori.
  // Uydurma liste değil, IB'nin kendi sınıflandırması — mezun işlerini etiketlerken
  // tutarlılık sağlar.
  math: [
    'Number and algebra',
    'Functions (and modelling)',
    'Geometry and trigonometry',
    'Probability and statistics',
    'Calculus',
    'Other',
  ],
  physics: ['Mechanics', 'Thermodynamics', 'Waves', 'Electricity & Magnetism', 'Circular Motion', 'Optics', 'Nuclear'],
  chemistry: ['Stoichiometry', 'Kinetics', 'Energetics', 'Equilibrium', 'Acids & Bases', 'Redox', 'Organic'],
  biology: ['Enzymes', 'Photosynthesis', 'Respiration', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Biology'],
  economics: ['Elasticity', 'Market Failure', 'Macro Policy', 'Trade', 'Development'],
  business: ['Marketing', 'Finance', 'HR', 'Operations', 'Strategy'],
  psychology: ['Cognitive', 'Biological', 'Sociocultural', 'Research Methods'],
  english: ['Poetry', 'Prose', 'Drama', 'Global Issue', 'Language & Power'],
  history: ['Causation', 'Historiography', 'Primary Sources', '20th Century'],
  _default: ['Case Study', 'Data Analysis', 'Field Work', 'Simulation', 'Literature Based'],
};

const MIN_TEXT_LENGTH = 500;

/* ------------------------------------------------------------------ */
/* Yardımcılar                                                         */
/* ------------------------------------------------------------------ */

function topicSuggestions(subject: string | null): string[] {
  if (!subject) return TOPIC_LIBRARY._default;
  const key = Object.keys(TOPIC_LIBRARY).find(
    (k) => k !== '_default' && subject.toLowerCase().includes(k)
  );
  return key ? TOPIC_LIBRARY[key] : TOPIC_LIBRARY._default;
}

function toDraft(s: Submission): Draft {
  return {
    extracted_text: s.extracted_text ?? '',
    rubric_id: s.rubric_id ?? '',
    examiner_notes: s.examiner_notes ?? '',
    topic_tags: s.topic_tags ?? [],
    session: s.session ?? '',
    syllabus_version: s.syllabus_version ?? '',
    verification: s.verification ?? '',
  };
}

function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/**
 * PDF'ten metin çıkarır. Checker sayfasındaki pdfjs-dist kullanımıyla
 * aynı mantık. DİKKAT: workerSrc dosya uzantısı pdfjs sürümüne bağlı —
 * pdfjs-dist 4.x için .mjs, 3.x için .js. Checker'da hangisi çalışıyorsa
 * onu kullan.
 */
async function extractPdfText(url: string): Promise<string> {
  const pdfjs: any = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Dosya indirilemedi (HTTP ${res.status})`);
  const buffer = await res.arrayBuffer();

  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((item: any) => item.str ?? '').join(' ') + '\n\n';
  }
  return out.replace(/[ \t]+/g, ' ').trim();
}

/* ------------------------------------------------------------------ */
/* Sayfa                                                               */
/* ------------------------------------------------------------------ */

export default function AdminAlumniPage() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [search, setSearch] = useState('');

  const [tagInput, setTagInput] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [panelError, setPanelError] = useState('');

  /* ---------------- veri ---------------- */

  async function load() {
    setLoading(true);
    setLoadError('');
    const { data, error } = await supabase
      .from('alumni_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError(error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as Submission[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(
    () => rows.find((r) => String(r.id) === selectedId) ?? null,
    [rows, selectedId]
  );

  useEffect(() => {
    setDraft(selected ? toDraft(selected) : null);
    setPanelError('');
    setTagInput('');
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter === 'pending' && r.approved === true) return false;
      if (statusFilter === 'approved' && r.approved !== true) return false;
      if (!q) return true;
      return [r.title, r.subject, r.full_name, r.work_type]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, statusFilter, search]);

  const pendingCount = rows.filter((r) => r.approved !== true).length;
  const approvedCount = rows.filter((r) => r.approved === true).length;

  /* ---------------- onay kapısı ---------------- */

  const gate = useMemo(() => {
    if (!selected || !draft) return { required: [], recommended: [], ready: false };

    const required = [
      { label: 'İzin kutusu işaretli', ok: selected.consent === true },
      {
        label: `Metin çıkarıldı (min ${MIN_TEXT_LENGTH} karakter)`,
        ok: draft.extracted_text.trim().length >= MIN_TEXT_LENGTH,
      },
      { label: 'Rubrik seçildi', ok: !!draft.rubric_id },
      { label: 'En az bir topic tag', ok: draft.topic_tags.length > 0 },
    ];
    const recommended = [
      { label: 'Kalibrasyon notu', ok: draft.examiner_notes.trim().length > 0 },
      { label: 'Session (ör. May 2025)', ok: draft.session.trim().length > 0 },
      { label: 'Doğrulama seviyesi', ok: !!draft.verification },
    ];
    return { required, recommended, ready: required.every((c) => c.ok) };
  }, [selected, draft]);

  /* ---------------- aksiyonlar ---------------- */

  function patch(key: keyof Draft, value: any) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || !draft) return;
    const exists = draft.topic_tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (!exists) patch('topic_tags', [...draft.topic_tags, tag]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    if (!draft) return;
    patch('topic_tags', draft.topic_tags.filter((t) => t !== tag));
  }

  async function handleExtract() {
    if (!selected?.file_url) return;
    setExtracting(true);
    setPanelError('');
    try {
      // The bucket is private: turn the stored path (or an older public URL)
      // into a short-lived signed URL before fetching the PDF.
      const signed = await toSignedUrl('alumni-files', selected.file_url);
      if (!signed) {
        setPanelError('Dosya bağlantısı üretilemedi — yetki yok ya da dosya bulunamadı.');
        setExtracting(false);
        return;
      }
      const text = await extractPdfText(signed);
      if (!text) {
        setPanelError('PDF açıldı ama metin bulunamadı. Taranmış görüntü olabilir — metni elle yapıştır.');
      } else {
        patch('extracted_text', text);
        setToast(`${wordCount(text)} kelime çıkarıldı — kaydetmeyi unutma`);
      }
    } catch (e: any) {
      setPanelError(e?.message ?? 'Metin çıkarılamadı.');
    }
    setExtracting(false);
  }

  async function persist(approvedValue: boolean | null) {
    if (!selected || !draft) return;
    setSaving(true);
    setPanelError('');

    const payload: Record<string, any> = {
      extracted_text: draft.extracted_text.trim() || null,
      rubric_id: draft.rubric_id || null,
      examiner_notes: draft.examiner_notes.trim() || null,
      topic_tags: draft.topic_tags.length ? draft.topic_tags : null,
      session: draft.session.trim() || null,
      syllabus_version: draft.syllabus_version.trim() || null,
      verification: draft.verification || null,
    };
    if (approvedValue !== null) payload.approved = approvedValue;

    const { error } = await supabase
      .from('alumni_submissions')
      .update(payload)
      .eq('id', selected.id);

    if (error) {
      setPanelError(
        error.message.includes('schema cache')
          ? `${error.message} — Supabase SQL editöründe: notify pgrst, 'reload schema';`
          : error.message
      );
    } else {
      setToast(
        approvedValue === true
          ? 'Onaylandı — artık Checker referans havuzunda'
          : approvedValue === false
          ? 'Onay kaldırıldı'
          : 'Kaydedildi'
      );
      await load();
    }
    setSaving(false);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Başlık */}
      <header className="bg-indigo-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs uppercase tracking-widest text-indigo-300">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold">Mezun gönderileri</h1>
          <p className="mt-2 max-w-2xl text-sm text-indigo-200">
            Metni çıkar, rubriği ve topic tag'lerini ata, kalibrasyon notunu yaz. Onaylanan
            gönderiler Checker'ın referans havuzuna girer.
          </p>
          <div className="mt-4 flex gap-6 text-sm">
            <span>
              <strong className="text-lg">{pendingCount}</strong>
              <span className="ml-2 text-indigo-300">bekliyor</span>
            </span>
            <span>
              <strong className="text-lg">{approvedCount}</strong>
              <span className="ml-2 text-indigo-300">onaylı</span>
            </span>
          </div>
        </div>
      </header>

      {toast && (
        <div className="bg-indigo-100 px-6 py-2 text-center text-sm text-indigo-900">{toast}</div>
      )}

      <div className="mx-auto max-w-7xl gap-6 px-6 py-8 lg:flex">
        {/* Liste */}
        <aside className="lg:w-80 lg:shrink-0">
          <div className="mb-3 flex gap-1 rounded-lg bg-white p-1 shadow-sm">
            {([
              ['pending', 'Bekleyen'],
              ['approved', 'Onaylı'],
              ['all', 'Tümü'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                  statusFilter === key
                    ? 'bg-indigo-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık, ders veya isim ara"
            className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />

          {loading && <p className="px-1 text-sm text-slate-500">Yükleniyor…</p>}

          {loadError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {loadError}
              <button onClick={load} className="mt-2 block font-medium underline">
                Tekrar dene
              </button>
            </div>
          )}

          {!loading && !loadError && filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              {statusFilter === 'pending'
                ? 'Bekleyen gönderi yok. /contribute linkini paylaşınca buraya düşer.'
                : 'Bu filtreye uyan gönderi yok.'}
            </div>
          )}

          <ul className="space-y-2">
            {filtered.map((r) => {
              const active = String(r.id) === selectedId;
              return (
                <li key={String(r.id)}>
                  <button
                    onClick={() => setSelectedId(String(r.id))}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      active
                        ? 'border-indigo-500 bg-white shadow-sm ring-1 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {r.title || 'Başlıksız'}
                      </span>
                      <span
                        className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                          r.approved === true
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.approved === true ? 'onaylı' : 'bekliyor'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {[r.work_type, r.subject, r.level, r.score && `${r.score}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {r.extracted_text && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        {wordCount(r.extracted_text)} kelime çıkarılmış
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Detay */}
        <main className="mt-8 flex-1 lg:mt-0">
          {!selected || !draft ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-slate-600">Soldan bir gönderi seç.</p>
              <p className="mt-1 text-sm text-slate-400">
                Onaylanmamış işler Checker prompt'una girmez.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Künye */}
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  {selected.title || 'Başlıksız'}
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  {[
                    ['Gönderen', selected.full_name],
                    ['E-posta', selected.email],
                    ['Mezuniyet', selected.graduation_year],
                    ['Tür', selected.work_type],
                    ['Ders', selected.subject],
                    ['Seviye', selected.level],
                    ['Puan', selected.score],
                    ['İzin', selected.consent === true ? 'verildi' : 'YOK'],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                      <dd
                        className={`mt-0.5 break-words ${
                          label === 'İzin' && selected.consent !== true
                            ? 'font-semibold text-red-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {value === null || value === undefined || value === '' ? '—' : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>

                {selected.criterion_scores && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Kriter puanları</p>
                    <p className="mt-1 text-slate-800">
                      {Object.entries(selected.criterion_scores)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('  ·  ')}
                    </p>
                  </div>
                )}

                {(selected.examiner_feedback || selected.advice) && (
                  <div className="mt-4 space-y-3 text-sm">
                    {selected.examiner_feedback && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Examiner geri bildirimi
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-slate-700">
                          {selected.examiner_feedback}
                        </p>
                      </div>
                    )}
                    {selected.advice && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Öğrencilere tavsiyesi
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-slate-700">{selected.advice}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Metin */}
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">Metin</h3>
                  <div className="flex items-center gap-3 text-sm">
                    {selected.file_url && (
                      <button
                        onClick={() => openStoredFile('alumni-files', selected.file_url)}
                        className="text-indigo-700 underline"
                      >
                        Dosyayı aç
                      </button>
                    )}
                    <button
                      onClick={handleExtract}
                      disabled={!selected.file_url || extracting}
                      className="rounded-lg bg-indigo-900 px-3 py-1.5 text-white disabled:opacity-40"
                    >
                      {extracting ? 'Çıkarılıyor…' : 'PDF metnini çıkar'}
                    </button>
                  </div>
                </div>

                <textarea
                  value={draft.extracted_text}
                  onChange={(e) => patch('extracted_text', e.target.value)}
                  rows={12}
                  placeholder="PDF'ten çıkar veya metni buraya yapıştır."
                  className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {wordCount(draft.extracted_text)} kelime · {draft.extracted_text.length} karakter
                </p>
              </section>

              {/* Etiketleme */}
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Etiketleme</h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-slate-700">Rubrik</span>
                    <select
                      value={draft.rubric_id}
                      onChange={(e) => patch('rubric_id', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Seç…</option>
                      {RUBRIC_OPTIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    <span className="text-slate-700">Doğrulama</span>
                    <select
                      value={draft.verification}
                      onChange={(e) => patch('verification', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Seç…</option>
                      {VERIFICATION_OPTIONS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    <span className="text-slate-700">Session</span>
                    <input
                      value={draft.session}
                      onChange={(e) => patch('session', e.target.value)}
                      placeholder="May 2025"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="text-slate-700">Müfredat sürümü</span>
                    <input
                      value={draft.syllabus_version}
                      onChange={(e) => patch('syllabus_version', e.target.value)}
                      placeholder="2019–2026"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </label>
                </div>

                {draft.rubric_id === 'ib-ia-maths' && !selected.level && (
                  <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Matematik IA'sında kriter E (use of mathematics) SL ve HL'de farklı
                    değerlendiriliyor. Bu gönderide seviye boş — doğru band seçilemez.
                  </p>
                )}

                {/* Topic tags */}
                <div className="mt-5">
                  <p className="text-sm text-slate-700">Topic tag'leri</p>
                  <p className="text-xs text-slate-500">
                    Erişimin en isabetli filtresi bu. Ders adı tek başına yeterli değil.
                  </p>

                  {draft.topic_tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {draft.topic_tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900 px-3 py-1 text-xs text-white"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            aria-label={`${tag} etiketini kaldır`}
                            className="text-indigo-300 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Etiket yaz, Enter'a bas"
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={() => addTag(tagInput)}
                      className="rounded-lg border border-indigo-900 px-3 py-2 text-sm text-indigo-900"
                    >
                      Ekle
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {topicSuggestions(selected.subject)
                      .filter(
                        (s) => !draft.topic_tags.some((t) => t.toLowerCase() === s.toLowerCase())
                      )
                      .map((s) => (
                        <button
                          key={s}
                          onClick={() => addTag(s)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:border-indigo-400 hover:text-indigo-800"
                        >
                          + {s}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Kalibrasyon notu */}
                <div className="mt-5">
                  <label className="block text-sm">
                    <span className="text-slate-700">Kalibrasyon notu</span>
                    <p className="text-xs text-slate-500">
                      Tam metin değil, anchor yaz. Örn: “Criterion A 6/6 — RQ 12 sayfada
                      cevaplanabilecek kadar dar, matematiksel teknik girişte belirtilmiş.”
                    </p>
                    <textarea
                      value={draft.examiner_notes}
                      onChange={(e) => patch('examiner_notes', e.target.value)}
                      rows={5}
                      className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </label>
                </div>
              </section>

              {/* Onay kapısı */}
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Onay kapısı</h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Zorunlu</p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {gate.required.map((c) => (
                        <li key={c.label} className="flex items-start gap-2">
                          <span className={c.ok ? 'text-indigo-700' : 'text-red-500'}>
                            {c.ok ? '✓' : '✕'}
                          </span>
                          <span className={c.ok ? 'text-slate-700' : 'text-red-700'}>{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Önerilen</p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {gate.recommended.map((c) => (
                        <li key={c.label} className="flex items-start gap-2">
                          <span className={c.ok ? 'text-indigo-700' : 'text-slate-300'}>
                            {c.ok ? '✓' : '○'}
                          </span>
                          <span className="text-slate-600">{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {panelError && (
                  <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {panelError}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => persist(null)}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:opacity-40"
                  >
                    {saving ? 'Kaydediliyor…' : 'Kaydet'}
                  </button>

                  {selected.approved === true ? (
                    <button
                      onClick={() => persist(false)}
                      disabled={saving}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-40"
                    >
                      Onayı kaldır
                    </button>
                  ) : (
                    <button
                      onClick={() => persist(true)}
                      disabled={saving || !gate.ready}
                      className="rounded-lg bg-indigo-900 px-4 py-2 text-sm text-white disabled:opacity-40"
                      title={gate.ready ? '' : 'Zorunlu maddeler eksik'}
                    >
                      Kaydet ve onayla
                    </button>
                  )}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
