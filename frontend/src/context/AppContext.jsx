import { useEffect, useMemo, useState } from 'react'
import { AppContext } from './AppContextObject'
import { PAGE_SIZE, WORD_TYPES } from '../constants/appConstants'
import {
  addWordToNotebook,
  addWordToSrs,
  changePasswordApi,
  clearAuth,
  createNotebook,
  filterWordsPaged,
  getGrammarExamplesByPointId,
  getGrammarPointDetail,
  getGrammarPoints,
  getMyNotebooks,
  getRecommendedPaged,
  getSearchHistory,
  getSrsDueCards,
  getStoredToken,
  getStoredUser,
  getTranslations,
  getWordDetail,
  login,
  register,
  searchWords,
  storeAuth,
  submitSrsReview,
  translateTextApi,
} from '../api'

export function AppProvider({ children }) {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(getStoredUser())
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchState, setSearchState] = useState({ items: [], page: 0, totalPages: 1, loading: false, hasSearched: false })

  const [detailLoading, setDetailLoading] = useState(false)
  const [wordDetail, setWordDetail] = useState(null)

  const [filterForm, setFilterForm] = useState({ hskLevel: 1, types: [] })
  const [filterState, setFilterState] = useState({ items: [], page: 0, totalPages: 1, loading: false })

  const [recommendedState, setRecommendedState] = useState({ items: [], page: 0, totalPages: 1, loading: false })

  const [notebooks, setNotebooks] = useState([])
  const [selectedNotebookId, setSelectedNotebookId] = useState('')
  const [notebookLoading, setNotebookLoading] = useState(false)

  const [srsDueCards, setSrsDueCards] = useState([])
  const [srsLoading, setSrsLoading] = useState(false)
  const [srsActionLoading, setSrsActionLoading] = useState('')

  const [grammarPoints, setGrammarPoints] = useState([])
  const [grammarLoading, setGrammarLoading] = useState(false)
  const [selectedGrammarId, setSelectedGrammarId] = useState('')
  const [grammarDetail, setGrammarDetail] = useState(null)
  const [grammarExamples, setGrammarExamples] = useState([])

  const [historyItems, setHistoryItems] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const [translationItems, setTranslationItems] = useState([])
  const [translationLoading, setTranslationLoading] = useState(false)

  const loggedIn = Boolean(token)
  const selectedWordTypes = useMemo(() => new Set(filterForm.types), [filterForm.types])

  function resetMessages() {
    setError('')
    setNotice('')
  }

  // Tự động ẩn thông báo sau 3 giây
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [notice])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  function handleApiError(e) {
    setError(e instanceof Error ? e.message : 'Unexpected error')
  }

  async function authenticate({ mode, username, email, password, remember }) {
    resetMessages()
    try {
      const payload =
        mode === 'login'
          ? await login({ username, password })
          : await register({ username, email, password })

      storeAuth(payload.data, { remember })
      setToken(payload.data.accessToken)
      setUser({
        userId: payload.data.userId,
        username: payload.data.username,
        email: payload.data.email,
        role: payload.data.role,
      })
      setNotice(`${mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} thành công!`)
      return true
    } catch (e) {
      handleApiError(e)
      return false
    }
  }

  function logout() {
    clearAuth()
    setToken('')
    setUser(null)
    setNotebooks([])
    setSelectedNotebookId('')
    setRecommendedState({ items: [], page: 0, totalPages: 1, loading: false })
    setSrsDueCards([])
    setHistoryItems([])
    setTranslationItems([])
    setNotice('Đã đăng xuất')
  }

  async function changePassword({ oldPassword, newPassword }) {
    resetMessages()
    try {
      await changePasswordApi({ oldPassword, newPassword, token })
      setNotice('Đổi mật khẩu thành công!')
    } catch (e) {
      handleApiError(e)
      throw e
    }
  }

  async function translateText({ sourceText, translatedText, sourceLanguage, targetLanguage }) {
    resetMessages()
    try {
      const result = await translateTextApi({
        sourceText,
        translatedText,
        sourceLanguage,
        targetLanguage,
        token,
      })
      setNotice('Đã lưu bản dịch!')
      await loadTranslations()
      return result
    } catch (e) {
      handleApiError(e)
      throw e
    }
  }

  async function loadSearch(page, keywordOverride = searchKeyword) {
    const keyword = String(keywordOverride || '').trim()

    if (!keyword) {
      setSearchState({ items: [], page: 0, totalPages: 1, loading: false, hasSearched: false })
      return
    }

    setSearchState((prev) => ({ ...prev, loading: true }))
    resetMessages()
    try {
      const result = await searchWords({ keyword, page, size: PAGE_SIZE, token })
      setSearchState({ items: result.items, page: result.page, totalPages: result.totalPages, loading: false, hasSearched: true })
    } catch (e) {
      setSearchState((prev) => ({ ...prev, loading: false, hasSearched: true }))
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
      setSelectedNotebookId((prev) => {
        if (!list.length) return ''
        const prevId = String(prev || '')
        const stillExists = list.some((nb) => String(nb.id) === prevId)
        if (stillExists) return prevId
        return String(list[0].id)
      })
    } catch (e) {
      handleApiError(e)
    } finally {
      setNotebookLoading(false)
    }
  }

  async function createNotebookItem(title) {
    if (!loggedIn) return
    resetMessages()
    try {
      const created = await createNotebook({ title, token })
      setNotice(`Đã tạo sổ tay: ${created.title}`)
      await loadNotebooks()
    } catch (e) {
      handleApiError(e)
    }
  }

  async function addCurrentWordToNotebook() {
    if (!loggedIn || !wordDetail || !selectedNotebookId) return
    resetMessages()
    try {
      // Lưu vào sổ tay
      await addWordToNotebook({
        notebookId: Number(selectedNotebookId),
        wordId: wordDetail.id,
        token,
      })
      // ĐỒNG THỜI tự động đưa vào SRS để học ngắt quãng
      await addWordToSrs({ wordId: wordDetail.id, token })

      await loadNotebooks()
      await loadSrsDueCards()
      setNotice(`Đã thêm "${wordDetail.hanzi}" vào sổ và bắt đầu lộ trình học (SRS)!`)
    } catch (e) {
      handleApiError(e)
    }
  }

  async function addCurrentWordToSrs() {
    if (!loggedIn || !wordDetail) return
    resetMessages()
    try {
      await addWordToSrs({ wordId: wordDetail.id, token })
      setNotice(`Đã thêm ${wordDetail.hanzi} vào SRS`)
      await loadSrsDueCards()
    } catch (e) {
      handleApiError(e)
    }
  }

  async function loadSrsDueCards(tokenOverride) {
    if (!loggedIn && !tokenOverride) return
    setSrsLoading(true)
    resetMessages()
    try {
      const cards = await getSrsDueCards(tokenOverride || token)
      setSrsDueCards(cards)
    } catch (e) {
      handleApiError(e)
    } finally {
      setSrsLoading(false)
    }
  }

  async function handleSrsReview(card, rating) {
    if (!loggedIn) return
    setSrsActionLoading(`${card.cardId}-${rating}`)
    resetMessages()
    try {
      const updated = await submitSrsReview({ wordId: card.wordId, rating, token })
      let feedbackText = ''
      if (rating === 1) feedbackText = 'Học lại'
      else if (rating === 2) feedbackText = 'Khó'
      else if (rating === 3) feedbackText = 'Tốt'
      else if (rating === 4) feedbackText = 'Dễ'

      setNotice(
        `${updated.hanzi}: ${feedbackText} · ôn tiếp ${new Date(updated.nextReviewAt).toLocaleString('vi-VN')}`,
      )
      await loadSrsDueCards()
    } catch (e) {
      handleApiError(e)
    } finally {
      setSrsActionLoading('')
    }
  }

  async function loadGrammarPoints() {
    setGrammarLoading(true)
    resetMessages()
    try {
      const points = await getGrammarPoints()
      setGrammarPoints(points)
      if (points.length > 0 && !selectedGrammarId) {
        const firstId = String(points[0].id)
        setSelectedGrammarId(firstId)
        await loadGrammarDetail(firstId)
      }
    } catch (e) {
      handleApiError(e)
    } finally {
      setGrammarLoading(false)
    }
  }

  async function loadGrammarDetail(grammarPointId) {
    resetMessages()
    try {
      const [detail, examples] = await Promise.all([
        getGrammarPointDetail(grammarPointId),
        getGrammarExamplesByPointId(grammarPointId),
      ])
      setGrammarDetail(detail)
      setGrammarExamples(examples)
    } catch (e) {
      handleApiError(e)
    }
  }

  async function loadSearchHistory(tokenOverride) {
    if (!loggedIn && !tokenOverride) return
    setHistoryLoading(true)
    resetMessages()
    try {
      const items = await getSearchHistory(tokenOverride || token)
      setHistoryItems(items)
    } catch (e) {
      handleApiError(e)
    } finally {
      setHistoryLoading(false)
    }
  }

  async function loadTranslations(tokenOverride) {
    if (!loggedIn && !tokenOverride) return
    setTranslationLoading(true)
    resetMessages()
    try {
      const items = await getTranslations(tokenOverride || token)
      setTranslationItems(items)
    } catch (e) {
      handleApiError(e)
    } finally {
      setTranslationLoading(false)
    }
  }

  useEffect(() => {
    loadGrammarPoints()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!token) return
    loadNotebooks(token)
    loadRecommended(0, token)
    loadSrsDueCards(token)
    loadSearchHistory(token)
    loadTranslations(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const value = {
    token,
    user,
    loggedIn,
    error,
    notice,
    setError,
    setNotice,
    resetMessages,

    searchKeyword,
    setSearchKeyword,
    searchState,
    loadSearch,
    detailLoading,
    wordDetail,
    handleSelectWord,

    filterForm,
    setFilterForm,
    selectedWordTypes,
    filterState,
    loadFilter,
    recommendedState,
    loadRecommended,

    notebooks,
    selectedNotebookId,
    setSelectedNotebookId,
    notebookLoading,
    loadNotebooks,
    createNotebookItem,
    addCurrentWordToNotebook,
    addCurrentWordToSrs,

    srsDueCards,
    srsLoading,
    srsActionLoading,
    loadSrsDueCards,
    handleSrsReview,

    grammarPoints,
    grammarLoading,
    selectedGrammarId,
    setSelectedGrammarId,
    grammarDetail,
    grammarExamples,
    loadGrammarPoints,
    loadGrammarDetail,

    historyItems,
    historyLoading,
    loadSearchHistory,
    translationItems,
    translationLoading,
    loadTranslations,

    authenticate,
    logout,
    changePassword,
    translateText,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
