'use client';

import React, { useState, useEffect } from 'react';
import Reveal from '../Reveal/Reveal';
import api from '@/lib/api';
import './FeatureCards.css';

const FeatureCards = () => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/api/v1/aimodels');
        if (response.data.success) {
          // Take first 8 active models for the homepage display
          const allModels = response.data.data || [];
          setModels(allModels.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to fetch home models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="loading-container text-center py-40">
        <div className="loading-spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="feature-grid">
      {models.map((model, index) => {
        // Simple color mapping based on index or model name
        const colors = ['#6366f1', '#a855f7', '#06b6d4', '#f97316', '#ec4899', '#d97706', '#3b82f6', '#10b981'];
        const cardColor = colors[index % colors.length];
        
        // Define an icon based on model name or default
        const getIcon = (name: string) => {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('face')) return '🎭';
          if (lowerName.includes('video')) return '🎬';
          if (lowerName.includes('upscale')) return '🔍';
          if (lowerName.includes('swap')) return '🔄';
          if (lowerName.includes('gen')) return '🎨';
          if (lowerName.includes('remove')) return '✂️';
          return '✨';
        };

        return (
          <Reveal key={model._id || model.id} delay={index * 0.1} direction="up" distance={20}>
            <div className="feature-card hover-glow">
              <div className="feature-icon-wrapper" style={{ backgroundColor: `${cardColor}15`, color: cardColor }}>
                <span className="feature-icon">{getIcon(model.name)}</span>
              </div>
              <h3 className="feature-title">{model.name}</h3>
              <p className="feature-desc">{model.description}</p>
              <div className="feature-tags">
                <span className="feature-tag">{model.provider || 'ahv'}</span>
                {model.id && <span className="feature-tag">{model.id.split('-')[0]}</span>}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};

export default FeatureCards;

