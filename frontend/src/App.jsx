import { useMemo, useState } from 'react'
import {
  addWordToNotebook,
  clearAuth,
  createNotebook,
  filterWordsPaged,
  getMyNotebooks,
  getRecommendedPaged,
  getStoredToken,
  getStoredUser,
  getWordDetail,
  login,
  register,
  searchWords,
  storeAuth,
} from './api'
import './App.css'

const PAGE_SIZE = 10
const WORD_TYPES = ['Danh từ', 'Động từ', 'Tính từ', 'Đại từ', 'Trạng từ']

function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button type="button" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page + 1} / {Math.max(totalPages, 1)}
      </span>
      <button type="button" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  )
}

function WordList({ items, onSelectWord }) {
  if (!items.length) return <p className="muted">No words found.</p>

  return (
    <ul className="word-list">
      {items.map((word) => (
        <li key={word.id}>
          <button type="button" className="word-item" onClick={() => onSelectWord(word.id)}>
            <strong>{word.hanzi}</strong>
            <span>{word.pinyin}</span>
            <span>{word.meaning}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(getStoredUser())
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchState, setSearchState] = useState({ items: [], page: 0, totalPages: 1, loading: false })

  const [detailLoading, setDetailLoading] = useState(false)
  const [wordDetail, setWordDetail] = useState(null)

  const [filterForm, setFilterForm] = useState({ hskLevel: 1, types: [WORD_TYPES[0]] })
  const [filterState, setFilterState] = useState({ items: [], page: 0, totalPages: 1, loading: false })

  const [recommendedState, setRecommendedState] = useState({ items: [], page: 0, totalPages: 1, loading: false })

  const [notebookTitle, setNotebookTitle] = useState('')
  const [notebooks, setNotebooks] = useState([])
  const [selectedNotebookId, setSelectedNotebookId] = useState('')
  const [notebookLoading, setNotebookLoading] = useState(false)

  const loggedIn = Boolean(token)

  const selectedWordTypes = useMemo(() => new Set(filterForm.types), [filterForm.types])

  function handleApiError(e) {
    setError(e instanceof Error ? e.message : 'Unexpected error')
  }

  function resetMessages() {
    setError('')
    setNotice('')
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    resetMessages()

    try {
      const payload =
        authMode === 'login'
          ? await login({ username: authForm.username, password: authForm.password })
          : await register({
              username: authForm.username,
              email: authForm.email,
              password: authForm.password,
            })

      storeAuth(payload.data)
      setToken(payload.data.accessToken)
      setUser({
        userId: payload.data.userId,
        username: payload.data.username,
        email: payload.data.email,
        role: payload.data.role,
      })
      setNotice(`${authMode === 'login' ? 'Login' : 'Register'} success`)
      setAuthForm({ username: '', email: '', password: '' })
      await loadNotebooks(payload.data.accessToken)
      await loadRecommended(0, payload.data.accessToken)
    } catch (e) {
      handleApiError(e)
    }
  }

  function handleLogout() {
    clearAuth()
    setToken('')
    setUser(null)
    setNotebooks([])
    setSelectedNotebookId('')
    setRecommendedState({ items: [], page: 0, totalPages: 1, loading: false })
    setNotice('Logged out')
  }

  async function loadSearch(page) {
    if (!searchKeyword.trim()) {
      setSearchState({ items: [], page: 0, totalPages: 1, loading: false })
      return
    }

    setSearchState((prev) => ({ ...prev, loading: true }))
    resetMessages()
    try {
      const result = await searchWords({ keyword: searchKeyword.trim(), page, size: PAGE_SIZE, token })
      setSearchState({ items: result.items, page: result.page, totalPages: result.totalPages, loading: false })
    } catch (e) {
      setSearchState((prev) => ({ ...prev, loading: false }))
      handleApiError(e)
    }
  }

  async function handleSelectWord(wordId) {
    setDetailLoading(true)
    resetMessages()
    try {
      const detail = await getWordDetail(wordId, token)
      setWordDetail(detail)
    } catch (e) {
      handleApiError(e)
    } finally {
      setDetailLoading(false)
    }
  }

  async function loadFilter(page) {
    setFilterState((prev) => ({ ...prev, loading: true }))
    resetMessages()
    try {
      const result = await filterWordsPaged({
        hskLevel: Number(filterForm.hskLevel),
        types: filterForm.types,
        page,
        size: PAGE_SIZE,
        token,
      })
      setFilterState({ items: result.items, page: result.page, totalPages: result.totalPages, loading: false })
    } catch (e) {
      setFilterState((prev) => ({ ...prev, loading: false }))
      handleApiError(e)
    }
  }

  async function loadRecommended(page, tokenOverride) {
    if (!loggedIn && !tokenOverride) return

    setRecommendedState((prev) => ({ ...prev, loading: true }))
    resetMessages()
    try {
      const result = await getRecommendedPaged({ page, size: PAGE_SIZE, token: tokenOverride || token })
      setRecommendedState({
        items: result.items,
        page: result.page,
        totalPages: result.totalPages,
        loading: false,
      })
    } catch (e) {
      setRecommendedState((prev) => ({ ...prev, loading: false }))
      handleApiError(e)
    }
  }

  async function loadNotebooks(tokenOverride) {
    if (!loggedIn && !tokenOverride) return
    setNotebookLoading(true)
    resetMessages()
    try {
      const list = await getMyNotebooks(tokenOverride || token)
      setNotebooks(list)
      if (list.length > 0) {
        setSelectedNotebookId(String(list[0].id))
      } else {
        setSelectedNotebookId('')
      }
    } catch (e) {
      handleApiError(e)
    } finally {
      setNotebookLoading(false)
    }
  }

  async function handleCreateNotebook(event) {
    event.preventDefault()
    if (!loggedIn) return

    resetMessages()
    try {
      const created = await createNotebook({ title: notebookTitle, token })
      setNotebookTitle('')
      setNotice(`Created notebook: ${created.title}`)
      await loadNotebooks()
    } catch (e) {
      handleApiError(e)
    }
  }

  async function handleAddWordToNotebook() {
    if (!loggedIn || !wordDetail || !selectedNotebookId) return

    resetMessages()
    try {
      const updated = await addWordToNotebook({
        notebookId: Number(selectedNotebookId),
        wordId: wordDetail.id,
        token,
      })
      setNotice(`Added to notebook: ${updated.title}`)
      await loadNotebooks()
    } catch (e) {
      handleApiError(e)
    }
  }

  return (
    <main className="container">
      <header className="app-header">
        <div>
          <h1>Hanzii Dashboard</h1>
          <p>Tra từ, xem chi tiết, lọc/recommended và quản lý notebook trên một màn hình.</p>
        </div>
        <div className="status-badge">{loggedIn ? `Signed in as ${user?.username}` : 'Guest mode'}</div>
      </header>

      {notice && <div className="notice ok">{notice}</div>}
      {error && <div className="notice error">{error}</div>}

      <div className="layout">
        <section className="column column-main">
          <article className="card">
            <h2>Search</h2>
            <form
              className="form-inline"
              onSubmit={(e) => {
                e.preventDefault()
                loadSearch(0)
              }}
            >
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nhập hanzi / pinyin / meaning..."
              />
              <button type="submit">Search</button>
            </form>

            {searchState.loading ? <p className="muted">Loading...</p> : <WordList items={searchState.items} onSelectWord={handleSelectWord} />}
            <Pagination page={searchState.page} totalPages={searchState.totalPages} onPageChange={loadSearch} />
          </article>

          <article className="card">
            <h2>Filter</h2>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault()
                loadFilter(0)
              }}
            >
              <label className="label-inline">
                HSK level
                <input
                  className="hsk-input"
                  type="number"
                  min="1"
                  max="9"
                  value={filterForm.hskLevel}
                  onChange={(e) => setFilterForm((prev) => ({ ...prev, hskLevel: e.target.value }))}
                />
              </label>

              <div className="chips">
                {WORD_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={selectedWordTypes.has(type) ? 'chip active' : 'chip'}
                    onClick={() => {
                      setFilterForm((prev) => {
                        const exists = prev.types.includes(type)
                        const nextTypes = exists ? prev.types.filter((t) => t !== type) : [...prev.types, type]
                        return { ...prev, types: nextTypes.length ? nextTypes : [type] }
                      })
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button type="submit">Apply Filter</button>
            </form>

            {filterState.loading ? <p className="muted">Loading...</p> : <WordList items={filterState.items} onSelectWord={handleSelectWord} />}
            <Pagination page={filterState.page} totalPages={filterState.totalPages} onPageChange={loadFilter} />
          </article>

          <article className="card">
            <div className="row between">
              <h2>Recommended</h2>
              <button type="button" onClick={() => loadRecommended(0)} disabled={!loggedIn}>
                Refresh
              </button>
            </div>
            {!loggedIn && <p className="muted">Login to load recommended words.</p>}
            {loggedIn && recommendedState.loading ? (
              <p className="muted">Loading...</p>
            ) : (
              <WordList items={recommendedState.items} onSelectWord={handleSelectWord} />
            )}
            {loggedIn && (
              <Pagination
                page={recommendedState.page}
                totalPages={recommendedState.totalPages}
                onPageChange={loadRecommended}
              />
            )}
          </article>
        </section>

        <aside className="column column-side">
          <article className="card">
            <div className="row between">
              <h2>Authentication</h2>
              {loggedIn && (
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>

            {!loggedIn ? (
              <>
                <div className="tabs">
                  <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
                    Login
                  </button>
                  <button
                    type="button"
                    className={authMode === 'register' ? 'active' : ''}
                    onClick={() => setAuthMode('register')}
                  >
                    Register
                  </button>
                </div>

                <form className="stack" onSubmit={handleAuthSubmit}>
                  <input
                    placeholder="Username"
                    value={authForm.username}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                  {authMode === 'register' && (
                    <input
                      placeholder="Email"
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  )}
                  <input
                    placeholder="Password"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button type="submit">{authMode === 'login' ? 'Login' : 'Register'}</button>
                </form>
              </>
            ) : (
              <div className="user-box">
                <strong>{user?.username}</strong>
                <span>{user?.email}</span>
              </div>
            )}
          </article>

          <article className="card">
            <h2>Word Detail</h2>
            {detailLoading && <p className="muted">Loading detail...</p>}
            {!detailLoading && !wordDetail && <p className="muted">Click a word from any list to view full detail.</p>}
            {wordDetail && (
              <div className="detail">
                <h3>{wordDetail.hanzi}</h3>
                <p>
                  <strong>Pinyin:</strong> {wordDetail.pinyin}
                </p>
                <p>
                  <strong>Meaning:</strong> {wordDetail.meaning}
                </p>
                <p>
                  <strong>HSK:</strong> {wordDetail.hskLevel}
                </p>
                <p>
                  <strong>Types:</strong> {(wordDetail.wordTypes || []).join(', ') || '-'}
                </p>

                {loggedIn && notebooks.length > 0 && (
                  <div className="stack">
                    <select value={selectedNotebookId} onChange={(e) => setSelectedNotebookId(e.target.value)}>
                      {notebooks.map((nb) => (
                        <option key={nb.id} value={nb.id}>
                          {nb.title}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddWordToNotebook}>
                      Add to Notebook
                    </button>
                  </div>
                )}
              </div>
            )}
          </article>

          <article className="card">
            <div className="row between">
              <h2>Notebook</h2>
              <button type="button" onClick={() => loadNotebooks()} disabled={!loggedIn || notebookLoading}>
                Reload
              </button>
            </div>

            {!loggedIn ? (
              <p className="muted">Login to manage notebooks.</p>
            ) : (
              <>
                <form className="form-inline" onSubmit={handleCreateNotebook}>
                  <input
                    placeholder="Notebook title"
                    value={notebookTitle}
                    onChange={(e) => setNotebookTitle(e.target.value)}
                    required
                  />
                  <button type="submit">Create</button>
                </form>

                {notebookLoading ? (
                  <p className="muted">Loading notebooks...</p>
                ) : notebooks.length === 0 ? (
                  <p className="muted">No notebook yet.</p>
                ) : (
                  <ul className="notebook-list">
                    {notebooks.map((nb) => (
                      <li key={nb.id}>
                        <strong>{nb.title}</strong>
                        <span>{(nb.wordIds || []).length} words</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </article>
        </aside>
      </div>
    </main>
  )
}

export default App
