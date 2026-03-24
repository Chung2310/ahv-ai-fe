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
              <span className="logo-icon">A</span>
              <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
            </Link>
          </Magnetic>
          <div className="status-indicator">
            <span className="status-dot"></span>
            HỆ THỐNG ONLINE
          </div>
        </div>

        <nav className="nav-links">
          <Magnetic><Link href="/models" className={pathname === '/models' ? 'active' : ''}>Mô hình</Link></Magnetic>
          <Magnetic><Link href="/workspace" className={pathname === '/workspace' ? 'active' : ''}>Trải nghiệm</Link></Magnetic>
          <Magnetic><Link href="/docs" className={pathname === '/docs' ? 'active' : ''}>Tài liệu</Link></Magnetic>
          <Magnetic><Link href="/pricing" className="nav-link">Bảng giá</Link></Magnetic>
          <Magnetic><Link href="/blog" className="nav-link">Blog</Link></Magnetic>
        </nav>
        
        <div className="header-actions">
          <Magnetic><Link href="/login" className="btn-secondary">Đăng nhập</Link></Magnetic>
          <Magnetic><Link href="/register" className="btn-primary">Đăng ký</Link></Magnetic>
        </div>
      </div>
    </header>
  );
};


export default Header;
