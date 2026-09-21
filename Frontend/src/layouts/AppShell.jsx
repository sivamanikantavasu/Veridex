import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Library, Clock, Bookmark, CreditCard, User, Shield,
  BarChart2, Users, Settings, FileText, Activity, Server,
  ChevronLeft, ChevronRight, Search, LogOut, Menu, BookOpen, ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../routes/AuthContext.jsx'
import VerdixMark from '../components/VerdixMark.jsx'

const userNav = (name, email) => [
  {
    group: 'Library',
    items: [
      { icon: Home, label: 'Home', href: `/Veridex/User/${name}/${email}/Home` },
      { icon: Library, label: 'Library', href: `/Veridex/User/${name}/${email}/Library` },
      { icon: Clock, label: 'History', href: `/Veridex/User/${name}/${email}/History` },
      { icon: Bookmark, label: 'Collections', href: `/Veridex/User/${name}/${email}/Collections` },
    ],
  },
  {
    group: 'Account',
    items: [
      { icon: CreditCard, label: 'Subscription', href: `/Veridex/User/${name}/${email}/Subscription` },
      { icon: User, label: 'Profile', href: `/Veridex/User/${name}/${email}/Profile` },
      { icon: Shield, label: 'Security', href: `/Veridex/User/${name}/${email}/Security` },
    ],
  },
]

const adminNav = (name, email) => [
  {
    group: 'Operations',
    items: [
      { icon: Home, label: 'Dashboard', href: `/Veridex/Admin/${name}/${email}/Home` },
      { icon: FileText, label: 'Content', href: `/Veridex/Admin/${name}/${email}/Content` },
      { icon: Users, label: 'Users', href: `/Veridex/Admin/${name}/${email}/Users` },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { icon: BarChart2, label: 'Usage', href: `/Veridex/Admin/${name}/${email}/Usage` },
      { icon: Activity, label: 'Audit Log', href: `/Veridex/Admin/${name}/${email}/Audit-Log` },
    ],
  },
  {
    group: 'System',
    items: [
      { icon: Settings, label: 'Security', href: `/Veridex/Admin/${name}/${email}/Security` },
      { icon: Server, label: 'System Health', href: `/Veridex/Admin/${name}/${email}/System-Health` },
      { icon: User, label: 'Profile', href: `/Veridex/Admin/${name}/${email}/Profile` },
    ],
  },
]

export default function AppShell({ children, role }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef(null)

  const searchResults = []

  useEffect(() => {
    const close = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const name = user?.name || ''
  const email = user?.email || ''
  const navGroups = role === 'admin' ? adminNav(name, email) : userNav(name, email)

  const handleLogout = async () => {
    await logout()
    navigate('/Veridex/Log-In')
  }

  const footerLinks = role === 'admin'
    ? [
        { label: 'Dashboard', href: `/Veridex/Admin/${name}/${email}/Home` },
        { label: 'Profile', href: `/Veridex/Admin/${name}/${email}/Profile` },
      ]
    : [
        { label: 'Home', href: `/Veridex/User/${name}/${email}/Home` },
        { label: 'Profile', href: `/Veridex/User/${name}/${email}/Profile` },
      ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(18,7,9,0.8)', zIndex: 199 }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: mobileOpen ? 'var(--sidebar-width)' : collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: mobileOpen ? 0 : undefined,
          bottom: 0,
          zIndex: mobileOpen ? 200 : 50,
          transition: 'width var(--transition-md)',
          overflow: 'hidden',
        }}
        className="sidebar-responsive"
      >
        {/* Logo */}
        <div style={{ height: 'var(--nav-height)', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border-subtle)', gap: '10px', flexShrink: 0, background: role === 'admin' ? 'var(--burgundy-900)' : 'transparent' }}>
          <VerdixMark size={22} color={role === 'admin' ? 'var(--burgundy-200)' : 'var(--burgundy-300)'} />
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Veridex
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 8px' }}>
          {navGroups.map((group) => (
            <div key={group.group} style={{ marginBottom: '24px' }}>
              {!collapsed && (
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px', margin: '0 0 6px' }}>
                  {group.group}
                </p>
              )}
              {group.items.map(({ icon: Icon, label, href }) => {
                const active = location.pathname === href
                return (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 10px',
                      borderRadius: 'var(--radius-md)',
                      color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                      background: active ? (role === 'admin' ? 'var(--burgundy-900)' : 'rgba(110,22,48,0.25)') : 'transparent',
                      borderLeft: `3px solid ${active ? (role === 'admin' ? 'var(--burgundy-400)' : 'var(--burgundy-500)') : 'transparent'}`,
                      marginBottom: '2px',
                      transition: 'all var(--transition)',
                      fontSize: '14px',
                      fontWeight: active ? 600 : 400,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)' }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    {!collapsed && label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            margin: '8px',
            padding: '8px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </aside>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left var(--transition-md)',
        }}
        className="main-content-responsive"
      >
        {/* Top nav */}
        <header
          style={{
            height: 'var(--nav-height)',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: '16px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open navigation"
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <Menu size={20} />
          </button>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Back"
            style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', transition: 'all var(--transition)', flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
          >
            <ArrowLeft size={14} />
          </button>

          {/* Search */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="search"
              aria-label="Search"
              placeholder={role === 'admin' ? 'Search content & users…' : 'Search content…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'var(--bg-elevated)',
                border: `1px solid ${searchFocused ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                padding: '7px 14px 7px 34px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'border-color var(--transition)',
              }}
            />
            {/* Dropdown */}
            {searchFocused && (searchQuery.trim().length >= 2) && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                zIndex: 9999, overflow: 'hidden', maxHeight: 340, overflowY: 'auto',
              }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No results for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    {searchResults.filter((r) => r.type === 'content').length > 0 && (
                      <div style={{ padding: '8px 12px 4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Content</div>
                    )}
                    {searchResults.filter((r) => r.type === 'content').map((r) => (
                      <button key={r.id} onMouseDown={() => { setSearchQuery(''); setSearchFocused(false) }}
                        style={{ width: '100%', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(110,22,48,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <BookOpen size={13} color="var(--burgundy-400)" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{r.category}</p>
                        </div>
                      </button>
                    ))}
                    {searchResults.filter((r) => r.type === 'user').length > 0 && (
                      <div style={{ padding: '8px 12px 4px', marginTop: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>Users</div>
                    )}
                    {searchResults.filter((r) => r.type === 'user').map((r) => (
                      <button key={r.id} onMouseDown={() => { setSearchQuery(''); setSearchFocused(false) }}
                        style={{ width: '100%', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--burgundy-800)', border: '1px solid var(--burgundy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 600, color: 'var(--burgundy-200)' }}>
                          {r.name[0]}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email} · {r.role}</p>
                        </div>
                      </button>
                    ))}
                    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', padding: '5px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--burgundy-800)', border: '1px solid var(--burgundy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--burgundy-200)', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-info-responsive">
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2, textTransform: 'capitalize' }}>{role}</p>
              {role === 'user' && (
                <Link to={`/Veridex/User/${name}/${email}/Upgrade`} style={{ fontSize: '10px', color: 'var(--accent-brass)', textDecoration: 'none', fontWeight: 600, lineHeight: 1.2 }}>
                  Upgrade plan
                </Link>
              )}
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px 28px', maxWidth: 'var(--content-max)', width: '100%', margin: '0 auto', boxSizing: 'border-box' }} className="main-padding-responsive">
          {children}
        </main>

        {/* Footer — role-scoped links only */}
        <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {footerLinks.map((l) => (
              <Link key={l.label} to={l.href} style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color var(--transition)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Veridex &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-responsive { display: ${mobileOpen ? 'flex' : 'none'} !important; }
          .main-content-responsive { margin-left: 0 !important; }
          .main-padding-responsive { padding: 20px 16px !important; }
          .mobile-menu-btn { display: flex !important; }
          .user-info-responsive { display: none; }
        }
        @media (max-width: 1024px) {
          .sidebar-responsive { width: var(--sidebar-collapsed) !important; }
          .main-content-responsive { margin-left: var(--sidebar-collapsed) !important; }
        }
      `}</style>
    </div>
  )
}
