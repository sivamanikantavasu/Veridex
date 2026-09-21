import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Library, Trash2 } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { SkeletonCard } from '../../components/Skeleton.jsx'
import { getContentById, getContentList } from '../../api/content.js'
import { deleteCollection, getCollection, getCollections, removeFromCollection } from '../../api/usage.js'
import { useAuth } from '../../routes/AuthContext.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'

export default function CollectionDetailPage() {
  const { collectionId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [collection, setCollection] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteCollection, setShowDeleteCollection] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getCollection(collectionId), getCollections()]).then(async ([detail, collections]) => {
      if (!active) return
      const result = detail || collections.find((item) => String(item.id) === String(collectionId)) || null
      setCollection(result)
      const contentIds = result?.contentIds?.length ? result.contentIds : (result?.items || []).map((item) => item.id)
      const library = await getContentList({ page: 1 })
      const content = await Promise.all(contentIds.map(async (id) => {
        const direct = await getContentById(id)
        return direct || library.items.find((item) => String(item.id) === String(id)) || { id, title: 'Saved content', type: 'content' }
      }))
      if (active) {
        setItems(content)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [collectionId])

  const homePath = `/Veridex/User/${user?.name}/${user?.email}`

  const handleRemoveItem = async () => {
    if (!itemToRemove) return
    setDeleting(true)
    const result = await removeFromCollection(collectionId, itemToRemove.id)
    if (result.success) {
      setItems((current) => current.filter((item) => String(item.id) !== String(itemToRemove.id)))
      setCollection((current) => current ? { ...current, count: Math.max(0, (current.count || 0) - 1), contentIds: (current.contentIds || []).filter((id) => String(id) !== String(itemToRemove.id)) } : current)
      setItemToRemove(null)
    }
    setDeleting(false)
  }

  const handleDeleteCollection = async () => {
    setDeleting(true)
    const result = await deleteCollection(collectionId)
    if (result.success) navigate(`${homePath}/Collections`)
    setDeleting(false)
  }

  return (
    <UserLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <button onClick={() => navigate(`${homePath}/Collections`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, border: 0, background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
            <ArrowLeft size={15} /> Collections
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 4px', fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-primary)' }}>
            <Bookmark size={22} color="var(--text-muted)" /> {collection?.name || 'Collection'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{collection?.count || 0} items</p>
            {collection && <Button variant="danger" size="sm" onClick={() => setShowDeleteCollection(true)}><Trash2 size={14} /> Delete collection</Button>}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : !collection ? (
          <EmptyState icon={Bookmark} title="Collection not found" description="This collection may have been removed or is not available to your account." />
        ) : items.length === 0 ? (
          <EmptyState icon={Library} title="This collection is empty" description="Save content from the library to see it here." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {items.map((item) => (
              <Card key={item.id} onClick={() => navigate(`${homePath}/Content/${item.id}`)} style={{ cursor: 'pointer', position: 'relative' }}>
                <button
                  type="button"
                  aria-label={`Remove ${item.title || 'resource'} from collection`}
                  title="Remove from collection"
                  onClick={(event) => { event.stopPropagation(); setItemToRemove(item) }}
                  style={{ position: 'absolute', top: 10, right: 10, zIndex: 1, display: 'inline-flex', padding: 7, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
                <div style={{ height: 160, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Library size={28} color="var(--border-strong)" />
                </div>
                <div style={{ padding: 14 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.3 }}>{item.title || 'Untitled content'}</p>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-muted)' }}>{item.author || 'Unknown author'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <Badge variant="default">{item.type || 'content'}</Badge>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(event) => { event.stopPropagation(); setItemToRemove(item) }}
                      style={{ padding: '4px 8px', height: 28, fontSize: 12 }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={showDeleteCollection}
        onClose={() => !deleting && setShowDeleteCollection(false)}
        onConfirm={handleDeleteCollection}
        title="Delete collection?"
        description={`Delete “${collection?.name || ''}” and all of its saved resources?`}
        confirmLabel="Delete collection"
        loading={deleting}
      />
      <ConfirmDialog
        open={Boolean(itemToRemove)}
        onClose={() => !deleting && setItemToRemove(null)}
        onConfirm={handleRemoveItem}
        title="Remove resource?"
        description={`Remove “${itemToRemove?.title || 'this resource'}” from the collection?`}
        confirmLabel="Remove resource"
        loading={deleting}
      />
    </UserLayout>
  )
}
