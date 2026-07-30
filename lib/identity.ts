import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// AI category -> score bucket
function bucketFor(category: string): 'academic' | 'leadership' | 'project' | 'social' {
  switch (category) {
    case 'Academic':
    case 'Research':
      return 'academic'
    case 'Leadership':
      return 'leadership'
    case 'Project':
      return 'project'
    default:
      return 'social'
  }
}

/**
 * Recomputes the Academic Identity Score from scratch.
 * Only APPROVED items count. Called after submit, approve, reject or delete.
 */
export async function recomputeIdentityScore(userId: string) {
  const { data: items } = await supabase
    .from('portfolio_items')
    .select('ai_score, ai_category, status')
    .eq('user_id', userId)
    .eq('status', 'approved')

  const buckets: Record<string, number[]> = {
    academic: [], leadership: [], project: [], social: []
  }

  for (const item of items || []) {
    const score = Number(item.ai_score) || 0
    buckets[bucketFor(item.ai_category)].push(score)
  }

  // One strong item reaches 75% of its quality; two or more reach full quality.
  function categoryScore(scores: number[]): number {
    if (scores.length === 0) return 0
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const depth = Math.min(1, 0.5 + 0.25 * scores.length)
    return Math.min(100, Math.round(avg * depth))
  }

  const academic = categoryScore(buckets.academic)
  const leadership = categoryScore(buckets.leadership)
  const project = categoryScore(buckets.project)
  const social = categoryScore(buckets.social)

  // Single division — breadth across the four areas is what admissions look for.
  const total = Math.round((academic + leadership + project + social) / 4)

  await supabase.from('identity_scores').upsert({
    user_id: userId,
    academic_score: academic,
    leadership_score: leadership,
    project_score: project,
    social_score: social,
    total_score: total,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })

  return { academic, leadership, project, social, total }
}