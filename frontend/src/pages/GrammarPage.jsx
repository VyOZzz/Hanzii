import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'
import { convertPinyin } from '../utils/pinyin'

export default function GrammarPage() {
  const {
    grammarLoading,
    grammarPoints,
    selectedGrammarId,
    setSelectedGrammarId,
    grammarDetail,
    grammarExamples,
    loadGrammarPoints,
    loadGrammarDetail,
  } = useAppContext()

  return (
    <div className="column">
      <article className="card fade-in">
        <div className="row between">
          <h2>Ngữ pháp tiếng Trung</h2>
          <button type="button" className="btn-ghost btn-icon" onClick={loadGrammarPoints} disabled={grammarLoading}>
            Làm mới
          </button>
        </div>

        {grammarLoading ? (
          <SkeletonBlock lines={4} />
        ) : grammarPoints.length === 0 ? (
          <StateMessage>
            <div className="empty-graphic"></div>
            Chưa có điểm ngữ pháp nào.
          </StateMessage>
        ) : (
          <>
            <select
              value={selectedGrammarId}
              onChange={async (e) => {
                const nextId = e.target.value
                setSelectedGrammarId(nextId)
                await loadGrammarDetail(nextId)
              }}
            >
              {grammarPoints.map((point) => (
                <option key={point.id} value={point.id}>
                  HSK {point.hskLevel} — {point.title}
                </option>
              ))}
            </select>

            {grammarDetail && (
              <div className="simple-detail">
                <p><strong>Tiêu đề:</strong> {grammarDetail.title}</p>
                <p><strong>Cấu trúc:</strong> <span style={{ fontFamily: 'var(--font-chinese)', fontSize: 16 }}>{grammarDetail.structure}</span></p>
                <p><strong>Giải thích:</strong> {grammarDetail.explanation}</p>
                <p><strong>HSK Level:</strong> {grammarDetail.hskLevel}</p>
              </div>
            )}

            <h3 className="subheading">Ví dụ</h3>
            {grammarExamples.length === 0 ? (
              <StateMessage>Chưa có ví dụ cho điểm ngữ pháp này.</StateMessage>
            ) : (
              <ul className="notebook-list compact-list">
                {grammarExamples.map((example) => (
                  <li key={example.id}>
                    <div>
                      <strong style={{ fontFamily: 'var(--font-chinese)', fontSize: 16 }}>{example.content}</strong>
                      <div className="muted">{convertPinyin(example.pinyin)}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{example.meaning}</div>
                    </div>
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
