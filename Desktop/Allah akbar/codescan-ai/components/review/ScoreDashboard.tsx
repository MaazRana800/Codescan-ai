'use client'
import ScoreRing from '@/components/ui/ScoreRing'

interface Scores {
  security: number
  performance: number
  maintainability: number
  readability: number
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  if (score >= 40) return 'Poor'
  return 'Critical'
}

export default function ScoreDashboard({ scores }: { scores: Scores }) {
  const overall = Math.round(
    (scores.security + scores.performance + scores.maintainability + scores.readability) / 4
  )

  const categories = [
    { key: 'security', label: 'Security', score: scores.security, icon: '🔒' },
    { key: 'performance', label: 'Performance', score: scores.performance, icon: '⚡' },
    { key: 'maintainability', label: 'Maintainability', score: scores.maintainability, icon: '🔧' },
    { key: 'readability', label: 'Readability', score: scores.readability, icon: '📖' },
  ]

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl font-bold" style={{ color: getScoreColor(overall) }}>
          {overall}
        </div>
        <div className="text-gray-500 text-sm mt-1">Overall Score</div>
        <div className="font-medium mt-1">{getScoreLabel(overall)}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.key} className="border rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="text-3xl font-bold" style={{ color: getScoreColor(cat.score) }}>
              {cat.score}
            </div>
            <div className="text-sm text-gray-500 mt-1">{cat.label}</div>
            <div className="mt-2 bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${cat.score}%`,
                  backgroundColor: getScoreColor(cat.score)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
