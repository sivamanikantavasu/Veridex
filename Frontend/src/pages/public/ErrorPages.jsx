import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, AlertTriangle, Clock } from 'lucide-react'
import VerdixMark from '../../components/VerdixMark.jsx'
import Button from '../../components/Button.jsx'

function ErrorShell({ icon: Icon, iconColor, iconBg, code, title, description, actions }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
      <Link to="/Veridex" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '56px' }}>
        <VerdixMark size={20} color="var(--burgundy-400)" />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Veridex</span>
      </Link>
      <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: iconBg, border: `1px solid ${iconColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <Icon size={28} color={iconColor} />
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{code}</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>{title}</h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 400, margin: '0 0 36px' }}>{description}</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actions}
      </div>
    </div>
  )
}

export function Page403() {
  const navigate = useNavigate()
  return (
    <ErrorShell
      icon={Lock}
      iconColor="var(--danger)"
      iconBg="rgba(229,72,77,0.1)"
      code="403 Forbidden"
      title="Access denied"
      description="You don't have permission to view this resource. Contact your administrator if you believe this is an error."
      actions={<><Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button><Button onClick={() => navigate('/Veridex')}>Home</Button></>}
    />
  )
}

export function Page404() {
  const navigate = useNavigate()
  return (
    <ErrorShell
      icon={AlertTriangle}
      iconColor="var(--warning)"
      iconBg="rgba(209,154,62,0.1)"
      code="404 Not Found"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      actions={<><Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button><Button onClick={() => navigate('/Veridex')}>Home</Button></>}
    />
  )
}

export function Page401() {
  const navigate = useNavigate()
  return (
    <ErrorShell
      icon={Clock}
      iconColor="var(--info)"
      iconBg="rgba(107,143,184,0.1)"
      code="401 Session Expired"
      title="Your session has expired"
      description="For security, your session has ended. Please sign in again to continue where you left off."
      actions={<Button onClick={() => navigate('/Veridex/Log-In')}>Sign In Again</Button>}
    />
  )
}
