import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import '../styles/AdminLoginPage.css'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface AdminLoginPageProps {
  onLoginSuccess: (token: string) => void
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const { token } = await response.json()
      onLoginSuccess(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Admin Portal</h1>
          <p>Secure Access to Customer Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {error && <div className="error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@kyc.com"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Logging in...' : '🔓 Login'}
          </button>
        </form>

        <div className="demo-section">
          <button
            type="button"
            className="demo-toggle"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
          >
            {showDemoCredentials ? '✕ Hide Demo Credentials' : '📝 Show Demo Credentials'}
          </button>

          {showDemoCredentials && (
            <div className="demo-credentials">
              <div className="credential-item">
                <span className="label">Email:</span>
                <span className="value">admin@kyc.com</span>
              </div>
              <div className="credential-item">
                <span className="label">Password:</span>
                <span className="value">admin123</span>
              </div>
              <p className="demo-note">
                💡 Use these credentials to access the admin dashboard and view all registered customers.
              </p>
            </div>
          )}
        </div>

        <div className="features-list">
          <h3>Admin Features:</h3>
          <ul>
            <li>✓ View all registered customers</li>
            <li>✓ Download customer data as PDF</li>
            <li>✓ Structured customer information</li>
            <li>✓ Secure logout</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
