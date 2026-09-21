import React, { useState, useEffect } from 'react'
import { Bookmark, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { SkeletonCard } from '../../components/Skeleton.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { getCollections, createCollection, deleteCollection } from '../../api/usage.js'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function CollectionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [collectionToDelete, setCollectionToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getCollections().then((c) => { setCollections(c); setLoading(false) })
  }, [])

  const crumbs = [
    { label: 'Home', href: `/Veridex/User/${user?.name}/${user?.email}/Home` },
    { label: 'Collections' },
  ]

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    setFormError('')
    const result = await createCollection({ name: newName.trim() })
    if (!result.success) {
      setCreating(false)
      setFormError(result.error || 'Collection could not be created.')
      return
    }
    setCollections((c) => [result.data, ...c])
    setNewName(''); setShowNew(false); setCreating(false)
  }

  const handleDelete = async () => {
    if (!collectionToDelete) return
    setDeleting(true)
    const result = await deleteCollection(collectionToDelete.id)
    if (result.success) {
      setCollections((current) => current.filter((collection) => collection.id !== collectionToDelete.id))
      setCollectionToDelete(null)
    } else {
      setFormError(result.error || 'Collection could not be deleted.')
    }
    setDeleting(false)
  }

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <BackButton />
          <Breadcrumbs items={crumbs} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bookmark size={22} color="var(--text-muted)" /> Collections
            </h1>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Collection</Button>
        </div>

        {showNew && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <input
              autoFocus value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowNew(false) }}
              placeholder="Collection name"
              style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', padding: '8px 12px', fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
            <Button size="sm" onClick={handleCreate} loading={creating} disabled={creating || !newName.trim()}>Create</Button>
            <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', padding: '4px' }}>Cancel</button>
            {formError && <p style={{ margin: 0, color: 'var(--danger)', fontSize: 12 }}>{formError}</p>}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : collections.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No collections yet"
            description="Save books, journals, and documents to collections for easy access."
            action={<Button variant="secondary" size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> Create your first collection</Button>}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {collections.map((col) => (
              <Card key={col.id} onClick={() => navigate(`../Collection/${col.id}`)} style={{ padding: '20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--burgundy-900)', border: '1px solid var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bookmark size={18} color="var(--burgundy-300)" />
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${col.name}`}
                    title="Delete collection"
                    onClick={(event) => { event.stopPropagation(); setCollectionToDelete(col) }}
                    style={{ display: 'inline-flex', padding: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{col.name}</p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{col.count || 0} items · Open collection</p>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={Boolean(collectionToDelete)}
        onClose={() => !deleting && setCollectionToDelete(null)}
        onConfirm={handleDelete}
        title="Delete collection?"
        description={`Delete “${collectionToDelete?.name || ''}” and remove all saved resources from it?`}
        confirmLabel="Delete collection"
        loading={deleting}
      />
    </UserLayout>
  )
}
