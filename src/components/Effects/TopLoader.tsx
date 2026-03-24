'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';

const TopLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When pathname or searchParams change, it means navigation completed
    setLoading(false);
  }, [pathname, searchParams]);

  // We can't easily detect "start" with App Router hooks, 
  // so we'll listen for click events on links to start the loader.
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (
        anchor && 
        anchor.href && 
        anchor.href.startsWith(window.location.origin) && 
        !anchor.href.includes('#') &&
        anchor.target !== '_blank'
      ) {
        setLoading(true);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ width: '0%', opacity: 1 }}
          animate={{ 
            width: '70%', 
            transition: { duration: 2, ease: "easeOut" } 
          }}
          exit={{ 
            width: '100%', 
            opacity: 0,
            transition: { duration: 0.3, ease: "easeIn" }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #00f3ff, #ff00ff)',
            boxShadow: '0 0 10px #00f3ff, 0 0 20px rgba(0, 243, 255, 0.5)',
            zIndex: 10001,
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default TopLoader;
