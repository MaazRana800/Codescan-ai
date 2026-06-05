import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { reviewCode } from '@/lib/gemini'
import { getOctokit, getPRFiles, getFileContent } from '@/lib/github'
import crypto from 'crypto'

function verifyGitHubSignature(body: string, signature: string): boolean {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256') || ''

  if (!verifyGitHubSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)

  if (!['opened', 'synchronize'].includes(payload.action)) {
    return NextResponse.json({ status: 'ignored' })
  }

  const supabase = createClient()
  const repoFullName = payload.repository.full_name
  const prNumber = payload.pull_request.number

  const { data: connectedRepo } = await supabase
    .from('connected_repos')
    .select('user_id')
    .eq('repo_full_name', repoFullName)
    .single()

  if (!connectedRepo) return NextResponse.json({ status: 'repo not connected' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('github_access_token, plan')
    .eq('id', connectedRepo.user_id)
    .single()

  const [owner, repo] = repoFullName.split('/')
  const octokit = getOctokit(profile.github_access_token)
  const prFiles = await getPRFiles(profile.github_access_token, owner, repo, prNumber)

  const codeExtensions = ['.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.go', '.rb', '.php', '.cs']
  const codeFiles = prFiles.filter(f =>
    codeExtensions.some(ext => f.filename.endsWith(ext)) && f.status !== 'removed'
  ).slice(0, 5)

  let allIssues: any[] = []
  let reviewComments = ''

  for (const file of codeFiles) {
    try {
      const { content } = await getFileContent(profile.github_access_token, owner, repo, file.filename)
      const result = await reviewCode(content)
      if (result.success) {
        const critical = result.data.issues.filter((i: any) => ['critical', 'high'].includes(i.severity))
        allIssues = allIssues.concat(critical)
        reviewComments += `\n### \`${file.filename}\` — Score: ${Math.round((result.data.scores.security + result.data.scores.performance + result.data.scores.maintainability + result.data.scores.readability) / 4)}/100\n`
        critical.forEach((issue: any) => {
          reviewComments += `\n**${issue.severity.toUpperCase()}** · ${issue.title}\n> ${issue.description}\n`
        })
      }
    } catch (e) {
      console.error(`Failed to review ${file.filename}:`, e)
    }
  }

  const commentBody = allIssues.length > 0
    ? `## 🤖 CodeScan AI Review\n\nFound **${allIssues.length} critical/high issues** across ${codeFiles.length} files.\n${reviewComments}\n\n---\n*[View full report](${process.env.NEXT_PUBLIC_APP_URL}/dashboard)*`
    : `## 🤖 CodeScan AI Review\n\n✅ No critical issues found in ${codeFiles.length} files reviewed.\n\n---\n*[View full report](${process.env.NEXT_PUBLIC_APP_URL}/dashboard)*`

  await octokit.issues.createComment({
    owner, repo,
    issue_number: prNumber,
    body: commentBody
  })

  return NextResponse.json({ success: true })
}
