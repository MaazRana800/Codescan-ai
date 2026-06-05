# CodeScan AI

AI-powered code review SaaS built with Next.js 14, Supabase, Google Gemini, and Lemon Squeezy.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + Auth)
- **AI:** Google Gemini API (2.5 Flash - free tier available)
- **Payments:** Lemon Squeezy (checkout + subscriptions)
- **OAuth:** GitHub
- **Email:** Resend
- **Styling:** Tailwind CSS

## Free Tier Strategy

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Google Gemini | Free tier | 1,500 requests/day (Flash) |
| Supabase | Free tier | 500MB DB, 2GB storage |
| Vercel | Free tier (Hobby) | 100GB bandwidth |
| GitHub OAuth | Always free | Unlimited |
| Resend | Free tier | 3,000 emails/month |
| Lemon Squeezy | Free to set up | No monthly fees |

**Total cost to start: $0**

## Quick Start

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your API keys:
```bash
cp .env.local.example .env.local
```

3. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL from `database-schema.sql` in the SQL Editor
   - Copy the URL and anon key to `.env.local`

4. Set up Google Gemini:
   - Get an API key from [aistudio.google.com](https://aistudio.google.com)
   - Add to `.env.local`

5. Set up Lemon Squeezy:
   - Create a store at [app.lemonsqueezy.com](https://app.lemonsqueezy.com)
   - Create products (Pro $12/mo, Team $29/mo)
   - Get API key, store ID, and variant IDs
   - Add to `.env.local`

6. Set up GitHub OAuth:
   - Create an OAuth app at [github.com/settings/developers](https://github.com/settings/developers)
   - Set callback URL to `http://localhost:3000/api/github/connect`

7. Run the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → API |
| `GEMINI_API_KEY` | Google Gemini API key | Google AI Studio |
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID | GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | GitHub Developer Settings |
| `GITHUB_WEBHOOK_SECRET` | Random string for webhook verification | Generate yourself |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API key | Lemon Squeezy Settings → API |
| `LEMONSQUEEZY_STORE_ID` | Your store ID | Lemon Squeezy Settings |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret | Lemon Squeezy Settings → Webhooks |
| `LEMONSQUEEZY_VARIANT_PRO` | Pro plan variant ID | Lemon Squeezy Product page |
| `LEMONSQUEEZY_VARIANT_TEAM` | Team plan variant ID | Lemon Squeezy Product page |
| `RESEND_API_KEY` | Resend API key | Resend Dashboard |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `http://localhost:3000` for dev |

## Features

- ✅ AI Code Review (paste code, get scored analysis)
- ✅ 4-Score Dashboard (Security, Performance, Maintainability, Readability)
- ✅ Issue Cards with expandable fix suggestions
- ✅ PDF Report Generation
- ✅ GitHub OAuth & Repo Integration
- ✅ Automatic PR Review via Webhooks
- ✅ Lemon Squeezy Subscriptions (Pro/Team)
- ✅ Team Workspace with invites
- ✅ Responsive Dashboard UI

## API Routes

```
POST /api/review                   Submit code for review
GET  /api/review/:id               Get review result
GET  /api/report/:id               Download PDF report
GET  /api/github/connect           OAuth callback
GET  /api/github/repos             List user's GitHub repos
POST /api/github/repos             Connect a repo (adds webhook)
POST /api/github/webhook           Receive PR events from GitHub
POST /api/lemonsqueezy/checkout    Create checkout session
POST /api/lemonsqueezy/webhook     Handle payment events
```

## Deployment

1. Deploy to Vercel:
```bash
npm install -g vercel
vercel --prod
```

2. Add all environment variables in Vercel Dashboard → Settings → Environment Variables

3. Update GitHub OAuth callback URL to production URL

4. Update Lemon Squeezy webhook URL to `https://yourapp.vercel.app/api/lemonsqueezy/webhook`

5. Update `NEXT_PUBLIC_APP_URL` to your production URL

## License

MIT
