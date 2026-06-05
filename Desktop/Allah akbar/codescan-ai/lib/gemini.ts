import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function reviewCode(code: string, language?: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `You are a senior software engineer performing a thorough code review.

Review the following ${language || 'code'} and respond ONLY with a valid JSON object. No explanation text before or after the JSON.

The JSON must follow this exact structure:
{
  "language": "detected language name",
  "summary": "2-3 sentence overall assessment",
  "scores": {
    "security": 0-100,
    "performance": 0-100,
    "maintainability": 0-100,
    "readability": 0-100
  },
  "issues": [
    {
      "id": "unique string id",
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "category": "security" | "performance" | "maintainability" | "readability" | "bug",
      "line_start": line number or null,
      "line_end": line number or null,
      "title": "Short issue title",
      "description": "What is wrong and why it matters",
      "fix": "Exact corrected code snippet or clear fix instruction"
    }
  ],
  "positive_points": ["what the code does well", "..."],
  "recommendations": ["top 3 overall suggestions"]
}

Scoring guide:
- 90-100: Excellent, production-ready
- 70-89: Good with minor issues
- 50-69: Acceptable but needs improvement
- 30-49: Significant problems
- 0-29: Critical issues, do not deploy

Be thorough. Find real issues. Do not hallucinate line numbers.

Code to review:
\`\`\`
${code}
\`\`\``

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
    },
  })

  const text = result.response.text()

  try {
    const parsed = JSON.parse(text)
    return { success: true, data: parsed }
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      return { success: true, data: JSON.parse(match[0]) }
    }
    return { success: false, error: 'Failed to parse AI response' }
  }
}
