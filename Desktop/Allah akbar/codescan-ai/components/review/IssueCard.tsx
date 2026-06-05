'use client'
import { useState } from 'react'

const severityConfig = {
  critical: { color: 'text-red-700 bg-red-50 border-red-200', label: 'CRITICAL' },
  high:     { color: 'text-orange-700 bg-orange-50 border-orange-200', label: 'HIGH' },
  medium:   { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'MEDIUM' },
  low:      { color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'LOW' },
  info:     { color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'INFO' },
}

export default function IssueCard({ issue }: { issue: any }) {
  const [showFix, setShowFix] = useState(false)
  const config = severityConfig[issue.severity as keyof typeof severityConfig] || severityConfig.info

  return (
    <div className={`border rounded-lg p-4 ${config.color}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold">{config.label}</span>
            <span className="text-xs opacity-60">·</span>
            <span className="text-xs opacity-60 capitalize">{issue.category}</span>
            {issue.line_start && (
              <>
                <span className="text-xs opacity-60">·</span>
                <span className="text-xs opacity-60">Line {issue.line_start}</span>
              </>
            )}
          </div>
          <h4 className="font-medium text-sm">{issue.title}</h4>
          <p className="text-sm opacity-80 mt-1">{issue.description}</p>
        </div>
        {issue.fix && (
          <button
            onClick={() => setShowFix(!showFix)}
            className="text-xs px-3 py-1.5 rounded-md border font-medium whitespace-nowrap hover:opacity-80"
          >
            {showFix ? 'Hide Fix' : 'Show Fix'}
          </button>
        )}
      </div>

      {showFix && issue.fix && (
        <div className="mt-3 bg-black/5 rounded-md p-3">
          <p className="text-xs font-medium mb-2 opacity-60">Suggested Fix</p>
          <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
            {issue.fix}
          </pre>
        </div>
      )}
    </div>
  )
}
