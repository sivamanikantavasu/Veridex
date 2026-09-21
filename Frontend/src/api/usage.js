import { getAuthHeaders, getSession } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function requestJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
    cache: 'no-store',
    ...options,
  })

  const text = await response.text()
  let payload = null
  try { payload = text ? JSON.parse(text) : null } catch { payload = { message: text } }

  if (!response.ok) {
    const message = payload?.message || payload?.error || response.statusText || 'Request failed'
    throw new Error(`${message} (HTTP ${response.status})`)
  }

  return payload
}

export async function getReadingHistory({ page = 1 } = {}) {
  try {
    const userId = getSession()?.id
    if (!userId) return { items: [], total: 0, page, pageSize: 20 }
    const result = await requestJson(`/api/usage/history/${userId}`)
    const items = Array.isArray(result?.data) ? result.data : []
    return { items, total: items.length, page, pageSize: 20 }
  } catch (error) {
    return { items: [], total: 0, page, pageSize: 20 }
  }
}

export async function trackReading({ contentId, contentTitle, page = 1, progress = 0, durationSeconds = 60 }) {
  try {
    const userId = getSession()?.id
    if (!userId) return { success: false, error: 'Sign in required.' }
    const result = await requestJson('/api/usage/track', {
      method: 'POST',
      body: JSON.stringify({ userId, contentId, contentTitle, page, progress, durationSeconds }),
    })
    return { success: true, data: result?.data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getCollections() {
  try {
    const userId = getSession()?.id
    if (!userId) return []
    const result = await requestJson(`/api/usage/collections/${userId}`)
    return Array.isArray(result?.data) ? result.data : []
  } catch { return [] }
}

export async function getCollection(id) {
  try {
    const userId = getSession()?.id
    if (!userId) return null
    const result = await requestJson(`/api/usage/collections/${encodeURIComponent(id)}/items?userId=${encodeURIComponent(userId)}`)
    return result?.data || null
  } catch { return null }
}

export async function createCollection(data) {
  try {
    const userId = getSession()?.id
    if (!userId) throw new Error('Your session is missing a user ID. Please sign in again.')
    const result = await requestJson(`/api/usage/collections/${userId}`, { method: 'POST', body: JSON.stringify(data) })
    return { success: true, data: result?.data }
  } catch (error) { return { success: false, error: error.message } }
}

export async function addToCollection(collectionId, contentId) {
  try {
    const userId = getSession()?.id
    const result = await requestJson(`/api/usage/collections/${collectionId}/items?userId=${encodeURIComponent(userId)}&contentId=${encodeURIComponent(contentId)}`, { method: 'POST' })
    return { success: true, data: result?.data }
  } catch (error) { return { success: false, error: error.message } }
}

export async function removeFromCollection(collectionId, contentId) {
  try {
    const userId = getSession()?.id
    if (!userId) throw new Error('Your session is missing a user ID. Please sign in again.')
    await requestJson(`/api/usage/collections/${encodeURIComponent(collectionId)}/items?userId=${encodeURIComponent(userId)}&contentId=${encodeURIComponent(contentId)}`, { method: 'DELETE' })
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

export async function deleteCollection(collectionId) {
  try {
    const userId = getSession()?.id
    if (!userId) throw new Error('Your session is missing a user ID. Please sign in again.')
    await requestJson(`/api/usage/collections/${encodeURIComponent(collectionId)}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getEngagementAnalytics({ dateFrom, dateTo, contentId } = {}) {
  try {
    const userId = getSession()?.id
    if (!userId) return { readingHours: 0, completionRate: 0, activeUsers: 0, sessions: [] }
    const result = await requestJson(`/api/usage/analytics${window.location.pathname.includes('/Admin/') ? '' : `/${userId}`}`)
    return result?.data || { readingHours: null, completionRate: null, activeUsers: null, sessions: [] }
  } catch (error) {
    return { readingHours: null, completionRate: null, activeUsers: null, sessions: [] }
  }
}

export async function getKpiSummary() {
  const [{ items: users = [] }, { items: content = [] }, history] = await Promise.all([
    import('./admin.js').then((m) => m.getUsers({ page: 1 })),
    import('./content.js').then((m) => m.getContentList({ page: 1 })),
    getReadingHistory({ page: 1 }),
  ])

  const activeUsers = users.filter((u) => (u.status || '').toLowerCase() === 'active').length
  const totalReadingHours = (history?.items || []).reduce((sum, item) => {
      const minutes = Number(item.durationMinutes ?? item.progress ?? 0)
      return sum + (Number.isFinite(minutes) ? minutes : 0)
  }, 0)

  return {
    totalUsers: users.length,
    activeSubscriptions: activeUsers,
    contentItems: content.length,
    readingHours: Math.max(0, Math.round(totalReadingHours / 60)),
  }
}
