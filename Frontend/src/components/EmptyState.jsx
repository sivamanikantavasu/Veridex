import React from 'react'
import { FileX } from 'lucide-react'

export default function EmptyState({ icon: Icon = FileX, title = 'Nothing here yet', description = 'Content will appear here once connected.', action }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {title}
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', maxWidth: 320 }}>
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
