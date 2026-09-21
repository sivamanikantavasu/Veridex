import React, { useState, useEffect } from 'react'
import { Server, RefreshCw, Circle } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Skeleton } from '../../components/Skeleton.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getSystemHealth } from '../../api/admin.js'
import { useAuth } from '../../routes/AuthContext.jsx'

const statusConfig = {
  healthy: { variant: 'success', label: 'Healthy' },
  degraded: { variant: 'warning', label: 'Degraded' },
  down: { variant: 'danger', label: 'Down' },
  unknown: { variant: 'default', label: 'Unknown' },
}

export default function SystemHealthPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = () => {
    setRefreshing(true)
    getSystemHealth().then((h) => { setHealth(h); setLoading(false); setRefreshing(false) })
  }

  useEffect(() => { load() }, [])

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'System Health' },
  ]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <BackButton />
            <Breadcrumbs items={crumbs} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={22} color="var(--text-muted)" /> System Health
            </h1>
          </div>
          <Button variant="secondary" size="sm" loading={refreshing} onClick={load}>
            <RefreshCw size={13} /> Refresh
          </Button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Service status reflects live health checks from the Spring Boot microservices and Eureka registry. Status shown as placeholder until backend is connected.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {loading ? (
            Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={100} />)
          ) : (
            health?.services?.map((service) => {
              const cfg = statusConfig[service.status] || statusConfig.unknown
              return (
                <Card key={service.name} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Server size={18} color="var(--text-muted)" />
                    </div>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                  <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{service.name}</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>Response: —</p>
                </Card>
              )
            })
          )}
        </div>

        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Eureka Registry</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 16px' }}>Registered service instances will be listed here once the Eureka client is connected.</p>
          <div style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No instances registered — data will appear here once connected.</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
