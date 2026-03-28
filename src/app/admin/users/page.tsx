'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FiTrash2, FiUserCheck, FiShield, FiMoreVertical, FiAlertCircle, FiEdit2, FiPlus, FiX } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/v1/users', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      console.log('Users API Response:', response.data);
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch users', err);
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (email.includes('admin') || email.includes('superadmin')) {
      alert('Không thể xóa tài khoản quản trị hệ thống.');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa người dùng "${email}"? Hành động này không thể hoàn tác.`)) return;

    try {
      await api.delete(`/api/v1/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa người dùng.');
    }
  };

  const handleChangeRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Xác nhận đổi quyền của người dùng này thành ${newRole}?`)) return;

    try {
      await api.put(`/api/v1/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thay đổi quyền.');
    }
  };

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't show password
        role: user.role || 'user',
        status: user.status || 'active'
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        status: ''
      });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingUser) {
        // Update user
        const id = editingUser._id || editingUser.id;
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password
        
        // Optimize: check what changed
        const updatePayload: any = {};
        if (formData.name !== editingUser.name) updatePayload.name = formData.name;
        if (formData.email !== editingUser.email) updatePayload.email = formData.email;
        if (formData.password) updatePayload.password = formData.password;
        if (formData.role !== editingUser.role) updatePayload.role = formData.role;
        if (formData.status !== (editingUser.status || 'active')) updatePayload.status = formData.status;

        if (Object.keys(updatePayload).length > 0) {
          const response = await api.put(`/api/v1/users/${id}`, updatePayload);
          if (response.data.success) {
            await fetchUsers(); // Re-fetch to get latest data
          }
        }
      } else {
        // Create user using Register API
        const response = await api.post('/api/v1/auths/register', formData);
        if (response.data.success) {
          await fetchUsers(); // Re-fetch to get latest data
        }
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu thông tin người dùng.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-users">
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-title">Quản lý <span className="gradient-text">Người dùng</span></h1>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Thêm người dùng mới
        </button>
      </header>

      {error && (
        <div className="error-alert" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 62, 62, 0.1)', border: '1px solid #ff3e3e', borderRadius: '12px', color: '#ff3e3e', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiAlertCircle />
          {error}
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Đang tải người dùng...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy người dùng nào.</td></tr>
            ) : users.map((user) => (
              <tr key={user._id || user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-glow)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'var(--primary)'
                    }}>
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name || 'Người dùng'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-badge ${user.role === 'admin' || user.role === 'superadmin' ? 'admin-badge-primary' : 'admin-badge-secondary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${user.status === 'active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                 <td>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleOpenModal(user)} 
                      className="admin-btn-icon" 
                      title="Sửa thông tin"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleChangeRole(user._id || user.id, user.role)} 
                      className="admin-btn-icon" 
                      title="Đổi vai trò"
                      disabled={user.role === 'superadmin'}
                    >
                      <FiShield />
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id || user.id, user.email)} 
                      className="admin-btn-icon danger" 
                      title="Xóa"
                      disabled={user.role === 'superadmin'}
                    >
                      <FiTrash2 />
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
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}</h2>
              <button className="modal-close" onClick={handleCloseModal}><FiX /></button>
            </div>
            <form onSubmit={handleSaveUser} className="admin-form" autoComplete="off">
              {error && (
                <div className="error-alert" style={{ marginBottom: '16px', color: '#ff3e3e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiAlertCircle /> {error}
                </div>
              )}
              
              <div className="admin-form-group">
                <label className="admin-form-label">Tên người dùng (Họ và tên)</label>
                <input 
                  type="text" 
                  name="name"
                  className="admin-form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="admin-form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Mật khẩu {editingUser && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>(Để trống nếu không đổi)</span>}
                </label>
                <input 
                  type="password" 
                  name="password"
                  className="admin-form-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                  placeholder={editingUser ? "••••••••" : "Nhập mật khẩu mới"}
                  autoComplete="new-password"
                />
              </div>

              <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Vai trò</label>
                  <select 
                    name="role"
                    className="admin-form-select"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Chọn vai trò</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Trạng thái</label>
                  <select 
                    name="status"
                    className="admin-form-select"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Chọn trạng thái</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-badge-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
        }
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
        .admin-btn-icon:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          background: #0f172a;
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          width: 100%;
          padding: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .modal-close:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
