'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { FiArrowLeft, FiSave, FiAlertCircle } from 'react-icons/fi';

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug: postSlug } = use(params);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    thumbnail: '',
    categoryId: '',
    status: 'published',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catsRes] = await Promise.all([
          api.get(`/api/v1/posts/${postSlug}`),
          api.get('/api/v1/categories')
        ]);

        if (postRes.data.success) {
          const post = postRes.data.data.post;
          setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            thumbnail: post.thumbnail || '',
            categoryId: post.categoryId || post.category?._id || post.category?.id || '',
            status: post.status || 'published',
          });
        }

        if (catsRes.data.success) {
          setCategories(catsRes.data.data.categories || []);
        }
      } catch (err: any) {
        console.error('Failed to fetch data', err);
        setError(err.message || 'Failed to load post data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.patch(`/api/v1/posts/${postSlug}`, formData);
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading post data...</div>;

  return (
    <div className="edit-post-page">
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} className="admin-btn-icon">
            <FiArrowLeft />
          </button>
          <h1 className="admin-title">Edit <span className="gradient-text">Post</span></h1>
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
                value={formData.title}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Slug (URL)</label>
              <input 
                type="text" 
                name="slug" 
                className="admin-form-input" 
                value={formData.slug}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Content (Markdown/HTML)</label>
              <textarea 
                name="content" 
                className="admin-form-textarea" 
                style={{ minHeight: '400px' }}
                value={formData.content}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-column-sidebar">
            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <select 
                name="categoryId" 
                className="admin-form-select" 
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Thumbnail URL</label>
              <input 
                type="text" 
                name="thumbnail" 
                className="admin-form-input" 
                value={formData.thumbnail}
                onChange={handleChange}
              />
              {formData.thumbnail && (
                <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img src={formData.thumbnail} alt="Preview" style={{ width: '100%', display: 'block' }} />
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
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={saving}>
                <FiSave /> {saving ? 'Updating...' : 'Save Changes'}
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
