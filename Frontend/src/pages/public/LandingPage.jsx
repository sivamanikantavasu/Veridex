import React from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout.jsx'
import { FileText, Microscope, Lock, Shield, Key, Library, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--bg-surface) 0%, var(--burgundy-900) 100%)', borderBottom: '1px solid var(--border-subtle)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-brass)', marginBottom: '20px' }}>
            Rights-Controlled Digital Publishing
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)', margin: '0 0 24px', letterSpacing: '-0.03em' }}>
            Scholarly content, delivered with precision access control
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Veridex is a subscription-based platform for books, academic journals, and research documents — with granular rights management built in from the ground up.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/Veridex/Sign-Up" style={heroCta}>Start Reading</Link>
            <Link to="/Veridex/Log-In" style={heroSecondary}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* Content types */}
      <section style={{ padding: '80px 24px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>Three content verticals, one platform</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>Unified access management across every format you publish or read.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {contentTypes.map((ct) => (
            <div key={ct.title} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '32px', transition: 'border-color var(--transition)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: ct.iconBg, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ct.icon size={22} color={ct.iconColor} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>{ct.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{ct.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How rights access works */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>How rights-controlled access works</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>Every document is protected end-to-end. Access is earned, not assumed.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            {rightsSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-brass)', fontWeight: 600 }}>0{i + 1}</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{s.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription tiers */}
      <section style={{ padding: '80px 24px', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>Subscription plans</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Pricing and feature details will be published before launch.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {tiers.map((tier) => (
            <div key={tier.name} style={{
              background: tier.featured ? 'var(--burgundy-900)' : 'var(--bg-surface)',
              border: `1px solid ${tier.featured ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '32px 24px',
            }}>
              {tier.featured && <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-brass)', margin: '0 0 12px' }}>Most Popular</p>}
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>{tier.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px' }}>{tier.description}</p>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '20px 0' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>Pricing to be announced</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--burgundy-900)', borderTop: '1px solid var(--burgundy-800)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Ready to access the archive?</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>Create your account and start exploring rights-controlled content.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/Veridex/Sign-Up" style={heroCta}>Create Account</Link>
          <Link to="/Veridex/Log-In" style={heroSecondary}>Sign In</Link>
        </div>
      </section>
    </PublicLayout>
  )
}

const heroCta = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '12px 28px', borderRadius: 'var(--radius-md)',
  background: 'var(--burgundy-500)', border: '1px solid var(--burgundy-400)',
  color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500,
  textDecoration: 'none',
}

const heroSecondary = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '12px 28px', borderRadius: 'var(--radius-md)',
  background: 'transparent', border: '1px solid var(--border-strong)',
  color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 400,
  textDecoration: 'none',
}

const contentTypes = [
  { icon: Library, title: 'Books', description: 'Full monographs, reference works, and edited volumes — protected by per-chapter or full-volume entitlements.', iconColor: 'var(--burgundy-300)', iconBg: 'var(--burgundy-900)' },
  { icon: FileText, title: 'Academic Journals', description: 'Peer-reviewed periodicals with issue and article-level access rules, embargo periods, and citation tracking.', iconColor: 'var(--info)', iconBg: 'var(--info-bg)' },
  { icon: Microscope, title: 'Research Documents', description: 'Pre-prints, working papers, technical reports, and dissertations with institutional access gates.', iconColor: 'var(--teal)', iconBg: 'var(--teal-bg)' },
]

const rightsSteps = [
  { icon: Key, title: 'Authenticate', description: 'Every session is verified. Access tokens are issued per entitlement, not per user.', color: 'var(--accent-brass)' },
  { icon: Lock, title: 'Validate entitlement', description: 'The access service checks plan, content type, subject, date window, and device limits in real time.', color: 'var(--burgundy-300)' },
  { icon: Shield, title: 'Deliver securely', description: 'Content is streamed, not downloaded. Watermarks and session binding prevent redistribution.', color: 'var(--info)' },
  { icon: CheckCircle, title: 'Read with confidence', description: 'Your session is monitored for anomalies. Concurrent session limits are enforced automatically.', color: 'var(--success)' },
]

const tiers = [
  { name: 'Reader', description: 'Individual access to selected collections.', featured: false },
  { name: 'Scholar', description: 'Expanded journal and research document access.', featured: true },
  { name: 'Institution', description: 'Campus-wide licensing with admin controls.', featured: false },
]
