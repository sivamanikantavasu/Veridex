const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
let currentSession = null

function normalizeRole(role) {
  const value = (role || '').toString().trim().toLowerCase()
  if (value === 'role_admin' || value === 'admin' || value === 'admin_role') return 'admin'
  if (value === 'role_user' || value === 'user' || value === 'user_role') return 'user'
  return 'user'
}

export function getSession() {
  return currentSession
}

export function setSession(user) {
  currentSession = user || null
}

export function clearSession() {
  currentSession = null
}

export function getAuthHeaders() {
  const session = getSession()
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
}

async function requestJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const text = await response.text()
  let payload = null

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { message: text }
    }
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export async function login({ email, password }) {
  try {
    const result = await requestJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const authData = result?.data || result
    const token = authData?.token || authData?.accessToken
    const user = authData?.user || { name: email, email, role: 'user' }

    if (result?.success !== false && (token || user)) {
      const session = {
        ...user,
        role: normalizeRole(user.role),
        token,
      }
      return { success: true, user: session }
    }

    return { success: false, error: result?.message || 'Invalid credentials.' }
  } catch (error) {
    return { success: false, error: error.message || 'Could not connect to Auth Service.' }
  }
}

export async function register({ name, email, password }) {
  try {
    const result = await requestJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'user' }),
    })
    const authData = result?.data || result
    const user = authData?.user
    if (result?.success === false || !user) {
      return { success: false, error: result?.message || 'Account could not be created.' }
    }
    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message || 'Could not connect to Auth Service.' }
  }
}

export async function logout() {
  try {
    await requestJson('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() })
  } catch {
    // Clear the in-memory session even if the audit request cannot be recorded.
  }
  clearSession()
  return { success: true }
}

export async function getCurrentUser() {
  try {
    const result = await requestJson('/api/auth/me')
    const user = result?.data
    if (!user) return { success: false, error: 'User profile not found.' }
    const session = getSession()
    const refreshed = { ...user, role: normalizeRole(user.role), token: session?.token }
    setSession(refreshed)
    return { success: true, user: refreshed }
  } catch (error) {
    return { success: false, error: error.message || 'Could not refresh user profile.' }
  }
}

export async function changePlan(plan) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/me/plan?plan=${encodeURIComponent(plan)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    })
    const payload = await response.json()
    if (!response.ok) throw new Error(payload?.message || 'Plan update failed')
    const session = getSession()
    const authData = payload?.data || {}
    setSession({ ...(authData.user || {}), token: authData.token || session?.token })
    return { success: true, user: payload?.data }
  } catch (error) { return { success: false, error: error.message } }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const result = await requestJson('/api/auth/me/password', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    return { success: result?.success !== false }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function requestPasswordReset({ email }) {
  return { success: true }
}

export async function resetPassword({ token, password }) {
  return { success: true }
}

export async function verifyEmail({ code }) {
  return { success: true }
}

export async function getLoginHistory() {
  return []
}

export async function getActiveSessions() {
  return []
}
