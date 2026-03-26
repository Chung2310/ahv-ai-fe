'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/v1/posts');
      console.log('Posts API Response:', response.data);
      if (response.data.success) {
        const data = response.data.data?.posts || response.data.data || [];
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/api/v1/posts/${id}`);
      setPosts(posts.filter(p => (p._id || p.id) !== id));
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  return (
    <div className="admin-posts">
      <header className="admin-header">
        <h1 className="admin-title">Manage <span className="gradient-text">Posts</span></h1>
        <Link href="/admin/posts/new" className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> New Post
        </Link>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading posts...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>No posts found.</td></tr>
            ) : posts.map((post) => (
              <tr key={post._id || post.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{post.title}</div>
                </td>
                <td>
                  <span className="admin-badge admin-badge-warning">{post.category?.name || 'Uncategorized'}</span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-success">{post.status || 'Published'}</span>
                </td>
                <td>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Link href={`/blog/${post._id || post.id}`} target="_blank" className="admin-btn-icon" title="View">
                      <FiExternalLink />
                    </Link>
                    <Link href={`/admin/posts/edit/${post._id || post.id}`} className="admin-btn-icon" title="Edit">
                      <FiEdit2 />
                    </Link>
                    <button onClick={() => handleDelete(post._id || post.id)} className="admin-btn-icon danger" title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .admin-btn-icon {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        .admin-btn-icon:hover {
          color: var(--primary);
        }
        .admin-btn-icon.danger:hover {
          color: #ff3e3e;
        }
      `}</style>
    </div>
  );
}
