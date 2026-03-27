'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { 
  FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiTrash2, FiActivity, 
  FiCpu, FiDollarSign, FiInfo, FiX, FiCheckCircle, FiAlertCircle,
  FiUpload
} from 'react-icons/fi';

interface AIModel {
  _id: string;
  name: string;
  description: string;
  price: string;
  status: 'active' | 'inactive';
  image?: string;
  provider: string;
  payload?: any; 
}

export default function AdminAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    image: '',
    provider: 'ahv',
    payload: ''
  });

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/aimodels');
      if (response.data.success) {
        setModels(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch AI models', err);
      setError('Không thể tải danh sách AI models.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleOpenModal = (model: AIModel | null = null) => {
    if (model) {
      setEditingModel(model);
      // Convert payload object to string if it exists
      const payloadStr = model.payload 
        ? (typeof model.payload === 'string' ? model.payload : JSON.stringify(model.payload, null, 2))
        : '';

      setFormData({
        name: model.name || '',
        description: model.description || '',
        price: String(model.price || ''),
        status: model.status || 'active',
        image: model.image || '',
        provider: model.provider || 'ahv',
        payload: payloadStr
      });
    } else {
      setEditingModel(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        status: 'active',
        image: '',
        provider: 'ahv',
        payload: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi upload ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const formatJson = () => {
    try {
      if (!formData.payload.trim()) return;
      const parsed = JSON.parse(formData.payload);
      setFormData(prev => ({ ...prev, payload: JSON.stringify(parsed, null, 2) }));
    } catch (err) {
      alert('Định dạng JSON không hợp lệ. Vui lòng kiểm tra lại.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Send payload as string directly as requested
      const submitData = { 
        ...formData, 
        payload: formData.payload.trim() 
      };

      if (editingModel) {
        // Update
        const response = await api.put(`/api/v1/aimodels/${editingModel._id}`, submitData);
        if (response.data.success) {
          fetchModels();
          setIsModalOpen(false);
        }
      } else {
        // Create
        const response = await api.post('/api/v1/aimodels', submitData);
        if (response.data.success) {
          fetchModels();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu model.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa model "${name}"?`)) return;
    try {
      const response = await api.delete(`/api/v1/aimodels/${id}`);
      if (response.data.success) {
        fetchModels();
      }
    } catch (errBy: any) {
      alert('Lỗi khi xóa model.');
    }
  };

  const filteredModels = models.filter(m => 
    (m.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-aimodels">
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-title">Quản lý <span className="gradient-text">AI Models</span></h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="admin-search-box" style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm model..." 
              className="admin-form-input"
              style={{ paddingLeft: '40px', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus /> Thêm Model
          </button>
        </div>
      </header>

      {error && (
        <div className="error-alert" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,62,62,0.1)', border: '1px solid #ff3e3e', borderRadius: '12px', color: '#ff3e3e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiAlertCircle /> {error}
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              <th>Giá (COINS)</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh sách model...</td></tr>
            ) : filteredModels.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy dữ liệu nào.</td></tr>
            ) : filteredModels.map((model) => (
              <tr key={model._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.05)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {model.image ? (
                        model.image.match(/\.(mp4|webm|ogg|mov)$|^data:video/i) || model.image.includes('/video/upload/') ? (
                          <video 
                            src={model.image} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                          />
                        ) : (
                          <img src={model.image} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )
                      ) : (
                        <FiCpu style={{ color: 'var(--primary)' }} />
                      )}
                    </div>
                    <div style={{ fontWeight: 600 }}>{model.name}</div>
                  </div>
                </td>
                <td style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {model.provider}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {model.price}
                </td>
                <td>
                  <span className={`admin-badge ${model.status === 'active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {model.status === 'active' ? 'ĐANG CHẠY' : 'DỪNG'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="admin-btn-icon" onClick={() => handleOpenModal(model)} title="Sửa">
                      <FiEdit2 size={16} />
                    </button>
                    <button className="admin-btn-icon" style={{ color: '#ff3e3e' }} onClick={() => handleDelete(model._id, model.name)} title="Xóa">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '95%' }}>
            <div className="modal-header">
              <h2>{editingModel ? 'Sửa AI Model' : 'Thêm AI Model Mới'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSaveModel} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-left-col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Tên Model</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="admin-form-input" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Ví dụ: Face Swap HD"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Provider</label>
                    <select name="provider" className="admin-form-select" value={formData.provider} onChange={handleInputChange}>
                      <option value="ahv">AHV</option>
                      <option value="openai">OpenAI</option>
                      <option value="replicate">Replicate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Giá (COINS)</label>
                      <input 
                        type="text" 
                        name="price" 
                        className="admin-form-input" 
                        value={formData.price} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Ví dụ: 50"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Trạng thái</label>
                      <select name="status" className="admin-form-select" value={formData.status} onChange={handleInputChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Ảnh/Video Model (Media)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        name="image" 
                        className="admin-form-input" 
                        value={formData.image} 
                        onChange={handleInputChange} 
                        placeholder="URL hoặc tải lên"
                      />
                      <label className="admin-btn admin-btn-secondary" style={{ padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiUpload />
                        <input type="file" hidden accept="image/*,video/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                    {formData.image || uploading ? (
                      <div style={{ 
                        marginTop: '12px', 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        border: '1px solid var(--glass-border)', 
                        height: '150px', 
                        background: 'rgba(0,0,0,0.2)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {uploading ? (
                          <div style={{ textAlign: 'center' }}>
                            <div className="spinner" style={{ margin: '0 auto 8px' }}></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Đang tải lên...</div>
                          </div>
                        ) : formData.image.match(/\.(mp4|webm|ogg|mov)$|^data:video/i) || formData.image.includes('/video/upload/') ? (
                          <video 
                            src={formData.image} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                          />
                        ) : (
                          <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Mô tả</label>
                    <textarea 
                      name="description" 
                      className="admin-form-textarea" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={3} 
                      placeholder="Mô tả chức năng..."
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className="form-right-col">
                  <div className="admin-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="admin-form-label" style={{ marginBottom: 0 }}>Dữ liệu cấu hình (Payload JSON)</label>
                      <button type="button" onClick={formatJson} className="text-xs text-primary hover:underline" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.75rem' }} disabled={uploading}>
                        Format JSON
                      </button>
                    </div>
                    <textarea 
                      name="payload" 
                      className="admin-form-textarea" 
                      value={formData.payload} 
                      onChange={handleInputChange} 
                      rows={12} 
                      placeholder='{ "task": "faceswap", ... }'
                      style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }} disabled={saving || uploading}>
                  {saving ? 'Đang lưu...' : uploading ? 'Đang chờ tải tệp...' : (editingModel ? 'Cập nhật' : 'Tạo mới')}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)} disabled={uploading}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          padding: 24px;
        }
        .modal-content {
          background: #0f172a;
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modal-close {
          background: none; border: none; color: var(--text-secondary);
          font-size: 1.5rem; cursor: pointer; display: flex;
        }
        .admin-btn-icon {
          background: none; border: none; color: var(--text-secondary);
          cursor: pointer; padding: 6px; border-radius: 8px; transition: all 0.2s;
        }
        .admin-btn-icon:hover {
          color: var(--primary);
          background: rgba(255,255,255,0.05);
        }
        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
