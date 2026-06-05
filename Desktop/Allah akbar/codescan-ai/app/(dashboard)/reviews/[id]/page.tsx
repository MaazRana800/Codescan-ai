'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import ReviewResult from '@/components/review/ReviewResult'
import Link from 'next/link'

export default function ReviewDetailPage() {
  const params = useParams()
  const [review, setReview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) fetchReview()
  }, [params.id])

  async function fetchReview() {
    try {
      const response = await fetch(`/api/review/${params.id}`)
      if (!response.ok) throw new Error('Review not found')
      const data = await response.json()
      setReview(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Review not found'}</p>
        <Link href="/reviews" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
          ← Back to reviews
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{review.title}</h1>
          <p className="text-gray-500 mt-1">
            {review.language} · {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
        <Link 
          href="/reviews" 
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to reviews
        </Link>
      </div>

      {review.status === 'complete' && review.review_result ? (
        <ReviewResult review={review} reviewData={review.review_result} />
      ) : review.status === 'pending' ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700">
          Review is still processing...
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Review failed. Please try again.
        </div>
      )}
    </div>
  )
}
