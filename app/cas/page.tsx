'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { storagePath } from '@/lib/storage'
import { authHeaders } from '@/lib/session'
import Navbar from '../components/Navbar'
import ProjectChat from './ProjectChat'

const categoryColors: Record<string, string> = {
  'Creativity': 'bg-purple-50 text-purple-700 border-purple-200',
  'Activity': 'bg-blue-50 text-blue-700 border-blue-200',
  'Service': 'bg-green-50 text-green-700 border-green-200',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-gray-50 text-gray-500 border-gray-200',
  removed: 'bg-red-50 text-red-600 border-red-200',
}

type Application = {
  id: string
  initials: string
  message: string | null
  status: string
  createdAt: string
}

export default function CAS() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [myApplications, setMyApplications] = useState<any[]>([])
  const [inbox, setInbox] = useState<Record<string, Application[]>>({})
  const [openInbox, setOpenInbox] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('discover')
  const [chat, setChat] = useState<{ id: string; title: string } | null>(null)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [proofPhoto, setProofPhoto] = useState<File | null>(null)
  const [proofNotes, setProofNotes] = useState('')
  const [participantCount, setParticipantCount] = useState('')
  const [submittingProof, setSubmittingProof] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Service')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [capacity, setCapacity] = useState('')
  const [fee, setFee] = useState('Free')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) window.location.href = '/auth'
      else { setUser(data.user); await loadAll(data.user.id) }
    })
  }, [])

  async function loadAll(userId: string) {
    setLoading(true)
    const { data } = await supabase.from('cas_events').select('*').eq('status', 'active').order('created_at', { ascending: false })
    setEvents(data || [])

    const { data: mine } = await supabase.from('cas_events').select('*').eq('created_by', userId).order('created_at', { ascending: false })
    setMyEvents(mine || [])

    await loadMyApplications()
    setLoading(false)
  }

  async function loadMyApplications() {
    const res = await fetch('/api/cas/applications', { headers: { ...(await authHeaders()) } })
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Could not load your projects.'); return }
    // The embedded relation arrives as an object, but normalise in case a
    // future query shape returns it as a one-element array.
    setMyApplications(
      (json.applications || []).map((a: any) => ({
        ...a,
        cas_events: Array.isArray(a.cas_events) ? a.cas_events[0] : a.cas_events,
      }))
    )
  }

  async function loadInbox(eventId: string) {
    const res = await fetch(`/api/cas/applications?eventId=${eventId}`, { headers: { ...(await authHeaders()) } })
    const json = await res.json()
    if (res.ok) setInbox((prev) => ({ ...prev, [eventId]: json.applications || [] }))
    else setError(json.error || 'Could not load the requests.')
  }

  async function decide(eventId: string, applicationId: string, status: string) {
    const res = await fetch('/api/cas/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify({ applicationId, status }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Could not update the request.'); return }
    await loadInbox(eventId)
  }

  async function createEvent() {
    if (!title || !description || !location || !eventDate) return
    setSubmitting(true)
    const { error: insertError } = await supabase.from('cas_events').insert({
      title, description, cas_category: category,
      location, event_date: eventDate,
      capacity: parseInt(capacity) || null,
      fee, event_type: 'student',
      created_by: user.id, status: 'active'
    })
    if (insertError) { setError(insertError.message); setSubmitting(false); return }
    setSuccess('Project created.')
    setTitle(''); setDescription(''); setLocation(''); setEventDate(''); setCapacity(''); setFee('Free')
    setShowForm(false)
    await loadAll(user.id)
    setSubmitting(false)
  }

  async function deleteEvent(eventId: string) {
    if (!confirm('Are you sure you want to delete this project?')) return
    setDeleting(eventId)
    await supabase.from('cas_events').delete().eq('id', eventId)
    await loadAll(user.id)
    setDeleting(null)
    setSuccess('Project deleted.')
  }

  async function apply(eventId: string) {
    setApplyingId(eventId)
    setError('')
    const res = await fetch('/api/cas/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify({ eventId, message: applyMessage }),
    })
    const json = await res.json()
    setApplyingId(null)

    if (!res.ok) {
      setError(json.error || 'Could not send the request.')
      setApplying(null)
      setApplyMessage('')
      return
    }

    setSuccess('Request sent. The organizer will reply inside the project.')
    setApplying(null)
    setApplyMessage('')
    await loadMyApplications()
  }

  async function submitProof(eventId: string) {
    if (!proofPhoto || !participantCount) return
    setSubmittingProof(true)
    // Store the object path, not a public URL — the bucket is private.
    const objectPath = storagePath(`${user.id}/${eventId}`, proofPhoto.name)
    const { error: uploadError } = await supabase.storage.from('cas-proofs').upload(objectPath, proofPhoto)
    if (uploadError) {
      setSubmittingProof(false)
      setError('Photo could not be uploaded: ' + uploadError.message)
      return
    }
    await supabase.from('cas_proofs').insert({
      event_id: eventId, uploaded_by: user.id,
      photo_url: objectPath,
      participant_count: parseInt(participantCount),
      notes: proofNotes, status: 'pending'
    })
    setSuccess('Proof submitted for review.')
    setUploadingFor(null); setProofPhoto(null); setProofNotes(''); setParticipantCount('')
    setSubmittingProof(false)
  }

  const filtered = filter === 'All' ? events : events.filter(e => e.cas_category === filter)
  const appliedIds = new Set(myApplications.map((a) => a.event_id))
  const joinedCount = myApplications.filter((a) => a.status === 'accepted').length

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">CAS Projects</h1>
            <p className="text-sm text-gray-500">Find a project, or start one and build a team.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            + Create project
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start justify-between gap-4">
            <p className="text-sm text-green-700">✅ {success}</p>
            <button onClick={() => setSuccess('')} className="text-green-600 text-xs">✕</button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start justify-between gap-4">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError('')} className="text-red-600 text-xs">✕</button>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Create new project</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Weekend hiking camp..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this project about?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CAS Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                    <option>Service</option><option>Activity</option><option>Creativity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                  <input value={fee} onChange={e => setFee(e.target.value)} placeholder="Free / 200 TL" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Antalya, Online..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max participants <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="20" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-xs text-yellow-700">Students who join see each other by initials only. After the project, upload photos and the participant count for verification.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
                <button onClick={createEvent} disabled={submitting || !title || !description || !location || !eventDate}
                  className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create project'}
                </button>
              </div>
            </div>
          </div>
        )}

        {applying && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">Ask to join</h3>
              <p className="text-xs text-gray-500 mb-4">The organizer sees your initials and this note. If they accept, you both continue in the project conversation on NetEdu.</p>
              <textarea value={applyMessage} onChange={e => setApplyMessage(e.target.value)}
                placeholder="Why do you want to join?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-24 mb-4" />
              <div className="flex gap-3">
                <button onClick={() => { setApplying(null); setApplyMessage('') }} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
                <button onClick={() => apply(applying)} disabled={applyingId !== null}
                  className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                  {applyingId ? 'Sending...' : 'Send request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {uploadingFor && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">Upload project proof</h3>
              <p className="text-xs text-gray-500 mb-4">Upload photos from the project. Once approved, it will count toward all participants portfolios.</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of participants</label>
                  <input type="number" value={participantCount} onChange={e => setParticipantCount(e.target.value)} placeholder="15" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo <span className="text-red-500">*</span></label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center ${proofPhoto ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                    <input type="file" accept="image/*" onChange={e => setProofPhoto(e.target.files?.[0] || null)} className="hidden" id="proof-upload" />
                    <label htmlFor="proof-upload" className="cursor-pointer">
                      {proofPhoto ? <p className="text-sm text-indigo-700">{proofPhoto.name}</p> : <p className="text-sm text-gray-500">Click to upload photo</p>}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={proofNotes} onChange={e => setProofNotes(e.target.value)} placeholder="Any additional notes..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setUploadingFor(null); setProofPhoto(null); setProofNotes(''); setParticipantCount('') }}
                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
                  <button onClick={() => submitProof(uploadingFor)} disabled={submittingProof || !proofPhoto || !participantCount}
                    className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                    {submittingProof ? 'Uploading...' : 'Submit for review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {chat && <ProjectChat eventId={chat.id} title={chat.title} onClose={() => setChat(null)} />}

        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab('discover')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'discover' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            Discover
          </button>
          <button onClick={() => setTab('joined')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'joined' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            Joined ({joinedCount})
          </button>
          <button onClick={() => setTab('myevents')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'myevents' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            My Projects ({myEvents.length})
          </button>
        </div>

        {tab === 'discover' && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {['All', 'Service', 'Activity', 'Creativity'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'}`}>
                  {f}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-semibold text-gray-800 mb-2">No projects yet</h3>
                <p className="text-sm text-gray-500 mb-4">Be the first to create a CAS project.</p>
                <button onClick={() => setShowForm(true)} className="bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Create the first one</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800 mb-2">{event.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[event.cas_category] || 'bg-gray-50 text-gray-500'}`}>{event.cas_category}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{event.description}</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">📍 Location</p><p className="text-xs font-medium text-gray-700">{event.location}</p></div>
                      <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">📅 Date</p><p className="text-xs font-medium text-gray-700">{event.event_date}</p></div>
                      <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">💰 Fee</p><p className="text-xs font-medium text-gray-700">{event.fee}</p></div>
                      {event.capacity && <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">👥 Capacity</p><p className="text-xs font-medium text-gray-700">{event.capacity} people</p></div>}
                    </div>
                    {event.created_by === user?.id ? (
                      <div className="text-center text-xs text-gray-400 py-2">Your project</div>
                    ) : appliedIds.has(event.id) ? (
                      <div className="text-center text-xs text-gray-400 py-2">Request already sent — see the Joined tab</div>
                    ) : (
                      <button onClick={() => setApplying(event.id)} className="w-full bg-indigo-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">Ask to join →</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'joined' && (
          <div className="flex flex-col gap-4">
            {myApplications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-800 mb-2">You have not joined a project yet</h3>
                <button onClick={() => setTab('discover')} className="mt-4 bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Browse projects</button>
              </div>
            ) : myApplications.map((a) => {
              const event = a.cas_events
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{event?.title || 'Project'}</h3>
                      <div className="flex gap-2 flex-wrap">
                        {event?.cas_category && (
                          <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[event.cas_category] || 'bg-gray-50 text-gray-500'}`}>{event.cas_category}</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full border ${statusStyles[a.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{a.status}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">📅 {event?.event_date}</p>
                      <p className="text-xs text-gray-400">📍 {event?.location}</p>
                    </div>
                  </div>
                  {a.status === 'accepted' ? (
                    <button onClick={() => setChat({ id: a.event_id, title: event?.title || 'Project' })}
                      className="w-full border border-indigo-900 text-indigo-900 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
                      💬 Open project conversation
                    </button>
                  ) : (
                    <p className="text-xs text-gray-400">
                      {a.status === 'pending'
                        ? 'Waiting for the organizer. The conversation opens once you are accepted.'
                        : 'You are not part of this project.'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'myevents' && (
          <div className="flex flex-col gap-4">
            {myEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-gray-800 mb-2">No projects created yet</h3>
                <button onClick={() => { setTab('discover'); setShowForm(true) }} className="mt-4 bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Create your first project</button>
              </div>
            ) : myEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[event.cas_category] || 'bg-gray-50 text-gray-500'}`}>{event.cas_category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">📅 {event.event_date}</p>
                    <p className="text-xs text-gray-400">📍 {event.location}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{event.description}</p>

                <div className="flex gap-3 flex-wrap mb-3">
                  <button
                    onClick={() => {
                      const next = openInbox === event.id ? null : event.id
                      setOpenInbox(next)
                      if (next) loadInbox(event.id)
                    }}
                    className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50">
                    👥 Requests{inbox[event.id] ? ` (${inbox[event.id].filter(a => a.status === 'pending').length})` : ''}
                  </button>
                  <button onClick={() => setChat({ id: event.id, title: event.title })}
                    className="px-4 py-2.5 border border-indigo-900 text-indigo-900 rounded-xl text-sm font-medium hover:bg-indigo-50">
                    💬 Conversation
                  </button>
                  <button onClick={() => setUploadingFor(event.id)}
                    className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50">
                    📷 Upload proof
                  </button>
                  <button onClick={() => deleteEvent(event.id)} disabled={deleting === event.id}
                    className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 disabled:opacity-50 ml-auto">
                    {deleting === event.id ? '...' : '🗑 Delete'}
                  </button>
                </div>

                {openInbox === event.id && (
                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                    {!inbox[event.id] && <p className="text-xs text-gray-400">Loading requests…</p>}
                    {inbox[event.id]?.length === 0 && <p className="text-xs text-gray-400">Nobody has asked to join yet.</p>}
                    {inbox[event.id]?.map((a) => (
                      <div key={a.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center justify-center">{a.initials}</span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${statusStyles[a.status] || 'bg-white text-gray-500 border-gray-200'}`}>{a.status}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                        {a.message && <p className="text-sm text-gray-600 leading-relaxed mb-3">{a.message}</p>}
                        <div className="flex gap-2">
                          {a.status === 'pending' && (
                            <>
                              <button onClick={() => decide(event.id, a.id, 'accepted')} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-900 text-white">Accept</button>
                              <button onClick={() => decide(event.id, a.id, 'declined')} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white">Decline</button>
                            </>
                          )}
                          {a.status === 'accepted' && (
                            <button onClick={() => decide(event.id, a.id, 'removed')} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 bg-white">Remove from project</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <p className="text-xs text-indigo-700">Students appear as initials until you accept them, and after that too. All messaging stays on NetEdu.</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          Names, e-mail addresses and phone numbers are never shown to other students. If a message worries you, use Report inside the
          conversation. <Link href="/pricing" className="text-indigo-700 underline">Messaging is part of Pro.</Link>
        </p>
      </div>
    </main>
  )
}
