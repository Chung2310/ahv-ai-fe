'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar/AdminSidebar';
import api from '@/lib/api';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Initial check from localStorage
        const storedUser = localStorage.getItem('user');
        let user = storedUser ? JSON.parse(storedUser) : null;

        // Verify with server for security
        const response = await api.get('/api/v1/auths/me');
        if (response.data.success) {
          user = response.data.data.user;
          localStorage.setItem('user', JSON.stringify(user));
        }

        if (user.role === 'admin' || user.role === 'superadmin') {
          setAuthorized(true);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Admin Auth Check Failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Verifying Authority...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
