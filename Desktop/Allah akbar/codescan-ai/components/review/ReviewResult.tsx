'use client'
import ScoreDashboard from './ScoreDashboard'
import IssueCard from './IssueCard'
import Button from '@/components/ui/Button'

export default function ReviewResult({ review, reviewData }: { review: any, reviewData: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Review Results</h2>
        <ScoreDashboard scores={reviewData.scores} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <p className="text-gray-600">{reviewData.summary}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Issues Found ({reviewData.issues?.length || 0})</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(`/api/report/${review.id}`, '_blank')}
          >
            Download PDF
          </Button>
        </div>
        <div className="space-y-3">
          {reviewData.issues?.map((issue: any) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>

      {reviewData.positive_points?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Positive Points</h2>
          <ul className="space-y-2">
            {reviewData.positive_points.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-600">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reviewData.recommendations?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {reviewData.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                <span className="text-gray-600">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
