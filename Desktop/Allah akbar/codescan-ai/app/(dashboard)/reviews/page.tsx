'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setReviews(data)
    setIsLoading(false)
  }

  const filteredReviews = reviews
    .filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                r.language?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'score') return (b.overall_score || 0) - (a.overall_score || 0)
      if (sortBy === 'issues') return (b.issue_count || 0) - (a.issue_count || 0)
      return 0
    })

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
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-500 mt-1">All your code reviews in one place</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="score">Sort by Score</option>
          <option value="issues">Sort by Issues</option>
        </select>
      </div>

      <Card>
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews found.</p>
            <Link href="/review" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
              Create your first review →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Language</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Issues</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReviews.map(review => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-sm">{review.title}</div>
                      <div className="text-xs text-gray-500">{review.source}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{review.language || 'Unknown'}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {review.overall_score !== null ? (
                        <span className={`font-bold ${
                          review.overall_score >= 80 ? 'text-green-600' :
                          review.overall_score >= 60 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {review.overall_score}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{review.issue_count || 0}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/reviews/${review.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
                        </Link>
                        {review.status === 'complete' && (
                          <a 
                            href={`/api/report/${review.id}`}
                            target="_blank"
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            PDF
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
