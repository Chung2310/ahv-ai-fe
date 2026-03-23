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
        <div className="nav-left">
          <Link href="/" className="logo">
            <span className="logo-icon">A</span>
            <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
          </Link>
          <div className="status-indicator">
            <span className="status-dot"></span>
            HỆ THỐNG ONLINE
          </div>
        </div>

        <nav className="nav-links">
          <Link href="/models" className={pathname === '/models' ? 'active' : ''}>Mô hình</Link>
          <Link href="/playground" className={pathname === '/playground' ? 'active' : ''}>Trải nghiệm</Link>
          <Link href="/docs" className={pathname === '/docs' ? 'active' : ''}>Tài liệu</Link>
          <a href="#pricing" className="nav-link">Bảng giá</a>
          <a href="#blog" className="nav-link">Blog</a>
        </nav>
        
        <div className="header-actions">
          <Link href="/login" className="btn-secondary">Đăng nhập</Link>
          <Link href="/register" className="btn-primary">Đăng ký</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
