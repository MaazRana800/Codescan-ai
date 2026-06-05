import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import crypto from 'crypto'

function verifyLemonSqueezySignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const expected = hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-signature') || ''

  if (!verifyLemonSqueezySignature(body, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const eventName = payload.meta?.event_name

  const supabase = createClient()

  // Handle subscription created (checkout completed)
  if (eventName === 'subscription_created' || eventName === 'subscription_payment_success') {
    const customData = payload.meta?.custom_data || {}
    const { userId, plan } = customData

    if (userId && plan) {
      await supabase.from('profiles').update({
        plan,
        lemonsqueezy_customer_id: String(payload.data.attributes.customer_id),
        lemonsqueezy_subscription_id: String(payload.data.id),
        review_count: 0
      }).eq('id', userId)
    }
  }

  // Handle subscription cancelled
  if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
    const subscriptionId = String(payload.data.id)

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('lemonsqueezy_subscription_id', subscriptionId)
      .single()

    if (profile) {
      await supabase.from('profiles')
        .update({ plan: 'free', lemonsqueezy_subscription_id: null })
        .eq('id', profile.id)
    }
  }

  return NextResponse.json({ received: true })
}
