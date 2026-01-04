interface LandingPageProps {
  readonly onGetStarted: () => void
  readonly onAdminLogin: () => void
}

const heroStats = [
  { label: 'Avg. Verification Time', value: '< 5 minutes' },
  { label: 'AI Confidence Score', value: '99.1%' },
  { label: 'Global Customers', value: '12k+' },
]

const trustBadges = ['FCA', 'MAS', 'FINTRAC', 'HKMA']

export function LandingPage({ onGetStarted, onAdminLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                K
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">KYC Command Center</p>
                <small className="text-xs text-slate-600">Powered by SELISE</small>
              </div>
            </div>

            {/* Nav Actions */}
            <nav className="flex items-center gap-3">
              <button
                onClick={onAdminLogin}
                className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Admin Portal
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Start Verification
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Copy */}
            <div className="animate-fade-in">
              <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wide mb-4">
                Enterprise-grade verification
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                One secure workspace to onboard customers{' '}
                <span className="text-gradient">with confidence.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Modern KYC workflows, AI-powered summarization and live admin tooling all in a
                single, secure experience. Submit, review and approve within minutes.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>🚀</span> Launch customer form
                </button>
                <button
                  onClick={onAdminLogin}
                  className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-semibold text-lg hover:border-cyan-500 hover:shadow-lg transition-all duration-300"
                >
                  <span>🔐</span> Go to admin login
                </button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <p className="text-xs text-slate-600 mb-1">{stat.label}</p>
                    <strong className="text-lg font-bold text-slate-900">{stat.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Form Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-200">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">KYC Verification Form</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-600">Auto-saving</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Complete your information to get verified</p>
                </div>

                {/* Form Content - Animated */}
                <div className="p-6 bg-gradient-to-br from-white to-slate-50 space-y-4">
                  {/* Name Field - Typing Animation */}
                  <div className="opacity-0 animate-slide-up">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="John Anderson"
                        readOnly
                        className="w-full px-4 py-3 bg-white border-2 border-cyan-500 rounded-lg text-slate-900 font-medium shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-pulse">
                        ✓
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="opacity-0 animate-slide-up-delayed">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value="john.anderson@example.com"
                        readOnly
                        className="w-full px-4 py-3 bg-white border-2 border-cyan-500 rounded-lg text-slate-900 font-medium shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-pulse">
                        ✓
                      </div>
                    </div>
                  </div>

                  {/* Nationality Field - Dropdown Animation */}
                  <div className="opacity-0 animate-slide-up-delayed-2">
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Nationality *
                    </label>
                    <div className="relative">
                      <select
                        value="Bangladesh"
                        className="w-full px-4 py-3 bg-white border-2 border-amber-400 rounded-lg text-slate-900 font-medium shadow-sm appearance-none animate-pulse-glow"
                      >
                        <option>Bangladesh</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-amber-600 mt-1 font-semibold animate-pulse">
                      ⚡ AI validating...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">Completion Progress</span>
                      <span className="text-xs font-bold text-cyan-600">65%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-slate-50/90 to-cyan-50/90 backdrop-blur-xl p-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">
                      🔒 End-to-end encrypted
                    </p>
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                      Continue →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600 mb-6">Trusted by compliance teams registered with</p>
          <div className="flex flex-wrap justify-center gap-8">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wide mb-4">
              Everything you need
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Controls that make onboarding effortless
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Designed with front-office speed and back-office governance in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accelerated workflows</h3>
              <p className="text-slate-600">Smart validation and auto-fill remove friction at every step.</p>
            </article>

            <article className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-grade security</h3>
              <p className="text-slate-600">End-to-end encryption plus granular admin access controls.</p>
            </article>

            <article className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI summaries</h3>
              <p className="text-slate-600">Mistral-powered summaries provide one-click underwriting insights.</p>
            </article>

            <article className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Realtime insights</h3>
              <p className="text-slate-600">Dashboards show queue health, SLA adherence and approval stats.</p>
            </article>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wide mb-4">
              Progressive onboarding
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              From submission to approval in four touchpoints
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Complete digital form',
                desc: 'Customer enters identity, address and documents in a guided interface.',
              },
              {
                step: '02',
                title: 'AI compliance summary',
                desc: 'Structured data is summarised for analysts in seconds.',
              },
              {
                step: '03',
                title: 'Analyst review',
                desc: 'Admin dashboard provides full context, notes and PDF export.',
              },
              {
                step: '04',
                title: 'Decision & audit trail',
                desc: 'Approval triggers notifications and stores artefacts immutably.',
              },
            ].map((step) => (
              <div key={step.step} className="relative p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 transition-all">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg mb-4 text-lg">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-700">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-cyan-100 font-semibold text-sm uppercase tracking-wide mb-4">
            Ready when you are
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Launch your KYC workspace today
          </h2>
          <p className="text-xl text-cyan-50 mb-10">
            Spin up the form, test AI summaries and invite your operations team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start a submission
            </button>
            <button
              onClick={onAdminLogin}
              className="px-8 py-4 bg-cyan-500/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Review as admin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xl">
                K
              </div>
              <div>
                <p className="text-sm font-bold">SELISE Compliance Cloud</p>
                <small className="text-xs text-slate-400">
                  © {new Date().getFullYear()} All rights reserved.
                </small>
              </div>
            </div>
            <div className="flex gap-6">
              <button
                onClick={onGetStarted}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Customer form
              </button>
              <button
                onClick={onAdminLogin}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Admin login
              </button>
              <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
