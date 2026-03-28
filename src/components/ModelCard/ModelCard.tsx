'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Reveal from '../Reveal/Reveal';
import './ModelCard.css';

interface ModelCardProps {
  id?: string;
  title: string;
  provider?: string;
  description: string;
  image: string;
  price?: string;
  speed?: string;
  delay?: number;
}

const ModelCard: React.FC<ModelCardProps> = ({ id, title, provider, description, image, price, speed, delay = 0 }) => {
  const router = useRouter();

  const handleGoToWorkspace = () => {
    if (id) {
      router.push(`/workspace?model=${id}`);
    } else {
      router.push('/workspace');
    }
  };

  return (
    <Reveal delay={delay} direction="up" distance={20}>
      <div className="model-card hover-scale">
        <div className="model-card-image-wrapper shimmer-effect">
          {image.match(/\.(mp4|webm|ogg|mov)$|^data:video/i) || image.includes('/video/upload/') ? (
            <video 
              src={image} 
              className="model-card-image object-cover" 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Image 
              src={image} 
              alt={title} 
              width={400} 
              height={300} 
              className="model-card-image object-cover" 
            />
          )}
          {speed && <span className="speed-badge">{speed}</span>}
          {provider && <span className="provider-badge">{provider}</span>}
        </div>
        <div className="model-card-content">
          <div className="model-card-header">
            <h3 className="model-card-title">{title}</h3>
            {price && (
              <div className="model-card-price">
                <span className="price-value">{price}</span>
                <span className="price-unit">COINS</span>
              </div>
            )}
          </div>
          <p className="model-card-desc">{description}</p>
          <div className="model-card-actions">
            <button className="btn-model-primary" onClick={handleGoToWorkspace}>Workspace</button>
            <button className="btn-model-outline">API Docs</button>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default ModelCard;
