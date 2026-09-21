import { getAuthHeaders } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function requestJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
    cache: 'no-store',
    ...options,
  })

  const text = await response.text()
  let payload = null
  if (text) {
    try { payload = JSON.parse(text) } catch { payload = { message: text } }
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || response.statusText || 'Request failed'
    throw new Error(`${message} (HTTP ${response.status})`)
  }

  return payload
}

export async function getUsers({ page = 1, filters = {} } = {}) {
  try {
    const result = await requestJson('/api/auth/users')
    const items = Array.isArray(result?.data) ? result.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user.role || 'user').toLowerCase().replace('role_', ''),
      status: (user.status || 'active').toLowerCase(),
      plan: (user.plan || 'reader').toLowerCase(),
      joinedAt: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    })) : []
    return { items, total: items.length, page, pageSize: 20 }
  } catch (error) {
    return { items: [], total: 0, page, pageSize: 20, error: error.message }
  }
}

export async function getUserById(id) {
  try {
    const result = await requestJson(`/api/auth/users/${id}`)
    return result?.data || null
  } catch { return null }
}

export async function updateUser(id, data) {
  try {
    const result = await requestJson(`/api/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    return { success: true, data: result?.data }
  } catch (error) { return { success: false, error: error.message } }
}

export async function suspendUser(id) {
  try {
    await requestJson(`/api/auth/users/${id}/status?value=suspended`, { method: 'PATCH' })
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

export async function reactivateUser(id) {
  try {
    await requestJson(`/api/auth/users/${id}/status?value=active`, { method: 'PATCH' })
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

export async function createUser(data) {
  try {
    const result = await requestJson('/api/auth/users', { method: 'POST', body: JSON.stringify(data) })
    return { success: true, data: result?.data }
  } catch (error) { return { success: false, error: error.message } }
}

export async function deleteUser(id) {
  try {
    await requestJson(`/api/auth/users/${id}`, { method: 'DELETE' })
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

export async function getAuditLog({ page = 1, filters = {} } = {}) {
  try {
    const result = await requestJson('/api/usage/audit')
    const items = Array.isArray(result?.data) ? result.data : []
    return { items, total: items.length, page, pageSize: 50 }
  } catch (error) {
    return { items: [], total: 0, page, pageSize: 50, error: error.message }
  }
}

export async function exportAuditLog(filters) {
  return { success: false, error: 'Audit log export endpoint is not implemented.' }
}

export async function getSecurityPolicy() {
  return null
}

export async function updateSecurityPolicy(data) {
  return { success: false, error: 'Security policy endpoint is not implemented.' }
}

export async function getSystemHealth() {
  return {
    services: [
      { name: 'Content Service', status: 'unknown' },
      { name: 'Access Service', status: 'unknown' },
      { name: 'Usage Service', status: 'unknown' },
      { name: 'Auth Service', status: 'unknown' },
      { name: 'API Gateway', status: 'unknown' },
      { name: 'Eureka Registry', status: 'unknown' },
    ],
  }
}

export async function getRecentSecurityEvents() {
  try {
    const result = await getUsers({ page: 1 })
    const items = Array.isArray(result?.items) ? result.items : []
    return items.slice(0, 5).map((user) => ({
      id: user.id,
      title: user.status === 'suspended' ? 'User access suspended' : 'User login activity',
      detail: `${user.name} (${user.email})`,
      time: user.joinedAt || 'recent',
    }))
  } catch (error) {
    return []
  }
}
