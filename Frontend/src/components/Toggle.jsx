import React from 'react'

export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          position: 'relative',
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          border: 'none',
          background: checked ? 'var(--burgundy-500)' : 'var(--bg-elevated)',
          outline: '1px solid ' + (checked ? 'var(--burgundy-400)' : 'var(--border-strong)'),
          transition: 'background var(--transition)',
          cursor: 'inherit',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '21px' : '3px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'var(--text-primary)',
            transition: 'left var(--transition)',
          }}
        />
      </button>
      {label && <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{label}</span>}
    </label>
  )
}
