'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const AuroraBackground = dynamic(() => import('@/components/BackgroundEffects/AuroraBackground'), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/Effects/SmoothScroll'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/Effects/CustomCursor'), { ssr: false });
const TopLoader = dynamic(() => import('@/components/Effects/TopLoader'), { ssr: false });

export default function AppEffects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Suspense fallback={null}>
        <TopLoader />
      </Suspense>
      <CustomCursor />
      <AuroraBackground />
      <SmoothScroll>
        <AnimatePresence initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

      </SmoothScroll>
    </>
  );
}

