import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function BackButton({ label = 'Back', to }) {
  const navigate = useNavigate()
  const handleClick = () => (to ? navigate(to) : navigate(-1))

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        background: 'none', border: 'none',
        color: 'var(--text-muted)', cursor: 'pointer',
        fontSize: '13px', padding: '4px 0',
        fontFamily: 'var(--font-sans)',
        transition: 'color var(--transition)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
    >
      <ChevronLeft size={15} />
      {label}
    </button>
  )
}
