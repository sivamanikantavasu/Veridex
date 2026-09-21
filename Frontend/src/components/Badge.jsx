import React from 'react'

const variantMap = {
  default: { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'var(--border-subtle)' },
  primary: { bg: 'var(--burgundy-800)', color: 'var(--burgundy-200)', border: 'var(--burgundy-700)' },
  success: { bg: 'rgba(78,159,125,0.15)', color: 'var(--success)', border: 'rgba(78,159,125,0.3)' },
  warning: { bg: 'rgba(209,154,62,0.15)', color: 'var(--warning)', border: 'rgba(209,154,62,0.3)' },
  danger: { bg: 'rgba(229,72,77,0.15)', color: 'var(--danger)', border: 'rgba(229,72,77,0.3)' },
  info: { bg: 'rgba(107,143,184,0.15)', color: 'var(--info)', border: 'rgba(107,143,184,0.3)' },
  brass: { bg: 'rgba(184,155,94,0.15)', color: 'var(--accent-brass)', border: 'rgba(184,155,94,0.3)' },
}

export default function Badge({ children, variant = 'default', style = {} }) {
  const v = variantMap[variant] || variantMap.default
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
