'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
}

const Reveal: React.FC<RevealProps> = ({ children, width = "fit-content" }) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoothness
          delay: 0.2 
        }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
