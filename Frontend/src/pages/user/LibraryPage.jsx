import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, List, Search, SlidersHorizontal, Library, X } from 'lucide-react'
import VerdixMark from '../../components/VerdixMark.jsx'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Select from '../../components/Select.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Pagination from '../../components/Pagination.jsx'
import { SkeletonCard, Skeleton } from '../../components/Skeleton.jsx'
import { getContentList } from '../../api/content.js'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'

const typeOpts = [{ value: '', label: 'All types' }, { value: 'book', label: 'Books' }, { value: 'journal', label: 'Journals' }, { value: 'research', label: 'Research Documents' }]
const accessOpts = [{ value: '', label: 'All access levels' }, { value: 'open', label: 'Open Access' }, { value: 'subscribed', label: 'Subscribed' }, { value: 'premium', label: 'Premium' }]
const sortOpts = [{ value: 'recent', label: 'Recently Added' }, { value: 'title', label: 'Title A–Z' }, { value: 'year', label: 'Year' }]

export default function LibraryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState('grid')
  const [filters, setFilters] = useState({ type: '', access: '', sort: 'recent', q: '' })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    getContentList({ page, filters }).then((res) => { setItems(res.items); setTotal(res.total); setLoading(false) })
  }, [page, filters])

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Library' },
  ]

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>Library</h1>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="search" placeholder="Search by title, author, subject..."
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              aria-label="Search library"
              style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', padding: '8px 14px 8px 34px', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
            />
          </div>
          <Select options={typeOpts} value={filters.type} onChange={(v) => setFilters((f) => ({ ...f, type: v }))} style={{ minWidth: 140 }} />
          <Select options={accessOpts} value={filters.access} onChange={(v) => setFilters((f) => ({ ...f, access: v }))} style={{ minWidth: 160 }} />
          <Select options={sortOpts} value={filters.sort} onChange={(v) => setFilters((f) => ({ ...f, sort: v }))} style={{ minWidth: 150 }} />
          <div style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {[{ k: 'grid', Icon: Grid }, { k: 'list', Icon: List }].map(({ k, Icon }) => (
              <button key={k} onClick={() => setView(k)} aria-pressed={view === k} aria-label={`${k} view`}
                style={{ padding: '8px 11px', background: view === k ? 'var(--burgundy-900)' : 'var(--bg-elevated)', border: 'none', color: view === k ? 'var(--burgundy-200)' : 'var(--text-muted)', cursor: 'pointer' }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr', gap: '16px' }}>
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Library} title="No content found" description="Try adjusting your filters or search term. Content will appear here once connected." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr', gap: '16px' }}>
            {items.map((item) => (
              view === 'grid' ? <GridItem key={item.id} item={item} onOpen={() => navigate(`../Content/${item.id}`)} /> : <ListItem key={item.id} item={item} onOpen={() => navigate(`../Content/${item.id}`)} />
            ))}
          </div>
        )}

        <Pagination page={page} totalItems={total} pageSize={20} onPageChange={setPage} />
      </div>
    </UserLayout>
  )
}

function GridItem({ item, onOpen }) {
  return (
    <Card onClick={onOpen} style={{ cursor: 'pointer' }}>
      <div style={{ height: 160, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Library size={28} color="var(--border-strong)" />
      </div>
      <div style={{ padding: '14px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.3 }}>{item.title || '—'}</p>
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-muted)' }}>{item.author || '—'}</p>
        <Badge variant="default">{item.type || '—'}</Badge>
      </div>
    </Card>
  )
}

function ListItem({ item, onOpen }) {
  return (
    <Card onClick={onOpen} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer' }}>
      <div style={{ width: 48, height: 64, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Library size={18} color="var(--border-strong)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{item.title || '—'}</p>
        <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-muted)' }}>{item.author || '—'}</p>
        <Badge variant="default">{item.type || '—'}</Badge>
      </div>
    </Card>
  )
}
