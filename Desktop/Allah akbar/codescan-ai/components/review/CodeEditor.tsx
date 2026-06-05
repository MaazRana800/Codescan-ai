'use client'
import { useState } from 'react'

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', 'Other'
]

interface CodeEditorProps {
  onSubmit: (code: string, language: string, title: string) => void
  isLoading: boolean
}

export default function CodeEditor({ onSubmit, isLoading }: CodeEditorProps) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [title, setTitle] = useState('')

  const handleSubmit = () => {
    if (!code.trim()) return
    onSubmit(code, language, title)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Code Review"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paste your code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste your code here..."
          className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{code.length} characters</span>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !code.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Reviewing...' : 'Review Code'}
        </button>
      </div>
    </div>
  )
}
