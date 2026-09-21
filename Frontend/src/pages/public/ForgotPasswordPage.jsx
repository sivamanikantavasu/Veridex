import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 900)
  }

  return (
    <PublicLayout showBack>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', minHeight: '60vh' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px' }}>
        {!sent ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Reset your password</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 28px' }}>Enter your email address and we'll send a secure reset link.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" fullWidth loading={loading}>Send Reset Link</Button>
              <Link to="/Veridex/Log-In" style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>← Back to sign in</Link>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(107,143,184,0.15)', border: '1px solid rgba(107,143,184,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Mail size={22} color="var(--info)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>Check your inbox</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
              If an account exists for <strong style={{ color: 'var(--text-secondary)' }}>{email}</strong>, you'll receive a reset link within a few minutes.
            </p>
            <Link to="/Veridex/Log-In" style={{ fontSize: '13px', color: 'var(--burgundy-300)' }}>Return to sign in</Link>
          </div>
        )}
      </div>
      </div>
    </PublicLayout>
  )
}
