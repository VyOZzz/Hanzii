import { useRef, useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'
import WordList from '../components/WordList'
import { useAppContext } from '../context/useAppContext'
import { WORD_TYPES } from '../constants/appConstants'
import { convertPinyin } from '../utils/pinyin'
import { searchWords } from '../api'

export default function DictionaryPage() {
  const {
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
    loggedIn,
    notebooks,
    selectedNotebookId,
    setSelectedNotebookId,
    addCurrentWordToNotebook,
    addCurrentWordToSrs,
    token
  } = useAppContext()

  const detailRef = useRef(null)
  const prevWordIdRef = useRef(null)

  // Auto-suggest state
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const blurTimeout = useRef(null)

  // Auto-scroll to detail section when a word is selected
  useEffect(() => {
    if (wordDetail && wordDetail.id !== prevWordIdRef.current) {
      prevWordIdRef.current = wordDetail.id
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [wordDetail])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchKeyword.trim().length > 0) {
        setSuggestionLoading(true)
        try {
          const res = await searchWords({ keyword: searchKeyword.trim(), page: 0, size: 5, token })
          setSuggestions(res.items || [])
          setShowSuggestions(true)
        } catch (e) {
          console.error('Lỗi lấy gợi ý:', e)
        } finally {
          setSuggestionLoading(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 400) // 400ms debounce

    return () => clearTimeout(delayDebounceFn)
  }, [searchKeyword, token])

  return (
    <div className="column">
      {/* Search section */}
      <article className="card card-accent fade-in">
        <h2><span className="card-icon">🔍</span> Tra từ</h2>
        <form
          className="form-inline"
          style={{ position: 'relative' }}
          onSubmit={(e) => {
            e.preventDefault()
            setShowSuggestions(false)
            loadSearch(0)
          }}
        >
          <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
            <input
              style={{ flex: 1 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
              onBlur={() => {
                blurTimeout.current = setTimeout(() => setShowSuggestions(false), 200)
              }}
              placeholder="Nhập hanzi / pinyin / nghĩa tiếng Việt..."
            />
            
            {showSuggestions && (
              <div className="search-suggestions fade-in">
                {suggestionLoading ? (
                  <div style={{ padding: 12, textAlign: 'center' }}>Đang tìm...</div>
                ) : suggestions.length > 0 ? (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        className="suggestion-item"
                        onMouseDown={(e) => {
                          e.preventDefault() // prevent blur
                          setSearchKeyword(s.hanzi)
                          setShowSuggestions(false)
                          handleSelectWord(s)
                        }}
                      >
                        <span className="sg-hanzi">{s.hanzi}</span>
                        <span className="sg-pinyin">{convertPinyin(s.pinyin)}</span>
                        <span className="sg-meaning">{s.meaning}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary">Tìm kiếm</button>
        </form>

        {searchState.loading ? (
          <SkeletonBlock lines={4} />
        ) : searchState.items.length === 0 ? (
          <StateMessage>
            <div className="empty-graphic">📚</div>
            Nhập từ khóa để bắt đầu tra cứu.
          </StateMessage>
        ) : (
          <WordList items={searchState.items} onSelectWord={handleSelectWord} />
        )}
        <Pagination page={searchState.page} totalPages={searchState.totalPages} onPageChange={loadSearch} />
      </article>

      {/* Word detail */}
      <article
        ref={detailRef}
        className={`card fade-in fade-in-delay-1${wordDetail ? ' card-detail-active' : ''}`}
      >
        <h2><span className="card-icon">📝</span> Chi tiết từ vựng</h2>
        {detailLoading && <SkeletonBlock lines={3} />}
        {!detailLoading && !wordDetail && (
          <StateMessage>
            <div className="empty-graphic">👆</div>
            Chọn một từ từ kết quả tìm kiếm để xem chi tiết.
          </StateMessage>
        )}
        {wordDetail && (
          <div className="detail">
            <h3>{wordDetail.hanzi}</h3>
            <p><strong>Pinyin:</strong> {convertPinyin(wordDetail.pinyin)}</p>
            <p><strong>Nghĩa:</strong> {wordDetail.meaning}</p>
            {wordDetail.sinoVietnamese && <p><strong>Hán Việt:</strong> {wordDetail.sinoVietnamese}</p>}
            <p><strong>HSK:</strong> Level {wordDetail.hskLevel || '—'}</p>
            {wordDetail.strokeCount > 0 && <p><strong>Số nét:</strong> {wordDetail.strokeCount}</p>}
            <p><strong>Loại từ:</strong> {(wordDetail.wordTypes || []).join(', ') || '—'}</p>

            {loggedIn && (
              <div className="stack" style={{ marginTop: 16 }}>
                {notebooks.length > 0 && (
                  <div className="row">
                    <select value={selectedNotebookId} onChange={(e) => setSelectedNotebookId(e.target.value)}>
                      {notebooks.map((nb) => (
                        <option key={nb.id} value={nb.id}>{nb.title}</option>
                      ))}
                    </select>
                    <button type="button" className="btn-gold btn-icon" onClick={addCurrentWordToNotebook}>
                      <span className="icon">📓</span> Lưu vào sổ
                    </button>
                  </div>
                )}
                <button type="button" className="btn-primary btn-icon" onClick={addCurrentWordToSrs}>
                  <span className="icon">🧠</span> Thêm vào SRS
                </button>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Filter section */}
      <article className="card fade-in fade-in-delay-2">
        <h2><span className="card-icon">🎯</span> Lọc theo HSK & Loại từ</h2>
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault()
            loadFilter(0)
          }}
        >
          <label className="label-inline">
            HSK Level
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
          <button type="submit" className="btn-primary">Áp dụng bộ lọc</button>
        </form>

        {filterState.loading ? (
          <SkeletonBlock lines={4} />
        ) : filterState.items.length === 0 ? (
          <StateMessage>Chưa có kết quả. Hãy chọn bộ lọc và nhấn áp dụng.</StateMessage>
        ) : (
          <WordList items={filterState.items} onSelectWord={handleSelectWord} />
        )}
        <Pagination page={filterState.page} totalPages={filterState.totalPages} onPageChange={loadFilter} />
      </article>

      {/* Recommended */}
      <article className="card fade-in fade-in-delay-3">
        <div className="row between">
          <h2><span className="card-icon">⭐</span> Gợi ý cho bạn</h2>
          <button type="button" className="btn-ghost" onClick={() => loadRecommended(0)} disabled={!loggedIn}>
            Làm mới
          </button>
        </div>
        {!loggedIn && (
          <StateMessage>
            <div className="empty-graphic">🔒</div>
            Đăng nhập để xem từ vựng gợi ý.
          </StateMessage>
        )}
        {loggedIn && recommendedState.loading ? (
          <SkeletonBlock lines={4} />
        ) : loggedIn && recommendedState.items.length === 0 ? (
          <StateMessage>Chưa có gợi ý. Hãy tra từ và học thêm để nhận đề xuất.</StateMessage>
        ) : (
          loggedIn && <WordList items={recommendedState.items} onSelectWord={handleSelectWord} />
        )}
        {loggedIn && (
          <Pagination page={recommendedState.page} totalPages={recommendedState.totalPages} onPageChange={loadRecommended} />
        )}
      </article>
    </div>
  )
}
