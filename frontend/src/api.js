const TOKEN_KEY = 'hanzii_access_token'
const USER_KEY = 'hanzii_user'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function storeAuth(auth) {
  localStorage.setItem(TOKEN_KEY, auth.accessToken)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: auth.userId,
      username: auth.username,
      email: auth.email,
      role: auth.role,
    }),
  )
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function buildErrorMessage(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload.message === 'string' && payload.message.trim()) return payload.message
  if (typeof payload.error === 'string' && payload.error.trim()) return payload.error
  return fallback
}

async function request(path, { method = 'GET', body, token, headers } = {}) {
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(buildErrorMessage(payload, `HTTP ${response.status}`))
  }

  if (payload && payload.success === false) {
    throw new Error(buildErrorMessage(payload, 'Request failed'))
  }

  return payload
}

function mapPageEnvelope(payload) {
  const pageData = payload?.data || {}
  const items = Array.isArray(pageData.content)
    ? pageData.content
    : Array.isArray(payload?.data)
      ? payload.data
      : []

  const meta = payload?.meta || {}
  return {
    items,
    page: Number(meta.page ?? pageData.number ?? 0),
    size: Number(meta.size ?? pageData.size ?? 10),
    totalElements: Number(meta.totalElements ?? pageData.totalElements ?? items.length),
    totalPages: Number(meta.totalPages ?? pageData.totalPages ?? 1),
  }
}

export async function login({ username, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  })
}

export async function register({ username, email, password }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { username, email, password },
  })
}

export async function searchWords({ keyword, page, size, token }) {
  const params = new URLSearchParams({ keyword, page: String(page), size: String(size) })
  const payload = await request(`/api/words/search?${params.toString()}`, { token })
  return mapPageEnvelope(payload)
}

export async function getWordDetail(id, token) {
  const payload = await request(`/api/words/${id}`, { token })
  return payload.data
}

export async function filterWordsPaged({ hskLevel, types, page, size, token }) {
  const params = new URLSearchParams({ hskLevel: String(hskLevel), page: String(page), size: String(size) })
  types.forEach((t) => params.append('types', t))
  const payload = await request(`/api/words/filter/paged?${params.toString()}`, { token })
  return mapPageEnvelope(payload)
}

export async function getRecommendedPaged({ page, size, token }) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  const payload = await request(`/api/words/recommended/me/paged?${params.toString()}`, { token })
  return mapPageEnvelope(payload)
}

export async function createNotebook({ title, token }) {
  const payload = await request('/api/notebooks', {
    method: 'POST',
    body: { title },
    token,
  })
  return payload.data
}

export async function getMyNotebooks(token) {
  const payload = await request('/api/notebooks/me', { token })
  return Array.isArray(payload.data) ? payload.data : []
}

export async function addWordToNotebook({ notebookId, wordId, token }) {
  const payload = await request(`/api/notebooks/${notebookId}/words/${wordId}`, {
    method: 'POST',
    token,
  })
  return payload.data
}
