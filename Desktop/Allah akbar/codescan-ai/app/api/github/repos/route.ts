import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { getOctokit } from '@/lib/github'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('github_access_token')
    .eq('id', user.id)
    .single()

  if (!profile?.github_access_token) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 })
  }

  const { Octokit } = await import('@octokit/rest')
  const octokit = new Octokit({ auth: profile.github_access_token })
  const { data } = await octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 50 })

  return NextResponse.json(data.map(r => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    private: r.private,
    language: r.language,
    updatedAt: r.updated_at
  })))
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { repoFullName } = await req.json()
  const [owner, repo] = repoFullName.split('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('github_access_token')
    .eq('id', user.id)
    .single()

  const { Octokit } = await import('@octokit/rest')
  const octokit = new Octokit({ auth: profile.github_access_token })

  const { data: webhook } = await octokit.repos.createWebhook({
    owner, repo,
    config: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/github/webhook`,
      content_type: 'json',
      secret: process.env.GITHUB_WEBHOOK_SECRET,
    },
    events: ['pull_request'],
    active: true,
  })

  await supabase.from('connected_repos').insert({
    user_id: user.id,
    repo_full_name: repoFullName,
    repo_id: webhook.id,
    webhook_id: webhook.id,
    auto_review: true,
  })

  return NextResponse.json({ success: true })
}
