import React, { useState, useEffect } from 'react'
import { Users, FileText, BarChart2, Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { Skeleton } from '../../components/Skeleton.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { getKpiSummary } from '../../api/usage.js'
import { getRecentSecurityEvents } from '../../api/admin.js'
import { getTopContent } from '../../api/content.js'

export default function AdminHome() {
  const [loading, setLoading] = useState(true)
  const [kpi, setKpi] = useState(null)
  const [securityEvents, setSecurityEvents] = useState([])
  const [topContent, setTopContent] = useState([])

  useEffect(() => {
    let mounted = true
    const loadDashboard = () => Promise.all([getKpiSummary(), getRecentSecurityEvents(), getTopContent()]).then(([k, se, tc]) => {
      if (!mounted) return
      setKpi(k); setSecurityEvents(se); setTopContent(tc); setLoading(false)
    })
    loadDashboard()
    window.addEventListener('focus', loadDashboard)
    return () => { mounted = false; window.removeEventListener('focus', loadDashboard) }
  }, [])

  const tiles = [
    { icon: Users, label: 'Total Users', value: kpi?.totalUsers, color: 'var(--info)' },
    { icon: CreditCard2, label: 'Active Subscriptions', value: kpi?.activeSubscriptions, color: 'var(--success)' },
    { icon: FileText, label: 'Content Items', value: kpi?.contentItems, color: 'var(--warning)' },
    { icon: BarChart2, label: 'Reading Hours', value: kpi?.readingHours, color: 'var(--burgundy-300)' },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Dashboard</h1>
        </div>

        {/* KPI tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {tiles.map(({ icon: Icon, label, value, color }) => (
            <Card key={label} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>{label}</p>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} color={color} />
                </div>
              </div>
              {loading ? (
                <Skeleton height={32} width="60%" />
              ) : (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{value ?? '—'}</p>
              )}
            </Card>
          ))}
        </div>

        {/* Reading activity chart placeholder */}
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--text-muted)" /> Reading Activity
            </h2>
            <Badge variant="default">30 days</Badge>
          </div>
          {/* Empty axes placeholder */}
          <div style={{ height: 180, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 24, width: '1px', background: 'var(--border-subtle)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, height: '1px', background: 'var(--border-subtle)' }} />
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: 24 + (i + 1) * 28, height: '1px', background: 'var(--border-subtle)', opacity: 0.5 }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 24 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>Chart data will appear here once connected.</p>
            </div>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="admin-home-grid">
          {/* Top content */}
          <Card style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Top Content</h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height={36} />)}
              </div>
            ) : topContent.length === 0 ? (
              <EmptyState title="No data yet" description="Content will appear here once connected." />
            ) : null}
          </Card>

          {/* Recent security events */}
          <Card style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="var(--text-muted)" /> Recent Security Events
            </h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} height={36} />)}
              </div>
            ) : securityEvents.length === 0 ? (
              <EmptyState title="No events" description="Security events will appear here once connected." />
            ) : null}
          </Card>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .admin-home-grid { grid-template-columns: 1fr !important; } }`}</style>
    </AdminLayout>
  )
}

// placeholder icon
function CreditCard2({ size, color }) {
  return <BarChart2 size={size} color={color} />
}
