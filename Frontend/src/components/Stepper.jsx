import React from 'react'
import { Check } from 'lucide-react'

export default function Stepper({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: done ? 'var(--burgundy-500)' : active ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: `2px solid ${done || active ? 'var(--burgundy-500)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: done ? 'white' : active ? 'var(--burgundy-300)' : 'var(--text-muted)',
                }}
              >
                {done ? <Check size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: '12px', color: active ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: active ? 600 : 400 }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < current ? 'var(--burgundy-500)' : 'var(--border-subtle)', margin: '0 8px', marginBottom: 22 }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
