import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <section className="pricing-section glass">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Scaling with <span className="gradient-text">Your Ambition.</span></h2>
          <p className="section-subtitle">Flexible plans designed to grow with your usage. No hidden fees, no complexity.</p>
        </div>
        
        <div className="pricing-grid">
          <div className="pricing-card glass hover-glow animate-fade-in">
            <h3 className="plan-name">Basic</h3>
            <div className="plan-price">$0<span>/month</span></div>
            <p className="plan-desc">Perfect for exploring and building small projects.</p>
            <ul className="plan-features">
              <li>1,000 monthly requests</li>
              <li>Community Access</li>
              <li>Standard Models</li>
            </ul>
            <button className="btn-secondary" style={{ width: '100%' }}>Start for Free</button>
          </div>

          <div className="pricing-card featured glass hover-glow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="featured-badge">Most Popular</div>
            <h3 className="plan-name">Pro</h3>
            <div className="plan-price">$49<span>/month</span></div>
            <p className="plan-desc">Best for scaling applications in production.</p>
            <ul className="plan-features">
              <li>50,000 monthly requests</li>
              <li>24/7 Priority Support</li>
              <li>Access to all PRO models</li>
            </ul>
            <button className="btn-primary skew-btn" style={{ width: '100%' }}><span>Upgrade Now</span></button>
          </div>

          <div className="pricing-card glass hover-glow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="plan-name">Enterprise</h3>
            <div className="plan-price">Custom</div>
            <p className="plan-desc">Mission-critical support and dedicated infra.</p>
            <ul className="plan-features">
              <li>Unlimited Requests</li>
              <li>Dedicated Account Manager</li>
              <li>Custom Infrastructure</li>
              <li>AI Solutions Consulting</li>
            </ul>
            <button className="btn-secondary skew-btn" style={{ width: '100%' }}><span>Contact Us</span></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
