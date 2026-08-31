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