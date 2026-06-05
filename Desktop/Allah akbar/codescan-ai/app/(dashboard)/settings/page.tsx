'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) setProfile(data)
    setIsLoading(false)
  }

  async function upgradePlan(plan: 'pro' | 'team') {
    try {
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (e) {
      console.error('Failed to upgrade:', e)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and billing</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-medium">{profile?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Full Name</span>
            <span className="text-sm font-medium">{profile?.full_name || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">GitHub</span>
            <span className="text-sm font-medium">{profile?.github_username || 'Not connected'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">Current Plan</span>
            <span className={`text-sm font-medium capitalize ${
              profile?.plan === 'pro' ? 'text-blue-600' :
              profile?.plan === 'team' ? 'text-purple-600' :
              'text-gray-600'
            }`}>
              {profile?.plan}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Upgrade Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`border rounded-lg p-4 ${profile?.plan === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold">Free</h3>
            <p className="text-2xl font-bold mt-2">$0<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              <li>5 reviews/month</li>
              <li>No GitHub repos</li>
              <li>No PDF reports</li>
            </ul>
          </div>
          <div className={`border rounded-lg p-4 ${profile?.plan === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold">Pro</h3>
            <p className="text-2xl font-bold mt-2">$12<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              <li>100 reviews/month</li>
              <li>3 GitHub repos</li>
              <li>PDF reports</li>
            </ul>
            {profile?.plan !== 'pro' && (
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => upgradePlan('pro')}
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
          <div className={`border rounded-lg p-4 ${profile?.plan === 'team' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="font-semibold">Team</h3>
            <p className="text-2xl font-bold mt-2">$29<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              <li>Unlimited reviews</li>
              <li>Unlimited repos</li>
              <li>Up to 5 team members</li>
            </ul>
            {profile?.plan !== 'team' && (
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => upgradePlan('team')}
              >
                Upgrade to Team
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
