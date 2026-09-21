import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize)
  if (totalPages <= 1) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        Page {page} of {totalPages}
      </span>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          style={navBtnStyle(page <= 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          const p = i + 1
          return (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              aria-current={p === page ? 'page' : undefined}
              style={{
                ...navBtnStyle(false),
                background: p === page ? 'var(--burgundy-500)' : undefined,
                color: p === page ? 'var(--text-primary)' : undefined,
                borderColor: p === page ? 'var(--burgundy-400)' : undefined,
              }}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          style={navBtnStyle(page >= totalPages)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

function navBtnStyle(disabled) {
  return {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontSize: '13px',
    fontFamily: 'var(--font-sans)',
  }
}
