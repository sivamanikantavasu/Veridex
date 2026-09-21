import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Star, Library } from 'lucide-react'
import VerdixMark from '../../components/VerdixMark.jsx'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { Skeleton, SkeletonCard } from '../../components/Skeleton.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { getContinueReading, getRecommended, getRecentlyAdded } from '../../api/content.js'
import { getSubscriptionStatus } from '../../api/access.js'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function UserHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [continueReading, setContinueReading] = useState([])
  const [recommended, setRecommended] = useState([])
  const [recentlyAdded, setRecentlyAdded] = useState([])
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    Promise.all([getContinueReading(), getRecommended(), getRecentlyAdded(), getSubscriptionStatus()]).then(([cr, rec, ra, sub]) => {
      setContinueReading(cr); setRecommended(rec); setRecentlyAdded(ra); setSubscription(sub)
      setLoading(false)
    })
  }, [])

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 4px' }}>Welcome back</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {user?.name}
          </h1>
        </div>

        {/* Subscription status */}
        <Card style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {loading ? (
            <div style={{ display: 'flex', gap: '24px', width: '100%', flexWrap: 'wrap' }}>
              {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} width={120} height={40} />)}
            </div>
          ) : (
            <>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Subscription</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-primary)', fontWeight: 600 }}>{subscription?.plan || '—'}</span>
                  <Badge variant={subscription?.status === 'active' ? 'success' : 'default'}>{subscription?.status === 'active' ? 'Active plan' : 'No active plan'}</Badge>
                </div>
              </div>
              <div style={{ height: '40px', width: '1px', background: 'var(--border-subtle)' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Items accessible</p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--text-primary)', fontWeight: 600 }}>{subscription?.itemsAccessible || '—'}</span>
              </div>
              <div style={{ height: '40px', width: '1px', background: 'var(--border-subtle)' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Renews</p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--text-primary)' }}>{subscription?.endDate || '—'}</span>
              </div>
              <Link to={`/Veridex/User/${user?.name}/${user?.email}/Subscription`} style={{ padding: '8px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Manage <ArrowRight size={13} />
              </Link>
            </>
          )}
        </Card>

        {/* Continue reading */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="var(--text-muted)" /> Continue reading
          </h2>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : continueReading.length === 0 ? (
            <EmptyState icon={Library} title="No reading in progress" description="Open a book or journal from your Library to see it here." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {continueReading.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate(`../Content/${item.id}`)} />)}
            </div>
          )}
        </section>

        {/* Recommended */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Star size={18} color="var(--text-muted)" /> Recommended
          </h2>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : recommended.length === 0 ? (
            <EmptyState icon={Library} title="Recommendations coming soon" description="Content will appear here once connected." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {recommended.map((item) => <ContentCard key={item.id} item={item} onOpen={() => navigate(`../Content/${item.id}`)} />)}
            </div>
          )}
        </section>
      </div>
    </UserLayout>
  )
}

function ContentCard({ item, onOpen }) {
  return (
    <Card onClick={onOpen} style={{ cursor: 'pointer' }}>
      <div style={{ height: 140, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <VerdixMark size={32} color="var(--border-strong)" />
      </div>
      <div style={{ padding: '16px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.3 }}>{item.title}</p>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-muted)' }}>{item.author}</p>
        <Badge variant="default">{item.type}</Badge>
      </div>
    </Card>
  )
}
