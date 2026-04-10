import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'

export default function SrsPage() {
  const { loggedIn, srsLoading, srsDueCards, srsActionLoading, loadSrsDueCards, handleSrsReview } = useAppContext()

  return (
    <div className="column">
      <article className="card card-accent fade-in">
        <div className="row between">
          <div>
            <p className="section-eyebrow">Ôn tập hôm nay</p>
            <h2><span className="card-icon">🧠</span> SRS – Thẻ cần ôn</h2>
          </div>
          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => loadSrsDueCards()}
            disabled={!loggedIn || srsLoading}
          >
            <span className="icon">🔄</span> Làm mới
          </button>
        </div>

        {!loggedIn ? (
          <StateMessage>
            <div className="empty-graphic">🔒</div>
            Đăng nhập để ôn tập thẻ SRS.
          </StateMessage>
        ) : srsLoading ? (
          <SkeletonBlock lines={5} />
        ) : srsDueCards.length === 0 ? (
          <StateMessage>
            <div className="empty-graphic">🎉</div>
            Tuyệt vời! Không có thẻ nào cần ôn tập lúc này.
          </StateMessage>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Có <strong style={{ color: 'var(--accent)' }}>{srsDueCards.length}</strong> thẻ cần ôn tập
            </p>
            <ul className="notebook-list">
              {srsDueCards.map((card) => (
                <li key={card.cardId} className="srs-item">
                  <div style={{ width: '100%' }}>
                    <div className="srs-word">{card.hanzi}</div>
                    <div className="muted" style={{ fontSize: 14 }}>{card.pinyin}</div>
                    <div style={{ margin: '6px 0', color: 'var(--text-secondary)' }}>{card.meaning}</div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      Lần ôn: {card.repetition} · Chu kỳ: {card.intervalDays} ngày
                    </div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      Hạn: {new Date(card.nextReviewAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="srs-actions">
                    <button
                      type="button"
                      className="btn-remember"
                      disabled={srsActionLoading.length > 0}
                      onClick={() => handleSrsReview(card, true)}
                    >
                      {srsActionLoading === `${card.cardId}-remember` ? 'Đang lưu...' : '✓ Nhớ'}
                    </button>
                    <button
                      type="button"
                      className="btn-forget"
                      disabled={srsActionLoading.length > 0}
                      onClick={() => handleSrsReview(card, false)}
                    >
                      {srsActionLoading === `${card.cardId}-forget` ? 'Đang lưu...' : '✗ Quên'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </div>
  )
}
