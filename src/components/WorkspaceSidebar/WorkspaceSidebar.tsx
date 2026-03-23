'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './WorkspaceSidebar.css';

const WorkspaceSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Overview', icon: '📊', path: '/workspace' },
    { title: 'API Keys', icon: '🔑', path: '/workspace/api-keys' },
    { title: 'Usage', icon: '📈', path: '/workspace/usage' },
    { title: 'Billing', icon: '💳', path: '/workspace/billing' },
    { title: 'Settings', icon: '⚙️', path: '/workspace/settings' },
  ];

  return (
    <aside className="workspace-sidebar">
      <div className="sidebar-brand">
        <Link href="/" className="brand-link">
          <div className="logo-icon">π</div>
          <span>PiAPI</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`sidebar-link ${pathname === item.path ? 'active' : ''}`}
          >
            <span className="link-icon">{item.icon}</span>
            <span className="link-title">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-plan">Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
