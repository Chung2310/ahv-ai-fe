'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/Reveal/Reveal';
import Magnetic from '@/components/Effects/Magnetic';
import api from '@/lib/api';
import './profile.css';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
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
        const response = await api.get('/api/v1/users/me');
        if (response.data.success) {
          const freshUser = response.data.data;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (err: any) {
        console.error('Failed to fetch user in Profile', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Reveal>
      <main className="profile-page">
        {/* Background Effects */}
        <div className="mesh-bg-container">
          <div className="mesh-blob blob-green"></div>
          <div className="mesh-blob blob-accent"></div>
        </div>
        <div className="cyber-grid"></div>

        <div className="profile-container container">
          <div className="profile-header-nav">
            <Link href="/" className="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Home
            </Link>
          </div>

          <div className="profile-card glass">
            <div className="profile-banner"></div>
            
            <div className="profile-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {user?.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="avatar-edit-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                </div>
                
                <div className="profile-main-info">
                  <h1 className="profile-name">{user?.username}</h1>
                  <span className="profile-role-badge">{user?.role || 'User'}</span>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <label>Email Address</label>
                  <p className="detail-value">{user?.email}</p>
                </div>
                <div className="detail-item">
                  <label>Account Status</label>
                  <div className="status-tag active">
                    <span className="dot"></span>
                    {user?.status || 'Active'}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Member Since</label>
                  <p className="detail-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="profile-actions">
                <Magnetic>
                  <Link href="/workspace" className="btn-workspace-link">
                    Open AI Workspace
                  </Link>
                </Magnetic>
                <button className="btn-logout-alt" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Reveal>
  );
}
