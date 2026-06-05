import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const { data: { session } } = await supabase.auth.getSession()
  const githubToken = session?.provider_token

  if (githubToken) {
    const { Octokit } = await import('@octokit/rest')
    const octokit = new Octokit({ auth: githubToken })
    const { data: githubUser } = await octokit.users.getAuthenticated()

    await supabase.from('profiles').update({
      github_access_token: githubToken,
      github_username: githubUser.login
    }).eq('id', user.id)
  }

  return NextResponse.redirect(new URL('/repos', req.url))
}
