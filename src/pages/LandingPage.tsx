import '../styles/LandingPage.css'

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
    <div className="landing-page">
      <header className="landing-nav">
        <div className="brand">
          <span className="brand-mark">K</span>
          <div>
            <p className="brand-label">KYC Command Center</p>
            <small>Powered by SELISE</small>
          </div>
        </div>
        <nav className="nav-actions">
          <button type="button" className="ghost-link" onClick={onAdminLogin}>
            Admin Portal
          </button>
          <button type="button" className="primary-link" onClick={onGetStarted}>
            Start Verification
          </button>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">Enterprise-grade verification</p>
            <h1>
              One secure workspace to onboard customers
              <span> with confidence.</span>
            </h1>
            <p className="hero-subtitle">
              Modern KYC workflows, AI-powered summarization and live admin tooling all in a
              single, secure experience. Submit, review and approve within minutes.
            </p>
            <div className="hero-cta">
              <button className="btn primary" onClick={onGetStarted}>
                <span>🚀</span> Launch customer form
              </button>
              <button className="btn ghost" onClick={onAdminLogin}>
                <span>🔐</span> Go to admin login
              </button>
            </div>
            <div className="hero-stats">
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat-card">
                  <p>{stat.label}</p>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="glass-card">
              <div className="glass-header">
                <p>Live Queue</p>
                <span>24 submissions</span>
              </div>
              <div className="glass-body">
                <div className="queue-item">
                  <div>
                    <p>Monica Glass</p>
                    <small>Pending review</small>
                  </div>
                  <span>⏳ 02:12</span>
                </div>
                <div className="queue-item">
                  <div>
                    <p>Felix Yan</p>
                    <small>AI summary ready</small>
                  </div>
                  <span className="pill success">Ready</span>
                </div>
                <div className="queue-item">
                  <div>
                    <p>Global FinTech LTD</p>
                    <small>Awaiting approval</small>
                  </div>
                  <span className="pill warning">Action</span>
                </div>
              </div>
              <div className="glass-footer">
                <p>Realtime compliance audit trail</p>
                <strong>Synced • 5 sec ago</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trusted-section">
        <p>Trusted by compliance teams registered with</p>
        <div className="badges-row">
          {trustBadges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <p>Everything you need</p>
          <h2>Controls that make onboarding effortless</h2>
          <p className="section-subtitle">
            Designed with front-office speed and back-office governance in mind.
          </p>
        </div>
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Accelerated workflows</h3>
            <p>Smart validation and auto-fill remove friction at every step.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Bank-grade security</h3>
            <p>End-to-end encryption plus granular admin access controls.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI summaries</h3>
            <p>Mistral-powered summaries provide one-click underwriting insights.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Realtime insights</h3>
            <p>Dashboards show queue health, SLA adherence and approval stats.</p>
          </article>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-header">
          <p>Progressive onboarding</p>
          <h2>From submission to approval in four touchpoints</h2>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <span>01</span>
            <h3>Complete digital form</h3>
            <p>Customer enters identity, address and documents in a guided interface.</p>
          </div>
          <div className="step-card">
            <span>02</span>
            <h3>AI compliance summary</h3>
            <p>Structured data is summarised for analysts in seconds.</p>
          </div>
          <div className="step-card">
            <span>03</span>
            <h3>Analyst review</h3>
            <p>Admin dashboard provides full context, notes and PDF export.</p>
          </div>
          <div className="step-card">
            <span>04</span>
            <h3>Decision & audit trail</h3>
            <p>Approval triggers notifications and stores artefacts immutably.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <div>
            <p className="cta-eyebrow">Ready when you are</p>
            <h2>Launch your KYC workspace today</h2>
            <p>Spin up the form, test AI summaries and invite your operations team.</p>
          </div>
          <div className="cta-actions">
            <button className="btn primary" onClick={onGetStarted}>
              Start a submission
            </button>
            <button className="btn outline" onClick={onAdminLogin}>
              Review as admin
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="brand-mark">K</span>
          <div>
            <p>SELISE Compliance Cloud</p>
            <small>© {new Date().getFullYear()} All rights reserved.</small>
          </div>
        </div>
        <div className="footer-links">
          <button onClick={onGetStarted}>Customer form</button>
          <button onClick={onAdminLogin}>Admin login</button>
          <a href="#">Privacy</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  )
}
