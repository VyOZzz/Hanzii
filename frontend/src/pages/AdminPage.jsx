import { useEffect, useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { blockUser, deleteUser, getAiConfig, getAiStats, getAllUsers, updateAiConfig, classifyMissingHsk } from '../api'

export default function AdminPage() {
  const { token, user, setError, setNotice } = useAppContext()
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [config, setConfig] = useState({ apiKey: '', apiKeyMasked: '', model: '', systemPrompt: '', isActive: true })
  const [classifyLoading, setClassifyLoading] = useState(false)

  const isAdmin = String(user?.role || '') === 'ADMIN'

  useEffect(() => {
    if (!isAdmin) return
    loadUsers()
    loadStats()
    loadConfig()
  }, [isAdmin])

  async function loadUsers() {
    try {
      setUsers(await getAllUsers(token))
    } catch (e) {
      setError(e.message)
    }
  }

  async function loadStats() {
    try {
      setStats(await getAiStats(token))
    } catch (e) {
      setError(e.message)
    }
  }

  async function loadConfig() {
    try {
      const data = await getAiConfig(token)
      setConfig({
        apiKey: '',
        apiKeyMasked: data.apiKeyMasked || '',
        model: data.model || '',
        systemPrompt: data.systemPrompt || '',
        isActive: Boolean(data.isActive),
      })
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleBlock(u) {
    try {
      await blockUser({ userId: u.id, blocked: !u.blocked, token })
      setNotice('Đã cập nhật trạng thái user')
      await loadUsers()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Xóa người dùng ${u.username}?`)) return
    try {
      await deleteUser({ userId: u.id, token })
      setNotice('Đã xóa user')
      await loadUsers()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleSaveConfig(e) {
    e.preventDefault()
    try {
      const payload = {
        model: config.model,
        systemPrompt: config.systemPrompt,
        isActive: config.isActive,
        token,
      }

      if (config.apiKey.trim()) {
        payload.apiKey = config.apiKey.trim()
      }

      await updateAiConfig(payload)
      setNotice('Đã cập nhật AI config')
      await loadConfig()
    } catch (e2) {
      setError(e2.message)
    }
  }

  if (!isAdmin) {
    return <article className="card fade-in"><h2>Admin</h2><p>Bạn không có quyền truy cập.</p></article>
  }

  return (
    <div className="column">
      <article className="card fade-in">
        <h2>Admin Panel</h2>
        <div className="tabs" style={{ marginBottom: 12 }}>
          <button type="button" className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users</button>
          <button type="button" className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>AI Usage</button>
          <button type="button" className={tab === 'config' ? 'active' : ''} onClick={() => setTab('config')}>AI Config</button>
        </div>

        {tab === 'users' && (
          <div className="stack">
            {users.map((u) => (
              <div key={u.id} className="row between" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}>
                <div>
                  <strong>{u.username}</strong> ({u.role})
                  <div className="muted">{u.email} · {u.blocked ? 'Blocked' : 'Active'}</div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <button type="button" className="btn-ghost" onClick={() => handleBlock(u)}>{u.blocked ? 'Unblock' : 'Block'}</button>
                  <button type="button" className="btn-ghost" onClick={() => handleDelete(u)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'stats' && (
          <div className="stack">
            <p>Tổng lượt gọi AI: <strong>{stats?.totalCalls || 0}</strong></p>
            <p>Top user dùng AI nhiều nhất:</p>
            <ul>
              {(stats?.topUsers || []).map((i) => <li key={i.username}>{i.username}: {i.calls}</li>)}
            </ul>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div>
              <p style={{ marginBottom: 8, fontWeight: 500 }}>Công cụ Admin</p>
              <button
                type="button"
                className="btn-primary"
                disabled={classifyLoading}
                onClick={async () => {
                  if (!window.confirm('Chạy AI để tự động phân loại HSK cho các từ còn thiếu? Có thể mất vài phút.')) return
                  setClassifyLoading(true)
                  try {
                    await classifyMissingHsk(token)
                    setNotice('Đã kích hoạt phân loại HSK bằng AI! Hệ thống đang xử lý ngầm.')
                  } catch (e) {
                    setError(e.message)
                  } finally {
                    setClassifyLoading(false)
                  }
                }}
              >
                {classifyLoading ? '⏳ Đang xử lý...' : '🤖 Phân loại HSK bằng AI'}
              </button>
            </div>
          </div>
        )}

        {tab === 'config' && (
          <form className="stack" onSubmit={handleSaveConfig}>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig((p) => ({ ...p, apiKey: e.target.value }))}
              placeholder={config.apiKeyMasked ? `API Key hiện tại: ${config.apiKeyMasked}` : 'Nhập API Key mới'}
              autoComplete="off"
            />
            <input value={config.model} onChange={(e) => setConfig((p) => ({ ...p, model: e.target.value }))} placeholder="Model" />
            <textarea value={config.systemPrompt} onChange={(e) => setConfig((p) => ({ ...p, systemPrompt: e.target.value }))} placeholder="System prompt" rows={5} />
            <label className="inline-check">
              <input type="checkbox" checked={config.isActive} onChange={(e) => setConfig((p) => ({ ...p, isActive: e.target.checked }))} />
              Active
            </label>
            <button type="submit" className="btn-primary">Lưu config</button>
          </form>
        )}
      </article>
    </div>
  )
}
