'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FiArrowLeft, FiSave, FiAlertCircle, FiUpload } from 'react-icons/fi';

export default function EditPost({ params }: { params: Promise<{ postId: string }> }) {
  const router = useRouter();
  const { postId } = use(params);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    categoryId: '',
    status: 'published',
  });
  const [originalData, setOriginalData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories');
      if (response.data.success) {
        const cats = response.data.data?.categories || response.data.data || [];
        setCategories(Array.isArray(cats) ? cats : []);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await api.get(`/api/v1/posts/${postId}`);
        await fetchCategories();

        if (postRes.data.success) {
          const post = postRes.data.data.post || postRes.data.data;
          
          // Get category ID correctly from populated object
          let catId = '';
          if (post.categoryId) {
            catId = typeof post.categoryId === 'string' ? post.categoryId : (post.categoryId._id || post.categoryId.id || '');
          }

          const initialData = {
            title: post.title,
            content: post.content,
            image: post.image || post.thumbnail || '',
            categoryId: catId,
            status: post.status || 'published',
          };
          setFormData(initialData);
          setOriginalData(initialData);
        }
      } catch (err: any) {
        console.error('Failed to fetch data', err);
        setError(err.message || 'Failed to load post data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: any = {};
      const finalImage = formData.image || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      
      if (formData.title !== originalData?.title) payload.title = formData.title;
      if (formData.content !== originalData?.content) payload.content = formData.content;
      if (finalImage !== (originalData?.image || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')) payload.image = finalImage;
      if (formData.categoryId !== originalData?.categoryId) payload.categoryId = formData.categoryId;
      if (formData.status !== originalData?.status) payload.status = formData.status;

      if (Object.keys(payload).length > 0) {
        await api.put(`/api/v1/posts/${postId}`, payload);
      }
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-loading" style={{ padding: '40px', textAlign: 'center' }}>
      <div className="loader" style={{ margin: '0 auto 20px' }}></div>
      <p>Loading post data...</p>
    </div>
  );

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
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={saving}>
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
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
