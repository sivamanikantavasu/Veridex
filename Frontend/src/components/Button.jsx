import React from 'react'

const variants = {
  primary: {
    background: 'var(--burgundy-500)',
    color: 'var(--text-primary)',
    border: '1px solid var(--burgundy-400)',
    hoverBg: 'var(--burgundy-600)',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
    hoverBg: 'var(--bg-hover)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    hoverBg: 'var(--bg-elevated)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
    hoverBg: 'rgba(229,72,77,0.1)',
  },
}

const sizes = {
  sm: { padding: '6px 14px', fontSize: '13px', height: '32px' },
  md: { padding: '8px 18px', fontSize: '14px', height: '38px' },
  lg: { padding: '11px 24px', fontSize: '15px', height: '44px' },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  className = '',
  ...props
}) {
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: 'var(--radius-md)',
        border: v.border,
        background: hovered && !disabled && !loading ? v.hoverBg : v.background,
        color: v.color,
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        letterSpacing: '0.01em',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--transition), opacity var(--transition)',
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
        ...s,
        ...style,
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
          }}
          aria-hidden="true"
        />
      )}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}
