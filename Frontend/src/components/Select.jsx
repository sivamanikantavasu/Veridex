import React from 'react'
import { ChevronDown } from 'lucide-react'

export default function Select({ label, options = [], value, onChange, style = {}, error, required, id }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--burgundy-300)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          style={{
            width: '100%',
            appearance: 'none',
            background: 'var(--bg-elevated)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            padding: '9px 40px 9px 14px',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-elevated)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          color="var(--text-muted)"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
      </div>
      {error && <p style={{ fontSize: '12px', color: 'var(--danger)', margin: 0 }}>{error}</p>}
    </div>
  )
}
