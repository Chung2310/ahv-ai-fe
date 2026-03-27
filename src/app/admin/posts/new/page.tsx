'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FiArrowLeft, FiSave, FiAlertCircle, FiUpload } from 'react-icons/fi';

export default function NewPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    categoryId: '',
    status: 'published',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories');
      console.log('Categories API Response:', response.data);
      if (response.data.success) {
        const cats = response.data.data?.categories || response.data.data || [];
        setCategories(Array.isArray(cats) ? cats : []);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      setError(err.message || 'Lỗi khi upload ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      };
      await api.post('/api/v1/posts', payload);
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-page">
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} className="admin-btn-icon">
            <FiArrowLeft />
          </button>
          <h1 className="admin-title">Create <span className="gradient-text">New Post</span></h1>
        </div>
      </header>

      {error && (
        <div className="error-alert" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 62, 62, 0.1)', border: '1px solid #ff3e3e', borderRadius: '12px', color: '#ff3e3e', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiAlertCircle />
          {error}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div className="form-column-main">
            <div className="admin-form-group">
              <label className="admin-form-label">Post Title</label>
              <input 
                type="text" 
                name="title" 
                className="admin-form-input" 
                placeholder="Enter post title" 
                value={formData.title}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Content (Markdown/HTML)</label>
              <textarea 
                name="content" 
                className="admin-form-textarea" 
                placeholder="Write your post content here..." 
                style={{ minHeight: '400px' }}
                value={formData.content}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-column-sidebar">
            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="admin-form-label" style={{ marginBottom: 0 }}>Category</label>
                <button 
                  type="button" 
                  onClick={fetchCategories} 
                  className="text-xs text-primary hover:underline"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary)' }}
                >
                  Refresh
                </button>
              </div>
              <select 
                name="categoryId" 
                className="admin-form-select" 
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                  ))
                ) : (
                  <option value="" disabled>No categories found</option>
                )}
              </select>
              {categories.length === 0 && (
                <p style={{ fontSize: '0.7rem', color: '#ffaa00', marginTop: '6px' }}>
                  No categories found. <Link href="/admin/categories" className="underline">Create one first.</Link>
                </p>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Thumbnail URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  name="image" 
                  className="admin-form-input" 
                  placeholder="https://..." 
                  value={formData.image}
                  onChange={handleChange}
                />
                <label className="admin-btn admin-btn-secondary" style={{ padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                  <FiUpload /> {uploading ? '...' : 'Upload'}
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {formData.image && (
                <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', display: 'block' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select 
                name="status" 
                className="admin-form-select" 
                value={formData.status}
                onChange={handleChange}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div style={{ marginTop: '40px' }}>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={loading}>
                <FiSave /> {loading ? 'Saving...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      <style jsx>{`
        .admin-btn-icon {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }
        .admin-btn-icon:hover {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
        }
      `}</style>
    </div>
  );
}
