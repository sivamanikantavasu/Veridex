import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VerdixMark from '../components/VerdixMark.jsx'
import { ChevronLeft } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About', href: '/Veridex/About' },
  { label: 'Plans', href: '/Veridex/Plans' },
  { label: 'FAQ', href: '/Veridex/FAQ' },
  { label: 'Contact', href: '/Veridex/Contact' },
]


export default function PublicLayout({ children, showBack = false, hideChrome = false }) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      {!hideChrome && <header style={{
        height: 'var(--nav-height)', background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link to="/Veridex" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', flexShrink: 0 }}>
          <VerdixMark size={20} color="var(--burgundy-300)" />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Veridex
          </span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', overflow: 'hidden' }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.href} className="pub-nav-link"
              style={{ padding: '6px 10px', fontSize: '13px', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', transition: 'color var(--transition)', textDecoration: 'none', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/Veridex/Log-In"
            style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid transparent', transition: 'all var(--transition)', textDecoration: 'none', marginLeft: '4px', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '' }}
          >Log In</Link>
          <Link to="/Veridex/Sign-Up"
            style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', background: 'var(--burgundy-600)', border: '1px solid var(--burgundy-500)', transition: 'background var(--transition)', textDecoration: 'none', marginLeft: '4px', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--burgundy-700)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--burgundy-600)'}
          >Get Started</Link>
        </nav>
      </header>}

      {/* Optional back button bar */}
      {showBack && !hideChrome && (
        <div style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', padding: '10px 20px' }}>
          <button onClick={() => navigate(-1)} style={backBtnSt}>
            <ChevronLeft size={15} /> Back
          </button>
        </div>
      )}

      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      {!hideChrome && <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            {[
              { label: 'Terms of Service', href: '/Veridex/Terms' },
              { label: 'Privacy Policy', href: '/Veridex/Privacy' },
            ].map((l) => (
              <Link key={l.label} to={l.href}
                style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color var(--transition)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >{l.label}</Link>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap' }}>
            &copy; {new Date().getFullYear()} ScholarSphere. All rights reserved.
          </p>
        </div>
      </footer>}

      <style>{`
        @media (max-width: 600px) {
          .pub-nav-link { display: none; }
        }
      `}</style>
    </div>
  )
}

const backBtnSt = {
  display: 'inline-flex', alignItems: 'center', gap: '4px',
  background: 'none', border: 'none', color: 'var(--text-muted)',
  cursor: 'pointer', fontSize: '13px', padding: '2px 0',
  fontFamily: 'var(--font-sans)', transition: 'color var(--transition)',
}
