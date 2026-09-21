import React, { useState } from 'react'
import { Mail, Building2, MessageSquare, CheckCircle } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'

const channels = [
  {
    icon: Mail,
    color: 'var(--burgundy-300)',
    bg: 'rgba(163,50,79,0.10)',
    label: 'General enquiries',
    value: 'shivamanikantavasu@gmail.com',
    note: 'We respond to all messages within two business days.',
  },
  {
    icon: Building2,
    color: 'var(--info)',
    bg: 'rgba(107,143,184,0.10)',
    label: 'Institutional licensing',
    value: 'shivamanikantavasu@gmail.com',
    note: 'For consortium, campus, and multi-user subscription queries.',
  },
  {
    icon: MessageSquare,
    color: 'var(--success)',
    bg: 'rgba(78,159,125,0.10)',
    label: 'Publisher partnerships',
    value: 'shivamanikantavasu@gmail.com',
    note: 'For onboarding your catalogue onto the Veridex platform.',
  },
]

const reasons = ['General question', 'Technical support', 'Institutional licensing', 'Publisher partnership', 'Press & media', 'Other']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', org: '', reason: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 900)
  }

  return (
    <PublicLayout showBack>
      {/* Hero */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-brass)', marginBottom: '14px' }}>Contact Us</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Get in touch
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            Whether you're a librarian evaluating institutional licences, a publisher exploring distribution, or an individual reader with a question — we want to hear from you.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
        {/* Left — channels */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 28px' }}>Direct channels</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {channels.map((ch) => (
              <div key={ch.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ch.icon size={18} color={ch.color} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '0 0 3px' }}>{ch.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--burgundy-300)', margin: '0 0 4px' }}>{ch.value}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{ch.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 6px' }}>Response times</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              General: 2 business days<br />
              Institutional: same business day<br />
              Technical support (existing subscribers): 4 hours
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 28px' }}>Send a message</h2>

          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '40px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(78,159,125,0.15)', border: '1px solid rgba(78,159,125,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={24} color="var(--success)" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>Message received</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>Thanks for reaching out. We'll get back to you at <strong style={{ color: 'var(--text-secondary)' }}>{form.email}</strong> within two business days.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Full name *" value={form.name} onChange={set('name')} type="text" required />
                <Field label="Email *" value={form.email} onChange={set('email')} type="email" required />
              </div>
              <Field label="Organisation" value={form.org} onChange={set('org')} type="text" />
              <div>
                <label style={labelSt}>Reason for contact</label>
                <select value={form.reason} onChange={set('reason')} style={{ ...inputSt, appearance: 'none' }}>
                  <option value="">Select…</option>
                  {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>Message *</label>
                <textarea
                  value={form.message} onChange={set('message')} required rows={5}
                  placeholder="Tell us what you need…"
                  style={{ ...inputSt, resize: 'vertical' }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                padding: '12px 28px', fontSize: '14px', fontWeight: 600,
                background: 'var(--burgundy-600)', border: '1px solid var(--burgundy-500)',
                color: 'var(--text-primary)', borderRadius: 'var(--radius-md)',
                cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'background var(--transition)', alignSelf: 'flex-start',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--burgundy-700)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--burgundy-600)'}
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      <input type={type} value={value} onChange={onChange} required={required} style={inputSt} />
    </div>
  )
}

const labelSt = { display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }
const inputSt = { width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', padding: '9px 12px', fontFamily: 'var(--font-sans)', outline: 'none' }
