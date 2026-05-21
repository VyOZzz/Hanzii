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

  let response
  try {
    response = await fetch(path, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    // Fetch itself failed — backend không chạy hoặc mất mạng
    throw new Error('Không thể kết nối đến server. Hãy kiểm tra backend đang chạy tại localhost:8081.')
  }

  // Nếu backend trả về HTML (ví dụ Vite 404 page khi proxy fail)
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    throw new Error('Không thể kết nối đến server. Hãy kiểm tra backend đang chạy tại localhost:8081.')
  }

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (response.status === 401) {
    clearAuth()
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  }

  if (response.status === 403) {
    throw new Error('Bạn không có quyền truy cập chức năng này.')
  }

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

export async function suggestWords({ keyword, page, size, token }) {
  const params = new URLSearchParams({ keyword, page: String(page), size: String(size) })
  const payload = await request(`/api/words/suggest?${params.toString()}`, { token })
  return mapPageEnvelope(payload)
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
  if (types && types.length > 0) {
    types.forEach((t) => params.append('types', t))
  }
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

export async function getNotebookQuiz({ notebookId, count = 10, token }) {
  const params = new URLSearchParams({ count: String(count) })
  const payload = await request(`/api/notebooks/${notebookId}/quiz?${params.toString()}`, { token })
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

/* ── AI ── */

export async function analyzeWordGrammar({ hanzi, pinyin, meaning }) {
  const message = `Hãy phân tích cấu trúc ngữ pháp, cách dùng của từ tiếng Trung sau đây (giải thích ngắn gọn, dễ hiểu), đồng thời đưa ra 2 câu ví dụ có phiên âm và dịch nghĩa.\nTừ: ${hanzi}\nPinyin: ${pinyin}\nNghĩa: ${meaning}`
  const payload = await request('/api/ai/chat', { method: 'POST', body: { message } })
  return payload.data
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

  let response
  try {
    response = await fetch(
      `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    )
  } catch {
    throw new Error('Khong the ket noi den dich vu dich. Kiem tra ket noi mang.')
  }

  if (!response.ok) throw new Error('Dich vu dich khong kha dung (loi ' + response.status + ')')

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Dich vu dich tra ve du lieu khong hop le')
  }

  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error('Loi dinh dang ket qua dich')
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

export async function getAllUsers(token) {
  const payload = await request('/api/users', { token })
  return Array.isArray(payload.data) ? payload.data : []
}

export async function blockUser({ userId, blocked, token }) {
  const payload = await request(`/api/users/${userId}/block`, {
    method: 'PUT',
    body: { blocked },
    token,
  })
  return payload.data
}

export async function deleteUser({ userId, token }) {
  const payload = await request(`/api/users/${userId}`, { method: 'DELETE', token })
  return payload.data
}

export async function getAiStats(token) {
  const payload = await request('/api/users/ai/stats', { token })
  return payload.data || {}
}

export async function getAiConfig(token) {
  const payload = await request('/api/ai-config/latest', { token })
  return payload.data || {}
}

export async function updateAiConfig({ apiKey, model, systemPrompt, isActive, token }) {
  const payload = await request('/api/ai-config', {
    method: 'PUT',
    body: { apiKey, model, systemPrompt, isActive },
    token,
  })
  return payload.data
}

/* ── AI Tutor ── */
export async function chatWithAITutor(message) {
  const payload = await request('/api/ai/chat', { method: 'POST', body: { message } })
  return payload.data
}
