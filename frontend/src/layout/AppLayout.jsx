import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'

const navItems = [
  { to: '/dictionary', label: 'Từ điển', icon: '📖' },
  { to: '/notebook', label: 'Sổ tay & Ôn tập', icon: '📓' },
  { to: '/grammar', label: 'Ngữ pháp', icon: '📐' },
  { to: '/translation', label: 'Dịch thuật', icon: '🌐' },
  { to: '/history', label: 'Lịch sử', icon: '🕑' },
  { to: '/account', label: 'Tài khoản', icon: '👤' },
]

export default function AppLayout() {
  const { loggedIn, user, notice, error } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">漢</span>
          <div>
            <h1>Hanzii</h1>
            <div className="brand-sub">Học tiếng Trung</div>
          </div>
        </div>

        <div className="sidebar-section-label">Menu chính</div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-footer">
          {loggedIn ? (
            <div className="user-pill">
              <div className="avatar">{(user?.username || 'U').charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user?.username}</div>
                <div className="user-role">{user?.role || 'User'}</div>
              </div>
            </div>
          ) : (
            <div className="guest-pill">🔒 Chế độ khách</div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div>
        {/* Topbar */}
        <header className="topbar">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <span className="topbar-title">Hanzii Learning System</span>
          <div className="topbar-actions">
            {loggedIn && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Xin chào, {user?.username}
              </span>
            )}
          </div>
        </header>

        {/* Notices */}
        <div className="main-content">
          {notice && <div className="notice ok">✅ {notice}</div>}
          {error && <div className="notice error">⚠️ {error}</div>}

          {/* Page content */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
