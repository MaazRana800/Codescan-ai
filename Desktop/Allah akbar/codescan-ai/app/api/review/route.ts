import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { reviewCode } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, review_count')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free' && (profile?.review_count || 0) >= 5) {
    return NextResponse.json({ error: 'Free limit reached. Upgrade to Pro.' }, { status: 403 })
  }

  const { code, language, title } = await req.json()

  if (!code || code.length < 10) {
    return NextResponse.json({ error: 'Please provide code to review' }, { status: 400 })
  }

  if (code.length > 50000) {
    return NextResponse.json({ error: 'Code too long. Maximum 50,000 characters.' }, { status: 400 })
  }

  const { data: review } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      title: title || `Review ${new Date().toLocaleDateString()}`,
      language,
      original_code: code,
      status: 'pending',
      source: 'paste'
    })
    .select()
    .single()

  const result = await reviewCode(code, language)

  if (!result.success) {
    await supabase.from('reviews').update({ status: 'error' }).eq('id', review.id)
    return NextResponse.json({ error: 'Review failed' }, { status: 500 })
  }

  const scores = result.data.scores
  const overall = Math.round((scores.security + scores.performance + scores.maintainability + scores.readability) / 4)

  await supabase.from('reviews').update({
    review_result: result.data,
    score_security: scores.security,
    score_performance: scores.performance,
    score_maintainability: scores.maintainability,
    score_readability: scores.readability,
    overall_score: overall,
    issue_count: result.data.issues?.length || 0,
    language: result.data.language,
    status: 'complete'
  }).eq('id', review.id)

  await supabase.from('profiles')
    .update({ review_count: (profile?.review_count || 0) + 1 })
    .eq('id', user.id)

  return NextResponse.json({ reviewId: review.id, data: result.data })
}
