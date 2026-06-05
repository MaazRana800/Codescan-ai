import Link from 'next/link'

const features = [
  { icon: '🤖', title: 'AI Code Review', description: 'Get instant, thorough code reviews powered by Google Gemini AI. Find bugs, security issues, and performance problems.' },
  { icon: '📊', title: 'Scored Reports', description: 'Receive a 0-100 score across Security, Performance, Maintainability, and Readability categories.' },
  { icon: '🔧', title: 'Fix Suggestions', description: 'Every issue comes with a detailed fix suggestion. Click to see the exact corrected code.' },
  { icon: '📄', title: 'PDF Reports', description: 'Download professional PDF reports with syntax-highlighted code and detailed analysis.' },
  { icon: '🔗', title: 'GitHub Integration', description: 'Connect your repos and get automatic PR reviews posted as comments on every pull request.' },
  { icon: '👥', title: 'Team Workspace', description: 'Share review history with your team. Perfect for small teams without a senior engineer.' },
]

const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 reviews/month', 'Basic code analysis', 'Community support'], cta: 'Get Started', popular: false },
  { name: 'Pro', price: '$12', period: '/month', features: ['100 reviews/month', 'GitHub integration (3 repos)', 'PDF reports', 'Priority support'], cta: 'Upgrade to Pro', popular: true },
  { name: 'Team', price: '$29', period: '/month', features: ['Unlimited reviews', 'Unlimited GitHub repos', 'Team workspace (5 members)', 'Priority support'], cta: 'Upgrade to Team', popular: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <span>🤖</span>
            CodeScan AI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            AI Code Review in <span className="text-blue-600">Seconds</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, thorough code reviews powered by Google Gemini AI. Catch security issues, performance bottlenecks, 
            and maintainability problems before they hit production.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Start Free →
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required. 5 free reviews to start.</p>
        </section>

        {/* Score Demo */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Sample Review Result</h2>
                <p className="text-gray-500 mt-2">See what your code review will look like</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Security', score: 72, icon: '🔒' },
                  { label: 'Performance', score: 85, icon: '⚡' },
                  { label: 'Maintainability', score: 68, icon: '🔧' },
                  { label: 'Readability', score: 91, icon: '📖' },
                ].map(cat => (
                  <div key={cat.label} className="text-center p-4 border rounded-xl">
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-3xl font-bold" style={{ color: cat.score >= 80 ? '#22c55e' : cat.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {cat.score}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{cat.label}</div>
                    <div className="mt-2 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${cat.score}%`, backgroundColor: cat.score >= 80 ? '#22c55e' : cat.score >= 60 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="text-5xl font-bold" style={{ color: '#f59e0b' }}>79</div>
                <div className="text-gray-500 text-sm mt-1">Overall Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need for better code</h2>
            <p className="text-gray-500 mt-4">Professional-grade code review tools for solo developers and teams</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
              <p className="text-gray-500 mt-4">Start free, upgrade when you need more</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map(plan => (
                <div key={plan.name} className={`bg-white rounded-2xl border-2 p-8 ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/signup"
                    className={`mt-8 block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2024 CodeScan AI. Built with Next.js, Supabase, Google Gemini, and Lemon Squeezy.
          </p>
        </div>
      </footer>
    </div>
  )
}
