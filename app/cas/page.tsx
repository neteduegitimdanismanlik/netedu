'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { storagePath } from '@/lib/storage'
import Navbar from '../components/Navbar'

const categoryColors: any = {
  'Creativity': 'bg-purple-50 text-purple-700 border-purple-200',
  'Activity': 'bg-blue-50 text-blue-700 border-blue-200',
  'Service': 'bg-green-50 text-green-700 border-green-200',
}

export default function CAS() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState('discover')
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
      else { setUser(data.user); await loadEvents(data.user.id) }
    })
  }, [])

  async function loadEvents(userId: string) {
    setLoading(true)
    const { data } = await supabase.from('cas_events').select('*').eq('status', 'active').order('created_at', { ascending: false })
    setEvents(data || [])
    const { data: mine } = await supabase.from('cas_events').select('*').eq('created_by', userId).order('created_at', { ascending: false })
    setMyEvents(mine || [])
    setLoading(false)
  }

  async function createEvent() {
    if (!title || !description || !location || !eventDate) return
    setSubmitting(true)
    await supabase.from('cas_events').insert({
      title, description, cas_category: category,
      location, event_date: eventDate,
      capacity: parseInt(capacity) || null,
      fee, event_type: 'student',
      created_by: user.id, status: 'active'
    })
    setSuccess('Event created!')
    setTitle(''); setDescription(''); setLocation(''); setEventDate(''); setCapacity(''); setFee('Free')
    setShowForm(false)
    await loadEvents(user.id)
    setSubmitting(false)
  }

  async function deleteEvent(eventId: string) {
    if (!confirm('Are you sure you want to delete this event?')) return
    setDeleting(eventId)
    await supabase.from('cas_events').delete().eq('id', eventId)
    await loadEvents(user.id)
    setDeleting(null)
    setSuccess('Event deleted.')
  }

  async function apply(eventId: string) {
    setApplyingId(eventId)
    await supabase.from('cas_applications').insert({
      event_id: eventId, user_id: user.id, message: applyMessage, status: 'pending'
    })
    setSuccess('Application sent! The organizer will contact you via WhatsApp if accepted.')
    setApplying(null)
    setApplyMessage('')
    setApplyingId(null)
  }

  async function submitProof(eventId: string) {
    if (!proofPhoto || !participantCount) return
    setSubmittingProof(true)
    // Store the object path, not a public URL — the bucket is private.
    const objectPath = storagePath(`${user.id}/${eventId}`, proofPhoto.name)
    const { error: uploadError } = await supabase.storage.from('cas-proofs').upload(objectPath, proofPhoto)
    if (uploadError) {
      setSubmittingProof(false)
      alert('Fotoğraf yüklenemedi: ' + uploadError.message)
      return
    }
    await supabase.from('cas_proofs').insert({
      event_id: eventId, uploaded_by: user.id,
      photo_url: objectPath,
      participant_count: parseInt(participantCount),
      notes: proofNotes, status: 'pending'
    })
    setSuccess('Proof submitted for review!')
    setUploadingFor(null); setProofPhoto(null); setProofNotes(''); setParticipantCount('')
    setSubmittingProof(false)
  }

  const filtered = filter === 'All' ? events : events.filter(e => e.cas_category === filter)

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">CAS Activities</h1>
            <p className="text-sm text-gray-500">Find and join Creativity, Activity and Service opportunities.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">
            + Create event
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">✅ {success}</p>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Create new event</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Weekend hiking camp..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this event about?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-20" />
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
                <p className="text-xs text-yellow-700">After the event, upload photos and participant list for verification.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
                <button onClick={createEvent} disabled={submitting || !title || !description || !location || !eventDate}
                  className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create event'}
                </button>
              </div>
            </div>
          </div>
        )}

        {applying && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">Apply to join</h3>
              <p className="text-xs text-gray-500 mb-4">If accepted, the organizer will contact you via WhatsApp.</p>
              <textarea value={applyMessage} onChange={e => setApplyMessage(e.target.value)}
                placeholder="Why do you want to join?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-24 mb-4" />
              <div className="flex gap-3">
                <button onClick={() => { setApplying(null); setApplyMessage('') }} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
                <button onClick={() => apply(applying)} disabled={applyingId !== null}
                  className="flex-1 bg-indigo-900 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50">
                  {applyingId ? 'Sending...' : 'Send application'}
                </button>
              </div>
            </div>
          </div>
        )}

        {uploadingFor && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">Upload event proof</h3>
              <p className="text-xs text-gray-500 mb-4">Upload photos from the event. Once approved, it will count toward all participants portfolios.</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of participants</label>
                  <input type="number" value={participantCount} onChange={e => setParticipantCount(e.target.value)} placeholder="15" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event photo <span className="text-red-500">*</span></label>
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

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('discover')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'discover' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            Discover
          </button>
          <button onClick={() => setTab('myevents')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'myevents' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            My Events ({myEvents.length})
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
                <h3 className="font-semibold text-gray-800 mb-2">No events yet</h3>
                <p className="text-sm text-gray-500 mb-4">Be the first to create a CAS activity!</p>
                <button onClick={() => setShowForm(true)} className="bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Create first event</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((event, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
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
                    {event.created_by !== user?.id ? (
                      <button onClick={() => setApplying(event.id)} className="w-full bg-indigo-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800">Apply to join →</button>
                    ) : (
                      <div className="text-center text-xs text-gray-400 py-2">Your event</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'myevents' && (
          <div className="flex flex-col gap-4">
            {myEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-gray-800 mb-2">No events created yet</h3>
                <button onClick={() => { setTab('discover'); setShowForm(true) }} className="mt-4 bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Create your first event</button>
              </div>
            ) : myEvents.map((event, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
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
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-3">
                  <p className="text-xs text-indigo-700">After the event is done, upload photos as proof. Once approved, it will count toward all participants portfolios.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => deleteEvent(event.id)} disabled={deleting === event.id}
                    className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 disabled:opacity-50">
                    {deleting === event.id ? '...' : '🗑 Delete'}
                  </button>
                  <button onClick={() => setUploadingFor(event.id)}
                    className="flex-1 border border-indigo-900 text-indigo-900 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50">
                    📷 Upload event proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}