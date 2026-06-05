import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { ReviewPDFDocument } from '@/lib/pdf'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const buffer = await renderToBuffer(
    React.createElement(ReviewPDFDocument, { review, reviewData: review.review_result })
  )

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="codescan-report-${params.id}.pdf"`
    }
  })
}
