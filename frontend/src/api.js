const TOKEN_KEY = 'hanzii_access_token'
const USER_KEY = 'hanzii_user'

function getStorageTargets() {
  return [localStorage, sessionStorage]
}

export function getStoredToken() {
  for (const storage of getStorageTargets()) {
    const token = storage.getItem(TOKEN_KEY)
    if (token) return token
  }
  return ''
}

export function getStoredUser() {
  for (const storage of getStorageTargets()) {
    const raw = storage.getItem(USER_KEY)
    if (!raw) continue
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return null
}

export function storeAuth(auth, { remember = true } = {}) {
  clearAuth()
  const targetStorage = remember ? localStorage : sessionStorage
  targetStorage.setItem(TOKEN_KEY, auth.accessToken)
  targetStorage.setItem(
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
  for (const storage of getStorageTargets()) {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(USER_KEY)
  }
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

/* ── Auth ── */

export async function login({ username, password }) {
  return request('/api/auth/login', { method: 'POST', body: { username, password } })
}

export async function register({ username, email, password }) {
  return request('/api/auth/register', { method: 'POST', body: { username, email, password } })
}

export async function changePasswordApi({ oldPassword, newPassword, token }) {
  return request('/api/auth/change-password', {
    method: 'PUT',
    body: { oldPassword, newPassword },
    token,
  })
}

/* ── Words ── */

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

/* ── Notebooks ── */

export async function createNotebook({ title, token }) {
  const payload = await request('/api/notebooks', { method: 'POST', body: { title }, token })
  return payload.data
}

export async function getMyNotebooks(token) {
  const payload = await request('/api/notebooks/me', { token })
  return Array.isArray(payload.data) ? payload.data : []
}

export async function addWordToNotebook({ notebookId, wordId, token }) {
  const payload = await request(`/api/notebooks/${notebookId}/words/${wordId}`, { method: 'POST', token })
  return payload.data
}

export async function removeNotebookWord({ notebookId, wordId, token }) {
  const payload = await request(`/api/notebooks/${notebookId}/words/${wordId}`, { method: 'DELETE', token })
  return payload.data
}

export async function getNotebookWords({ notebookId, token }) {
  const payload = await request(`/api/notebooks/${notebookId}/words`, { token })
  return Array.isArray(payload.data) ? payload.data : []
}

/* ── SRS ── */

export async function addWordToSrs({ wordId, token }) {
  const payload = await request('/api/srs/cards', { method: 'POST', body: { wordId }, token })
  return payload.data
}

export async function getSrsDueCards(token) {
  const payload = await request('/api/srs/review/today', { token })
  return Array.isArray(payload.data) ? payload.data : []
}

export async function submitSrsReview({ wordId, rating, token }) {
  const payload = await request('/api/srs/review', { method: 'POST', body: { wordId, rating }, token })
  return payload.data
}

export async function prepareNotebookReview({ notebookId, all = false, token }) {
  const payload = await request(`/api/srs/cards/notebook/${notebookId}?all=${all}`, { method: 'POST', token })
  return payload.data // { newCardsCreated, dueCards }
}

export async function getNotebookDueCards({ notebookId, token }) {
  const payload = await request(`/api/srs/review/notebook/${notebookId}`, { token })
  return Array.isArray(payload.data) ? payload.data : []
}

/* ── Grammar ── */

export async function getGrammarPoints() {
  const payload = await request('/api/grammar-points')
  return Array.isArray(payload.data) ? payload.data : []
}

export async function getGrammarPointDetail(id) {
  const payload = await request(`/api/grammar-points/${id}`)
  return payload.data
}

export async function getGrammarExamplesByPointId(grammarPointId) {
  const payload = await request(`/api/grammar-examples/grammar-point/${grammarPointId}`)
  return Array.isArray(payload.data) ? payload.data : []
}

/* ── History ── */

export async function getSearchHistory(token) {
  const payload = await request('/api/search-history/me', { token })
  return Array.isArray(payload.data) ? payload.data : []
}

/* ── Translation ── */

const LANG_CODE_MAP = {
  'Tiếng Trung': 'zh-CN',
  'Tiếng Việt': 'vi',
  'English': 'en',
}

export async function autoTranslate({ text, sourceLang, targetLang }) {
  const src = LANG_CODE_MAP[sourceLang] || 'zh-CN'
  const tgt = LANG_CODE_MAP[targetLang] || 'vi'
  const params = new URLSearchParams({
    client: 'gtx',
    sl: src,
    tl: tgt,
    dt: 't',
    q: text,
  })
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
  )
  if (!response.ok) throw new Error('Dịch vụ dịch không khả dụng')
  const data = await response.json()
  // Response format: [[["translated","source",...], ...], ...]
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error('Lỗi định dạng kết quả dịch')
  }
  return data[0].map((segment) => segment[0]).join('')
}

export async function getTranslations(token) {
  const payload = await request('/api/translations/me', { token })
  return Array.isArray(payload.data) ? payload.data : []
}

export async function translateTextApi({ sourceText, translatedText, sourceLanguage, targetLanguage, token }) {
  const payload = await request('/api/translations', {
    method: 'POST',
    body: { sourceText, translatedText, sourceLanguage, targetLanguage },
    token,
  })
  return payload.data
}
