import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'
import { autoTranslate } from '../api'
import useVoiceInput from '../hooks/useVoiceInput'

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
  const [saving, setSaving] = useState(false)

  const langMap = {
    'Tiếng Trung': 'zh-CN',
    'Tiếng Việt': 'vi-VN',
    English: 'en-US',
  }
  const { listening, supported, startListening } = useVoiceInput(langMap[sourceLang] || 'zh-CN')

  function handleSwapLanguages() {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  async function handleAutoTranslate() {
    if (!sourceText.trim()) return
    setTranslating(true)
    setTranslatedText('')
    try {
      const result = await autoTranslate({
        text: sourceText.trim(),
        sourceLang,
        targetLang,
      })
      setTranslatedText(result)
    } catch (e) {
      setTranslatedText(`[Lỗi dịch: ${e.message}]`)
    }
    setTranslating(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!sourceText.trim() || !translatedText.trim() || !loggedIn) return
    setSaving(true)
    try {
      await translateText({
        sourceText: sourceText.trim(),
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        translatedText: translatedText.trim(),
      })
      setSourceText('')
      setTranslatedText('')
    } catch {
      /* error handled by context */
    }
    setSaving(false)
  }

  return (
    <div className="column">
      {/* Translate form */}
      <article className="card card-accent fade-in">
        <h2>Dịch văn bản</h2>

        <form onSubmit={handleSave}>
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
              <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={!supported || listening}
                  onClick={() => startListening({ onResult: setSourceText })}
                >
                  {listening ? 'Đang nghe...' : 'Giọng nói'}
                </button>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={`Nhập văn bản ${sourceLang}...`}
                disabled={translating || saving}
              />
            </div>
            <div className="translate-box">
              <label>Bản dịch ({targetLang})</label>
              <textarea
                value={translating ? 'Đang dịch...' : translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                placeholder={`Bản dịch sẽ hiển thị ở đây...`}
                disabled={translating || saving}
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn-primary btn-icon"
              disabled={translating || !sourceText.trim()}
              onClick={handleAutoTranslate}
              style={{ flex: 1 }}
            >
              {translating ? 'Đang dịch...' : 'Dịch'}
            </button>
            {loggedIn && (
              <button
                type="submit"
                className="btn-ghost btn-icon"
                disabled={saving || !sourceText.trim() || !translatedText.trim()}
                style={{ flex: 1 }}
              >
                {saving ? 'Đang lưu...' : 'Lưu bản dịch'}
              </button>
            )}
          </div>
        </form>
      </article>

      {/* Translation history */}
      <article className="card fade-in fade-in-delay-1">
        <div className="row between">
          <h2>Lịch sử dịch</h2>
          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => loadTranslations()}
            disabled={!loggedIn || translationLoading}
          >
            Làm mới
          </button>
        </div>

        {!loggedIn ? (
          <StateMessage>Đăng nhập để xem lịch sử dịch.</StateMessage>
        ) : translationLoading ? (
          <SkeletonBlock lines={4} />
        ) : translationItems.length === 0 ? (
          <StateMessage>
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
