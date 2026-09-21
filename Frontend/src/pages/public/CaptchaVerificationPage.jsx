import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CaptchaGuard from '../../components/CaptchaGuard.jsx'
import PublicLayout from '../../layouts/PublicLayout.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'

export default function CaptchaVerificationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { completeLogin } = useAuth()
  const auth = location.state?.auth
  const adminMode = location.state?.adminMode

  if (!auth?.token || !auth?.email) {
    return <MissingVerification onBack={() => navigate('/Veridex/Log-In', { replace: true })} />
  }

  const finish = () => {
    const user = auth
    completeLogin(user)
    const isAdmin = user.role === 'admin' || user.role === 'ROLE_ADMIN' || adminMode
    navigate(isAdmin
      ? `/Veridex/Admin/${user.name}/${user.email}/Home`
      : `/Veridex/User/${user.name}/${user.email}/Home`, { replace: true })
  }

  return (
    <PublicLayout hideChrome>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 480, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-primary)', margin: '0 0 8px' }}>Verify your sign in</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 24px' }}>Complete the security verification before opening your account.</p>
          <CaptchaGuard plan={1} onVerify={finish} />
        </div>
      </div>
    </PublicLayout>
  )
}

function MissingVerification({ onBack }) {
  return (
    <PublicLayout hideChrome>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)' }}>Your sign-in verification has expired.</p>
          <Button onClick={onBack}>Return to sign in</Button>
        </div>
      </div>
    </PublicLayout>
  )
}