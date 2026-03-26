'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FiTrash2, FiUserCheck, FiShield, FiMoreVertical, FiAlertCircle } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/v1/users');
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

  const handleDelete = async (id: string, username: string) => {
    if (username === 'admin' || username === 'superadmin') {
      alert('Không thể xóa tài khoản quản trị hệ thống.');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa người dùng "${username}"? Hành động này không thể hoàn tác.`)) return;

    try {
      await api.delete(`/api/v1/users/${id}`);
      setUsers(users.filter(u => (u._id || u.id) !== id));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa người dùng.');
    }
  };

  const handleChangeRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Xác nhận đổi quyền của người dùng này thành ${newRole}?`)) return;

    try {
      await api.put(`/api/v1/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => {
        if ((u._id || u.id) === id) return { ...u, role: newRole };
        return u;
      }));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thay đổi quyền.');
    }
  };

  return (
    <div className="admin-users">
      <header className="admin-header">
        <h1 className="admin-title">Quản lý <span className="gradient-text">Người dùng</span></h1>
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
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.username}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID: {user._id || user.id}</div>
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
                      onClick={() => handleChangeRole(user._id || user.id, user.role)} 
                      className="admin-btn-icon" 
                      title="Đổi vai trò"
                      disabled={user.role === 'superadmin'}
                    >
                      <FiShield />
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id || user.id, user.username)} 
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
      `}</style>
    </div>
  );
}
