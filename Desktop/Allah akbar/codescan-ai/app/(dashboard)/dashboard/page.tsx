'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgScore: 0,
    issuesFound: 0,
    recentReviews: [] as any[]
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (reviews) {
      const completed = reviews.filter(r => r.status === 'complete')
      const totalIssues = completed.reduce((sum, r) => sum + (r.issue_count || 0), 0)
      const avgScore = completed.length > 0 
        ? Math.round(completed.reduce((sum, r) => sum + (r.overall_score || 0), 0) / completed.length)
        : 0

      setStats({
        totalReviews: reviews.length,
        avgScore,
        issuesFound: totalIssues,
        recentReviews: reviews.slice(0, 5)
      })
    }
    setIsLoading(false)
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your code reviews</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-3xl font-bold text-blue-600">{stats.totalReviews}</div>
          <div className="text-sm text-gray-500 mt-1">Total Reviews</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-green-600">{stats.avgScore}</div>
          <div className="text-sm text-gray-500 mt-1">Average Score</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-red-600">{stats.issuesFound}</div>
          <div className="text-sm text-gray-500 mt-1">Issues Found</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Reviews</h2>
          <Link href="/reviews" className="text-sm text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        {stats.recentReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Start by reviewing some code!</p>
            <Link href="/review" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
              New Review →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentReviews.map(review => (
              <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{review.title}</p>
                  <p className="text-xs text-gray-500">
                    {review.language} · {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {review.overall_score !== null && (
                    <span className={`text-sm font-bold ${
                      review.overall_score >= 80 ? 'text-green-600' :
                      review.overall_score >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {review.overall_score}
                    </span>
                  )}
                  <Link 
                    href={`/reviews/${review.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
