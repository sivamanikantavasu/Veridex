import { getAuthHeaders, getSession } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function requestJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
    cache: 'no-store',
    ...options,
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = payload?.message || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export async function getEntitlements() {
  try {
    const result = await requestJson('/api/access/entitlements')
    return result?.data || []
  } catch (error) {
    return []
  }
}

export async function createEntitlement(data) {
  return { success: true, id: null }
}

export async function updateEntitlement(id, data) {
  return { success: true }
}

export async function deleteEntitlement(id) {
  return { success: true }
}

export async function checkAccess(contentId) {
  try {
    const result = await requestJson('/api/access/check', {
      method: 'POST',
      body: JSON.stringify({ contentId }),
    })
    return result?.data || { hasAccess: false, reason: null }
  } catch (error) {
    return { hasAccess: false, reason: error.message }
  }
}

export async function getSubscriptionStatus() {
  try {
    const email = getSession()?.email
    if (!email) return null
    const result = await requestJson(`/api/access/subscription/${encodeURIComponent(email)}`)
    return result?.data || null
  } catch (error) {
    return null
  }
}

export async function getSubscriptionPlans() {
  try {
    const result = await requestJson('/api/access/entitlements')
    return result?.data || []
  } catch (error) {
    return []
  }
}
