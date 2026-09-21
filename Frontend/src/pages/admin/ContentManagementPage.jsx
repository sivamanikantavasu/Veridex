import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Table from '../../components/Table.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'
import { getContentList, createContent, updateContent, deleteContent } from '../../api/content.js'
import { getContentResource } from '../../api/content.js'
import ResourceViewer from '../../components/ResourceViewer.jsx'

const statusVariant = { published: 'success', draft: 'default', archived: 'warning', rejected: 'danger' }
const accessVariant = { open: 'success', subscribed: 'info', premium: 'brass' }

const EMPTY_FORM = { title: '', type: 'journal', author: '', status: 'draft', accessLevel: 'subscribed' }

export default function ContentManagementPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const response = await getContentList({ page: 1 })
    setItems(response.items || [])
    setLoading(false)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openAdd = () => {
    navigate(`/Veridex/Admin/${user?.name}/${user?.email}/Content/New`)
  }

  const openEdit = (row) => { setForm({ title: row.title || '', type: row.type || 'journal', author: row.author || '', status: row.status || 'draft', accessLevel: row.accessLevel || 'subscribed' }); setEditTarget(row); setModal('edit') }
  const closeModal = () => { setModal(null); setEditTarget(null); setForm(EMPTY_FORM) }

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim()) return
    setSaving(true)

    try {
      if (modal === 'add') {
        const payload = {
          title: form.title,
          type: form.type,
          author: form.author,
          status: form.status,
          accessLevel: form.accessLevel,
          subject: 'General',
          language: 'English',
          year: String(new Date().getFullYear()),
          description: `${form.title} by ${form.author}`,
          totalPages: 120,
          coverUrl: '',
          createdAt: new Date().toISOString(),
        }
        const result = await createContent(payload)
        if (!result.success) throw new Error(result.error || 'Content could not be created.')
      } else {
        const result = await updateContent(editTarget.id, { ...editTarget, ...form })
        if (!result.success) throw new Error(result.error || 'Content could not be updated.')
      }
      await loadItems()
      closeModal()
    } catch (error) {
      console.error('Failed to save content', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setActing(true)
    try {
      const result = await deleteContent(confirm.id)
      if (!result.success) throw new Error(result.error || 'Content could not be deleted.')
      await loadItems()
    } catch (error) {
      console.error('Failed to delete content', error)
    } finally {
      setActing(false)
      setConfirm(null)
    }
  }

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Content' },
  ]

  const columns = [
    { key: 'title', label: 'Title', render: (v) => <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{v || '—'}</span> },
    { key: 'type', label: 'Type', render: (v) => <Badge variant="default">{v || '—'}</Badge> },
    { key: 'author', label: 'Author' },
    { key: 'status', label: 'Status', render: (v) => <Badge variant={statusVariant[v] || 'default'}>{v || '—'}</Badge> },
    { key: 'accessLevel', label: 'Access', render: (v) => <Badge variant={accessVariant[v] || 'default'}>{v || '—'}</Badge> },
    { key: 'createdAt', label: 'Created', noWrap: true },
    {
      key: 'actions', label: '', render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}><Pencil size={12} /> Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setConfirm({ id: row.id, title: row.title })}><Trash2 size={12} /></Button>
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
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>Content</h1>
          </div>
          <Button onClick={openAdd} size="sm"><Plus size={14} /> New Content</Button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <Table columns={columns} data={items} loading={loading} totalItems={items.length} page={1} pageSize={50} onPageChange={() => {}} emptyTitle="No content yet" emptyDescription="Add your first content item to get started." />
        </div>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,3,4,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={closeModal}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{modal === 'add' ? 'New Content' : 'Edit Content'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', borderRadius: 'var(--radius-sm)' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <CField label="Title *" value={form.title} onChange={set('title')} />
              <CField label="Author *" value={form.author} onChange={set('author')} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lblSt}>Type</label>
                  <select value={form.type} onChange={set('type')} style={selSt}>
                    {['journal', 'monograph', 'textbook', 'report', 'thesis', 'dataset'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lblSt}>Status</label>
                  <select value={form.status} onChange={set('status')} style={selSt}>
                    {['draft', 'published', 'archived', 'rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lblSt}>Access</label>
                  <select value={form.accessLevel} onChange={set('accessLevel')} style={selSt}>
                    {['open', 'subscribed', 'premium'].map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              {modal === 'edit' && editTarget?.resourceName && (
                <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ ...lblSt, marginBottom: 10 }}>Uploaded resource</p>
                  <ResourceViewer
                    resourceLoader={() => getContentResource(editTarget.id)}
                    fileName={editTarget.resourceName}
                    contentType={editTarget.resourceContentType}
                    height={260}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving || !form.title.trim() || !form.author.trim()}>
                {saving ? 'Saving…' : modal === 'add' ? 'Create' : 'Save Changes'}
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
        title="Delete content"
        description={`Permanently delete "${confirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </AdminLayout>
  )
}

function CField({ label, value = '', onChange }) {
  return (
    <div>
      <label style={lblSt}>{label}</label>
      <input type="text" value={value} onChange={onChange} style={inpSt} />
    </div>
  )
}

const lblSt = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '5px' }
const inpSt = { width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '13px', padding: '8px 10px', fontFamily: 'var(--font-sans)', outline: 'none' }
const selSt = { ...inpSt, appearance: 'none', cursor: 'pointer' }
