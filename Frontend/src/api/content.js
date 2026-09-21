import { getAuthHeaders } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function requestJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
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
    const message = payload?.message || payload?.error || response.statusText || 'Request failed'
    throw new Error(`${message} (HTTP ${response.status})`)
  }

  return payload
}

function normalizeContentPayload(result) {
  const data = result?.data ?? result ?? []
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.content)) return data.content
  return []
}

export async function getContentList({ page = 1, filters = {} } = {}) {
  try {
    const result = await requestJson('/api/content')
    const items = normalizeContentPayload(result)
      .map((item) => ({
        ...item,
        id: item.id ?? item._id ?? String(item.title || Math.random()),
        type: (item.type || item.category || 'journal').toLowerCase(),
        status: (item.status || 'published').toLowerCase(),
        accessLevel: (item.accessLevel || item.access || 'subscribed').toLowerCase(),
      }))
      .filter((item) => {
        const q = (filters.q || '').toLowerCase()
        const type = (filters.type || '').toLowerCase()
        const access = (filters.access || '').toLowerCase()
        const matchesQuery = !q || [item.title, item.author, item.subject, item.description].some((value) => (value || '').toLowerCase().includes(q))
        const matchesType = !type || (item.type || '').toLowerCase() === type
        const matchesAccess = !access || (item.accessLevel || '').toLowerCase() === access
        return matchesQuery && matchesType && matchesAccess
      })

    const sorted = [...items].sort((a, b) => {
      if (filters.sort === 'title') return (a.title || '').localeCompare(b.title || '')
      if (filters.sort === 'year') return Number(b.year || 0) - Number(a.year || 0)
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    })

    return { items: sorted, total: sorted.length, page, pageSize: 20 }
  } catch (error) {
    return { items: [], total: 0, page, pageSize: 20 }
  }
}

export async function getContentById(id) {
  try {
    const result = await requestJson(`/api/content/${id}`)
    return result?.data || null
  } catch (error) {
    return null
  }
}

export async function createContent(data) {
  try {
    const result = await requestJson('/api/content', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const created = result?.data ?? result
    return {
      success: true,
      id: created?.id || null,
      data: created,
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function uploadContentResource(id, file) {
  const response = await fetch(`${API_BASE}/api/content/${id}/file`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: (() => { const formData = new FormData(); formData.append('file', file); return formData })(),
  })
  const text = await response.text()
  let payload = null
  try { payload = text ? JSON.parse(text) : null } catch { payload = { message: text } }
  if (!response.ok) throw new Error(`${payload?.message || response.statusText || 'Resource upload failed'} (HTTP ${response.status})`)
  return payload?.data || payload
}

export async function getContentResource(id) {
  const response = await fetch(`${API_BASE}/api/content/${id}/file`, { headers: getAuthHeaders() })
  if (!response.ok) throw new Error(`Resource could not be loaded (HTTP ${response.status})`)
  const blob = await response.blob()
  return {
    blob,
    url: URL.createObjectURL(blob),
    contentType: response.headers.get('content-type') || blob.type || 'application/octet-stream',
    fileName: response.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/i)?.[1] || '',
  }
}

export async function updateContent(id, data) {
  try {
    const result = await requestJson(`/api/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return { success: true, data: result?.data ?? result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteContent(id) {
  try {
    await requestJson(`/api/content/${id}`, { method: 'DELETE' })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getRecommended() {
  try {
    const result = await getContentList({ page: 1 })
    return Array.isArray(result?.items) ? result.items.slice(0, 4) : []
  } catch (error) {
    return []
  }
}

export async function getRecentlyAdded() {
  try {
    const result = await getContentList({ page: 1 })
    return Array.isArray(result?.items) ? result.items.slice(0, 4) : []
  } catch (error) {
    return []
  }
}

export async function getContinueReading() {
  try {
    const result = await getContentList({ page: 1 })
    return Array.isArray(result?.items) ? result.items.slice(0, 3) : []
  } catch (error) {
    return []
  }
}

export async function getTopContent() {
  try {
    const result = await getContentList({ page: 1 })
    return Array.isArray(result?.items) ? result.items.slice(0, 5) : []
  } catch (error) {
    return []
  }
}
