'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  
  // Instant position for the dot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring position for the ring (slight lag)
  const ringX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const ringY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          backgroundColor: 'var(--primary)',
          borderRadius: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Glowing Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: isPointer ? 60 : 40,
          height: isPointer ? 60 : 40,
          border: '1px solid var(--primary)',
          borderRadius: '50%',
          zIndex: 9998,
          pointerEvents: 'none',
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isPointer ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      />
      
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 1024px) {
          * {
            cursor: auto !important;
          }
          .custom-cursor {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
