import { useState } from 'react'
import { SimpleCustomerForm } from './pages/SimpleCustomerForm'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboard } from './pages/AdminDashboard'
import './App.css'

type Page = 'form' | 'admin-login' | 'admin-dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('form')
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'))

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('adminToken', token)
    setAdminToken(token)
    setCurrentPage('admin-dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setCurrentPage('form')
  }

  return (
    <div className="app-container">
      <nav className="app-navbar">
        <div className="navbar-brand">KYC System</div>
        <div className="navbar-links">
          <button
            className={`nav-button ${currentPage === 'form' ? 'active' : ''}`}
            onClick={() => {
              setCurrentPage('form')
              setAdminToken(null)
              localStorage.removeItem('adminToken')
            }}
          >
            Customer Form
          </button>
          {!adminToken ? (
            <button
              className={`nav-button ${currentPage === 'admin-login' ? 'active' : ''}`}
              onClick={() => setCurrentPage('admin-login')}
            >
              Admin Login
            </button>
          ) : (
            <button className="nav-button active">Admin Logged In</button>
          )}
        </div>
      </nav>

      <main className="app-main">
        {currentPage === 'form' && <SimpleCustomerForm />}
        {currentPage === 'admin-login' && !adminToken && (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
        )}
        {currentPage === 'admin-dashboard' && adminToken && (
          <AdminDashboard token={adminToken} onLogout={handleLogout} />
        )}
      </main>
    </div>
  )
}

export default App
