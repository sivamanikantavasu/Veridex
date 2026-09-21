import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 900)
  }

  return (
    <PublicLayout showBack>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', minHeight: '60vh' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px' }}>
        {!done ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Set new password</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 28px' }}>Choose a strong password for your Veridex account.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                label="New password"
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                suffix={
                  <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <Input label="Confirm password" type="password" required value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} error={error} />
              <Button type="submit" fullWidth loading={loading}>Update Password</Button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(78,159,125,0.15)', border: '1px solid rgba(78,159,125,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check size={24} color="var(--success)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>Password updated</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Your password has been changed. You can now sign in.</p>
            <Button fullWidth onClick={() => navigate('/Veridex/Log-In')}>Sign In</Button>
          </div>
        )}
      </div>
      </div>
    </PublicLayout>
  )
}
