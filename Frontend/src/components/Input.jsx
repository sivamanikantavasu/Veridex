import React from 'react'

export default function Input({
  label,
  error,
  hint,
  type = 'text',
  id,
  required,
  suffix,
  prefix,
  style = {},
  inputStyle = {},
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--burgundy-300)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            padding: `9px ${suffix ? '40px' : '14px'} 9px ${prefix ? '40px' : '14px'}`,
            outline: 'none',
            transition: 'border-color var(--transition)',
            fontFamily: 'var(--font-sans)',
            ...inputStyle,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--burgundy-400)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-strong)'
          }}
          {...props}
        />
        {suffix && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          style={{ fontSize: '12px', color: 'var(--danger)', margin: 0 }}
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          {hint}
        </p>
      )}
    </div>
  )
}
