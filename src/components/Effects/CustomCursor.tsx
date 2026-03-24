'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // For the trail/particles
  const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);

  useEffect(() => {
    let frameId: number;
    let particleId = 0;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Add particle to trail
      if (Math.random() > 0.7) { // Only add particles occasionally for performance
        setTrail(prev => [{ x: e.clientX, y: e.clientY, id: particleId++ }, ...prev.slice(0, 5)]);
      }
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);

    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .clickable');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [cursorX, cursorY]);

  return (
    <div className="custom-cursor-container">
      {/* Particle Trail */}
      <AnimatePresence>
        {trail.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2, x: p.x, y: p.y }}
            exit={{ opacity: 0 }}
            className="cursor-particle"
            style={{ position: 'fixed', top: -4, left: -4 }}
          />
        ))}
      </AnimatePresence>

      {/* Main AI Neural Spark */}
      <motion.div
        className="cursor-neural-ring-outer"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          rotate: 360,
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 3, ease: "linear" },
          scale: { type: 'spring', stiffness: 300 }
        }}
      />
      
      <motion.div
        className="cursor-neural-ring-inner"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: -360,
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 2, ease: "linear" },
          scale: { type: 'spring', stiffness: 300 }
        }}
      />

      <motion.div
        className="cursor-core"
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        animate={{
          scale: isHovered ? 2 : 1,
          boxShadow: isHovered ? "0 0 20px #00f3ff, 0 0 40px #ff00ff" : "0 0 10px #00f3ff"
        }}
      />
    </div>
  );
};

export default CustomCursor;

