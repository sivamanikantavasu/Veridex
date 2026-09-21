import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: '13px',
        }}
      >
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {i > 0 && <ChevronRight size={14} color="var(--text-muted)" />}
            {item.href && i < items.length - 1 ? (
              <Link
                to={item.href}
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={i === items.length - 1 ? 'page' : undefined}
                style={{ color: i === items.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
