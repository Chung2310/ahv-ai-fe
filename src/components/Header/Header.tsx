'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/Effects/Magnetic';
import './Header.css';

const Header = () => {
  const pathname = usePathname();
  
  return (
    <header className="header glass">
      <div className="container header-content">
        <div className="nav-left">
          <Magnetic>
            <Link href="/" className="logo">
              <span className="logo-icon"></span>
              <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
            </Link>
          </Magnetic>
          <div className="status-indicator">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </div>
        </div>

        <nav className="nav-links">
          <Magnetic><Link href="/models" className={pathname === '/models' ? 'active' : ''}>Models</Link></Magnetic>
          <Magnetic><Link href="/workspace" className={pathname === '/workspace' ? 'active' : ''}>Workspace</Link></Magnetic>
          <Magnetic><Link href="/docs" className={pathname === '/docs' ? 'active' : ''}>Docs</Link></Magnetic>
          <Magnetic><Link href="/pricing" className="nav-link">Pricing</Link></Magnetic>
          <Magnetic><Link href="/blog" className="nav-link">Blog</Link></Magnetic>
        </nav>
        
        <div className="header-actions">
          <Magnetic><Link href="/login" className="btn-secondary">Login</Link></Magnetic>
          <Magnetic><Link href="/register" className="btn-primary">Register</Link></Magnetic>
        </div>
      </div>
    </header>
  );
};


export default Header;
