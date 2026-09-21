import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, X as XIcon } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import CaptchaGuard from '../../components/CaptchaGuard.jsx'
import { register } from '../../api/auth.js'

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Number', test: (p) => /\d/.test(p) },
  { label: 'Special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

function strength(password) {
  const passed = rules.filter((r) => r.test(password)).length
  if (passed <= 1) return { level: 0, label: 'Weak', color: 'var(--danger)' }
  if (passed <= 3) return { level: 1, label: 'Fair', color: 'var(--warning)' }
  if (passed === 4) return { level: 2, label: 'Good', color: 'var(--info)' }
  return { level: 3, label: 'Strong', color: 'var(--success)' }
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('form') // form | verify | success
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [otp, setOtp] = useState('')

  const pw = strength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!form.email.includes('@')) e.email = 'Enter a valid email address.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.'
    if (!form.terms) e.terms = 'You must accept the terms to continue.'
    if (!captchaVerified) e.captcha = 'Complete the security verification.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('verify') }, 900)
  }

  const handleVerify = (e) => {
    e.preventDefault()
    if (otp.length < 6) return
    setLoading(true)
    register({ name: form.name, email: form.email, password: form.password }).then((result) => {
      setLoading(false)
      if (!result.success) {
        setErrors({ submit: result.error || 'Account could not be created.' })
        setStep('form')
        return
      }
      setStep('success')
    })
  }

  return (
    <PublicLayout showBack>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', minHeight: '60vh' }}>
      <div style={{ width: '100%', maxWidth: 480, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px' }}>
        {step === 'form' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Create your account</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 28px' }}>
              Already a member? <Link to="/Veridex/Log-In" style={{ color: 'var(--burgundy-300)' }}>Sign in</Link>
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Input label="Full name" type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
              <Input label="Email address" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} />
              <div>
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                {form.password && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= pw.level ? pw.color : 'var(--border-subtle)', transition: 'background var(--transition)' }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '12px', color: pw.color, margin: '0 0 8px' }}>Strength: {pw.label}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {rules.map((r) => {
                        const ok = r.test(form.password)
                        return (
                          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: ok ? 'var(--success)' : 'var(--text-muted)' }}>
                            {ok ? <Check size={11} /> : <XIcon size={11} />}
                            {r.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              <Input label="Confirm password" type="password" required value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} error={errors.confirm} />

              <label style={{ display: 'flex', gap: '10px', cursor: 'pointer', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))} style={{ accentColor: 'var(--burgundy-500)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  I agree to the <Link to="/Veridex" style={{ color: 'var(--burgundy-300)' }}>Terms of Service</Link> and <Link to="/Veridex" style={{ color: 'var(--burgundy-300)' }}>Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p style={{ fontSize: '12px', color: 'var(--danger)', margin: 0 }}>{errors.terms}</p>}

              <CaptchaGuard plan={1} onVerify={() => setCaptchaVerified(true)} onFail={() => setCaptchaVerified(false)} />
              {errors.captcha && <p style={{ fontSize: '12px', color: 'var(--danger)', margin: 0 }}>{errors.captcha}</p>}

              <Button type="submit" fullWidth loading={loading}>Create Account</Button>
            </form>
          </>
        )}

        {step === 'verify' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Verify your email</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 28px' }}>We sent a 6-digit code to <strong style={{ color: 'var(--text-secondary)' }}>{form.email}</strong>. Enter it below to activate your account.</p>
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 10px' }}>Verification code</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const v = e.target.value.slice(-1)
                        setOtp((o) => { const a = (o + '      ').split(''); a[i] = v; return a.join('').trimEnd() })
                      }}
                      aria-label={`Digit ${i + 1}`}
                      style={{ width: 44, height: 52, textAlign: 'center', fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)' }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" fullWidth loading={loading} disabled={otp.replace(/\s/g, '').length < 6}>Verify Email</Button>
              {errors.submit && <p style={{ fontSize: '12px', color: 'var(--danger)', margin: 0 }}>{errors.submit}</p>}
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Resend code</button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(78,159,125,0.15)', border: '1px solid rgba(78,159,125,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check size={28} color="var(--success)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>Account created</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Your account is ready. Sign in to start reading.</p>
            <Button fullWidth onClick={() => navigate('/Veridex/Log-In')}>Go to Sign In</Button>
          </div>
        )}
      </div>
      </div>
    </PublicLayout>
  )
}
