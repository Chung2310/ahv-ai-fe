'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiFileText, FiLayers, FiUsers, FiSettings, FiArrowLeft, FiCheckSquare, FiCreditCard, FiCpu, FiMessageSquare } from 'react-icons/fi';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Dashboard', icon: <FiGrid />, path: '/admin' },
    { title: 'Posts', icon: <FiFileText />, path: '/admin/posts' },
    { title: 'Categories', icon: <FiLayers />, path: '/admin/categories' },
    { title: 'Users', icon: <FiUsers />, path: '/admin/users' },
    { title: 'Tasks', icon: <FiCheckSquare />, path: '/admin/tasks' },
    { title: 'Wallets', icon: <FiCreditCard />, path: '/admin/wallets' },
    { title: 'Tickets', icon: <FiMessageSquare />, path: '/admin/tickets' },
    { title: 'AI Models', icon: <FiCpu />, path: '/admin/aimodels' },
    { title: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link href="/" className="admin-logo">
          <div className="admin-logo-icon">A</div>
          <span>Admin <span className="gradient-text">Panel</span></span>
        </Link>
      </div>
      
      <nav className="admin-nav">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`admin-nav-link ${pathname === item.path ? 'active' : pathname.startsWith(item.path + '/') ? 'active' : ''}`}
          >
            <span className="admin-link-icon">{item.icon}</span>
            <span className="admin-link-title">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer" style={{ padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
        <Link href="/" className="admin-nav-link">
          <FiArrowLeft />
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
