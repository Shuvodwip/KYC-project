import { useState, useEffect, useMemo } from 'react'

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
      const submissions = data?.data?.submissions || []

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

      if (!response.ok) throw new Error('Failed to download PDF')

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

      if (!response.ok) throw new Error('Failed to approve customer')

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

      if (!response.ok) throw new Error('Failed to reject customer')

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

      if (!deleteResponse.ok) throw new Error('Failed to delete customer')

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wide">
                Live supervision
              </p>
              <h1 className="text-3xl font-bold text-slate-900">Customer Command Center</h1>
              <p className="text-slate-600">Monitor submissions, trigger approvals and keep auditors confident.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchCustomers}
                className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:border-cyan-500 transition-all"
              >
                ↻ Refresh data
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 font-semibold">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-medium">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-600 text-xl mb-2">📭 No customers registered yet</p>
            <small className="text-slate-500">Customer data will appear here as submissions are made</small>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg text-white">
                <p className="text-cyan-100 text-sm mb-1">Total submissions</p>
                <strong className="text-4xl font-bold block mb-1">{stats.total}</strong>
                <span className="text-cyan-100 text-sm">+18% vs last week</span>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-emerald-200">
                <p className="text-slate-600 text-sm mb-1">Approval rate</p>
                <strong className="text-4xl font-bold text-emerald-600 block mb-1">{stats.approvalRate}%</strong>
                <span className="text-slate-600 text-sm">{stats.approved} approved</span>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-amber-200">
                <p className="text-slate-600 text-sm mb-1">Pending reviews</p>
                <strong className="text-4xl font-bold text-amber-600 block mb-1">{stats.pending}</strong>
                <span className="text-slate-600 text-sm">Action required</span>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
                <p className="text-slate-600 text-sm mb-1">Rejections</p>
                <strong className="text-4xl font-bold text-slate-600 block mb-1">{stats.rejected}</strong>
                <span className="text-slate-600 text-sm">Auto cleanup enabled</span>
              </div>
            </div>

            <div className="mb-4 text-slate-600">
              Queue overview <strong className="text-slate-900">{customers.length} records</strong>
            </div>

            {/* Customer Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-cyan-50 border-b border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <span className="text-sm text-slate-600 font-mono">ID: {customer.id.substring(0, 8)}</span>
                  </div>

                  {customer.summary && (
                    <div className="px-6 py-4 bg-cyan-50 border-b border-cyan-100">
                      <span className="text-cyan-700 font-semibold text-sm block mb-1">🤖 AI Summary:</span>
                      <p className="text-slate-700">{customer.summary}</p>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">📧 Email:</span>
                      <span className="text-slate-900 font-semibold">{customer.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">📞 Phone:</span>
                      <span className="text-slate-900 font-semibold">{customer.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">🎂 DOB:</span>
                      <span className="text-slate-900 font-semibold">{customer.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">🌍 Nationality:</span>
                      <span className="text-slate-900 font-semibold">{customer.nationality}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">📍 Address:</span>
                      <span className="text-slate-900 font-semibold">{customer.address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">🏙️ City:</span>
                      <span className="text-slate-900 font-semibold">{customer.city}</span>
                    </div>
                    {customer.createdAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">📅 Registered:</span>
                        <span className="text-slate-900 font-semibold">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {customer.status && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">✅ Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${customer.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            customer.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                    {customer.status === 'approved' ? (
                      <>
                        <button
                          onClick={() => handleDownloadPDF(customer)}
                          disabled={downloadingId === customer.id}
                          className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-all"
                        >
                          {downloadingId === customer.id ? '⏳ Generating...' : '📥 Download PDF'}
                        </button>
                        <button
                          onClick={() => handleEmailPDF(customer)}
                          disabled={emailingId === customer.id}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-all"
                        >
                          {emailingId === customer.id ? '📨 Sending…' : '📧 Email PDF'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(customer)}
                          disabled={approvalProcessing === customer.id}
                          className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-all"
                        >
                          {approvalProcessing === customer.id ? '⏳ Processing...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(customer)}
                          disabled={approvalProcessing === customer.id || deletingId === customer.id}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition-all"
                        >
                          {approvalProcessing === customer.id || deletingId === customer.id ? '⏳ Processing...' : '❌ Reject'}
                        </button>
                      </>
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
