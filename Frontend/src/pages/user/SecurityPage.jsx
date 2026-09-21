import React, { useState, useEffect } from 'react'
import { Shield, Eye, EyeOff, Monitor, Smartphone, Tablet } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import Badge from '../../components/Badge.jsx'
import Toggle from '../../components/Toggle.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { Skeleton } from '../../components/Skeleton.jsx'
import { changePassword, getActiveSessions, getLoginHistory } from '../../api/auth.js'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function SecurityPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sessions, setSessions] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [twoFa, setTwoFa] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    Promise.all([getActiveSessions(), getLoginHistory()]).then(([s, h]) => { setSessions(s); setHistory(h); setLoading(false) })
  }, [])

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Security' },
  ]

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 680 }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="var(--text-muted)" /> Security
          </h1>
        </div>

        {/* Change password */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Change Password</h2>
          <form onSubmit={async (e) => { e.preventDefault(); setPasswordMessage(''); if (form.next !== form.confirm) { setPasswordMessage('New passwords do not match.'); return } setSaving(true); const result = await changePassword(form.current, form.next); setSaving(false); setPasswordMessage(result.success ? 'Password updated successfully.' : result.error || 'Password could not be updated.'); if (result.success) setForm({ current: '', next: '', confirm: '' }) }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Current password" type={showPw ? 'text' : 'password'} value={form.current} onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
              suffix={<button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
            />
            <Input label="New password" type="password" value={form.next} onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))} />
            <Input label="Confirm new password" type="password" value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} />
            <Button type="submit" loading={saving} style={{ alignSelf: 'flex-start' }}>Update Password</Button>
            {passwordMessage && <p style={{ margin: 0, fontSize: '13px', color: passwordMessage.includes('successfully') ? 'var(--success)' : 'var(--danger)' }}>{passwordMessage}</p>}
          </form>
        </Card>

        {/* Two-factor */}
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Two-Factor Authentication</h2>
            <Toggle checked={twoFa} onChange={setTwoFa} label="" />
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 12px' }}>Two-factor authentication setup will be available once connected to the backend.</p>
          <Badge variant="default">Setup pending backend integration</Badge>
        </Card>

        {/* Active sessions */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Active Sessions</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 2 }, (_, i) => <Skeleton key={i} height={48} />)}
            </div>
          ) : sessions.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Session data will appear here once connected.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sessions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <Monitor size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>{s.device}</p></div>
                  <Badge variant={s.current ? 'success' : 'default'}>{s.current ? 'Current' : 'Active'}</Badge>
                  {!s.current && <Button variant="danger" size="sm">Revoke</Button>}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Login history */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Login History</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={36} />)}
            </div>
          ) : history.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Login history will appear here once connected.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)', flex: 1 }}>{h.timestamp}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{h.ip}</span>
                  <Badge variant={h.success ? 'success' : 'danger'}>{h.success ? 'Success' : 'Failed'}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </UserLayout>
  )
}
