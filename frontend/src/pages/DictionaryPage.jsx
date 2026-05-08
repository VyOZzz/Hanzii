import { useRef, useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'
import WordList from '../components/WordList'
import { useAppContext } from '../context/useAppContext'
import { WORD_TYPES } from '../constants/appConstants'
import { convertPinyin } from '../utils/pinyin'
import { getWordDetail, filterWordsPaged, getRecommendedPaged, suggestWords, searchWords, analyzeWordGrammar } from '../api'
import { formatMeaning } from '../utils/meaning'

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

  // AI Grammar Analysis state
  const [grammarAnalysis, setGrammarAnalysis] = useState(null)
  const [grammarLoading, setGrammarLoading] = useState(false)

  // Auto-scroll to detail section when a word is selected
  useEffect(() => {
    if (wordDetail && wordDetail.id !== prevWordIdRef.current) {
      prevWordIdRef.current = wordDetail.id
      setGrammarAnalysis(null)
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
          const res = await suggestWords({ keyword: searchKeyword.trim(), page: 0, size: 5, token })
          const validSuggestions = (res.items || []).filter(word => /[\u4E00-\u9FA5\u3007]/.test(word.hanzi))
          setSuggestions(validSuggestions)
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
    <div className="dictionary-layout">
      {/* Hero Search Section */}
      <section className="hero-search-section">
        <div className="hero-content">
          <h1 className="hero-title">Tra cứu từ vựng tiếng Trung</h1>
          <p className="hero-subtitle">Tra từ vựng, ngữ pháp, Hán tự và nhiều hơn nữa</p>
          
          <form
            className="hero-search-form"
            onSubmit={(e) => {
              e.preventDefault()
              setShowSuggestions(false)
              loadSearch(0)
            }}
          >
            <div className="search-input-wrapper">
              <input
                className="hero-search-input"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
                onBlur={() => {
                  blurTimeout.current = setTimeout(() => setShowSuggestions(false), 200)
                }}
                placeholder="Nhập tiếng Việt, pinyin, chữ Hán..."
              />
              <button type="submit" className="btn-primary hero-search-btn">Tìm kiếm</button>
              
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
                            handleSelectWord(s.id)
                          }}
                        >
                          <span className="sg-hanzi">{s.hanzi}</span>
                          <span className="sg-pinyin">{convertPinyin(s.pinyin)}</span>
                          <span className="sg-meaning">{formatMeaning(s.meaning)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )}
            </div>
          </form>

          {/* Quick Filters / Chips mapping to WORD_TYPES */}
          <div className="hero-chips">
            {WORD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={selectedWordTypes.has(type) ? 'hero-chip active' : 'hero-chip'}
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
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column: Results & Details */}
        <div className="main-col">
          {/* Word detail */}
          {wordDetail ? (
            <article
              ref={detailRef}
              className="card fade-in card-detail-active"
            >
              <h2>Chi tiết từ vựng</h2>
              {detailLoading ? (
                <SkeletonBlock lines={3} />
              ) : (
                <div className="detail">
                  <h3>{wordDetail.hanzi}</h3>
                  <p><strong>Pinyin:</strong> {convertPinyin(wordDetail.pinyin)}</p>
                  <p><strong>Nghĩa:</strong> {formatMeaning(wordDetail.meaning, 10)}</p>
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
                            Lưu vào sổ
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                    <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ margin: 0, color: '#334155' }}>Ngữ pháp & Cách dùng</h4>
                      {grammarAnalysis === null && !grammarLoading && (
                        <button 
                          className="btn-primary" 
                          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '6px 12px', fontSize: 13 }}
                          onClick={async () => {
                            setGrammarLoading(true)
                            try {
                              console.log("Sending AI request for:", wordDetail.hanzi);
                              const res = await analyzeWordGrammar({
                                hanzi: wordDetail.hanzi,
                                pinyin: wordDetail.pinyin,
                                meaning: wordDetail.meaning
                              })
                              console.log("AI Response received:", res);
                              setGrammarAnalysis(res || "AI không trả về kết quả nào (Empty string).")
                            } catch (e) {
                              console.error("AI Error:", e);
                              setGrammarAnalysis("Không thể phân tích bằng AI lúc này: " + e.message)
                            } finally {
                              setGrammarLoading(false)
                            }
                          }}
                        >
                          ✨ Phân tích bằng AI
                        </button>
                      )}
                    </div>
                    {grammarLoading && <SkeletonBlock lines={3} />}
                    {grammarAnalysis !== null && (
                      <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6, color: '#475569' }}>
                        {grammarAnalysis}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          ) : null}

          {/* Search Results */}
          <article className="card fade-in">
            <h2>Kết quả tìm kiếm</h2>
            {searchState.loading ? (
              <SkeletonBlock lines={4} />
            ) : !searchState.hasSearched ? (
              <StateMessage>
                Nhập từ khóa ở trên để bắt đầu tra cứu.
              </StateMessage>
            ) : searchState.items.length === 0 ? (
              <StateMessage>
                Không tìm thấy kết quả phù hợp cho "{searchKeyword}".
              </StateMessage>
            ) : (
              <WordList items={searchState.items} onSelectWord={handleSelectWord} />
            )}
            <Pagination page={searchState.page} totalPages={searchState.totalPages} onPageChange={loadSearch} />
          </article>
        </div>

        {/* Right Column: Filters & Recommended */}
        <div className="side-col">
          {/* Filter section */}
          <article className="card fade-in fade-in-delay-1">
            <h2>Lọc nâng cao</h2>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault()
                loadFilter(0)
              }}
            >
              <label className="label-inline" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <span>HSK Level</span>
                <input
                  style={{width: '100%'}}
                  type="number"
                  min="1"
                  max="9"
                  value={filterForm.hskLevel}
                  onChange={(e) => setFilterForm((prev) => ({ ...prev, hskLevel: e.target.value }))}
                />
              </label>
              <button type="submit" className="btn-primary" style={{width: '100%'}}>Lọc kết quả</button>
            </form>

            {filterState.loading ? (
              <SkeletonBlock lines={4} />
            ) : filterState.items.length > 0 ? (
              <>
                <div style={{marginTop: 16}}>
                  <WordList items={filterState.items} onSelectWord={handleSelectWord} />
                </div>
                <Pagination page={filterState.page} totalPages={filterState.totalPages} onPageChange={loadFilter} />
              </>
            ) : null}
          </article>

          {/* Recommended */}
          <article className="card fade-in fade-in-delay-2">
            <div className="row between">
              <h2>Gợi ý</h2>
              <button type="button" className="btn-ghost" style={{padding: '4px 8px', fontSize: 12}} onClick={() => loadRecommended(0)} disabled={!loggedIn}>
                Làm mới
              </button>
            </div>
            {!loggedIn && (
              <StateMessage>Đăng nhập để xem từ vựng gợi ý.</StateMessage>
            )}
            {loggedIn && recommendedState.loading ? (
              <SkeletonBlock lines={4} />
            ) : loggedIn && recommendedState.items.length === 0 ? (
              <StateMessage>Chưa có gợi ý.</StateMessage>
            ) : (
              loggedIn && <WordList items={recommendedState.items} onSelectWord={handleSelectWord} />
            )}
          </article>
        </div>
      </div>
    </div>
  )
}
