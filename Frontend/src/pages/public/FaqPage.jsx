import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'

const ALL_FAQS = [
  // Accounts & Access
  { cat: 'Accounts & Access', q: 'How do I create an account?', a: 'Click "Get Started" on the home page or "Sign Up" in the navigation bar. You will need to provide your name, email address, and a password. Email verification is required before you can log in.' },
  { cat: 'Accounts & Access', q: 'I forgot my password. How do I reset it?', a: 'Click "Forgot password?" on the sign-in page, enter your registered email, and follow the link we send you. Reset links expire after 60 minutes.' },
  { cat: 'Accounts & Access', q: 'Can I use the platform on multiple devices?', a: 'Yes. You can be signed in on up to the number of devices permitted by your subscription tier simultaneously. Exceeding that limit will end the oldest session automatically.' },
  { cat: 'Accounts & Access', q: 'How do I change my email address?', a: 'Go to your Profile settings and update your email address. A verification link will be sent to the new address before the change takes effect.' },
  { cat: 'Accounts & Access', q: 'Can I share my account with colleagues?', a: 'Individual accounts are single-user and may not be shared. Organisations needing multi-user access should contact us about an Institution plan.' },

  // Subscriptions & Billing
  { cat: 'Subscriptions & Billing', q: 'What happens when my free trial ends?', a: 'At the end of the 14-day trial your account moves to a read-only state. You will not be billed automatically unless you entered payment details during sign-up and opted in to auto-renew.' },
  { cat: 'Subscriptions & Billing', q: 'Can I switch between monthly and annual billing?', a: 'Yes. You can switch from monthly to annual at any time — the change takes effect at your next renewal date. Switching from annual to monthly applies at annual renewal.' },
  { cat: 'Subscriptions & Billing', q: 'Do you offer discounts for students?', a: 'We offer a verified student rate of 40% off the Reader plan. Verification is handled through your institutional email address.' },
  { cat: 'Subscriptions & Billing', q: 'How do I cancel my subscription?', a: 'Go to Account → Subscription → Cancel plan. Cancellation stops auto-renewal; you retain access until the end of your paid period.' },
  { cat: 'Subscriptions & Billing', q: 'Can I get a refund?', a: 'Monthly plans are refundable within 7 days of payment if fewer than 20 items were accessed. Annual plans are refundable within 30 days. Contact shivamanikantavasu@gmail.com for refund requests.' },

  // Content & Reading
  { cat: 'Content & Reading', q: 'Why can\'t I access a specific article?', a: 'Access depends on your subscription tier and the content type. Some items require a higher-tier subscription or are subject to publisher embargo periods. The detail page will show you the exact access rule.' },
  { cat: 'Content & Reading', q: 'Can I download content for offline reading?', a: 'Downloads are not available on the platform. Content is streamed to protect publisher rights. You can add items to your Reading List to access them quickly when online.' },
  { cat: 'Content & Reading', q: 'Why does my document have a watermark?', a: 'Watermarks are a publisher-required security measure. They contain encrypted session information and do not affect the reading experience. They cannot be removed.' },
  { cat: 'Content & Reading', q: 'Can I print content?', a: 'Printing is not enabled on the platform. This is a rights-management requirement applied to all content. Some publishers permit print for specific items — this will be indicated on the content detail page.' },
  { cat: 'Content & Reading', q: 'How do I save content to read later?', a: 'Use the Bookmark button on any content detail page to add items to a Collection. You can create and manage Collections from your account sidebar.' },

  // Technical
  { cat: 'Technical', q: 'Which browsers are supported?', a: 'Veridex is fully tested on the current and previous major version of Chrome, Firefox, Safari, and Edge. Older browsers may work but are not officially supported.' },
  { cat: 'Technical', q: 'The page won\'t load — what should I do?', a: 'Clear your browser cache and cookies, then reload. If the problem persists, try a different browser or incognito window. Check our status page at our support team for any ongoing incidents.' },
  { cat: 'Technical', q: 'Is my reading data private?', a: 'Reading history is private to your account and, for institutional subscribers, to your institution\'s administrator. We do not sell individual reading data to third parties. See our Privacy Policy for full details.' },
  { cat: 'Technical', q: 'How do I report a technical problem?', a: 'Use the contact form on our Contact page and select "Technical support" as the reason. Include the URL of the affected page and a description of the issue.' },

  // Institutions
  { cat: 'Institutions', q: 'How does institutional SSO work?', a: 'Institution plan subscribers can configure SAML 2.0 or OpenID Connect SSO through the Admin console. Users sign in via your IdP and are automatically provisioned. Setup documentation is available in the admin help centre.' },
  { cat: 'Institutions', q: 'Can we restrict which content our users can access?', a: 'Yes. The entitlements console lets administrators apply subject-area, content-type, and date-range restrictions to groups of users within your institution.' },
  { cat: 'Institutions', q: 'Is there an API for integration with our library catalogue?', a: 'Yes. Institution plans include API access via OAuth 2.0. Documentation is available at your admin console. Contact your account manager to enable API access.' },
]

const CATS = [...new Set(ALL_FAQS.map((f) => f.cat))]

export default function FaqPage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [openIdx, setOpenIdx] = useState(null)

  const filtered = ALL_FAQS.filter((faq) => {
    const matchesCat = activeCat === 'All' || faq.cat === activeCat
    const matchesSearch = !search.trim() || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <PublicLayout showBack>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--bg-surface) 0%, var(--burgundy-900) 100%)', borderBottom: '1px solid var(--border-subtle)', padding: '64px 24px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-brass)', marginBottom: '14px' }}>Help Centre</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Frequently asked questions
        </h1>
        {/* Search */}
        <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '15px', padding: '12px 14px 12px 40px', fontFamily: 'var(--font-sans)', outline: 'none' }}
          />
        </div>
      </section>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {['All', ...CATS].map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{
                padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500,
                background: activeCat === cat ? 'var(--burgundy-700)' : 'var(--bg-elevated)',
                color: activeCat === cat ? 'var(--text-primary)' : 'var(--text-muted)',
                border: `1px solid ${activeCat === cat ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
                cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--transition)',
              }}
            >{cat}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No questions match "{search}". Try a different term or browse all categories.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((faq, i) => {
              const isOpen = openIdx === i
              return (
                <div key={i} style={{ background: 'var(--bg-surface)', border: `1px solid ${isOpen ? 'var(--burgundy-700)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'border-color var(--transition)' }}>
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', textAlign: 'left', fontFamily: 'var(--font-sans)' }}
                    aria-expanded={isOpen}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{faq.q}</span>
                    <div style={{ flexShrink: 0, color: isOpen ? 'var(--burgundy-300)' : 'var(--text-muted)' }}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: '14px 0 0' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: '48px', padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>Still have questions?</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 16px' }}>Our support team typically replies within two business days.</p>
          <Link to="/Veridex/Contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: 'var(--burgundy-600)', border: '1px solid var(--burgundy-500)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
            Contact us →
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}

