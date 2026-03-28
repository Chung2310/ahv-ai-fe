'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/Effects/Magnetic';
import api from '@/lib/api';
import './Header.css';

const Header = () => {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        return;
      }

      // Initial state from localStorage for faster UI
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }

      try {
        const response = await api.get('/api/v1/auths/me');
        if (response.data.success) {
          const freshUser = response.data.data.user;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (err: any) {
        console.error('Failed to fetch user', err);
        // If unauthorized, clear storage
        if (err.response?.status === 401) {
          localStorage.clear();
          setUser(null);
        }
      }
    };

    fetchUser();
    
    // Listen for storage changes (for cross-tab sync)
    window.addEventListener('storage', fetchUser);
    return () => window.removeEventListener('storage', fetchUser);
  }, []);
  
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
          <Magnetic><Link href="/pricing" className={pathname === '/pricing' ? 'active' : ''}>Pricing</Link></Magnetic>
          <Magnetic><Link href="/blog" className={pathname === '/blog' ? 'active' : ''}>Blog</Link></Magnetic>
          <Magnetic><Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link></Magnetic>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <Magnetic><Link href="/admin" className="nav-link admin-link-highlight">Admin</Link></Magnetic>
          )}
        </nav>
        
        <div className="header-actions">
          {user ? (
            <Magnetic>
              <Link href="/profile" className="user-avatar-container">
                <div className="avatar-wrapper">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name || user?.username || 'User'} className="user-avatar-img" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {(user?.name || user?.username || 'U').charAt(0)}
                    </div>
                  )}
                </div>
                <span className="user-name-min">{user?.name || user?.username || 'User'}</span>
              </Link>
            </Magnetic>
          ) : (
            <>
              <Magnetic><Link href="/login" className="btn-secondary">Login</Link></Magnetic>
              <Magnetic><Link href="/register" className="btn-primary">Register</Link></Magnetic>
            </>
          )}
        </div>
      </div>
    </header>
  );
};


export default Header;
