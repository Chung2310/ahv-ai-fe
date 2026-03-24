'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './AuroraBackground.css';

const AuroraBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      // Multiply by factor to control parallax intensity (e.g., 50px)
      mouseX.set(x * 50);
      mouseY.set(y * 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="aurora-container">
      <motion.div 
        className="aurora-wrapper"
        style={{ x: translateX, y: translateY }}
      >
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </motion.div>
      <div className="aurora-overlay"></div>
      
      {/* Subtle grid overlay for tech feel */}
      <div className="aurora-grid"></div>
      
      {/* Grain effect for texture */}
      <div className="aurora-noise"></div>
    </div>
  );
};

export default AuroraBackground;
