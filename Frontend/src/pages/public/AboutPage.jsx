import React from 'react'
import { Shield, Globe, Users, Award } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'

const pillars = [
  {
    icon: Shield,
    color: 'var(--burgundy-400)',
    bg: 'rgba(163,50,79,0.12)',
    title: 'Rights-first architecture',
    body: 'Every document on the platform is governed by a precise entitlement rule. Access is validated in real time — by content type, subject area, date window, and subscriber tier — before a single page is rendered.',
  },
  {
    icon: Globe,
    color: 'var(--info)',
    bg: 'rgba(107,143,184,0.12)',
    title: 'Global scholarly coverage',
    body: 'Our catalogue spans peer-reviewed journals, academic monographs, technical reports, and institutional working papers across medicine, law, engineering, social sciences, and the humanities.',
  },
  {
    icon: Users,
    color: 'var(--success)',
    bg: 'rgba(78,159,125,0.12)',
    title: 'Institution-grade controls',
    body: 'Administrators manage user access, content entitlements, and concurrent-session limits from a single console. All actions are written to an immutable audit trail.',
  },
  {
    icon: Award,
    color: 'var(--accent-brass)',
    bg: 'rgba(184,155,94,0.12)',
    title: 'Reader-centred design',
    body: 'The secure reader adapts to every screen size and supports dark, sepia, and light themes. Session watermarking and print restrictions protect publisher rights without impeding the reading experience.',
  },
]


export default function AboutPage() {
  return (
    <PublicLayout showBack>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--bg-surface) 0%, var(--burgundy-900) 100%)', borderBottom: '1px solid var(--border-subtle)', padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-brass)', marginBottom: '16px' }}>About Veridex</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Built for serious scholarship
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            Veridex is a rights-controlled digital publishing platform designed for researchers, librarians, and institutions that need precision access management alongside a world-class reading experience.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '72px 24px', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Our mission</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: '0 0 16px' }}>
          Academic knowledge should be accessible — but access must be earned, verified, and governed by clear rules. Publishers invest years and substantial resources producing peer-reviewed content. Veridex exists to protect that investment while making the content as discoverable and readable as possible for entitled subscribers.
        </p>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
          We believe that rigorous rights management and excellent user experience are not opposites. Every design decision on the platform balances the reader's need for friction-free access with the publisher's need for enforceable protection.
        </p>
      </section>

      {/* Pillars */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 48px', textAlign: 'center' }}>What we stand for</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {pillars.map((p) => (
              <div key={p.title} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <p.icon size={20} color={p.color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>{p.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}

