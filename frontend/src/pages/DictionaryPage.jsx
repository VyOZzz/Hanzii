import { useRef, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pagination'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'
import WordList from '../components/WordList'
import { useAppContext } from '../context/useAppContext'
import { HSK_LEVELS, WORD_TYPES } from '../constants/appConstants'
import { convertPinyin } from '../utils/pinyin'
import { suggestWords, analyzeWordGrammar } from '../api'
import { formatMeaning } from '../utils/meaning'
import useVoiceInput from '../hooks/useVoiceInput'
import HandwritingCanvas from '../components/HandwritingCanvas'
import StrokeAnimation from '../components/StrokeAnimation'

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
    resetFilter,
    recommendedState,
    loadRecommended,
    loggedIn,
    notebooks,
    selectedNotebookId,
    setSelectedNotebookId,
    addCurrentWordToNotebook,
    token,
    historyItems,
    srsDueCards,
    loadSrsDueCards,
    loadSearchHistory,
  } = useAppContext()

  const detailRef = useRef(null)
  const prevWordIdRef = useRef(null)

  // Auto-suggest state
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const blurTimeout = useRef(null)

  const recentSearches = useMemo(() => historyItems.slice(0, 5), [historyItems])

  // AI Grammar Analysis state
  const [grammarAnalysis, setGrammarAnalysis] = useState(null)
  const [grammarLoading, setGrammarLoading] = useState(false)
  const [showHandwriting, setShowHandwriting] = useState(false)
  const [showStroke, setShowStroke] = useState(false)
  const { listening, supported, startListening } = useVoiceInput('zh-CN')

  const navigate = useNavigate()
  const filterActive = filterState.hasFiltered || filterForm.types.length > 0
  const resultState = filterActive ? filterState : searchState
  const resultTitle = filterActive ? 'Kết quả lọc' : 'Kết quả tra cứu'
  const resultHasRequested = filterActive ? filterState.hasFiltered : searchState.hasSearched

  function updateFilter(nextForm) {
    setFilterForm(nextForm)
    if (nextForm.types.length === 0 && Number(nextForm.hskLevel) === 1) {
      resetFilter()
      return
    }
    loadFilter(0, nextForm)
  }

  function toggleTypeFilter(type) {
    const exists = filterForm.types.includes(type)
    const nextTypes = exists ? filterForm.types.filter((t) => t !== type) : [...filterForm.types, type]
    updateFilter({ ...filterForm, types: nextTypes })
  }

  function handleStartSrs() {
    navigate('/notebook')
  }

  function runRecentSearch(query) {
    setSearchKeyword(query)
    setShowSuggestions(false)
    loadSearch(0, query)
  }

  // Auto-scroll to detail section when a word is selected
  useEffect(() => {
    if (wordDetail && wordDetail.id !== prevWordIdRef.current) {
      prevWordIdRef.current = wordDetail.id
      setShowStroke(false)
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
          const keyword = searchKeyword.trim()
          const normalize = (value = '') => value.toLowerCase().replace(/\s+/g, '')
          const rankSuggestion = (word) => {
            const k = normalize(keyword)
            const hanzi = (word.hanzi || '').toLowerCase().trim()
            const pinyin = normalize(word.pinyin || '')
            if (hanzi === k || pinyin === k) return 0
            if (hanzi.startsWith(k) || pinyin.startsWith(k)) return 1
            if (hanzi.includes(k) || pinyin.includes(k)) return 2
            return 3
          }

          const res = await suggestWords({ keyword, page: 0, size: 1000, token })
          const validSuggestions = (res.items || [])
            .filter(word => /[\u4E00-\u9FA5\u3007]/.test(word.hanzi))
            .sort((a, b) => {
              const ra = rankSuggestion(a)
              const rb = rankSuggestion(b)
              if (ra !== rb) return ra - rb
              return (a.hanzi || '').length - (b.hanzi || '').length
            })
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

  // Refresh stats when returning to homepage
  useEffect(() => {
    if (loggedIn) {
      loadSrsDueCards()
      loadSearchHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn])

  const handleSpeak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="dictionary-layout">
      {/* Hero Search Section */}
      <section className="hero-search-section fade-in">
        <div className="hero-content">
          <h1 className="hero-title">Tra cứu thông minh</h1>
          <p className="hero-subtitle">Tra từ vựng, ngữ pháp, Hán tự và lưu ngay vào lộ trình học của bạn</p>
          
          <form
            className="hero-search-form"
            onSubmit={(e) => {
              e.preventDefault()
              setShowSuggestions(false)
              loadSearch(0)
            }}
          >
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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
                placeholder="Nhập tiếng Việt, pinyin hoặc chữ Hán..."
              />
              <button type="submit" className="btn-primary hero-search-btn">Tìm kiếm</button>
              <button
                type="button"
                className="btn-ghost hero-search-btn"
                disabled={!supported || listening}
                onClick={() => startListening({ onResult: (text) => {
                  setSearchKeyword(text)
                  loadSearch(0, text)
                } })}
              >
                {listening ? 'Đang nghe...' : 'Giọng nói'}
              </button>
              <button type="button" className="btn-ghost hero-search-btn" onClick={() => setShowHandwriting((v) => !v)}>
                Nét vẽ
              </button>
              
              {showSuggestions && (
                <div className="search-suggestions fade-in">
                  {suggestionLoading ? (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tìm gợi ý...</div>
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
            {showHandwriting && (
              <HandwritingCanvas
                onRecognize={(text) => {
                  setSearchKeyword(text)
                  loadSearch(0, text)
                  setShowHandwriting(false)
                }}
              />
            )}
          </form>

          {/* Type filters underneath the search */}
          <div className="hero-chips">
            {WORD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={selectedWordTypes.has(type) ? 'hero-chip active' : 'hero-chip'}
                onClick={() => toggleTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="study-quick-strip" style={{ marginTop: '24px' }}>
            <div className="study-stat">
              <strong>{srsDueCards.length}</strong>
              <span>Thẻ SRS cần ôn</span>
            </div>
            <div className="study-stat">
              <strong>{notebooks.length}</strong>
              <span>Sổ tay học tập</span>
            </div>
            <div className="study-stat">
              <strong>{recentSearches.length}</strong>
              <span>Tra cứu gần đây</span>
            </div>
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
              <div className="row between" style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Chi tiết từ vựng</h2>
                <span className="study-badge">HSK {wordDetail.hskLevel || '—'}</span>
              </div>
              
              {detailLoading ? (
                <SkeletonBlock lines={4} />
              ) : (
                <div className="detail">
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {wordDetail.hanzi}
                      <button
                        type="button"
                        onClick={() => handleSpeak(wordDetail.hanzi)}
                        className="speaker-btn"
                        title="Nghe phát âm"
                      >
                        🔊
                      </button>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: 500 }}>{convertPinyin(wordDetail.pinyin)}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{wordDetail.sinoVietnamese ? `Hán Việt: ${wordDetail.sinoVietnamese}` : ''}</span>
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '16px', margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      <strong>Nghĩa:</strong> {formatMeaning(wordDetail.meaning, 10)}
                    </p>
                  </div>

                  <div className="row" style={{ gap: '24px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {wordDetail.strokeCount > 0 && <span><strong>Số nét:</strong> {wordDetail.strokeCount}</span>}
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ fontSize: 13, padding: '4px 10px' }}
                        onClick={() => setShowStroke((v) => !v)}
                      >
                        {showStroke ? 'Ẩn nét chữ' : 'Xem animation nét chữ'}
                      </button>
                    </div>
                    <span><strong>Loại từ:</strong> {(wordDetail.wordTypes || []).join(', ') || '—'}</span>
                  </div>

                  {showStroke && (
                    <div className="fade-in" style={{ margin: '16px 0', padding: 16, background: 'var(--bg-glass)', borderRadius: 12 }}>
                      <StrokeAnimation hanzi={wordDetail.hanzi} />
                    </div>
                  )}

                  {loggedIn && (
                    <div className="stack word-detail-actions">
                      {notebooks.length > 0 ? (
                        <div className="row">
                          <select className="hsk-select" value={selectedNotebookId} onChange={(e) => setSelectedNotebookId(e.target.value)} style={{ flex: 1, padding: '10px' }}>
                            {notebooks.map((nb) => (
                              <option key={nb.id} value={nb.id}>{nb.title}</option>
                            ))}
                          </select>
                          <button type="button" className="btn-primary" onClick={addCurrentWordToNotebook} style={{ padding: '10px 16px' }}>
                            Lưu vào sổ
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="btn-primary" onClick={() => navigate('/notebook')} style={{ width: '100%', padding: '10px' }}>
                          Tạo sổ tay mới để lưu từ
                        </button>
                      )}

                      <button type="button" className="btn-gold" onClick={handleStartSrs} style={{ width: '100%', padding: '10px' }}>
                        Bắt đầu học qua thẻ SRS
                      </button>
                    </div>
                  )}

                  <div className="analysis-panel" style={{ marginTop: 24 }}>
                    <div className="row between" style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Phân tích ngữ pháp & Cách dùng</h4>
                      </div>
                      
                      {grammarAnalysis === null && !grammarLoading && (
                        <button
                          className="btn-primary"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '6px 16px', fontSize: 13, border: 'none' }}
                          onClick={async () => {
                            setGrammarLoading(true)
                            try {
                              const res = await analyzeWordGrammar({
                                hanzi: wordDetail.hanzi,
                                pinyin: wordDetail.pinyin,
                                meaning: wordDetail.meaning,
                                token
                              })
                              setGrammarAnalysis(res || 'AI không trả về kết quả nào.')
                            } catch (e) {
                              setGrammarAnalysis(`Không thể phân tích bằng AI lúc này: ${e.message}`)
                            } finally {
                              setGrammarLoading(false)
                            }
                          }}
                        >
                          Hỏi Gia Sư AI
                        </button>
                      )}
                    </div>
                    {grammarLoading && <SkeletonBlock lines={3} />}
                    {grammarAnalysis !== null && (
                      <div className="analysis-result fade-in" style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
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
            <h2>{resultTitle}</h2>
            {resultState.loading ? (
              <SkeletonBlock lines={4} />
            ) : !resultHasRequested ? (
              <StateMessage>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: '8px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><br/>
                Nhập từ khóa hoặc quét chọn Pinyin ở thanh tìm kiếm phía trên.
              </StateMessage>
            ) : resultState.items.length === 0 ? (
              <StateMessage error>
                {filterActive ? 'Không có từ vựng phù hợp với bộ lọc.' : `Không tìm thấy kết quả phù hợp cho "${searchKeyword}".`}
              </StateMessage>
            ) : (
              <WordList items={resultState.items} onSelectWord={handleSelectWord} />
            )}
            <Pagination
              page={resultState.page}
              totalPages={resultState.totalPages}
              onPageChange={filterActive ? loadFilter : loadSearch}
            />
          </article>
        </div>

        {/* Right Column: Filters & Recommended */}
        <div className="side-col">
          {/* Quick Study Action */}
          <article className="card study-dock-card fade-in">
            <div className="row between" style={{ marginBottom: '12px' }}>
              <div>
                <p className="section-eyebrow">Học nhanh</p>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Tiếp tục học từ vừa tra</h3>
              </div>
            </div>

            {recentSearches.length > 0 ? (
              <div className="recent-searches">
                {recentSearches.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="hero-chip recent-search-chip"
                    onClick={() => runRecentSearch(item.queryText)}
                  >
                    {item.queryText}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Tra vài từ để tạo lộ trình học ngay tại đây.</p>
            )}
          </article>


          {/* Filters */}
          <article className="card fade-in fade-in-delay-1">
            <div className="row between" style={{ marginBottom: 12 }}>
              <div>
                <p className="section-eyebrow">Bộ lọc</p>
                <h2 style={{ margin: 0 }}>HSK & loại từ</h2>
              </div>
              <button type="button" className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={resetFilter} disabled={!filterActive}>
                Xóa lọc
              </button>
            </div>

            <label className="section-eyebrow" htmlFor="dictionary-hsk-filter">Cấp HSK</label>
            <select
              id="dictionary-hsk-filter"
              className="hsk-select"
              value={filterForm.hskLevel}
              onChange={(e) => updateFilter({ ...filterForm, hskLevel: Number(e.target.value) })}
              style={{ width: '100%', margin: '8px 0 12px', padding: '10px' }}
            >
              {HSK_LEVELS.map((level) => (
                <option key={level} value={level}>HSK {level}</option>
              ))}
            </select>

            <div className="recent-searches">
              {WORD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={selectedWordTypes.has(type) ? 'hero-chip active' : 'hero-chip'}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </article>

          {/* Recommended */}
          <article className="card fade-in fade-in-delay-2">
            <div className="row between">
              <h2>Gợi ý cho bạn</h2>
              <button type="button" className="btn-ghost" style={{padding: '4px 8px', fontSize: 12}} onClick={() => loadRecommended(0)} disabled={!loggedIn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
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
