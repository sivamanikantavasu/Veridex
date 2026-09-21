import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'

const plans = [
  {
    id: 'reader',
    name: 'Reader',
    tagline: 'For individual researchers',
    price: { monthly: '₹14', annual: '₹14' },
    color: 'var(--burgundy-400)',
    badge: null,
    features: [
      { label: 'Up to 200 content items / month', yes: true },
      { label: 'Academic journals access', yes: true },
      { label: 'Reading history & bookmarks', yes: true },
      { label: 'Dark / sepia / light reader themes', yes: true },
      { label: 'Research documents access', yes: false },
      { label: 'Collections & tagging', yes: false },
      { label: 'Institutional SSO', yes: false },
      { label: 'Admin console access', yes: false },
      { label: 'API access', yes: false },
    ],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    tagline: 'For serious academic work',
    price: { monthly: '₹34', annual: '₹34' },
    color: 'var(--burgundy-300)',
    badge: 'Most popular',
    featured: true,
    features: [
      { label: 'Unlimited content access', yes: true },
      { label: 'Academic journals access', yes: true },
      { label: 'Reading history & bookmarks', yes: true },
      { label: 'Dark / sepia / light reader themes', yes: true },
      { label: 'Research documents access', yes: true },
      { label: 'Collections & tagging', yes: true },
      { label: 'Institutional SSO', yes: false },
      { label: 'Admin console access', yes: false },
      { label: 'API access', yes: false },
    ],
  },
  {
    id: 'institution',
    name: 'Institution',
    tagline: 'Campus-wide licensing',
    price: { monthly: 'Custom', annual: 'Custom' },
    color: 'var(--accent-brass)',
    badge: null,
    features: [
      { label: 'Unlimited content access', yes: true },
      { label: 'Academic journals access', yes: true },
      { label: 'Reading history & bookmarks', yes: true },
      { label: 'Dark / sepia / light reader themes', yes: true },
      { label: 'Research documents access', yes: true },
      { label: 'Collections & tagging', yes: true },
      { label: 'Institutional SSO', yes: true },
      { label: 'Admin console access', yes: true },
      { label: 'API access', yes: true },
    ],
  },
]

const faqs = [
  { q: 'Can I change plans later?', a: 'Yes. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'Is there a free trial?', a: 'Reader and Scholar plans include a 14-day free trial with no credit card required. Institution plans start with a 30-day pilot.' },
  { q: 'How does institutional licensing work?', a: 'Institution plans are priced by concurrent-user count or FTE. Contact our team for a tailored quote.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, bank transfer (for institutional orders over $5,000/year), and purchase orders.' },
]

export default function PlansPage() {
  const [billing, setBilling] = useState('annual')

  return (
    <PublicLayout showBack>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--bg-surface) 0%, var(--burgundy-900) 100%)', borderBottom: '1px solid var(--border-subtle)', padding: '64px 24px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-brass)', marginBottom: '14px' }}>Subscription Plans</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Transparent, scalable pricing
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>All plans include unlimited reading sessions and a WCAG AA accessible reader.</p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '100px', padding: '3px' }}>
          {['monthly', 'annual'].map((b) => (
            <button key={b} onClick={() => setBilling(b)}
              style={{
                padding: '7px 22px', borderRadius: '100px', fontSize: '13px', fontWeight: 500,
                background: billing === b ? 'var(--burgundy-700)' : 'transparent',
                color: billing === b ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition)',
              }}
            >
              {b === 'annual' ? 'Annual (save 20%)' : 'Monthly'}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: '56px 24px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              background: plan.featured ? 'var(--burgundy-900)' : 'var(--bg-surface)',
              border: `1px solid ${plan.featured ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-lg)', padding: '32px 28px',
              position: 'relative',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--burgundy-500)', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '100px' }}>
                  {plan.badge}
                </div>
              )}
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: plan.color, margin: '0 0 8px' }}>{plan.name}</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {plan.price[billing]}
                {plan.price[billing] !== 'Custom' && <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>/ mo</span>}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px' }}>{plan.tagline}</p>

              <Link to={plan.id === 'institution' ? '/Veridex/Contact' : '/Veridex/Sign-Up'}
                style={{
                  display: 'block', textAlign: 'center', padding: '11px 0',
                  background: plan.featured ? 'var(--burgundy-500)' : 'transparent',
                  border: `1px solid ${plan.featured ? 'var(--burgundy-400)' : 'var(--border-strong)'}`,
                  color: plan.featured ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 500,
                  textDecoration: 'none', marginBottom: '24px', transition: 'all var(--transition)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = plan.featured ? 'var(--burgundy-600)' : 'var(--bg-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = plan.featured ? 'var(--burgundy-500)' : 'transparent' }}
              >
                {plan.id === 'institution' ? 'Contact sales' : 'Start free trial'}
              </Link>

              <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '20px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((f) => (
                  <div key={f.label} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: f.yes ? 'rgba(78,159,125,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {f.yes
                        ? <Check size={11} color="var(--success)" />
                        : <X size={11} color="var(--border-strong)" />}
                    </div>
                    <span style={{ fontSize: '13px', color: f.yes ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 36px', textAlign: 'center' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqs.map((faq) => (
              <div key={faq.q} style={{ padding: '20px 24px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>{faq.q}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

