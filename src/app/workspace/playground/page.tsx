'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { MODELS } from '@/data/models';
import './playground.css';

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        url: selectedModel.image,
        metadata: {
          model: selectedModel.title,
          time: "1.8s",
          resolution: "1024x1024"
        }
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <main className="playground-page">
      <Header />
      
      <div className="playground-container">
        {/* Left: Params Panel */}
        <aside className="playground-sidebar">
          <div className="panel-section">
            <h3 className="panel-title">Model</h3>
            <select 
              className="playground-select"
              value={selectedModel.title}
              onChange={(e) => {
                const model = MODELS.find(m => m.title === e.target.value);
                if (model) setSelectedModel(model);
              }}
            >
              {MODELS.map((m, idx) => (
                <option key={idx} value={m.title}>{m.title}</option>
              ))}
            </select>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">Parameters</h3>
            <div className="param-group">
              <label>Aspect Ratio</label>
              <div className="radio-group">
                <button className="radio-btn active">1:1</button>
                <button className="radio-btn">16:9</button>
                <button className="radio-btn">9:16</button>
              </div>
            </div>
            
            <div className="param-group">
              <label>Steps</label>
              <input type="range" min="1" max="50" defaultChecked />
            </div>

            <div className="param-group">
              <label>Guidance</label>
              <input type="range" min="1" max="20" defaultChecked />
            </div>
          </div>

          <button 
            className="btn-generate"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate ✨'}
          </button>
        </aside>

        {/* Center/Right: Main Playground */}
        <div className="playground-main">
          <div className="prompt-container">
            <textarea 
              className="prompt-input"
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="preview-container">
            {isGenerating ? (
              <div className="generation-loader">
                <div className="spinner"></div>
                <p>Model is thinking...</p>
              </div>
            ) : result ? (
              <div className="result-view">
                <Image 
                  src={result.url} 
                  alt="Generated result" 
                  width={1024} 
                  height={1024} 
                  unoptimized
                  className="result-img" 
                />
                <div className="result-info">
                  <div className="info-item">
                    <span className="info-label">Model:</span>
                    <span>{result.metadata.model}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Generation Time:</span>
                    <span>{result.metadata.time}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-preview">
                <div className="preview-icon">🎨</div>
                <p>Your results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

