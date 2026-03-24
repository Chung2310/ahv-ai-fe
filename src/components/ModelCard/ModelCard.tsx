'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from '../Reveal/Reveal';
import './ModelCard.css';

interface ModelCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  speed?: string;
  delay?: number;
}

const ModelCard: React.FC<ModelCardProps> = ({ title, description, image, tags, speed, delay = 0 }) => {
  return (
    <Reveal delay={delay} direction="up" distance={20}>
      <div className="model-card hover-scale">
        <div className="model-card-image-wrapper shimmer-effect">
          <Image 
            src={image} 
            alt={title} 
            width={400} 
            height={300} 
            className="model-card-image object-cover" 
          />
          {speed && <span className="speed-badge">{speed}</span>}
        </div>
        <div className="model-card-content">
          <h3 className="model-card-title">{title}</h3>
          <p className="model-card-desc">{description}</p>
          <div className="model-card-tags">
            {tags.map((tag, idx) => (
              <span key={idx} className="model-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="model-card-actions">
            <button className="btn-model-primary">Workspace</button>
            <button className="btn-model-outline">API Docs</button>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default ModelCard;
