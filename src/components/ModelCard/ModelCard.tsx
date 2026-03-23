import React from 'react';
import './ModelCard.css';

interface ModelCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  speed?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ title, description, image, tags, speed }) => {
  return (
    <div className="model-card animate-fade-in hover-scale">
      <div className="model-card-image-wrapper shimmer-effect">
        <img src={image} alt={title} className="model-card-image" />
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
          <button className="btn-model-primary">Playground</button>
          <button className="btn-model-outline">API Docs</button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
