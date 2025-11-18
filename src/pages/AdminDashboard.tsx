import { useState, useEffect, useMemo } from 'react'
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
  summary?: string
  createdAt?: string
  status?: 'approved' | 'rejected' | 'pending'
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
  const [approvalProcessing, setApprovalProcessing] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [emailingId, setEmailingId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const total = customers.length
    const approved = customers.filter((c) => c.status === 'approved').length
    const pending = customers.filter((c) => c.status === 'pending').length
    const rejected = customers.filter((c) => c.status === 'rejected').length
    return {
      total,
      approved,
      pending,
      rejected,
      approvalRate: total ? Math.round((approved / total) * 100) : 0,
    }
  }, [customers])

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
        summary: submission.summary || undefined,
        createdAt: submission.createdAt,
        status: submission.status || 'pending',
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

  const handleEmailPDF = async (customer: Customer) => {
    try {
      setEmailingId(customer.id)

      const response = await fetch(
        `http://localhost:5000/api/kyc/export/${customer.id}/email`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to email PDF')
      }

      alert('📧 PDF email has been queued for the customer.')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error emailing PDF')
    } finally {
      setEmailingId(null)
    }
  }

  const handleApprove = async (customer: Customer) => {
    try {
      setApprovalProcessing(customer.id)

      const response = await fetch(
        `http://localhost:5000/api/kyc/approve/${customer.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'approved' }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to approve customer')
      }

      // Update local state
      setCustomers(customers.map(c => 
        c.id === customer.id ? { ...c, status: 'approved' } : c
      ))

      alert('✅ Customer approved successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error approving customer')
    } finally {
      setApprovalProcessing(null)
    }
  }

  const handleReject = async (customer: Customer) => {
    try {
      setApprovalProcessing(customer.id)

      const response = await fetch(
        `http://localhost:5000/api/kyc/reject/${customer.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'rejected' }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to reject customer')
      }

      // Now delete the customer after rejection
      setDeletingId(customer.id)
      const deleteResponse = await fetch(
        `http://localhost:5000/api/kyc/delete/${customer.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete customer')
      }

      // Remove from local state
      setCustomers(customers.filter(c => c.id !== customer.id))

      alert('❌ Customer rejected and deleted successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error rejecting customer')
    } finally {
      setApprovalProcessing(null)
      setDeletingId(null)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <p className="eyebrow">Live supervision</p>
          <h1>Customer Command Center</h1>
          <p>Monitor submissions, trigger approvals and keep auditors confident.</p>
        </div>
        <div className="header-actions">
          <button className="outline-button" onClick={fetchCustomers}>
            ↻ Refresh data
          </button>
          <button className="logout-button" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
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
            <div className="insight-cards">
              <div className="insight-card primary">
                <p>Total submissions</p>
                <strong>{stats.total}</strong>
                <span>+18% vs last week</span>
              </div>
              <div className="insight-card success">
                <p>Approval rate</p>
                <strong>{stats.approvalRate}%</strong>
                <span>{stats.approved} approved</span>
              </div>
              <div className="insight-card warning">
                <p>Pending reviews</p>
                <strong>{stats.pending}</strong>
                <span>Action required</span>
              </div>
              <div className="insight-card neutral">
                <p>Rejections</p>
                <strong>{stats.rejected}</strong>
                <span>Auto cleanup enabled</span>
              </div>
            </div>

            <div className="customers-count">
              Queue overview <strong>{customers.length} records</strong>
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

                  {customer.summary && (
                    <div className="summary-banner">
                      <span className="summary-label">🤖 AI Summary:</span>
                      <p className="summary-text">{customer.summary}</p>
                    </div>
                  )}

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

                    {customer.status && (
                      <div className="info-row">
                        <span className="label">✅ Status:</span>
                        <span className={`status-badge status-${customer.status}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    {customer.status === 'approved' ? (
                      <div className="action-buttons">
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
                        <button
                          className="email-button"
                          onClick={() => handleEmailPDF(customer)}
                          disabled={emailingId === customer.id}
                        >
                          {emailingId === customer.id ? '📨 Sending…' : '📧 Email PDF'}
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          className="approve-button"
                          onClick={() => handleApprove(customer)}
                          disabled={approvalProcessing === customer.id}
                        >
                          {approvalProcessing === customer.id ? '⏳ Processing...' : '✅ Approve'}
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => handleReject(customer)}
                          disabled={approvalProcessing === customer.id || deletingId === customer.id}
                        >
                          {approvalProcessing === customer.id || deletingId === customer.id ? '⏳ Processing...' : '❌ Reject'}
                        </button>
                      </div>
                    )}
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
