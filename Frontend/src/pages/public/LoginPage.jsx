import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import VerdixMark from '../../components/VerdixMark.jsx'
import PublicLayout from '../../layouts/PublicLayout.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function LoginPage({ adminMode = false }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const trimmedEmail = form.email.trim()
      const trimmedPassword = form.password

      if (!trimmedEmail || !trimmedPassword) {
        setError('Please enter both email and password.')
        setLoading(false)
        return
      }

      const result = await login({ email: trimmedEmail, password: trimmedPassword })
      setLoading(false)

      if (!result.success) {
        setError(result.error || 'Invalid credentials. Please check your details and try again.')
        return
      }

      navigate('/Veridex/Verification/Captcha', {
        replace: true,
        state: { auth: result.user, adminMode },
      })
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Session error, please try again.')
    }
  }

  const normalizeRole = (role) => {
    const value = (role || '').toString().trim().toLowerCase()
    if (value === 'role_admin' || value === 'admin' || value === 'admin_role') return 'admin'
    if (value === 'role_user' || value === 'user' || value === 'user_role') return 'user'
    return 'user'
  }

  return (
    <PublicLayout showBack>
      <div style={{ display: 'flex', minHeight: '60vh' }}>
        {/* Brand panel */}
        <div className="login-brand-panel" style={{
          flex: '0 0 44%',
          background: 'linear-gradient(150deg, var(--burgundy-800) 0%, var(--burgundy-900) 55%, var(--bg-base) 100%)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 64px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle geometric background */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                border: '1px solid var(--burgundy-300)',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }} />
            ))}
          </div>

          <Link to="/Veridex" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'auto', textDecoration: 'none', position: 'relative' }}>
            <VerdixMark size={26} color="var(--burgundy-200)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Veridex</span>
          </Link>

          <div style={{ position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
            {adminMode && (
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--burgundy-300)', margin: '0 0 20px' }}>
                Administration Portal
              </p>
            )}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3vw, 42px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
            }}>
              {adminMode
                ? 'Secure management console access'
                : 'Your archive of rights-controlled knowledge'}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0, maxWidth: 380 }}>
              {adminMode
                ? 'All administrative actions are logged to an immutable audit trail and governed by role-based access controls.'
                : 'Access peer-reviewed journals, research documents, and monographs — each governed by precise entitlement rules.'}
            </p>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '48px 0 0', position: 'relative' }}>
            Veridex &copy; {new Date().getFullYear()}
          </p>
        </div>

        {/* Form panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: 'var(--bg-base)' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            {/* Mobile logo */}
            <div className="mobile-logo" style={{ display: 'none', alignItems: 'center', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
              <VerdixMark size={22} color="var(--burgundy-300)" />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Veridex</span>
            </div>

            <>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {adminMode ? 'Administrator sign in' : 'Sign in to Veridex'}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 32px' }}>
                {adminMode
                  ? 'Secure admin access.'
                  : <>New here? <Link to="/Veridex/Sign-Up" style={{ color: 'var(--burgundy-300)', textDecoration: 'none' }}>Create an account</Link></>}
              </p>

              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Input
                  label="Email address" type="email" id="email" required
                  autoComplete="email" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Input
                  label="Password" type={showPass ? 'text' : 'password'} id="password" required
                  autoComplete="current-password" value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  suffix={
                    <button type="button" onClick={() => setShowPass((s) => !s)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form.remember} onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))} style={{ accentColor: 'var(--burgundy-500)', cursor: 'pointer' }} />
                    Remember this device
                  </label>
                  <Link to="/Veridex/Forgot-Password" style={{ fontSize: '13px', color: 'var(--burgundy-300)', textDecoration: 'none' }}>Forgot password?</Link>
                </div>

                {error && (
                  <div role="alert" style={{ padding: '10px 14px', background: 'rgba(229,72,77,0.08)', border: '1px solid rgba(229,72,77,0.25)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--danger)' }}>
                    {error}
                  </div>
                )}

                <Button type="submit" fullWidth loading={loading}>
                  {adminMode ? 'Continue' : 'Sign in'}
                </Button>
              </form>
            </>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-brand-panel { display: none !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </PublicLayout>
  )
}

function OtpInput({ value, onChange }) {
  const len = 6
  const digits = Array.from({ length: len }, (_, i) => value[i] || '')
  const refs = Array.from({ length: len }, () => React.createRef())

  const handleKey = (i, e) => {
    if (/^\d$/.test(e.key)) {
      const next = value.slice(0, i) + e.key + value.slice(i + 1)
      onChange(next)
      if (i < len - 1) refs[i + 1].current?.focus()
    } else if (e.key === 'Backspace') {
      onChange(value.slice(0, i) + ' ' + value.slice(i + 1))
      if (i > 0) refs[i - 1].current?.focus()
    }
  }

  return (
    <div>
      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px' }}>Verification code</p>
      <div style={{ display: 'flex', gap: '8px' }} role="group" aria-label="One-time password">
        {digits.map((d, i) => (
          <input
            key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
            value={d.trim()} onChange={() => {}} onKeyDown={(e) => handleKey(i, e)}
            aria-label={`Digit ${i + 1}`}
            style={{
              width: '48px', height: '56px', textAlign: 'center',
              fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: 600,
              color: 'var(--text-primary)', background: 'var(--bg-elevated)',
              border: `2px solid ${d.trim() ? 'var(--burgundy-500)' : 'var(--border-strong)'}`,
              borderRadius: 'var(--radius-md)', outline: 'none', flex: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
