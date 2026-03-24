import React from 'react';
import Reveal from '../Reveal/Reveal';
import './FeatureCards.css';

const features = [
  {
    title: 'Image Models',
    description: 'Access Flux, Stable Diffusion, and more. Generate stunning high-res images in seconds.',
    icon: '🎨',
    color: '#00f3ff' // Neon Cyan
  },
  {
    title: 'Video Models',
    description: 'State-of-the-art text-to-video and image-to-video generation for cinematic results.',
    icon: '🎬',
    color: '#ff00ff' // Neon Magenta
  },
  {
    title: 'Audio Models',
    description: 'Crystal-clear speech synthesis and voice cloning with emotional intelligence.',
    icon: '🎙️',
    color: '#00ff88' // Neon Green
  },
  {
    title: 'Text Models',
    description: 'Latest LLMs for reasoning, creative writing, and complex data extraction.',
    icon: '✍️',
    color: '#fff200' // Neon Yellow
  }
];

const FeatureCards = () => {
  return (
    <div className="feature-grid">
      {features.map((feature, index) => (
        <Reveal key={index} delay={index * 0.1} direction="up" distance={20}>
          <div className="feature-card hover-glow">
            <div className="feature-icon-wrapper" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
              <span className="feature-icon">{feature.icon}</span>
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
            <div className="feature-link">View Documentation →</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default FeatureCards;

