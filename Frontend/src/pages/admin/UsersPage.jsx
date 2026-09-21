import React, { useState, useEffect } from 'react'
import { Users, UserX, UserCheck, Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Table from '../../components/Table.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { getUsers, createUser, updateUser, deleteUser, suspendUser, reactivateUser } from '../../api/admin.js'
import { useAuth } from '../../routes/AuthContext.jsx'

const roleVariant = { admin: 'primary', user: 'default' }
const statusVariant = { active: 'success', suspended: 'danger', pending: 'warning' }

const EMPTY_FORM = { name: '', email: '', role: 'user', status: 'active', plan: 'reader', password: '' }

export default function UsersPage() {
  const auth = useAuth()
  const user = auth?.user
  const [users, setUsers] = useState([])
  const [confirm, setConfirm] = useState(null)
  const [acting, setActing] = useState(false)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let mounted = true
    getUsers().then((result) => {
      if (!mounted) return
      setUsers(Array.isArray(result?.items) ? result.items : [])
      setLoadError(result?.error || '')
    }).catch(() => {
      if (mounted) {
        setUsers([])
        setLoadError('Users could not be loaded.')
      }
    })

    return () => { mounted = false }
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(EMPTY_FORM); setEditTarget(null); setModal('add') }
  const openEdit = (row) => { setForm({ name: row.name || '', email: row.email || '', role: row.role || 'user', status: row.status || 'active', plan: row.plan || 'reader', password: '' }); setEditTarget(row); setModal('edit') }
  const closeModal = () => { setModal(null); setEditTarget(null); setForm(EMPTY_FORM) }

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (modal === 'add' && !form.password.trim()) return
    setSaving(true)
    const result = modal === 'add'
      ? await createUser(form)
      : await updateUser(editTarget.id, { ...form, password: form.password || undefined })
    if (!result.success) window.alert(result.error || 'User could not be saved.')
    else { await reloadUsers(); closeModal() }
    setSaving(false)
  }

  const reloadUsers = async () => {
    const result = await getUsers()
    setUsers(Array.isArray(result?.items) ? result.items : [])
    setLoadError(result?.error || '')
  }

  const handleDelete = async () => {
    setActing(true)
    const result = confirm.action === 'delete' ? await deleteUser(confirm.userId)
      : confirm.action === 'suspend' ? await suspendUser(confirm.userId)
        : await reactivateUser(confirm.userId)
    if (!result.success) window.alert(result.error || 'User operation failed.')
    else await reloadUsers()
    setActing(false)
    setConfirm(null)
  }

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Users' },
  ]

  const columns = [
    { key: 'name', label: 'Name', render: (v) => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v || '—'}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (v) => <Badge variant={roleVariant[v] || 'default'}>{v || '—'}</Badge> },
    { key: 'status', label: 'Status', render: (v) => <Badge variant={statusVariant[v] || 'default'}>{v || '—'}</Badge> },
    { key: 'plan', label: 'Plan', render: (v) => <Badge variant="info">{v || 'reader'}</Badge> },
    { key: 'joinedAt', label: 'Joined', noWrap: true },
    {
      key: 'actions', label: '', render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>
            <Pencil size={12} /> Edit
          </Button>
          {row.status === 'active' ? (
            <Button variant="danger" size="sm" onClick={() => setConfirm({ action: 'suspend', userId: row.id, name: row.name })}>
              <UserX size={12} /> Suspend
            </Button>
          ) : row.status === 'suspended' ? (
            <Button variant="secondary" size="sm" onClick={() => setConfirm({ action: 'reactivate', userId: row.id, name: row.name })}>
              <UserCheck size={12} /> Reactivate
            </Button>
          ) : null}
          <Button variant="danger" size="sm" onClick={() => setConfirm({ action: 'delete', userId: row.id, name: row.name })}>
            <Trash2 size={12} />
          </Button>
        </div>
      )
    },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <BackButton />
            <Breadcrumbs items={crumbs} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={22} color="var(--text-muted)" /> Users
            </h1>
          </div>
          <Button onClick={openAdd} size="sm"><Plus size={14} /> Add User</Button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {loadError ? (
            <div style={{ padding: '24px', color: 'var(--danger, #b42318)' }}>{loadError}</div>
          ) : (
            <Table columns={columns} data={users} loading={false} totalItems={users.length} page={1} pageSize={50} onPageChange={() => {}} emptyTitle="No users found" emptyDescription="Add your first user to get started." />
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,3,4,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={closeModal}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{modal === 'add' ? 'Add User' : 'Edit User'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', borderRadius: 'var(--radius-sm)' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <MField label="Full name *" value={form.name} onChange={set('name')} type="text" />
              <MField label="Email *" value={form.email} onChange={set('email')} type="email" />
              {modal === 'add' && <MField label="Password *" value={form.password} onChange={set('password')} type="password" />}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lblSt}>Role</label>
                  <select value={form.role} onChange={set('role')} style={selSt}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={lblSt}>Status</label>
                  <select value={form.status} onChange={set('status')} style={selSt}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label style={lblSt}>Subscription plan</label>
                  <select value={form.plan} onChange={set('plan')} style={selSt}>
                    <option value="reader">Reader</option>
                    <option value="scholar">Scholar</option>
                    <option value="institution">Institution</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving || !form.name.trim() || !form.email.trim()}>
                {saving ? 'Saving…' : modal === 'add' ? 'Add User' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={acting}
        title={confirm?.action === 'delete' ? 'Delete user' : confirm?.action === 'suspend' ? 'Suspend user' : 'Reactivate user'}
        description={
          confirm?.action === 'delete' ? `Permanently delete ${confirm?.name}? This cannot be undone.` :
          confirm?.action === 'suspend' ? `Suspend ${confirm?.name}? They will lose access immediately.` :
          `Reactivate ${confirm?.name}? Their access will be restored.`
        }
        confirmLabel={confirm?.action === 'delete' ? 'Delete' : confirm?.action === 'suspend' ? 'Suspend' : 'Reactivate'}
        confirmVariant={confirm?.action === 'delete' || confirm?.action === 'suspend' ? 'danger' : 'primary'}
      />
    </AdminLayout>
  )
}

function MField({ label, value = '', onChange, type = 'text' }) {
  return (
    <div>
      <label style={lblSt}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={inpSt} />
    </div>
  )
}

const lblSt = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '5px' }
const inpSt = { width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '13px', padding: '8px 10px', fontFamily: 'var(--font-sans)', outline: 'none' }
const selSt = { ...inpSt, appearance: 'none', cursor: 'pointer' }
