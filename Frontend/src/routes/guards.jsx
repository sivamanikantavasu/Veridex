import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export function RequireAuth({ children }) {
  const auth = useAuth()
  const user = auth?.user
  const location = useLocation()
  if (!user) return <Navigate to="/Veridex/Log-In" state={{ from: location }} replace />
  return children
}

function normalizeRole(role) {
  const value = (role || '').toString().trim().toLowerCase()
  if (value === 'role_admin' || value === 'admin' || value === 'admin_role') return 'admin'
  if (value === 'role_user' || value === 'user' || value === 'user_role') return 'user'
  return 'user'
}

export function RequireAdmin({ children }) {
  const auth = useAuth()
  const user = auth?.user
  const location = useLocation()
  if (!user) return <Navigate to="/Veridex/Log-In" state={{ from: location }} replace />
  if (normalizeRole(user.role) !== 'admin') return <Navigate to="/Veridex/403" replace />
  return children
}

export function RedirectIfAuth({ children }) {
  const auth = useAuth()
  const user = auth?.user
  if (user) {
    const role = normalizeRole(user.role)
    const dest = role === 'admin'
      ? `/Veridex/Admin/${user.name}/${user.email}/Home`
      : `/Veridex/User/${user.name}/${user.email}/Home`
    return <Navigate to={dest} replace />
  }
  return children
}
