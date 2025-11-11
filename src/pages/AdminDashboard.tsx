import { useState, useEffect } from 'react'
import '../styles/AdminDashboard.css'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  address: string
  city: string
  createdAt?: string
}

interface AdminDashboardProps {
  readonly token: string
  readonly onLogout: () => void
}

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5000/api/kyc/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      // Extract submissions from nested API response
      const submissions = data?.data?.submissions || []
      
      // Transform submissions to customer format (flatten nested data)
      const customers: Customer[] = submissions.map((submission: any) => ({
        id: submission.id,
        firstName: submission.data?.firstName || '',
        lastName: submission.data?.lastName || '',
        email: submission.data?.email || '',
        phone: submission.data?.phone || '',
        dateOfBirth: submission.data?.dateOfBirth || '',
        nationality: submission.data?.nationality || '',
        address: submission.data?.address || '',
        city: submission.data?.city || '',
        createdAt: submission.createdAt,
      }))
      
      setCustomers(customers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async (customer: Customer) => {
    try {
      setDownloadingId(customer.id)

      const response = await fetch(
        `http://localhost:5000/api/kyc/export/${customer.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `customer-${customer.firstName}-${customer.lastName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error downloading PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Admin Dashboard</h1>
          <p>Manage Customer KYC Data</p>
        </div>
        <button className="logout-button" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-banner">{error}</div>}

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <p>📭 No customers registered yet</p>
            <small>Customer data will appear here as submissions are made</small>
          </div>
        ) : (
          <>
            <div className="customers-count">
              Total Customers: <strong>{customers.length}</strong>
            </div>

            <div className="customers-grid">
              {customers.map((customer) => (
                <div key={customer.id} className="customer-card">
                  <div className="card-header">
                    <div className="customer-name">
                      <h3>
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <span className="customer-id">ID: {customer.id.substring(0, 8)}</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">📧 Email:</span>
                      <span className="value">{customer.email}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">📞 Phone:</span>
                      <span className="value">{customer.phone}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">🎂 DOB:</span>
                      <span className="value">{customer.dateOfBirth}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">🌍 Nationality:</span>
                      <span className="value">{customer.nationality}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">📍 Address:</span>
                      <span className="value">{customer.address}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">🏙️ City:</span>
                      <span className="value">{customer.city}</span>
                    </div>

                    {customer.createdAt && (
                      <div className="info-row">
                        <span className="label">📅 Registered:</span>
                        <span className="value">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <button
                      className="pdf-button"
                      onClick={() => handleDownloadPDF(customer)}
                      disabled={downloadingId === customer.id}
                    >
                      {downloadingId === customer.id ? (
                        <>⏳ Generating...</>
                      ) : (
                        <>📥 Download PDF</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
