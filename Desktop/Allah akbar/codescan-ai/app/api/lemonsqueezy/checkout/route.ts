import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { createCheckout, LEMON_VARIANTS } from '@/lib/lemonsqueezy'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()
  const variantId = LEMON_VARIANTS[plan as keyof typeof LEMON_VARIANTS]
  if (!variantId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  try {
    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      variantId,
      {
        checkoutOptions: {
          embed: false,
          media: true,
          logo: true,
          desc: true,
        },
        checkoutData: {
          email: user.email,
          custom: {
            userId: user.id,
            plan: plan,
          },
        },
        productOptions: {
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
        },
      }
    )

    return NextResponse.json({ url: checkout.data?.attributes?.url })
  } catch (error: any) {
    console.error('Lemon Squeezy checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
