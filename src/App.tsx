import { useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import { SimpleCustomerForm } from './pages/SimpleCustomerForm'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboard } from './pages/AdminDashboard'
import './App.css'

type Page = 'landing' | 'form' | 'admin-login' | 'admin-dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'))

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('adminToken', token)
    setAdminToken(token)
    setCurrentPage('admin-dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setCurrentPage('landing')
  }

  // Hide navbar on landing page
  const showNavbar = currentPage !== 'landing'

  return (
    <div className="app-container">
      {showNavbar && (
        <nav className="app-navbar">
          <div 
            className="navbar-brand"
            onClick={() => setCurrentPage('landing')}
            style={{ cursor: 'pointer' }}
          >
            KYC System
          </div>
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
              <button 
                className="nav-button active"
                onClick={() => setCurrentPage('admin-dashboard')}
              >
                Admin Dashboard
              </button>
            )}
          </div>
        </nav>
      )}

      <main className="app-main">
        {currentPage === 'landing' && <LandingPage onGetStarted={() => setCurrentPage('form')} />}
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
