import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'

const navItems = [
  { to: '/dictionary', label: 'Từ điển', icon: '🔍' },
  { to: '/notebook', label: 'Sổ tay & Ôn tập', icon: '📓' },
  { to: '/grammar', label: 'Ngữ pháp', icon: '📐' },
  { to: '/translation', label: 'Dịch thuật', icon: '🌐' },
  { to: '/history', label: 'Lịch sử', icon: '🕑' },
]

export default function AppLayout() {
  const { loggedIn, user, notice, error, logout } = useAppContext()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  function handleGoAccount() {
    navigate('/account')
    setDrawerOpen(false)
  }

  return (
    <div className="app-shell">
      {/* ── Top Navigation ── */}
      <nav className="topnav">
        {/* Mobile toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Brand */}
        <NavLink to="/dictionary" className="nav-brand">
          <div className="nav-brand-icon">漢</div>
          <div className="nav-brand-text">
            <span className="brand-name">Hanzii</span>
            <span className="brand-sub">Học tiếng Trung</span>
          </div>
        </NavLink>

        {/* Center nav links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right area */}
        <div className="nav-right">
          {loggedIn ? (
            <>
              <div className="nav-user-avatar" title={user?.username}>
                {(user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="nav-username">{user?.username}</span>
              <button className="btn-ghost nav-btn-register" onClick={handleGoAccount}>
                Tài khoản
              </button>
              <button className="btn-ghost nav-btn-register" onClick={logout} style={{ color: 'var(--text-muted)' }}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost nav-btn-register" onClick={() => navigate('/account')}>
                Đăng ký
              </button>
              <button className="btn-primary nav-btn-login" onClick={() => navigate('/account')}>
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile Overlay + Drawer ── */}
      <div
        className={`mobile-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <NavLink to="/dictionary" className="nav-brand" style={{ marginBottom: 12 }} onClick={() => setDrawerOpen(false)}>
          <div className="nav-brand-icon">漢</div>
          <div className="nav-brand-text">
            <span className="brand-name">Hanzii</span>
            <span className="brand-sub">Học tiếng Trung</span>
          </div>
        </NavLink>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setDrawerOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', display: 'grid', gap: 8 }}>
          {loggedIn ? (
            <>
              <button className="btn-ghost" onClick={() => { handleGoAccount() }}>👤 Tài khoản</button>
              <button className="btn-ghost" onClick={() => { logout(); setDrawerOpen(false) }}>Đăng xuất</button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => { navigate('/account'); setDrawerOpen(false) }}>Đăng nhập</button>
            </>
          )}
        </div>
      </div>

      {/* ── Page Content ── */}
      <main className="main-content">
        {notice && <div className="notice ok">✅ {notice}</div>}
        {error && <div className="notice error">⚠️ {error}</div>}
        <Outlet />
      </main>
    </div>
  )
}
