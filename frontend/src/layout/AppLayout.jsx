import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import AITutorWidget from '../components/AITutorWidget'

const navItems = [
  { to: '/dictionary', label: 'Từ điển' },
  { to: '/notebook', label: 'Sổ tay & Ôn tập' },
  { to: '/grammar', label: 'Ngữ pháp' },
  { to: '/translation', label: 'Dịch thuật' },
  { to: '/history', label: 'Lịch sử' },
  { to: '/account', label: 'Tài khoản' },
]

export default function AppLayout() {
  const { loggedIn, user, notice, error } = useAppContext()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      {/* Topbar */}
      <header className="topbar">
        <NavLink to="/dictionary" className="topbar-brand">
          <span className="brand-icon">漢</span>
          <h1>Hanzii</h1>
        </NavLink>

        {/* Desktop Menu */}
        <nav className="topbar-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          {loggedIn ? (
            <div className="user-pill">
              <div className="avatar">{(user?.username || 'U').charAt(0).toUpperCase()}</div>
              <div className="user-name">{user?.username}</div>
            </div>
          ) : (
            <div className="guest-pill">Chế độ khách</div>
          )}
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {notice && <div className="notice ok">{notice}</div>}
        {error && <div className="notice error">{error}</div>}

        <Outlet />
        
        {/* Floating AI Tutor Widget */}
        <AITutorWidget />
      </main>
    </div>
  )
}
