import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '⚡',
      title: 'Improve Focus',
      description: 'Train your attention span and concentration with scientifically-designed exercises'
    },
    {
      icon: '👁️',
      title: 'Enhance Vision',
      description: 'Develop better peripheral vision and increase visual processing speed'
    },
    {
      icon: '🚀',
      title: 'Speed Reading',
      description: 'Boost your reading speed while maintaining comprehension accuracy'
    },
    {
      icon: '🧠',
      title: 'Brain Training',
      description: 'Strengthen neural pathways and improve cognitive flexibility'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your improvements with detailed statistics and performance metrics'
    },
    {
      icon: '🎯',
      title: 'Multiple Modes',
      description: 'Challenge yourself with standard and reverse modes at varying difficulty levels'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Active Users' },
    { value: '50K+', label: 'Games Played' },
    { value: '98%', label: 'User Satisfaction' }
  ];

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🎓 COGNITIVE TRAINING</div>
          <h1 className="hero-title">Master Your Mind</h1>
          <p className="hero-subtitle">
            Unlock your mental potential with Schulte Tables—the scientifically-proven training method used by professionals worldwide
          </p>
          <div className="cta-buttons">
            <button className="start-btn" onClick={() => navigate('/game')}>
              Start Training Now
              <span className="btn-arrow">→</span>
            </button>
            <button className="learn-btn" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="floating-card card-1">
            <div className="mini-grid">
              <div className="mini-cell">1</div>
              <div className="mini-cell">2</div>
              <div className="mini-cell">3</div>
              <div className="mini-cell">4</div>
              <div className="mini-cell">5</div>
              <div className="mini-cell">6</div>
            </div>
          </div>
          <div className="floating-card card-2">⚡</div>
          <div className="floating-card card-3">🧠</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Why Choose Schulte Tables?</h2>
        <p className="section-subtitle">Proven cognitive enhancement with measurable results</p>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Configure</h3>
            <p>Choose your difficulty level and game mode</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Play</h3>
            <p>Click numbers in sequence as fast as you can</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Improve</h3>
            <p>Track progress and beat your personal records</p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <div className="history-content">
          <h2>About Schulte Tables</h2>
          <p>
            Originally developed by German psychiatrist <strong>Walter Schulte</strong> in the 1920s, 
            Schulte Tables are grids of randomly distributed numbers used to study attention properties 
            and develop speed reading skills. Today, they're utilized by educators, athletes, and professionals 
            to enhance focus, peripheral vision, and visual processing speed.
          </p>
          <p>
            Research shows that regular training with Schulte Tables can significantly improve:
          </p>
          <ul className="benefits-list">
            <li>✓ Attention and concentration span</li>
            <li>✓ Peripheral vision capabilities</li>
            <li>✓ Visual search and scanning speed</li>
            <li>✓ Overall cognitive performance</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <h2>Ready to Transform Your Mind?</h2>
        <p>Join thousands of users improving their cognitive abilities every day</p>
        <button className="start-btn-large" onClick={() => navigate('/game')}>
          Begin Your Journey
          <span className="btn-arrow">→</span>
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Schulte Table Trainer. Enhancing minds, one table at a time.</p>
      </footer>
    </div>
  );
};

export default LandingPage;