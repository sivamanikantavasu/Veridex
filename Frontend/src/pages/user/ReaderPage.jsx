import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark, Moon, Sun, Minus, List, StickyNote, BookMarked, Lock, X } from 'lucide-react'
import { useAuth } from '../../routes/AuthContext.jsx'
import Modal from '../../components/Modal.jsx'
import Button from '../../components/Button.jsx'
import { checkAccess } from '../../api/access.js'
import { getContentById } from '../../api/content.js'
import { getContentResource } from '../../api/content.js'
import ResourceViewer from '../../components/ResourceViewer.jsx'
import { trackReading } from '../../api/usage.js'

export default function ReaderPage() {
  const { contentId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('dark') // dark | sepia | light
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activePanel, setActivePanel] = useState('toc')
  const [sessionExpired, setSessionExpired] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  const themes = {
    dark: { bg: 'var(--bg-base)', text: 'var(--text-primary)', surfaceBg: 'var(--bg-surface)' },
    sepia: { bg: '#1C1510', text: '#E8D5B7', surfaceBg: '#211810' },
    light: { bg: '#F5F0EC', text: '#1A0B0F', surfaceBg: '#EDE8E4' },
  }
  const t = themes[theme]

  useEffect(() => {
    Promise.all([getContentById(contentId), checkAccess(contentId)]).then(([c, a]) => {
      setContent(c)
      const openAccess = c?.accessLevel?.toLowerCase() === 'open'
      if (!a.hasAccess && !openAccess) setAccessDenied(true)
      setLoading(false)
    })
  }, [contentId])

  useEffect(() => {
    if (!content || accessDenied) return undefined
    const record = () => trackReading({
      contentId,
      contentTitle: content.title,
      page,
      progress: content.totalPages ? Math.min(100, Math.round((page / content.totalPages) * 100)) : 0,
      durationSeconds: 60,
    })
    record()
    const timer = window.setInterval(record, 60000)
    return () => window.clearInterval(timer)
  }, [content, contentId, page, accessDenied])

  if (accessDenied) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'rgba(229,72,77,0.1)', border: '1px solid rgba(229,72,77,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={28} color="var(--danger)" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--text-primary)', margin: 0 }}>Access restricted</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: 360 }}>Your current subscription does not include access to this content.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => navigate('../Subscription')}>View Plans</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: t.surfaceBg, overflow: 'hidden' }}>
      {/* Toolbar */}
      <header style={{ height: 52, background: t.surfaceBg, borderBottom: `1px solid ${theme === 'light' ? '#d0c8c0' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => navigate(-1)} aria-label="Back" style={toolBtn(t)}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {content?.title || 'Loading...'}
          </p>
        </div>

        {/* Page nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page" style={toolBtn(t)}><ChevronLeft size={16} /></button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: t.text, minWidth: 48, textAlign: 'center' }}>
            {page} / —
          </span>
          <button onClick={() => setPage((p) => p + 1)} aria-label="Next page" style={toolBtn(t)}><ChevronRight size={16} /></button>
        </div>

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => setZoom((z) => Math.max(60, z - 10))} aria-label="Zoom out" style={toolBtn(t)}><ZoomOut size={15} /></button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: t.text, minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(200, z + 10))} aria-label="Zoom in" style={toolBtn(t)}><ZoomIn size={15} /></button>
        </div>

        {/* Theme */}
        <div style={{ display: 'flex', gap: '2px', border: `1px solid ${theme === 'light' ? '#d0c8c0' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {[['dark', Moon], ['sepia', Minus], ['light', Sun]].map(([k, Icon]) => (
            <button key={k} onClick={() => setTheme(k)} aria-label={`${k} theme`} aria-pressed={theme === k}
              style={{ ...toolBtn(t), borderRadius: 0, background: theme === k ? (k === 'light' ? '#d0c8c0' : 'var(--bg-elevated)') : 'transparent' }}>
              <Icon size={14} />
            </button>
          ))}
        </div>

        <button aria-label="Bookmark page" style={toolBtn(t)}><Bookmark size={15} /></button>
        <button onClick={() => setPanelOpen(!panelOpen)} aria-label="Toggle panel" aria-expanded={panelOpen} style={{ ...toolBtn(t), background: panelOpen ? 'var(--bg-elevated)' : 'transparent' }}><List size={16} /></button>

        {/* Protected indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(78,159,125,0.1)', border: '1px solid rgba(78,159,125,0.2)', borderRadius: 'var(--radius-sm)' }}>
          <Lock size={11} color="var(--success)" />
          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 500 }}>Protected session</span>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Content canvas */}
        <main style={{ flex: 1, overflow: 'auto', position: 'relative', background: t.bg }}>
          {/* Watermark */}
          <div className="watermark-overlay" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} className="watermark-text" style={{ top: `${(i * 11) % 100}%`, left: `${(i * 17) % 80}%` }}>
                {user?.name} · {user?.email}
              </span>
            ))}
          </div>

          <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px', fontSize: `${zoom}%` }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className="skeleton" style={{ height: 14, width: `${60 + (i % 5) * 8}%`, borderRadius: 4, background: 'var(--border-subtle)' }} />
                ))}
              </div>
            ) : (
              <div style={{ color: t.text, lineHeight: 1.85, fontFamily: 'var(--font-serif)', fontSize: '17px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', marginTop: 0, color: t.text }}>{content?.title || 'Resource'}</h2>
                <ResourceViewer resourceLoader={() => getContentResource(contentId)} fileName={content?.resourceName || content?.title} contentType={content?.resourceContentType} height={Math.max(420, window.innerHeight - 180)} />
              </div>
            )}
          </div>
        </main>

        {/* Side panel */}
        {panelOpen && (
          <aside style={{ width: 280, background: t.surfaceBg, borderLeft: `1px solid ${theme === 'light' ? '#d0c8c0' : 'var(--border-subtle)'}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${theme === 'light' ? '#d0c8c0' : 'var(--border-subtle)'}` }}>
              {[['toc', List, 'Contents'], ['notes', StickyNote, 'Notes'], ['bm', BookMarked, 'Bookmarks']].map(([k, Icon, label]) => (
                <button key={k} onClick={() => setActivePanel(k)} aria-selected={activePanel === k}
                  style={{ flex: 1, padding: '10px 6px', background: 'none', border: 'none', borderBottom: `2px solid ${activePanel === k ? 'var(--burgundy-500)' : 'transparent'}`, color: activePanel === k ? t.text : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Content will appear here once connected.</p>
            </div>
          </aside>
        )}
      </div>

      {/* Session expired modal */}
      <Modal open={sessionExpired} onClose={() => setSessionExpired(false)} title="Session expired"
        footer={<><Button variant="ghost" onClick={() => navigate(-1)}>Leave Reader</Button><Button onClick={() => setSessionExpired(false)}>Reconnect</Button></>}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>Your reading session has expired due to inactivity. Reconnect to continue reading from where you left off.</p>
      </Modal>
    </div>
  )
}

function toolBtn(t) {
  return {
    background: 'none',
    border: 'none',
    color: t.text,
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--radius-sm)',
  }
}
