'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FiFileText, FiLayers, FiUsers, FiActivity } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    users: 0,
    jobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, catsRes, usersRes] = await Promise.all([
          api.get('/api/v1/posts', { headers: { 'Cache-Control': 'no-cache' } }),
          api.get('/api/v1/categories', { headers: { 'Cache-Control': 'no-cache' } }),
          api.get('/api/v1/users', { headers: { 'Cache-Control': 'no-cache' } })
        ]);

        const postData = postsRes.data.data?.posts || postsRes.data.data || [];
        const catData = catsRes.data.data?.categories || catsRes.data.data || [];
        const userData = usersRes.data.data || [];
        
        setStats({
          posts: postsRes.data.data.total || (Array.isArray(postData) ? postData.length : 0),
          categories: catsRes.data.data.total || (Array.isArray(catData) ? catData.length : 0),
          users: usersRes.data.meta?.totalItems || (Array.isArray(userData) ? userData.length : 0),
          jobs: 124 // Placeholder
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1 className="admin-title">Dashboard <span className="gradient-text">Overview</span></h1>
        <div className="admin-badge admin-badge-success">System Online</div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Posts</div>
          <div className="stat-value">{loading ? '...' : stats.posts}</div>
          <FiFileText style={{ marginTop: '12px', color: 'var(--primary)' }} />
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{loading ? '...' : stats.categories}</div>
          <FiLayers style={{ marginTop: '12px', color: 'var(--primary)' }} />
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{loading ? '...' : stats.users}</div>
          <FiUsers style={{ marginTop: '12px', color: 'var(--primary)' }} />
        </div>
        <div className="stat-card">
          <div className="stat-label">AI Jobs</div>
          <div className="stat-value">{loading ? '...' : stats.jobs}</div>
          <FiActivity style={{ marginTop: '12px', color: 'var(--primary)' }} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-subtitle" style={{ marginBottom: '20px' }}>Recent Activity</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Create New Post</td>
                <td>admin</td>
                <td><span className="admin-badge admin-badge-success">Success</span></td>
                <td>2 mins ago</td>
              </tr>
              <tr>
                <td>Update Category</td>
                <td>superadmin</td>
                <td><span className="admin-badge admin-badge-success">Success</span></td>
                <td>15 mins ago</td>
              </tr>
              <tr>
                <td>Face Swap Job</td>
                <td>user_123</td>
                <td><span className="admin-badge admin-badge-warning">Processing</span></td>
                <td>1 hour ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
