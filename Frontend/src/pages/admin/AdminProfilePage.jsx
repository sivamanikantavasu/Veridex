import React, { useState } from 'react'
import { User, Camera } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import Badge from '../../components/Badge.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'
import { updateUser } from '../../api/admin.js'

export default function AdminProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Profile' },
  ]

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const result = await updateUser(user?.id, { name: form.name, email: form.email, role: user?.role, status: user?.status })
    setSaving(false)
    if (!result.success) {
      setError(result.error || 'Profile could not be saved.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 640 }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>Profile</h1>
        </div>

        <Card style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--burgundy-800)', border: '2px solid var(--burgundy-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 600, color: 'var(--burgundy-200)', fontFamily: 'var(--font-serif)' }}>
              {user?.name?.[0] || 'A'}
            </div>
            <button aria-label="Change avatar" style={{ position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-elevated)', border: '2px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Camera size={12} color="var(--text-muted)" />
            </button>
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</p>
            <Badge variant="primary">Administrator</Badge>
          </div>
        </Card>

        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px' }}>Account Details</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button type="submit" loading={saving}>Save Changes</Button>
              {saved && <span style={{ fontSize: '13px', color: 'var(--success)' }}>Saved.</span>}
              {error && <span style={{ fontSize: '13px', color: 'var(--danger)' }}>{error}</span>}
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  )
}
