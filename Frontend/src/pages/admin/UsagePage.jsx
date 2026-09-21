import React, { useState, useEffect } from 'react'
import { BarChart2, TrendingUp } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Select from '../../components/Select.jsx'
import { Skeleton } from '../../components/Skeleton.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getEngagementAnalytics } from '../../api/usage.js'
import { useAuth } from '../../routes/AuthContext.jsx'

const dateOpts = [{ value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }]

export default function UsagePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    setLoading(true)
    getEngagementAnalytics({ dateRange }).then((a) => { setAnalytics(a); setLoading(false) })
  }, [dateRange])

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Usage Analytics' },
  ]

  const metrics = [
    { label: 'Reading Hours', value: analytics?.readingHours, unit: 'hrs' },
    { label: 'Completion Rate', value: analytics?.completionRate, unit: '%' },
    { label: 'Active Users', value: analytics?.activeUsers, unit: '' },
    { label: 'Total Sessions', value: analytics?.sessions?.length, unit: '' },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <BackButton />
            <Breadcrumbs items={crumbs} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>Usage Analytics</h1>
          </div>
          <Select options={dateOpts} value={dateRange} onChange={setDateRange} style={{ minWidth: 160 }} />
        </div>

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {metrics.map(({ label, value, unit }) => (
            <Card key={label} style={{ padding: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '0 0 10px' }}>{label}</p>
              {loading ? <Skeleton height={28} width="50%" /> : (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {value != null ? `${value}${unit}` : '—'}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Reading hours chart */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="var(--text-muted)" /> Reading Hours Over Time
          </h2>
          <ChartPlaceholder label={`${analytics?.sessions?.length || 0} persisted reading sessions`} />
        </Card>

        {/* Completion rates */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={16} color="var(--text-muted)" /> Completion Rates by Content Type
          </h2>
          <ChartPlaceholder label={`${analytics?.completionRate || 0}% average completion from SQL events`} />
        </Card>
      </div>
    </AdminLayout>
  )
}

function ChartPlaceholder({ label }) {
  return (
    <div style={{ height: 160, position: 'relative', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 24, width: '1px', background: 'var(--border-subtle)', margin: '12px 0 0 32px' }} />
      <div style={{ position: 'absolute', left: 32, right: 12, bottom: 24, height: '1px', background: 'var(--border-subtle)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>{label}</p>
      </div>
    </div>
  )
}
