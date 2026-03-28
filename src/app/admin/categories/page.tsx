'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FiPlus, FiTrash2, FiAlertCircle, FiEdit2, FiX } from 'react-icons/fi';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '' });
  const [editingCat, setEditingCat] = useState<any>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Only send name for category update/create as that's the only editable field here
    const payload = { name: newCat.name };

    try {
      if (editingCat) {
        // Update existing category
        const id = editingCat._id || editingCat.id;
        const response = await api.put(`/api/v1/categories/${id}`, payload);
        if (response.data.success) {
          await fetchCategories(); // Re-fetch to get latest data
          handleCancel();
        }
      } else {
        // Create new category
        const response = await api.post('/api/v1/categories', payload);
        if (response.data.success) {
          await fetchCategories(); // Re-fetch to get latest data
          setNewCat({ name: '' });
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${editingCat ? 'update' : 'create'} category`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCat(cat);
    setNewCat({ name: cat.name });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingCat(null);
    setNewCat({ name: '' });
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will affect all posts in this category.')) return;
    
    try {
      await api.delete(`/api/v1/categories/${id}`);
      fetchCategories();
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
          <h2 className="section-subtitle" style={{ marginBottom: '20px' }}>
            {editingCat ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form className="admin-form" onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && (
              <div className="error-alert" style={{ marginBottom: '16px', color: '#ff3e3e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Processing...' : (editingCat ? 'Update Category' : 'Add Category')}
              </button>
              {editingCat && (
                <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiX /> Cancel
                </button>
              )}
            </div>
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
                        <button 
                          onClick={() => handleEdit(cat)} 
                          className="admin-btn-icon" 
                          title="Edit Category"
                          style={{ color: (editingCat?._id === cat._id || editingCat?.id === cat.id) ? 'var(--primary)' : 'inherit' }}
                        >
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(cat._id || cat.id)} className="admin-btn-icon danger" title="Delete Category">
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
