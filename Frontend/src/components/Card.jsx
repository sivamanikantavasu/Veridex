import React from 'react'

export default function Card({ children, style = {}, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined,
        transition: onClick ? 'border-color var(--transition)' : undefined,
        ...style,
      }}
      onMouseEnter={onClick ? (e) => (e.currentTarget.style.borderColor = 'var(--border-strong)') : undefined}
      onMouseLeave={onClick ? (e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)') : undefined}
    >
      {children}
    </div>
  )
}
