import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { SkeletonBlock, StateMessage } from '../components/AsyncState'

export default function NotebookPage() {
  const { loggedIn, notebookLoading, notebooks, createNotebookItem, loadNotebooks } = useAppContext()
  const [notebookTitle, setNotebookTitle] = useState('')

  async function onCreate(e) {
    e.preventDefault()
    await createNotebookItem(notebookTitle)
    setNotebookTitle('')
  }

  return (
    <div className="column">
      <article className="card fade-in">
        <div className="row between">
          <h2><span className="card-icon">📓</span> Sổ tay từ vựng</h2>
          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => loadNotebooks()}
            disabled={!loggedIn || notebookLoading}
          >
            <span className="icon">🔄</span> Tải lại
          </button>
        </div>

        {!loggedIn ? (
          <StateMessage>
            <div className="empty-graphic">🔒</div>
            Đăng nhập để quản lý sổ tay.
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
                <span className="icon">➕</span> Tạo mới
              </button>
            </form>

            {notebookLoading ? (
              <SkeletonBlock lines={3} />
            ) : notebooks.length === 0 ? (
              <StateMessage>
                <div className="empty-graphic">📭</div>
                Chưa có sổ tay nào. Tạo sổ tay đầu tiên ở trên!
              </StateMessage>
            ) : (
              <ul className="notebook-list">
                {notebooks.map((nb) => (
                  <li key={nb.id}>
                    <div>
                      <strong>{nb.title}</strong>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Tạo: {nb.createdAt ? new Date(nb.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </div>
                    </div>
                    <span className="count-badge">
                      {(nb.wordIds || []).length} từ
                    </span>
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
