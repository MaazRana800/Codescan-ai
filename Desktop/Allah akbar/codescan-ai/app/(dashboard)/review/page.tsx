'use client'
import { useState } from 'react'
import CodeEditor from '@/components/review/CodeEditor'
import ReviewResult from '@/components/review/ReviewResult'

export default function ReviewPage() {
  const [review, setReview] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(code: string, language: string, title: string) {
    setIsLoading(true)
    setError('')
    setReview(null)
    setReviewData(null)

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, title })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Review failed')
      }

      setReview({ id: data.reviewId, title: title || 'Review', created_at: new Date().toISOString() })
      setReviewData(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Review</h1>
        <p className="text-gray-500 mt-1">Paste your code and get AI-powered feedback</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CodeEditor onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {reviewData && review && (
        <ReviewResult review={review} reviewData={reviewData} />
      )}
    </div>
  )
}
