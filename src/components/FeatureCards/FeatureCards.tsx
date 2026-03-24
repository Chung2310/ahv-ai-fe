import React from 'react';
import Reveal from '../Reveal/Reveal';
import './FeatureCards.css';

const features = [
  {
    title: 'Face Swap',
    description: 'Swap faces for one or more people with high precision. Supports images up to 20MB with an auto-upscale option for results.',
    icon: '🎭',
    color: '#6366f1',
    tags: ['faceswap', 'faceswap_multi']
  },
  {
    title: 'Video Face Swap',
    description: 'Replace faces frame-by-frame in videos. Original audio is preserved; supports multi-GPU for high performance.',
    icon: '🎬',
    color: '#a855f7',
    tags: ['faceswap_video']
  },
  {
    title: 'Upscale & Enhance',
    description: 'Increase image resolution up to 4x with AI beauty settings (Natural, Glamour, Studio).',
    icon: '🔍',
    color: '#06b6d4',
    tags: ['upscale']
  },
  {
    title: 'Virtual Try-On',
    description: 'Try on clothes virtually using AI. Simply upload a portrait and an outfit photo to see the result instantly.',
    icon: '👗',
    color: '#f97316',
    tags: ['try_on']
  },
  {
    title: 'AHV Image Gen',
    description: 'Create and transform images with AI featuring customizable styles, resolutions, and control parameters.',
    icon: '🎨',
    color: '#ec4899',
    tags: ['ahv_image']
  },
  {
    title: 'AHV Video Gen',
    description: 'Create and process videos with AI using advanced neural rendering. Ideal for short creative content.',
    icon: '🎥',
    color: '#d97706',
    tags: ['ahv_video']
  },
  {
    title: 'Object Removal',
    description: 'Precise object removal using AI with intelligent background inpainting. Provide a mask or let the model auto-detect.',
    icon: '✂️',
    color: '#3b82f6',
    tags: ['remove_object']
  },
  {
    title: 'Background Removal',
    description: 'Remove backgrounds with one click featuring sharp edge detection. Returns transparent PNG for easy compositing.',
    icon: '✨',
    color: '#10b981',
    tags: ['remove_bg', 'scan']
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
            <div className="feature-tags">
              {feature.tags.map((tag, i) => (
                <span key={i} className="feature-tag">{tag}</span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default FeatureCards;

