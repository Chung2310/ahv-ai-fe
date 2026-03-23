import React from 'react';
import './DeveloperSection.css';

const DeveloperSection = () => {
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
          
          <button className="btn-primary">View API Documentation</button>
        </div>
        
        <div className="dev-visual glass dark">
          <div className="code-editor">
            <div className="editor-tabs">
              <div className="tab active">cURL</div>
              <div className="tab">Node.js</div>
              <div className="tab">Python</div>
            </div>
            <div className="code-block">
              <pre>
                <code>{`curl -X POST "https://api.piapi.ai/v1/flux/generate" \\
  -H "Authorization: Bearer $PIAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Cyberpunk city at night, 8k",
    "negative_prompt": "blurry, low quality",
    "num_images": 1
  }'`}</code>
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
