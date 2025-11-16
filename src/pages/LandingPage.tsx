import { useEffect } from 'react'
import '../styles/LandingPage.css'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  useEffect(() => {
    const handleScroll = () => {
      // Scroll listener for potential future enhancements
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Complete Know Your Customer <span className="highlight">Verification</span>
            </h1>
            <p className="hero-subtitle">
              Secure, Fast, and Compliant KYC Solutions with AI-Powered Summaries
            </p>
            <button className="cta-button primary" onClick={onGetStarted}>
              Start Verification
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon">🔒</div>
              <p>Secure</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">⚡</div>
              <p>Fast</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">✅</div>
              <p>Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Our KYC System?</h2>
          <p>Industry-leading features for seamless customer verification</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Summaries</h3>
            <p>Automatic customer analysis with advanced AI technology for quick insights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>PDF Reports</h3>
            <p>Generate professional reports with all customer information in one document</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Bank-Level Security</h3>
            <p>Enterprise-grade encryption and compliance with international standards</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Processing</h3>
            <p>Instant verification with real-time status updates and notifications</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive admin dashboard with detailed customer insights and metrics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Support</h3>
            <p>Support for multiple countries and compliance with local regulations</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple, fast, and secure KYC verification in 3 steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Fill Information</h3>
            <p>Enter your personal and identity information securely</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI system analyzes and generates automatic summaries</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Verified</h3>
            <p>Receive instant verification and download your report</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat">
            <h3>10K+</h3>
            <p>Customers Verified</p>
          </div>
          <div className="stat">
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
          <div className="stat">
            <h3>50+</h3>
            <p>Countries</p>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Complete your KYC verification in just a few minutes</p>
          <button className="cta-button primary large" onClick={onGetStarted}>
            Start Your Verification Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>KYC System</h4>
            <p>Complete Know Your Customer verification solution</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Customer Verification</li>
              <li>Admin Dashboard</li>
              <li>PDF Reports</li>
              <li>AI Summaries</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Documentation</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 KYC System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
