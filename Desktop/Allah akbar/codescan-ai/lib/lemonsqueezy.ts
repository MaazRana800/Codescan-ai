import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => console.error('Lemon Squeezy Error:', error),
})

export const LEMON_VARIANTS = {
  pro: process.env.LEMONSQUEEZY_VARIANT_PRO!,
  team: process.env.LEMONSQUEEZY_VARIANT_TEAM!,
}

export { createCheckout }
