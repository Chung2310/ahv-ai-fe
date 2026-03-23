'use client';

import React, { useEffect, useState } from 'react';

const BackgroundEffects = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="mesh-bg-container">
      <div 
        className="mesh-blob blob-green" 
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="mesh-blob blob-accent" 
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      />
    </div>
  );
};

export default BackgroundEffects;
