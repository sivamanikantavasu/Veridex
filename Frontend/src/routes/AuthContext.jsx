import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, logout as apiLogout, getCurrentUser, getSession, setSession } from '../api/auth.js'

const defaultAuthContext = {
  user: null,
  login: async () => ({ success: false, error: 'Please return to the sign-in page and try again.' }),
  completeLogin: () => {},
  logout: async () => ({ success: true }),
}

const AuthContext = createContext(defaultAuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  useEffect(() => {
    let mounted = true
    const refreshUser = async () => {
      if (!getSession()?.token) return
      const result = await getCurrentUser()
      if (mounted && result.success) setUser(result.user)
    }
    refreshUser()
    window.addEventListener('focus', refreshUser)
    return () => {
      mounted = false
      window.removeEventListener('focus', refreshUser)
    }
  }, [])

  const login = async (credentials) => {
    return apiLogin(credentials)
  }

  const completeLogin = (sessionUser) => {
    setSession(sessionUser)
    setUser(sessionUser)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, completeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext) || defaultAuthContext
}
