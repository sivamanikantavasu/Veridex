import React, { useState, useEffect } from 'react'
import { Settings, Shield } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Toggle from '../../components/Toggle.jsx'
import Button from '../../components/Button.jsx'
import { Skeleton } from '../../components/Skeleton.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getSecurityPolicy, updateSecurityPolicy } from '../../api/admin.js'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function AdminSecurityPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [policy, setPolicy] = useState({
    captchaStrength: 'medium',
    loginAttemptLimit: '',
    lockoutDuration: '',
    sessionTimeout: '',
    allowedDevices: '',
    requireMfa: false,
    enforceTls: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSecurityPolicy().then((p) => { if (p) setPolicy(p); setLoading(false) })
  }, [])

  const handleSave = () => {
    setError('')
    setSaving(true)
    updateSecurityPolicy(policy).then((result) => {
      setSaving(false)
      if (!result?.success) {
        setError(result?.error || 'Security policy storage is not available.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Security Policy' },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 680 }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="var(--text-muted)" /> Security Policy
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={60} />)}
          </div>
        ) : (
          <>
            <Card style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>CAPTCHA Configuration</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 10px' }}>CAPTCHA strength policy</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setPolicy((p) => ({ ...p, captchaStrength: level }))}
                        aria-pressed={policy.captchaStrength === level}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${policy.captchaStrength === level ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
                          background: policy.captchaStrength === level ? 'var(--burgundy-900)' : 'var(--bg-elevated)',
                          color: policy.captchaStrength === level ? 'var(--burgundy-200)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textTransform: 'capitalize',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Login Policy</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input label="Max login attempts" type="number" value={policy.loginAttemptLimit} onChange={(e) => setPolicy((p) => ({ ...p, loginAttemptLimit: e.target.value }))} hint="Before lockout (e.g. 6)" />
                  <Input label="Lockout duration (min)" type="number" value={policy.lockoutDuration} onChange={(e) => setPolicy((p) => ({ ...p, lockoutDuration: e.target.value }))} hint="e.g. 15" />
                </div>
                <Input label="Session timeout (min)" type="number" value={policy.sessionTimeout} onChange={(e) => setPolicy((p) => ({ ...p, sessionTimeout: e.target.value }))} hint="Idle timeout before automatic sign-out" />
                <Input label="Max allowed devices" type="number" value={policy.allowedDevices} onChange={(e) => setPolicy((p) => ({ ...p, allowedDevices: e.target.value }))} hint="Per user account" />
              </div>
            </Card>

            <Card style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Security Toggles</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'requireMfa', label: 'Require MFA for all users', description: 'Forces two-factor authentication on every login.' },
                  { key: 'enforceTls', label: 'Enforce TLS 1.3+', description: 'Reject connections using older TLS versions.' },
                ].map(({ key, label, description }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{description}</p>
                    </div>
                    <Toggle checked={policy[key]} onChange={(v) => setPolicy((p) => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button onClick={handleSave} loading={saving}>Save Policy</Button>
              {saved && <span style={{ fontSize: '13px', color: 'var(--success)' }}>Policy saved.</span>}
              {error && <span style={{ fontSize: '13px', color: 'var(--danger)' }}>{error}</span>}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
