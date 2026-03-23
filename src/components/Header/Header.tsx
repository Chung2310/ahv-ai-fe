'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Header.css';

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="header glass">
      <div className="container header-content">
        <div className="logo">
          <span className="logo-icon">π</span>
          <span className="logo-text">PiAPI</span>
        </div>
        <div className="nav-left">
          <a href="/" className="logo">
            Pi<span className="gradient-text">API</span>
          </a>
          <div className="status-indicator">
            <span className="status-dot"></span>
            SYS_ONLINE
          </div>
        </div>

        <nav className="nav-links">
          <Link href="/models" className={pathname === '/models' ? 'active' : ''}>Models</Link>
          <Link href="/playground" className={pathname === '/playground' ? 'active' : ''}>Playground</Link>
          <Link href="/docs" className={pathname === '/docs' ? 'active' : ''}>Docs</Link>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#blog" className="nav-link">Blog</a>
        </nav>
        
        <div className="header-actions">
          <a href="/login" className="btn-secondary">Log In</a>
          <a href="/register" className="btn-primary">Sign Up</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
