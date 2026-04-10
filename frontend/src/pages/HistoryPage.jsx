import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'

export default function HistoryPage() {
  const { loggedIn, historyLoading, historyItems, loadSearchHistory } = useAppContext()

  return (
    <div className="column">
      <article className="card fade-in">
        <div className="row between">
          <h2><span className="card-icon">🕑</span> Lịch sử tra cứu</h2>
          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => loadSearchHistory()}
            disabled={!loggedIn || historyLoading}
          >
            <span className="icon">🔄</span> Làm mới
          </button>
        </div>

        {!loggedIn ? (
          <StateMessage>
            <div className="empty-graphic">🔒</div>
            Đăng nhập để xem lịch sử tra cứu.
          </StateMessage>
        ) : historyLoading ? (
          <SkeletonBlock lines={4} />
        ) : historyItems.length === 0 ? (
          <StateMessage>
            <div className="empty-graphic">🔍</div>
            Chưa có lịch sử tra cứu. Hãy tra từ để bắt đầu!
          </StateMessage>
        ) : (
          <ul className="notebook-list" style={{ gap: 0 }}>
            {historyItems.map((item) => (
              <li key={item.id} className="timeline-item" style={{ border: 'none', background: 'transparent', padding: '10px 16px 10px 28px' }}>
                <div>
                  <strong style={{ fontFamily: 'var(--font-chinese)', fontSize: 16 }}>{item.queryText}</strong>
                  <div className="muted" style={{ fontSize: 11 }}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  )
}
