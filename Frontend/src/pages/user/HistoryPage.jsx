import React, { useState, useEffect } from 'react'
import { Clock, Library } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { SkeletonCard } from '../../components/Skeleton.jsx'
import Pagination from '../../components/Pagination.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getReadingHistory } from '../../api/usage.js'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function HistoryPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getReadingHistory({ page }).then((res) => { setItems(res.items); setTotal(res.total); setLoading(false) })
  }, [page])

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Reading History' },
  ]

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={22} color="var(--text-muted)" /> Reading History
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} style={{ height: 80 }} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Clock} title="No reading history" description="Your reading activity will appear here once you start reading content." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 44, height: 56, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Library size={16} color="var(--border-strong)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-muted)' }}>{item.lastRead}</p>
                  <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.progress || 0}%`, background: 'var(--burgundy-500)', borderRadius: 2 }} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>{item.progress || 0}%</span>
              </div>
            ))}
          </div>
        )}
        <Pagination page={page} totalItems={total} pageSize={20} onPageChange={setPage} />
      </div>
    </UserLayout>
  )
}
