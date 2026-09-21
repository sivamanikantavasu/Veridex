import React, { useState, useEffect } from 'react'
import { Lock, Plus, Trash2 } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import Select from '../../components/Select.jsx'
import Input from '../../components/Input.jsx'
import Toggle from '../../components/Toggle.jsx'
import Modal from '../../components/Modal.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { getEntitlements, createEntitlement, deleteEntitlement } from '../../api/access.js'
import { useAuth } from '../../routes/AuthContext.jsx'

const planOpts = [{ value: '', label: 'All plans' }, { value: 'reader', label: 'Reader' }, { value: 'scholar', label: 'Scholar' }, { value: 'institution', label: 'Institution' }]
const typeOpts = [{ value: '', label: 'All types' }, { value: 'book', label: 'Books' }, { value: 'journal', label: 'Journals' }, { value: 'research', label: 'Research' }]

export default function EntitlementsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [entitlements, setEntitlements] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ plan: '', contentType: '', subject: '', deviceLimit: '', concurrentLimit: '', readOnly: true, noDownload: true, dateFrom: '', dateTo: '' })

  useEffect(() => {
    getEntitlements().then((e) => { setEntitlements(e); setLoading(false) })
  }, [])

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Entitlements' },
  ]

  const columns = [
    { key: 'plan', label: 'Plan', render: (v) => <Badge variant="primary">{v || '—'}</Badge> },
    { key: 'contentType', label: 'Content Type', render: (v) => <Badge variant="default">{v || '—'}</Badge> },
    { key: 'subject', label: 'Subject' },
    { key: 'deviceLimit', label: 'Devices', render: (v) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{v ?? '—'}</span> },
    { key: 'concurrentLimit', label: 'Concurrent Sessions', render: (v) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{v ?? '—'}</span> },
    { key: 'readOnly', label: 'Read-only', render: (v) => <Badge variant={v ? 'success' : 'default'}>{v ? 'Yes' : 'No'}</Badge> },
    { key: 'noDownload', label: 'No Download', render: (v) => <Badge variant={v ? 'success' : 'default'}>{v ? 'Yes' : 'No'}</Badge> },
    { key: 'id', label: '', render: (v) => (
      <Button variant="danger" size="sm" onClick={() => deleteEntitlement(v).then(() => setEntitlements((e) => e.filter((x) => x.id !== v)))}>
        <Trash2 size={12} />
      </Button>
    )},
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <BackButton />
            <Breadcrumbs items={crumbs} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={22} color="var(--text-muted)" /> Entitlements
            </h1>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}><Plus size={14} /> New Rule</Button>
        </div>

        <Card style={{ padding: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Define granular access rights by plan, content type, subject area, date window, device limit, and session constraints. All rules are evaluated in real time by the Access Service.
          </p>
        </Card>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <Table columns={columns} data={entitlements} loading={loading} emptyTitle="No entitlement rules" emptyDescription="Create your first access rule to define subscription rights." />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Entitlement Rule" maxWidth={560}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => { createEntitlement(form).then(() => setModalOpen(false)) }}>Create Rule</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select label="Plan" required options={planOpts} value={form.plan} onChange={(v) => setForm((f) => ({ ...f, plan: v }))} />
            <Select label="Content type" options={typeOpts} value={form.contentType} onChange={(v) => setForm((f) => ({ ...f, contentType: v }))} />
          </div>
          <Input label="Subject / Discipline" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Device limit" type="number" value={form.deviceLimit} onChange={(e) => setForm((f) => ({ ...f, deviceLimit: e.target.value }))} hint="Leave blank for unlimited" />
            <Input label="Concurrent sessions" type="number" value={form.concurrentLimit} onChange={(e) => setForm((f) => ({ ...f, concurrentLimit: e.target.value }))} hint="Leave blank for unlimited" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Access from" type="date" value={form.dateFrom} onChange={(e) => setForm((f) => ({ ...f, dateFrom: e.target.value }))} />
            <Input label="Access until" type="date" value={form.dateTo} onChange={(e) => setForm((f) => ({ ...f, dateTo: e.target.value }))} />
          </div>
          <div style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[{ key: 'readOnly', label: 'Read-only (no print, no copy)' }, { key: 'noDownload', label: 'Disable download' }].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: 'var(--burgundy-500)' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}
