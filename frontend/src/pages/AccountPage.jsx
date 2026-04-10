import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'

export default function AccountPage() {
  const { loggedIn, user, authenticate, logout, changePassword, setError } = useAppContext()

  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authValidation, setAuthValidation] = useState({})
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Change password state
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNew: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwValidation, setPwValidation] = useState({})

  async function handleSubmit(event) {
    event.preventDefault()
    setAuthValidation({})

    const username = authForm.username.trim()
    const password = authForm.password
    const email = authForm.email.trim()
    const validationErrors = {}

    if (!username) validationErrors.username = 'Vui lòng nhập tên đăng nhập'
    if (!password || password.length < 6) validationErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    if (authMode === 'register') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email) validationErrors.email = 'Vui lòng nhập email'
      else if (!emailRegex.test(email)) validationErrors.email = 'Email không hợp lệ'
      if (!confirmPassword) validationErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      else if (password !== confirmPassword) validationErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (Object.keys(validationErrors).length > 0) {
      setAuthValidation(validationErrors)
      return
    }

    setAuthLoading(true)
    const ok = await authenticate({ mode: authMode, username, email, password, remember: rememberMe })
    if (ok) {
      setAuthForm({ username: '', email: '', password: '' })
      setConfirmPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
    setAuthLoading(false)
  }

  async function handleChangePassword(event) {
    event.preventDefault()
    setPwValidation({})

    const errs = {}
    if (!pwForm.oldPassword) errs.oldPassword = 'Vui lòng nhập mật khẩu cũ'
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) errs.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    if (pwForm.newPassword !== pwForm.confirmNew) errs.confirmNew = 'Mật khẩu xác nhận không khớp'

    if (Object.keys(errs).length > 0) {
      setPwValidation(errs)
      return
    }

    setPwLoading(true)
    try {
      await changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword })
      setPwForm({ oldPassword: '', newPassword: '', confirmNew: '' })
    } catch (e) {
      if (setError) setError(e.message || 'Đổi mật khẩu thất bại')
    }
    setPwLoading(false)
  }

  return (
    <div className="column">
      <article className="card fade-in">
        <div className="row between">
          <h2><span className="card-icon">👤</span> Tài khoản</h2>
          {loggedIn && (
            <button type="button" className="btn-ghost btn-icon" onClick={logout}>
              <span className="icon">🚪</span> Đăng xuất
            </button>
          )}
        </div>

        {!loggedIn ? (
          <>
            <div className="tabs">
              <button
                type="button"
                className={authMode === 'login' ? 'active' : ''}
                onClick={() => setAuthMode('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'active' : ''}
                onClick={() => setAuthMode('register')}
              >
                Đăng ký
              </button>
            </div>

            <form className="stack" onSubmit={handleSubmit}>
              <div>
                <input
                  placeholder="Tên đăng nhập"
                  value={authForm.username}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))}
                  disabled={authLoading}
                  required
                />
                {authValidation.username && <p className="validation-msg">{authValidation.username}</p>}
              </div>

              {authMode === 'register' && (
                <div>
                  <input
                    placeholder="Email"
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={authLoading}
                    required
                  />
                  {authValidation.email && <p className="validation-msg">{authValidation.email}</p>}
                </div>
              )}

              <div>
                <input
                  placeholder="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  value={authForm.password}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                  disabled={authLoading}
                  required
                />
                {authValidation.password && <p className="validation-msg">{authValidation.password}</p>}
              </div>

              {authMode === 'register' && (
                <div>
                  <input
                    placeholder="Xác nhận mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={authLoading}
                    required
                  />
                  {authValidation.confirmPassword && <p className="validation-msg">{authValidation.confirmPassword}</p>}
                </div>
              )}

              <div className="row">
                <label className="inline-check">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    disabled={authLoading}
                  />
                  Hiển thị mật khẩu
                </label>
                <label className="inline-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={authLoading}
                  />
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={authLoading}>
                {authLoading ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </form>
          </>
        ) : (
          <div className="stack">
            <div className="user-box">
              <strong>{user?.username}</strong>
              <span>📧 {user?.email}</span>
              <span>🏷️ Vai trò: {user?.role || 'USER'}</span>
            </div>

            {/* Change password */}
            <div className="change-pw-section">
              <h3>🔑 Đổi mật khẩu</h3>
              <form className="stack" onSubmit={handleChangePassword}>
                <div>
                  <input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    value={pwForm.oldPassword}
                    onChange={(e) => setPwForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
                    disabled={pwLoading}
                    required
                  />
                  {pwValidation.oldPassword && <p className="validation-msg">{pwValidation.oldPassword}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    disabled={pwLoading}
                    required
                  />
                  {pwValidation.newPassword && <p className="validation-msg">{pwValidation.newPassword}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={pwForm.confirmNew}
                    onChange={(e) => setPwForm((prev) => ({ ...prev, confirmNew: e.target.value }))}
                    disabled={pwLoading}
                    required
                  />
                  {pwValidation.confirmNew && <p className="validation-msg">{pwValidation.confirmNew}</p>}
                </div>
                <button type="submit" className="btn-primary" disabled={pwLoading}>
                  {pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
