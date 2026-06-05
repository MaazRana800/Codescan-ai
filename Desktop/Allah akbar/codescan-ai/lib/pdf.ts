import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1d4ed8' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: 4, marginBottom: 12 },
  scoreGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  scoreCard: { flex: 1, border: '1px solid #e5e7eb', borderRadius: 6, padding: 10, alignItems: 'center' },
  scoreNumber: { fontSize: 22, fontWeight: 'bold' },
  scoreLabel: { fontSize: 8, color: '#6b7280', marginTop: 2 },
  issue: { border: '1px solid #e5e7eb', borderRadius: 4, padding: 8, marginBottom: 8 },
  issueSeverity: { fontSize: 8, fontWeight: 'bold', marginBottom: 4 },
  issueTitle: { fontSize: 10, fontWeight: 'bold' },
  issueDesc: { fontSize: 9, color: '#4b5563', marginTop: 3, lineHeight: 1.4 },
  codeBlock: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 4, fontFamily: 'Courier', fontSize: 8, marginTop: 4, lineHeight: 1.5 },
})

function getScoreColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

function getSeverityColor(severity: string) {
  const map: Record<string, string> = {
    critical: '#dc2626', high: '#ea580c',
    medium: '#d97706', low: '#2563eb', info: '#6b7280'
  }
  return map[severity] || '#6b7280'
}

export function ReviewPDFDocument({ review, reviewData }: { review: any, reviewData: any }) {
  const scores = reviewData.scores
  const overall = Math.round((scores.security + scores.performance + scores.maintainability + scores.readability) / 4)

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, 'CodeScan AI — Code Review Report'),
        React.createElement(Text, { style: styles.subtitle }, `${review.title} · ${new Date(review.created_at).toLocaleDateString()}`),
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Quality Scores'),
        React.createElement(View, { style: styles.scoreGrid },
          [
            { label: 'Overall', score: overall },
            { label: 'Security', score: scores.security },
            { label: 'Performance', score: scores.performance },
            { label: 'Maintainability', score: scores.maintainability },
            { label: 'Readability', score: scores.readability },
          ].map(s =>
            React.createElement(View, { key: s.label, style: styles.scoreCard },
              React.createElement(Text, { style: { ...styles.scoreNumber, color: getScoreColor(s.score) } }, String(s.score)),
              React.createElement(Text, { style: styles.scoreLabel }, s.label),
            )
          )
        ),
        React.createElement(Text, { style: { fontSize: 9, color: '#4b5563', lineHeight: 1.5 } }, reviewData.summary),
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, `Issues Found (${reviewData.issues?.length || 0})`),
        ...(reviewData.issues || []).slice(0, 20).map((issue: any) =>
          React.createElement(View, { key: issue.id, style: styles.issue },
            React.createElement(Text, { style: { ...styles.issueSeverity, color: getSeverityColor(issue.severity) } },
              `${issue.severity.toUpperCase()} · ${issue.category} · ${issue.line_start ? `Line ${issue.line_start}` : 'General'}`
            ),
            React.createElement(Text, { style: styles.issueTitle }, issue.title),
            React.createElement(Text, { style: styles.issueDesc }, issue.description),
            issue.fix && React.createElement(Text, { style: { ...styles.issueDesc, fontStyle: 'italic', marginTop: 4 } }, `Fix: ${issue.fix}`),
          )
        )
      ),
    )
  )
}

export async function generatePDF(review: any, reviewData: any) {
  const doc = ReviewPDFDocument({ review, reviewData })
  const blob = await pdf(doc).toBlob()
  return blob
}
