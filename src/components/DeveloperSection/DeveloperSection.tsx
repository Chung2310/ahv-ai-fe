"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import './DeveloperSection.css';

const CODE_SNIPPETS = {
  curl: `curl -X POST "https://api.piapi.ai/v1/flux/generate" \\
  -H "Authorization: Bearer $PIAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Cyberpunk city at night, 8k",
    "negative_prompt": "blurry, low quality",
    "num_images": 1
  }'`,
  node: `const axios = require('axios');

const response = await axios.post('https://api.piapi.ai/v1/flux/generate', {
  prompt: 'Cyberpunk city at night, 8k',
  negative_prompt: 'blurry, low quality',
  num_images: 1
}, {
  headers: { 'Authorization': \`Bearer \${process.env.PIAPI_KEY}\` }
});`,
  python: `import requests

response = requests.post(
    "https://api.piapi.ai/v1/flux/generate",
    headers={"Authorization": f"Bearer {PIAPI_KEY}"},
    json={
        "prompt": "Cyberpunk city at night, 8k",
        "negative_prompt": "blurry, low quality",
        "num_images": 1
    }
)`
};

const DeveloperSection = () => {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');

  return (
    <section className="dev-section">
      <div className="container dev-grid">
        <div className="dev-content animate-fade-in">
          <h2 className="section-title text-white">Built for <span className="gradient-text">Engineers.</span></h2>
          <p className="dev-subtitle">
            Integrate powerful AI capabilities into your applications with our robust, 
            low-latency API. Designed by developers, for developers.
          </p>
          
          <ul className="dev-features">
            <li className="dev-feature-item">
              <span className="check">✓</span>
              <span>99.99% Uptime Guarantee</span>
            </li>
            <li className="dev-feature-item">
              <span className="check">✓</span>
              <span>WebSocket Support for Real-time Streaming</span>
            </li>
            <li className="dev-feature-item">
              <span className="check">✓</span>
              <span>Comprehensive SDKs for Python, Node.js and Go</span>
            </li>
            <li className="dev-feature-item">
              <span className="check">✓</span>
              <span>Enterprise-grade Security & HIPAA Compliance</span>
            </li>
          </ul>
          
          <Link href="/docs">
            <button className="btn-primary">View API Documentation</button>
          </Link>
        </div>
        
        <div className="dev-visual glass dark">
          <div className="code-editor">
            <div className="editor-tabs">
              <div 
                className={`tab ${activeTab === 'curl' ? 'active' : ''}`}
                onClick={() => setActiveTab('curl')}
              >
                cURL
              </div>
              <div 
                className={`tab ${activeTab === 'node' ? 'active' : ''}`}
                onClick={() => setActiveTab('node')}
              >
                Node.js
              </div>
              <div 
                className={`tab ${activeTab === 'python' ? 'active' : ''}`}
                onClick={() => setActiveTab('python')}
              >
                Python
              </div>
            </div>
            <div className="code-block">
              <pre>
                <code>{CODE_SNIPPETS[activeTab]}</code>
              </pre>
            </div>
            <div className="code-footer">
              <span className="status-success">● 200 OK</span>
              <span className="latency">420ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;
