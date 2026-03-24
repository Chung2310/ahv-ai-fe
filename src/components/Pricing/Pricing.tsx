'use client';

import React, { useState } from 'react';
import Reveal from '../Reveal/Reveal';
import './Pricing.css';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      desc: "Perfect for exploring and trial playground.",
      features: [
        "Basic Task Processing",
        "Community Access",
        "Playground Trial Package",
        "Automated Support"
      ],
      buttonText: "Start for Free",
      isFeatured: false
    },
    {
      name: "Creator",
      monthlyPrice: 15,
      yearlyPrice: 11.25,
      desc: "For individual creators and developers.",
      features: [
        "$10 Monthly Credits",
        "Unlimited Task Speed",
        "File-to-URL Conversion",
        "Email & Ticket Support"
      ],
      buttonText: "Choose Creator",
      isFeatured: false
    },
    {
      name: "Pro",
      monthlyPrice: 60,
      yearlyPrice: 45,
      desc: "Advanced features for scaling apps.",
      features: [
        "$60 Monthly Credits",
        "All API Task Types",
        "Advanced Models (Flux/Flux Dev)",
        "Invoice Customization"
      ],
      buttonText: "Go Pro",
      isFeatured: true
    },
    {
      name: "Enterprise",
      monthlyPrice: 100,
      yearlyPrice: 75,
      desc: "The ultimate power for organizations.",
      features: [
        "3x Pro Task Concurrency",
        "Up to 100 Sub-accounts",
        "Unified Billing/Invoice",
        "Dedicated Support"
      ],
      buttonText: "Contact Us",
      isFeatured: false
    }
  ];

  return (
    <section className="pricing-section glass">
      <div className="container">
        <Reveal width="100%" direction="up">
          <div className="section-header">
            <h2 className="section-title">Scaling with <span className="gradient-text">Your Ambition.</span></h2>
            <p className="section-subtitle">Flexible plans designed to grow with your usage. No hidden fees, no complexity.</p>
          </div>
        </Reveal>

        <Reveal width="100%" direction="up" delay={0.1}>
          <div className="billing-toggle-wrapper">
            <span className={!isYearly ? "active" : ""}>Monthly</span>
            <button 
              className={`billing-toggle ${isYearly ? "yearly" : ""}`}
              onClick={() => setIsYearly(!isYearly)}
            >
              <div className="toggle-knob"></div>
            </button>
            <span className={isYearly ? "active" : ""}>Yearly <b>(Save 25%)</b></span>
          </div>
        </Reveal>
        
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.1} direction="up" distance={30}>
              <div className={`pricing-card glass hover-glow ${plan.isFeatured ? 'featured' : ''}`}>
                {plan.isFeatured && <div className="featured-badge">Most Popular</div>}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  <span>/month</span>
                </div>
                <p className="plan-desc">{plan.desc}</p>
                <ul className="plan-features">
                  {plan.features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button className={plan.isFeatured ? "btn-primary skew-btn" : "btn-secondary"} style={{ width: '100%' }}>
                  <span>{plan.buttonText}</span>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;


