import React, { useState } from 'react'
import { User, Camera } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: '', language: 'en' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500) }, 800)
  }

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Profile' },
  ]

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 680 }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>Profile</h1>
        </div>

        {/* Avatar */}
        <Card style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--burgundy-800)', border: '2px solid var(--burgundy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 600, color: 'var(--burgundy-200)', fontFamily: 'var(--font-serif)' }}>
              {user?.name?.[0] || 'U'}
            </div>
            <button aria-label="Change avatar" title="Avatar upload available once backend is connected" onClick={() => alert('Avatar upload will be available once the media backend is connected.')} style={{ position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-elevated)', border: '2px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Camera size={12} color="var(--text-muted)" />
            </button>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </Card>

        {/* Details form */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px' }}>Personal Details</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="A short description about yourself"
                rows={4}
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', padding: '10px 14px', fontFamily: 'var(--font-sans)', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button type="submit" loading={saving}>Save Changes</Button>
              {saved && <span style={{ fontSize: '13px', color: 'var(--success)' }}>Changes saved.</span>}
            </div>
          </form>
        </Card>
      </div>
    </UserLayout>
  )
}
