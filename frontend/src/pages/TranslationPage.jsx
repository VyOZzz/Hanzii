import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'

export default function TranslationPage() {
  const {
    loggedIn,
    translationLoading,
    translationItems,
    loadTranslations,
    translateText,
  } = useAppContext()

  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('Tiếng Trung')
  const [targetLang, setTargetLang] = useState('Tiếng Việt')
  const [translating, setTranslating] = useState(false)

  function handleSwapLanguages() {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  async function handleTranslate(e) {
    e.preventDefault()
    if (!sourceText.trim() || !loggedIn) return
    setTranslating(true)
    try {
      const result = await translateText({
        sourceText: sourceText.trim(),
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        translatedText: translatedText.trim(),
      })
      if (result) {
        setTranslatedText(result.translatedText || translatedText)
      }
    } catch {
      /* error handled by context */
    }
    setTranslating(false)
  }

  return (
    <div className="column">
      {/* Translate form */}
      <article className="card card-accent fade-in">
        <h2><span className="card-icon">🌐</span> Dịch văn bản</h2>

        {!loggedIn ? (
          <StateMessage>
            <div className="empty-graphic">🔒</div>
            Đăng nhập để sử dụng tính năng dịch.
          </StateMessage>
        ) : (
          <form onSubmit={handleTranslate}>
            <div className="lang-select" style={{ marginBottom: 12 }}>
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                <option>Tiếng Trung</option>
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
              <button type="button" className="swap-btn btn-ghost" onClick={handleSwapLanguages}>⇄</button>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                <option>Tiếng Việt</option>
                <option>Tiếng Trung</option>
                <option>English</option>
              </select>
            </div>

            <div className="translate-grid">
              <div className="translate-box">
                <label>Văn bản gốc ({sourceLang})</label>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder={`Nhập văn bản ${sourceLang}...`}
                  disabled={translating}
                />
              </div>
              <div className="translate-box">
                <label>Bản dịch ({targetLang})</label>
                <textarea
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  placeholder={`Nhập bản dịch ${targetLang}...`}
                  disabled={translating}
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn-primary btn-icon" disabled={translating || !sourceText.trim()}>
                <span className="icon">💾</span> {translating ? 'Đang lưu...' : 'Lưu bản dịch'}
              </button>
            </div>
          </form>
        )}
      </article>

      {/* Translation history */}
      <article className="card fade-in fade-in-delay-1">
        <div className="row between">
          <h2><span className="card-icon">📋</span> Lịch sử dịch</h2>
          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => loadTranslations()}
            disabled={!loggedIn || translationLoading}
          >
            <span className="icon">🔄</span> Làm mới
          </button>
        </div>

        {!loggedIn ? (
          <StateMessage>Đăng nhập để xem lịch sử dịch.</StateMessage>
        ) : translationLoading ? (
          <SkeletonBlock lines={4} />
        ) : translationItems.length === 0 ? (
          <StateMessage>
            <div className="empty-graphic">📝</div>
            Chưa có bản dịch nào. Hãy dịch văn bản đầu tiên!
          </StateMessage>
        ) : (
          <ul className="notebook-list compact-list">
            {translationItems.map((item) => (
              <li key={item.id}>
                <div style={{ width: '100%' }}>
                  <div className="row between">
                    <strong style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                      {item.sourceLanguage} → {item.targetLanguage}
                    </strong>
                    <span className="muted" style={{ fontSize: 11 }}>
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div style={{ margin: '6px 0', fontFamily: 'var(--font-chinese)' }}>{item.sourceText}</div>
                  <div className="muted">{item.translatedText}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  )
}
