'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  scale?: number;
  blur?: boolean;
}

const Reveal: React.FC<RevealProps> = ({ 
  children, 
  width = "100%",
  direction = 'up',
  delay = 0.2,
  duration = 0.8,
  distance = 50,
  scale = 1,
  blur = false
}) => {
  const getInitialProps = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <div style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        variants={{
          hidden: { 
            opacity: 0, 
            ...getInitialProps(),
            scale: scale !== 1 ? scale : 1,
          },
          visible: { 
            opacity: 1, 
            y: 0, 
            x: 0, 
            scale: 1,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ 
          duration, 
          ease: [0.22, 1, 0.36, 1],
          delay 
        }}
        viewport={{ once: true, margin: "-50px" }}
        style={{ 
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};


export default Reveal;

