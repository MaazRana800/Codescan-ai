import { Octokit } from '@octokit/rest'

export function getOctokit(accessToken: string) {
  return new Octokit({ auth: accessToken })
}

export async function getUserRepos(accessToken: string) {
  const octokit = getOctokit(accessToken)
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 50
  })
  return data.map(r => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    private: r.private,
    language: r.language,
    updatedAt: r.updated_at
  }))
}

export async function getRepoFiles(accessToken: string, owner: string, repo: string, path = '') {
  const octokit = getOctokit(accessToken)
  const { data } = await octokit.repos.getContent({ owner, repo, path })
  return data
}

export async function getFileContent(accessToken: string, owner: string, repo: string, path: string) {
  const octokit = getOctokit(accessToken)
  const { data } = await octokit.repos.getContent({ owner, repo, path }) as any
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return { content, sha: data.sha, size: data.size }
}

export async function getPRFiles(accessToken: string, owner: string, repo: string, pullNumber: number) {
  const octokit = getOctokit(accessToken)
  const { data } = await octokit.pulls.listFiles({ owner, repo, pull_number: pullNumber })
  return data
}
