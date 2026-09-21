import React, { useState, useEffect } from 'react'
import { Activity, Download, Filter } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Table from '../../components/Table.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import Select from '../../components/Select.jsx'
import Input from '../../components/Input.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getAuditLog, exportAuditLog } from '../../api/admin.js'
import { useAuth } from '../../routes/AuthContext.jsx'

const eventTypeOpts = [{ value: '', label: 'All event types' }, { value: 'login', label: 'Login' }, { value: 'access', label: 'Content Access' }, { value: 'entitlement', label: 'Entitlement Change' }, { value: 'admin', label: 'Admin Action' }]
const severityVariant = { info: 'info', warning: 'warning', critical: 'danger', success: 'success' }

export default function AuditLogPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ eventType: '', dateFrom: '', dateTo: '' })
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getAuditLog({ page, filters }).then((res) => { setItems(res.items); setTotal(res.total); setLoading(false) })
  }, [page, filters])

  const handleExport = () => {
    setExporting(true)
    exportAuditLog(filters).then(() => setExporting(false))
  }

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Audit Log' },
  ]

  const columns = [
    { key: 'timestamp', label: 'Timestamp', noWrap: true, render: (v) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{v || '—'}</span> },
    { key: 'eventType', label: 'Event Type', render: (v) => <Badge variant="default">{v || '—'}</Badge> },
    { key: 'actor', label: 'Actor' },
    { key: 'target', label: 'Target' },
    { key: 'severity', label: 'Severity', render: (v) => <Badge variant={severityVariant[v] || 'default'}>{v || '—'}</Badge> },
    { key: 'ip', label: 'IP Address', noWrap: true, render: (v) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{v || '—'}</span> },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <BackButton />
            <Breadcrumbs items={crumbs} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={22} color="var(--text-muted)" /> Audit Log
            </h1>
          </div>
          <Button variant="secondary" size="sm" loading={exporting} onClick={handleExport}>
            <Download size={14} /> Export
          </Button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Select options={eventTypeOpts} value={filters.eventType} onChange={(v) => setFilters((f) => ({ ...f, eventType: v }))} style={{ minWidth: 180 }} />
          <Input type="date" label="From" value={filters.dateFrom} onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} style={{ width: 160 }} />
          <Input type="date" label="To" value={filters.dateTo} onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} style={{ width: 160 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(107,143,184,0.08)', border: '1px solid rgba(107,143,184,0.2)', borderRadius: 'var(--radius-md)' }}>
          <Activity size={14} color="var(--info)" />
          <span style={{ fontSize: '13px', color: 'var(--info)' }}>Audit log entries are immutable and cannot be edited or deleted.</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <Table columns={columns} data={items} loading={loading} totalItems={total} page={page} pageSize={50} onPageChange={setPage} emptyTitle="No audit events" emptyDescription="Audit events will appear here once connected to the backend." />
        </div>
      </div>
    </AdminLayout>
  )
}
