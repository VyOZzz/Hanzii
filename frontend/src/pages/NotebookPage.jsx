import { useState, useCallback, useEffect } from 'react'
import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'
import { getNotebookWords, prepareNotebookReview, submitSrsReview, removeNotebookWord, getNotebookDueCards } from '../api'
import { convertPinyin } from '../utils/pinyin'
import { formatMeaning } from '../utils/meaning'

function calcNextInterval(rating, currentInterval, repetition) {
  if (rating === 1) return 1
  if (rating === 2) return Math.max(1, Math.round(currentInterval * 1.2))
  if (rating === 3) return currentInterval === 0 ? 1 : Math.round(currentInterval * 2.5)
  if (rating === 4) return currentInterval === 0 ? 4 : Math.round(currentInterval * 4.0)
  return 1
}

function formatInterval(days) {
  if (days <= 1) return '1 ngày'
  if (days < 30) return `${days} ngày`
  if (days < 365) return `${Math.round((days / 30) * 10) / 10} tháng`
  return `${Math.round((days / 365) * 10) / 10} năm`
}

export default function NotebookPage() {
  const {
    loggedIn,
    token,
    notebookLoading,
    notebooks,
    createNotebookItem,
    loadNotebooks,
    loadSrsDueCards,
    setNotice,
    setError,
  } = useAppContext()

  const [notebookTitle, setNotebookTitle] = useState('')

  // Notebook detail
  const [activeNotebookId, setActiveNotebookId] = useState(null)
  const [notebookWords, setNotebookWords] = useState([])
  const [wordsLoading, setWordsLoading] = useState(false)
  const [reviewQueueStats, setReviewQueueStats] = useState({ newCount: 0, reviewCount: 0, totalDue: 0 })
  const [reviewQueueLoading, setReviewQueueLoading] = useState(false)

  // Anki review mode
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewCards, setReviewCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewActionLoading, setReviewActionLoading] = useState(false)
  const [reviewStats, setReviewStats] = useState({ remembered: 0, forgot: 0 })

  // Settings
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    cardMode: 'normal',
    showPinyin: true,
    showMeta: true,
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hanzii_notebook_settings')
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch {}
  }, [])

  function updateSetting(key, val) {
    setSettings((prev) => {
      const next = { ...prev, [key]: val }
      localStorage.setItem('hanzii_notebook_settings', JSON.stringify(next))
      return next
    })
  }

  async function onCreate(e) {
    e.preventDefault()
    await createNotebookItem(notebookTitle)
    setNotebookTitle('')
  }

  const selectNotebook = useCallback(async (nbId) => {
    if (activeNotebookId === nbId) {
      setActiveNotebookId(null)
      setNotebookWords([])
      setReviewQueueStats({ newCount: 0, reviewCount: 0, totalDue: 0 })
      return
    }
    setActiveNotebookId(nbId)
    setWordsLoading(true)
    setReviewQueueLoading(true)
    try {
      const [words, dueCards] = await Promise.all([
        getNotebookWords({ notebookId: nbId, token }),
        getNotebookDueCards({ notebookId: nbId, token }),
      ])
      const newCount = dueCards.filter((card) => Number(card.repetition) === 0).length
      const reviewCount = dueCards.length - newCount
      setNotebookWords(words)
      setReviewQueueStats({ newCount, reviewCount, totalDue: dueCards.length })
    } catch (e) {
      setError(e.message)
    } finally {
      setWordsLoading(false)
      setReviewQueueLoading(false)
    }
  }, [activeNotebookId, token, setError])

  async function startReview(all = false) {
    if (!activeNotebookId) return
    setReviewLoading(true)
    try {
      const result = await prepareNotebookReview({ notebookId: activeNotebookId, all, token })
      const dueCards = Array.isArray(result.dueCards) ? result.dueCards : []
      if (dueCards.length === 0) {
        setNotice(all ? 'Sổ tay hiện không có từ nào!' : 'Không có thẻ nào cần ôn tập trong sổ tay này!')
        setReviewLoading(false)
        return
      }
      setReviewCards(dueCards)
      setCurrentIndex(0)
      setCardFlipped(false)
      setReviewStats({ remembered: 0, forgot: 0 })
      setReviewMode(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setReviewLoading(false)
    }
  }

  async function handleAnswer(rating) {
    const card = reviewCards[currentIndex]
    setReviewActionLoading(true)
    try {
      await submitSrsReview({ wordId: card.wordId, rating, token })
      setReviewStats((prev) => ({
        remembered: prev.remembered + (rating >= 3 ? 1 : 0),
        forgot: prev.forgot + (rating < 3 ? 1 : 0),
      }))
      // Move to next card
      if (currentIndex + 1 < reviewCards.length) {
        setCurrentIndex((prev) => prev + 1)
        setCardFlipped(false)
      } else {
        // Review complete
        setReviewMode(false)
        if (activeNotebookId) {
          try {
            const dueCards = await getNotebookDueCards({ notebookId: activeNotebookId, token })
            const newCount = dueCards.filter((item) => Number(item.repetition) === 0).length
            const reviewCount = dueCards.length - newCount
            setReviewQueueStats({ newCount, reviewCount, totalDue: dueCards.length })
          } catch {}
        }
        await loadSrsDueCards()
        setNotice(
          `Ôn tập hoàn thành! Nhớ: ${reviewStats.remembered + (rating >= 3 ? 1 : 0)}, Quên: ${reviewStats.forgot + (rating < 3 ? 1 : 0)}`,
        )
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setReviewActionLoading(false)
    }
  }

  function exitReview() {
    setReviewMode(false)
    setReviewCards([])
    setCurrentIndex(0)
    setCardFlipped(false)
  }

  async function handleRemoveWord(wordId, wordHanzi) {
    if (!window.confirm(`Bạn có chắc muốn xóa từ "${wordHanzi}" khỏi sổ tay này?`)) return
    try {
      await removeNotebookWord({ notebookId: activeNotebookId, wordId, token })
      setNotebookWords((prev) => prev.filter((w) => w.id !== wordId))
      if (activeNotebookId) {
        try {
          const dueCards = await getNotebookDueCards({ notebookId: activeNotebookId, token })
          const newCount = dueCards.filter((item) => Number(item.repetition) === 0).length
          const reviewCount = dueCards.length - newCount
          setReviewQueueStats({ newCount, reviewCount, totalDue: dueCards.length })
        } catch {}
      }
      setNotice(`Đã xoá "${wordHanzi}"`)
    } catch (e) {
      setError(e.message)
    }
  }

  const currentCard = reviewCards[currentIndex]
  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId)

  // ── Anki Review Mode ──
  if (reviewMode && currentCard) {
    return (
      <div className="column">
        <article className="card card-accent fade-in">
          {/* Progress bar */}
          <div className="row between" style={{ marginBottom: 8 }}>
            <div>
              <p className="section-eyebrow">Đang ôn tập · {activeNotebook?.title}</p>
              <h2 style={{ margin: 0 }}>
                Thẻ {currentIndex + 1} / {reviewCards.length}
              </h2>
            </div>
            <button type="button" className="btn-ghost" onClick={exitReview}>✕ Thoát</button>
          </div>

          {/* Progress indicator */}
          <div className="review-progress-bar">
            <div
              className="review-progress-fill"
              style={{ width: `${((currentIndex) / reviewCards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard */}
          <div className="flashcard-container">
            <div 
              className={`flashcard ${cardFlipped ? 'flipped' : ''}`}
              onClick={() => !cardFlipped && setCardFlipped(true)}
            >
              {/* Front */}
              <div className="flashcard-front">
                {settings.cardMode === 'reverse' ? (
                  <div className="flashcard-meaning" style={{ fontSize: 28, color: '#fff' }}>
                    {formatMeaning(currentCard.meaning, 5)}
                  </div>
                ) : (
                  <div className="flashcard-hanzi">{currentCard.hanzi}</div>
                )}
                <div className="flashcard-hint">Nhấn để xem đáp án</div>
              </div>

              {/* Back */}
              <div className="flashcard-back">
                {settings.cardMode === 'reverse' ? (
                  <>
                    <div className="flashcard-hanzi">{currentCard.hanzi}</div>
                    {settings.showPinyin && (
                      <div className="flashcard-pinyin">{convertPinyin(currentCard.pinyin)}</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flashcard-hanzi">{currentCard.hanzi}</div>
                    {settings.showPinyin && (
                      <div className="flashcard-pinyin">{convertPinyin(currentCard.pinyin)}</div>
                    )}
                    <div className="flashcard-meaning">{formatMeaning(currentCard.meaning, 5)}</div>
                  </>
                )}
                
                {currentCard.customExamples && (
                  <div className="flashcard-examples" style={{ marginTop: '16px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left' }}>
                    <div className="section-eyebrow" style={{ color: '#7dd3fc', marginBottom: '8px' }}>✨ Câu ví dụ cá nhân hóa (AI)</div>
                    <div style={{ fontSize: '1rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'rgba(241, 245, 249, 0.96)' }}>
                      {currentCard.customExamples}
                    </div>
                  </div>
                )}
                {settings.showMeta && (
                  <div className="flashcard-meta">
                    Lần ôn: {currentCard.repetition} · Chu kỳ: {currentCard.intervalDays} ngày
                  </div>
                )}
              </div>
            </div>

            {!cardFlipped ? (
              <button
                type="button"
                className="btn-primary flashcard-show-btn"
                onClick={() => setCardFlipped(true)}
              >
                Hiện đáp án
              </button>
            ) : (
              <div className="flashcard-actions-4">
                <button
                  type="button"
                  className="btn-again"
                  disabled={reviewActionLoading}
                  onClick={() => handleAnswer(1)}
                >
                  <span className="btn-time">{formatInterval(calcNextInterval(1, currentCard.intervalDays, currentCard.repetition))}</span>
                  <span>Lại</span>
                </button>
                <button
                  type="button"
                  className="btn-hard"
                  disabled={reviewActionLoading}
                  onClick={() => handleAnswer(2)}
                >
                  <span className="btn-time">{formatInterval(calcNextInterval(2, currentCard.intervalDays, currentCard.repetition))}</span>
                  <span>Khó</span>
                </button>
                <button
                  type="button"
                  className="btn-good"
                  disabled={reviewActionLoading}
                  onClick={() => handleAnswer(3)}
                >
                  <span className="btn-time">{formatInterval(calcNextInterval(3, currentCard.intervalDays, currentCard.repetition))}</span>
                  <span>Tốt</span>
                </button>
                <button
                  type="button"
                  className="btn-easy"
                  disabled={reviewActionLoading}
                  onClick={() => handleAnswer(4)}
                >
                  <span className="btn-time">{formatInterval(calcNextInterval(4, currentCard.intervalDays, currentCard.repetition))}</span>
                  <span>Dễ</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="review-stats">
            <span className="stat-remember">✓ Nhớ: {reviewStats.remembered}</span>
            <span className="stat-forget">✗ Quên: {reviewStats.forgot}</span>
          </div>
        </article>
      </div>
    )
  }

  // ── Normal Notebook View ──
  return (
    <div className="column">
      <article className="card fade-in">
        <div className="row between">
          <h2>Sổ tay & Ôn tập</h2>
          <div className="row" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn-ghost btn-icon"
              onClick={() => setShowSettings(!showSettings)}
              disabled={!loggedIn}
              title="Cài đặt flashcard"
            >
              Cài đặt
            </button>
            <button
              type="button"
              className="btn-ghost btn-icon"
              onClick={() => loadNotebooks()}
              disabled={!loggedIn || notebookLoading}
            >
              Tải lại
            </button>
          </div>
        </div>

        {showSettings && loggedIn && (
          <div className="settings-panel fade-in">
            <h3 className="section-eyebrow" style={{ marginTop: 0 }}>Cấu hình Flashcard</h3>
            <div className="settings-grid">
              <label className="setting-item">
                <span>Chế độ lật thẻ</span>
                <select
                  value={settings.cardMode}
                  onChange={(e) => updateSetting('cardMode', e.target.value)}
                >
                  <option value="normal">Xuôi (Chữ Hán → Nghĩa)</option>
                  <option value="reverse">Ngược (Nghĩa → Chữ Hán)</option>
                </select>
              </label>
              <label className="setting-item checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.showPinyin}
                  onChange={(e) => updateSetting('showPinyin', e.target.checked)}
                />
                Hiện Pinyin (ở mặt sau)
              </label>
              <label className="setting-item checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.showMeta}
                  onChange={(e) => updateSetting('showMeta', e.target.checked)}
                />
                Hiện thống kê (Lần ôn, chu kỳ)
              </label>
            </div>
          </div>
        )}

        {!loggedIn ? (
          <StateMessage>
            Đăng nhập để quản lý sổ tay và ôn tập.
          </StateMessage>
        ) : (
          <>
            <form className="form-inline" onSubmit={onCreate}>
              <input
                placeholder="Tên sổ tay mới..."
                value={notebookTitle}
                onChange={(e) => setNotebookTitle(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary btn-icon">
                Tạo mới
              </button>
            </form>

            {notebookLoading ? (
              <SkeletonBlock lines={3} />
            ) : notebooks.length === 0 ? (
              <StateMessage>
                Chưa có sổ tay nào. Tạo sổ tay đầu tiên ở trên!
              </StateMessage>
            ) : (
              <ul className="notebook-list">
                {notebooks.map((nb) => (
                  <li key={nb.id} className={`notebook-item ${activeNotebookId === nb.id ? 'active' : ''}`}>
                    <div
                      className="notebook-header"
                      onClick={() => selectNotebook(nb.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <strong>{nb.title}</strong>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Tạo: {nb.createdAt ? new Date(nb.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </div>
                      </div>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="count-badge">{(nb.wordIds || []).length} từ</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                          {activeNotebookId === nb.id ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {activeNotebookId === nb.id && (
                      <div className="notebook-detail fade-in">
                        <div className="review-queue-row" aria-live="polite">
                          <div className="review-queue-item new">
                            <span className="label">Mới cần học</span>
                            <strong className="value">{reviewQueueLoading ? '…' : reviewQueueStats.newCount}</strong>
                          </div>
                          <div className="review-queue-item review">
                            <span className="label">Cần ôn lại</span>
                            <strong className="value">{reviewQueueLoading ? '…' : reviewQueueStats.reviewCount}</strong>
                          </div>
                          <div className="review-queue-item due">
                            <span className="label">Tổng đến hạn</span>
                            <strong className="value">{reviewQueueLoading ? '…' : reviewQueueStats.totalDue}</strong>
                          </div>
                        </div>

                        {/* Review button */}
                        {(nb.wordIds || []).length > 0 && (
                          <div className="row" style={{ gap: 8 }}>
                            <button
                              type="button"
                              className="btn-primary btn-icon notebook-review-btn"
                              style={{ flex: 1 }}
                              onClick={() => startReview(false)}
                              disabled={reviewLoading}
                            >
                              {reviewLoading ? 'Đang chuẩn bị...' : 'Bắt đầu ôn tập'}
                            </button>
                            <button
                              type="button"
                              className="btn-ghost btn-icon notebook-review-btn"
                              style={{ flex: 1, background: 'var(--bg-glass)' }}
                              onClick={() => startReview(true)}
                              disabled={reviewLoading}
                            >
                              {reviewLoading ? 'Đang chuẩn bị...' : 'Học toàn bộ'}
                            </button>
                          </div>
                        )}

                        {/* Words in notebook */}
                        <div className="subheading">Từ vựng trong sổ tay</div>
                        {wordsLoading ? (
                          <SkeletonBlock lines={3} />
                        ) : notebookWords.length === 0 ? (
                          <StateMessage>
                            Chưa có từ nào. Thêm từ từ trang Từ điển.
                          </StateMessage>
                        ) : (
                          <ul className="notebook-word-list">
                            {notebookWords.map((word) => (
                              <li key={word.id} className="notebook-word-item">
                                <span className="nw-hanzi">{word.hanzi}</span>
                                <span className="nw-pinyin">{convertPinyin(word.pinyin)}</span>
                                <span className="nw-meaning">{formatMeaning(word.meaning)}</span>
                                <button
                                  type="button"
                                  className="btn-ghost btn-icon"
                                  style={{ padding: 6, color: 'var(--text-muted)' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveWord(word.id, word.hanzi)
                                  }}
                                  title="Xoá khỏi sổ"
                                >
                                  Xoá
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </article>
    </div>
  )
}
