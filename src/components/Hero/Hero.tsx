'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../Reveal/Reveal';
import Magnetic from '../Effects/Magnetic';
import './Hero.css';

export default function Hero() {
  const fullText = "The Most Powerful AI Ecosystem for Developers";
  const words = fullText.split(" ");
  const { scrollY } = useScroll();

  // Parallax effects
  const gridY = useTransform(scrollY, [0, 500], [0, 150]);
  const sphereY = useTransform(scrollY, [0, 500], [0, -80]);
  const contentY = useTransform(scrollY, [0, 500], [0, 40]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.5 }
    }
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <section className="hero-section">
      <motion.div className="cyber-grid" style={{ y: gridY }} />
      <div className="scanline" />
      
      <div className="container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: contentY }}
        >
          <motion.div className="hero-badge animate-glow" variants={itemVariants}>
            <span className="badge-dot"></span>
            <span className="neon-text-cyan">SYS_ONLINE // EDGE_v4.2</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title" 
            variants={titleContainer}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, i) => (
              <motion.span 
                key={i} 
                variants={wordVariants} 
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Integrate state-of-the-art AI models into your applications with a single API. 
            Fast, reliable, and built for scale.
          </motion.p>

          <motion.div className="hero-actions" variants={itemVariants}>
            <Magnetic>
              <motion.a 
                href="/login" 
                className="btn-primary skew-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started Now</span>
              </motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a 
                href="/models" 
                className="btn-secondary skew-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View Models Library</span>
              </motion.a>
            </Magnetic>
          </motion.div>


          <motion.div className="hero-stats" variants={itemVariants}>
            {[
              { label: 'Uptime', value: '99.9%', color: 'neon-text-cyan' },
              { label: 'Latency', value: '<200ms', color: 'neon-text-magenta' },
              { label: 'Requests', value: '1M+', color: 'neon-text-cyan' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                className="stat-item"
                whileHover={{ y: -5, color: 'var(--primary)' }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
              >
                <span className={`stat-value ${stat.color}`}>{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          style={{ y: sphereY }}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="visual-wrapper">
            <motion.div 
              className="cyber-sphere"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="sphere-ring"></div>
              ))}
              <div className="sphere-content">
                <span className="glow-text">AI</span>
              </div>
            </motion.div>
            
            <div className="glow-blob"></div>
            <div className="glow-blob secondary"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

