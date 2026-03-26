'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories');
      console.log('Categories API Response:', response.data);
      if (response.data.success) {
        const data = response.data.data?.categories || response.data.data || [];
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/api/v1/categories', newCat);
      if (response.data.success) {
        setCategories([...categories, response.data.data]);
        setNewCat({ name: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will affect all posts in this category.')) return;
    
    try {
      await api.delete(`/api/v1/categories/${id}`);
      setCategories(categories.filter(c => (c._id || c.id) !== id));
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="admin-categories">
      <header className="admin-header">
        <h1 className="admin-title">Manage <span className="gradient-text">Categories</span></h1>
      </header>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        <div className="category-form-container">
          <h2 className="section-subtitle" style={{ marginBottom: '20px' }}>Add New Category</h2>
          <form className="admin-form" onSubmit={handleAddCategory} style={{ padding: '24px' }}>
            {error && (
              <div className="error-alert" style={{ marginBottom: '16px', color: '#ff3e3e', fontSize: '0.85rem' }}>
                <FiAlertCircle /> {error}
              </div>
            )}
            <div className="admin-form-group">
              <label className="admin-form-label">Category Name</label>
              <input 
                type="text" 
                className="admin-form-input" 
                placeholder="e.g. Technology" 
                value={newCat.name}
                onChange={(e) => {
                  setNewCat({ name: e.target.value });
                }}
                required 
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        <div className="category-list-container">
          <h2 className="section-subtitle" style={{ marginBottom: '20px' }}>Existing Categories</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Posts</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat._id || cat.id}>
                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                    <td>{cat.postCount || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleDelete(cat._id || cat.id)} className="admin-btn-icon danger">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-btn-icon {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }
        .admin-btn-icon:hover.danger {
          color: #ff3e3e;
        }
      `}</style>
    </div>
  );
}
