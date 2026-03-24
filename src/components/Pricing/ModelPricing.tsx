'use client';

import React, { useState } from 'react';
import Reveal from '../Reveal/Reveal';
import './ModelPricing.css';

const ModelPricing = () => {
  const [activeTab, setActiveTab] = useState('image');

  const models = {
    image: [
      { name: "Flux Schnell", price: "$0.0015", unit: "image" },
      { name: "Flux Dev", price: "$0.025", unit: "image" },
      { name: "Flux Pro", price: "$0.05", unit: "image" },
      { name: "Stable Diffusion 3", price: "$0.03", unit: "image" },
    ],
    video: [
      { name: "Luma Dream Machine", price: "$0.15", unit: "s" },
      { name: "Kling AI", price: "$0.20", unit: "s" },
      { name: "Runway Gen-3", price: "$0.25", unit: "s" },
    ],
    text: [
      { name: "GPT-4o", price: "$5.00", unit: "1M tokens" },
      { name: "Claude 3.5 Sonnet", price: "$3.00", unit: "1M tokens" },
      { name: "Gemini 1.5 Pro", price: "$3.50", unit: "1M tokens" },
    ]
  };

  return (
    <section className="model-pricing-section">
      <div className="container">
        <Reveal width="100%" direction="up">
          <div className="section-header">
            <h2 className="section-title">API <span className="gradient-text">Pay-as-you-go</span></h2>
            <p className="section-subtitle">Only pay for what you use. Transparent pricing per request.</p>
          </div>
        </Reveal>

        <div className="model-tabs">
          {Object.keys(models).map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="model-table-wrapper">
          <table className="model-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Price</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {models[activeTab as keyof typeof models].map((model, index) => (
                <tr key={model.name}>
                  <td>{model.name}</td>
                  <td className="price-cell">{model.price}</td>
                  <td>per {model.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ModelPricing;
