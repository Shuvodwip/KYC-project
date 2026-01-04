import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div className="text-white space-y-6 hidden lg:block">
          <div className="inline-block px-4 py-2 bg-cyan-500/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-cyan-400/30">
            Operations suite
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            Admin dashboard with full audit control
          </h2>
          <p className="text-xl text-cyan-100">
            Review submissions, trigger AI summaries and export compliance-ready PDFs from one place.
            Built for analysts, secured for auditors.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <strong className="text-3xl font-bold block mb-1">1.3k</strong>
              <span className="text-cyan-200">Approvals this quarter</span>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <strong className="text-3xl font-bold block mb-1">4.8/5</strong>
              <span className="text-cyan-200">Ops team satisfaction</span>
            </div>
          </div>
          <ul className="space-y-3 pt-4">
            <li className="flex items-center gap-3 text-lg">
              <span className="text-emerald-400">✓</span> Realtime queue overview
            </li>
            <li className="flex items-center gap-3 text-lg">
              <span className="text-emerald-400">✓</span> Regulator-friendly audit logs
            </li>
            <li className="flex items-center gap-3 text-lg">
              <span className="text-emerald-400">✓</span> Deeplinks into customer PDFs
            </li>
          </ul>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
            <p className="text-slate-600">Secure Access to Customer Dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@kyc.com"
                {...register('email')}
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="text-red-600 text-sm font-semibold mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.password ? 'border-red-500' : 'border-slate-300'
                  }`}
                disabled={isLoading}
              />
              {errors.password && (
                <span className="text-red-600 text-sm font-semibold mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Logging in...' : '🔓 Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              {showDemoCredentials ? '✕ Hide Demo Credentials' : '📝 Show Demo Credentials'}
            </button>

            {showDemoCredentials && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 animate-slide-up">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">Email:</span>
                  <span className="font-mono text-cyan-600">admin@kyc.com</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">Password:</span>
                  <span className="font-mono text-cyan-600">admin123</span>
                </div>
                <p className="text-xs text-slate-600 pt-2">
                  💡 Use these credentials to access the admin dashboard and view all registered customers.
                </p>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Admin Features:</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> View all registered customers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Download customer data as PDF
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Structured customer information
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Secure logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
