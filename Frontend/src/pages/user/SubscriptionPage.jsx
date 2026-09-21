import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Check } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Skeleton } from '../../components/Skeleton.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getSubscriptionStatus, getSubscriptionPlans } from '../../api/access.js'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function SubscriptionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])

  useEffect(() => {
    let mounted = true
    const loadSubscription = async () => {
      const [sub, p] = await Promise.all([getSubscriptionStatus(), getSubscriptionPlans()])
      if (!mounted) return
      setSubscription(sub); setPlans(p.length ? p : [
        { id: 'reader', name: 'Reader', price: '₹14/mo', description: 'Up to 200 items/month, academic journals, history and bookmarks.' },
        { id: 'scholar', name: 'Scholar', price: '₹34/mo', description: 'Unlimited content, research documents, collections and tagging.' },
        { id: 'institution', name: 'Institution', price: 'Custom', description: 'SSO, admin console, API access and custom user limits.' },
      ]); setLoading(false)
    }
    loadSubscription()
    window.addEventListener('focus', loadSubscription)
    return () => {
      mounted = false
      window.removeEventListener('focus', loadSubscription)
    }
  }, [])

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Subscription' },
  ]

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>Subscription</h1>
        </div>

        {/* Current plan */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Current Plan</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={16} width={`${60 + i * 10}%`} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} color="var(--text-muted)" />
                </div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{subscription?.plan || '—'}</p>
                  <Badge variant={subscription?.status === 'active' ? 'success' : 'default'}>{subscription?.status === 'active' ? 'Active subscription' : 'No active subscription'}</Badge>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>Monthly charge</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{subscription?.monthlyCharge || '—'}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Entitlements */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Entitlements</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Plan', value: subscription?.plan || '—' },
              { label: 'Items accessible', value: subscription?.itemsAccessible || '—' },
              { label: 'Start date', value: subscription?.startDate || '—' },
              { label: 'End date', value: subscription?.endDate || '—' },
              { label: 'Status', value: subscription?.status || '—' },
              { label: 'Entitlements', value: subscription?.entitlements?.length ? `${subscription.entitlements.length} active` : '—' },
            ].map((e) => (
              <div key={e.label} style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 6px' }}>{e.label}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--text-primary)', margin: 0 }}>{e.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Billing placeholder */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Billing</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 20px' }}>Billing history and payment method management will be available once connected.</p>
          <Button variant="secondary" onClick={() => alert('Billing portal will be available once connected to the payment backend.')}>Manage Billing</Button>
        </Card>

        {/* Plans */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Available Plans</h2>
          {plans.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Plans will appear here once connected to the backend.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {plans.map((plan) => <PlanCard key={plan.id} plan={plan} onSelect={() => navigate('../Upgrade')} />)}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}

function PlanCard({ plan, onSelect }) {
  return (
    <Card style={{ padding: '24px' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>{plan.name}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 16px' }}>{plan.price}</p>
      <Button variant="secondary" fullWidth onClick={onSelect}>Select Plan</Button>
    </Card>
  )
}
