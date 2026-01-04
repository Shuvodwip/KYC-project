import { useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import { SimpleCustomerForm } from './pages/SimpleCustomerForm'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboard } from './pages/AdminDashboard'

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

  return (
    <div className="min-h-screen w-full">
      <main className="w-full">
        {currentPage === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentPage('form')}
            onAdminLogin={() => setCurrentPage('admin-login')}
          />
        )}
        {currentPage === 'form' && <SimpleCustomerForm onNavigateToLanding={() => setCurrentPage('landing')} />}
        {currentPage === 'admin-login' && (
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
