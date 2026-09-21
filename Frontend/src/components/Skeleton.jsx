import React from 'react'

export function Skeleton({ width, height = 16, borderRadius = 'var(--radius-md)', style = {} }) {
  return (
    <div
      className="skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius, ...style }}
    />
  )
}

export function SkeletonText({ lines = 3, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', ...style }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
      ))}
    </div>
  )
}

export function SkeletonCard({ style = {} }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        ...style,
      }}
    >
      <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
      <SkeletonText lines={3} />
    </div>
  )
}
