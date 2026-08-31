import { supabase } from './supabase'

/**
 * Turns a stored value into a short-lived signed URL.
 * Accepts either a full public URL (older rows) or a bare object path (new rows).
 */
export async function toSignedUrl(
  bucket: string,
  stored: string | null | undefined,
  seconds = 3600
): Promise<string | null> {
  if (!stored) return null

  const marker = `/object/public/${bucket}/`
  let path = stored.includes(marker) ? stored.split(marker)[1] : stored
  try { path = decodeURIComponent(path) } catch { /* keep as-is */ }
  path = path.split('?')[0]

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, seconds)
  if (error) return null
  return data?.signedUrl ?? null
}

/** Resolves signed URLs for a list of rows in one pass. */
export async function signRows<T extends Record<string, any>>(
  rows: T[],
  bucket: string,
  field: string,
  seconds = 3600
): Promise<T[]> {
  return Promise.all(
    rows.map(async (r) => ({ ...r, [field]: await toSignedUrl(bucket, r[field], seconds) }))
  )
}

/**
 * Opens a stored file in a new tab through a short-lived signed URL.
 * The tab is opened synchronously so the popup blocker does not swallow it,
 * then pointed at the signed URL once it has been issued.
 */
export async function openStoredFile(
  bucket: string,
  stored: string | null | undefined
): Promise<void> {
  const tab = window.open('', '_blank')
  const url = await toSignedUrl(bucket, stored)
  if (!url) {
    tab?.close()
    alert('Dosya açılamadı — bağlantı üretilemedi ya da bu dosyayı görme yetkin yok.')
    return
  }
  if (tab) tab.location.href = url
  else window.location.href = url
}

/** Builds an unguessable object path: <prefix>/<timestamp>-<random>.<ext> */
export function storagePath(prefix: string, fileName: string): string {
  const ext = fileName.split('.').pop() || 'bin'
  const rand = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)).replace(/-/g, '')
  return `${prefix}/${Date.now()}-${rand}.${ext}`
}