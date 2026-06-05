'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ReposPage() {
  const [repos, setRepos] = useState<any[]>([])
  const [connectedRepos, setConnectedRepos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Fetch connected repos from DB
    const { data: connected } = await supabase
      .from('connected_repos')
      .select('*')
      .eq('user_id', user.id)

    if (connected) setConnectedRepos(connected)

    // Fetch GitHub repos
    try {
      const response = await fetch('/api/github/repos')
      if (response.ok) {
        const data = await response.json()
        setRepos(data)
      }
    } catch (e) {
      console.error('Failed to fetch repos:', e)
    }

    setIsLoading(false)
  }

  async function connectRepo(repoFullName: string) {
    setIsConnecting(true)
    try {
      const response = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoFullName })
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (e) {
      console.error('Failed to connect repo:', e)
    }
    setIsConnecting(false)
  }

  const isConnected = (fullName: string) => 
    connectedRepos.some(cr => cr.repo_full_name === fullName)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GitHub Repositories</h1>
        <p className="text-gray-500 mt-1">Connect repos for automatic PR review</p>
      </div>

      {repos.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No GitHub repositories found.</p>
            <p className="text-sm text-gray-400">
              Make sure you've connected your GitHub account in settings.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map(repo => (
            <Card key={repo.id} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{repo.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{repo.fullName}</p>
                <div className="flex items-center gap-2 mt-2">
                  {repo.language && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{repo.language}</span>
                  )}
                  {repo.private && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Private</span>
                  )}
                </div>
              </div>
              <Button
                variant={isConnected(repo.fullName) ? 'secondary' : 'primary'}
                size="sm"
                isLoading={isConnecting}
                disabled={isConnected(repo.fullName)}
                onClick={() => connectRepo(repo.fullName)}
              >
                {isConnected(repo.fullName) ? 'Connected' : 'Connect'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
