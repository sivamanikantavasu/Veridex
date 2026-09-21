import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Lock, Play, Bookmark, Tag, Calendar, Globe, X } from 'lucide-react'
import VerdixMark from '../../components/VerdixMark.jsx'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Skeleton, SkeletonText } from '../../components/Skeleton.jsx'
import { getContentById } from '../../api/content.js'
import { checkAccess } from '../../api/access.js'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'
import { getCollections, addToCollection } from '../../api/usage.js'

export default function ContentDetailPage() {
  const { contentId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState(null)
  const [access, setAccess] = useState(null)
  const [collections, setCollections] = useState([])
  const [showCollections, setShowCollections] = useState(false)
  const [savingCollection, setSavingCollection] = useState(false)
  const [collectionMessage, setCollectionMessage] = useState('')

  const isContentSaved = (collection) => (
    (collection.contentIds || []).some((id) => String(id) === String(contentId))
    || (collection.items || []).some((item) => String(item.id) === String(contentId))
  )
  const isSaved = collections.some(isContentSaved)

  useEffect(() => {
    Promise.all([getContentById(contentId), checkAccess(contentId), getCollections()]).then(([c, a, savedCollections]) => {
      const openAccess = c?.accessLevel?.toLowerCase() === 'open'
      setContent(c); setAccess(openAccess ? { ...a, hasAccess: true, reason: null } : a); setCollections(savedCollections); setLoading(false)
    })
  }, [contentId])

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Library', href: `/Veridex/User/${user?.name}/${user?.email}/Library` },
    { label: content?.title || 'Content' },
  ]

  const openCollections = async () => {
    setCollectionMessage('')
    setShowCollections(true)
    setCollections(await getCollections())
  }

  const saveToCollection = async (collectionId) => {
    setSavingCollection(true)
    const result = await addToCollection(collectionId, contentId)
    setSavingCollection(false)
    if (result.success) {
      setCollections((current) => current.map((collection) => {
        if (collection.id !== collectionId) return collection
        const updated = result.data || collection
        return {
          ...collection,
          ...updated,
          contentIds: [...new Set([...(updated.contentIds || collection.contentIds || []), String(contentId)])],
        }
      }))
      setCollectionMessage('Saved to collection.')
      setTimeout(() => setShowCollections(false), 700)
    } else setCollectionMessage(result.error || 'Could not save to collection.')
  }

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <BackButton />
        <Breadcrumbs items={crumbs} />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px' }}>
            <Skeleton height={280} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="60%" height={32} />
              <Skeleton width="40%" height={18} />
              <SkeletonText lines={5} />
            </div>
          </div>
        ) : !content ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Content not found or not yet connected.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px', alignItems: 'start' }} className="content-detail-grid">
            {/* Cover */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', aspectRatio: '2/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VerdixMark size={40} color="var(--border-strong)" />
            </div>

            {/* Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <Badge variant={access?.hasAccess ? 'success' : 'brass'}>
                    {access?.hasAccess ? 'Accessible' : <><Lock size={10} style={{ marginRight: 3 }} />Locked</>}
                  </Badge>
                  <Badge variant="default">{content.type || '—'}</Badge>
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.2 }}>{content.title || '—'}</h1>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: 0 }}>{content.author || '—'}</p>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { icon: Calendar, label: 'Year', value: content.year || '—' },
                  { icon: Globe, label: 'Language', value: content.language || '—' },
                  { icon: Tag, label: 'Subject', value: content.subject || '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Icon size={11} />{label}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                  {content.description || 'Content description will appear here once connected to the backend.'}
                </p>
              </div>

              {access?.hasAccess ? (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button onClick={() => navigate(`../Reader/${contentId}`)}>
                    <Play size={15} /> Read Now
                  </Button>
                  <Button variant="secondary" onClick={openCollections}><Bookmark size={15} /> {isSaved ? 'Saved' : 'Save to Collection'}</Button>
                </div>
              ) : (
                <Card style={{ padding: '20px', background: 'var(--burgundy-900)', border: '1px solid var(--burgundy-700)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Lock size={18} color="var(--accent-brass)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 4px' }}>Subscription required</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>{access?.reason || 'This content is not included in your current plan.'}</p>
                      <Link to="../Subscription" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--burgundy-500)', border: '1px solid var(--burgundy-400)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>
                        View Plans
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      {showCollections && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(8,3,4,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowCollections(false)}>
          <div style={{ width: '100%', maxWidth: 420, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 22 }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Save to collection</h2>
              <button onClick={() => setShowCollections(false)} aria-label="Close" style={{ background: 'none', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {collections.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Create a collection first from the Collections page.</p> : collections.map((collection) => (
              <Button key={collection.id} variant="secondary" onClick={() => saveToCollection(collection.id)} loading={savingCollection} disabled={savingCollection || isContentSaved(collection)} style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}>
                {collection.name}<span>{isContentSaved(collection) ? 'Saved' : `${collection.count || 0} items`}</span>
              </Button>
            ))}
            {collectionMessage && <p style={{ color: collectionMessage.startsWith('Saved') ? 'var(--success)' : 'var(--danger)', fontSize: 13, margin: '12px 0 0' }}>{collectionMessage}</p>}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .content-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </UserLayout>
  )
}
