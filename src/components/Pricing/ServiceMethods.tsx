'use client';

import React from 'react';
import Reveal from '../Reveal/Reveal';
import './ServiceMethods.css';

const ServiceMethods = () => {
  return (
    <section className="service-methods-section">
      <div className="container">
        <Reveal width="100%" direction="up">
          <div className="section-header">
            <h2 className="section-title">Simplified <span className="gradient-text">Integration</span></h2>
            <p className="section-subtitle">Choose the method that fits your workflow and cost structure.</p>
          </div>
        </Reveal>

        <div className="methods-grid">
          <Reveal direction="left" delay={0.1}>
            <div className="method-card glass">
              <div className="method-icon">🚀</div>
              <h3 className="method-name">Pay-as-you-go (PAYG)</h3>
              <p className="method-desc">
                Use our global account pool. Ready to use immediately with no setup required. Perfect for variable workloads.
              </p>
              <ul className="method-details">
                <li>No monthly seat fees</li>
                <li>Pay per request</li>
                <li>Global high-speed pool</li>
              </ul>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.2}>
            <div className="method-card glass">
              <div className="method-icon">🛠️</div>
              <h3 className="method-name">Host-your-account (HYA)</h3>
              <p className="method-desc">
                Link your own platform accounts. Maintain full control and benefit from your own subscription limits.
              </p>
              <ul className="method-details">
                <li>Fixed monthly seat fee</li>
                <li>No pay-per-request fees</li>
                <li>Use your own quotas</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ServiceMethods;
