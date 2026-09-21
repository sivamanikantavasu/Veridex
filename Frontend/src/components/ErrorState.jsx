import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button.jsx'

export default function ErrorState({ title = 'Something went wrong', description = 'An error occurred. Please try again.', onRetry }) {
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
          background: 'rgba(229,72,77,0.1)',
          border: '1px solid rgba(229,72,77,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger)',
        }}
      >
        <AlertTriangle size={24} />
      </div>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {title}
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', maxWidth: 320 }}>
          {description}
        </p>
      </div>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try Again</Button>}
    </div>
  )
}
