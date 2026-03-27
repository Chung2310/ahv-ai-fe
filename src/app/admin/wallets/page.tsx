'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { 
  FiSearch, FiRefreshCw, FiCreditCard, FiPlus, FiMinus, 
  FiUser, FiAlertCircle, FiX, FiCheckCircle, FiClock, FiActivity, FiList
} from 'react-icons/fi';

interface UserWallet {
  _id: string;
  userId: string;
  name?: string;
  email: string;
  balance: number;
  totalSpent?: number;
}

export default function AdminWallets() {
  const [users, setUsers] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWallet | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Task History Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState('');

  const fetchBalances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/wallets');
      if (response.data.success) {
        const rawData = response.data.data || [];
        // Flatten nested user info if it exists
        const flattenedData = rawData.map((item: any) => ({
          ...item,
          userId: item.user?._id || item.user?.id || item.userId || item._id,
          email: item.email || item.user?.email || '',
          name: item.name || item.user?.name || item.user?.username || ''
        }));
        setUsers(flattenedData);
      }
    } catch (err: any) {
      console.error('Failed to fetch balances', err);
      setError('Không thể tải thông tin ví người dùng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const handleOpenAdjust = (user: UserWallet, type: 'add' | 'subtract') => {
    setSelectedUser(user);
    setAdjustmentType(type);
    setAmount(0);
    setNote('');
    setIsModalOpen(true);
    setError('');
  };

  const fetchUserTasks = async (userId: string) => {
    setLoadingTasks(true);
    setTaskError('');
    try {
      const response = await api.get(`/api/v1/tasks/user/${userId}`);
      if (response.data.success) {
        setUserTasks(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch user tasks', err);
      setTaskError('Không thể tải lịch sử task của người dùng.');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleOpenTaskHistory = (user: UserWallet) => {
    setSelectedUser(user);
    setIsTaskModalOpen(true);
    fetchUserTasks(user.userId);
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || amount <= 0) return;

    setSaving(true);
    setError('');

    try {
      const finalAmount = adjustmentType === 'add' ? amount : -amount;
      const response = await api.post(`/api/v1/wallets/balance/${selectedUser.userId}`, {
        amount: finalAmount,
        note: note
      });

      if (response.data.success) {
        await fetchBalances();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi điều chỉnh số dư.');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-wallets">
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-title">Quản lý <span className="gradient-text">Ví Người Dùng</span></h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="admin-search-box" style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo email hoặc tên..." 
              className="admin-form-input"
              style={{ paddingLeft: '40px', width: '300px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={fetchBalances} disabled={loading}>
            <FiRefreshCw className={loading ? 'spin' : ''} /> Làm mới
          </button>
        </div>
      </header>

      {error && !isModalOpen && (
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
              <th>Số dư hiện tại</th>
              <th>Tổng đã sử dụng</th>
              <th style={{ textAlign: 'right' }}>Điều chỉnh nhanh</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>Đang tải thông tin ví...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy người dùng nào.</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user._id}>
                <td onClick={() => handleOpenTaskHistory(user)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'rgba(0, 243, 255, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                      <FiUser />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {user.balance.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>COINS</span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {user.totalSpent?.toLocaleString() || 0} COINS
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      className="admin-btn-adjust add" 
                      onClick={() => handleOpenAdjust(user, 'add')}
                      title="Nạp thêm"
                    >
                      <FiPlus />
                    </button>
                    <button 
                      className="admin-btn-adjust subtract" 
                      onClick={() => handleOpenAdjust(user, 'subtract')}
                      title="Trừ bớt"
                    >
                      <FiMinus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiCreditCard className="gradient-text" style={{ fontSize: '1.5rem' }} />
                <h2 style={{ margin: 0 }}>{adjustmentType === 'add' ? 'Nạp tiền' : 'Trừ tiền'}</h2>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>

            <form onSubmit={handleAdjustBalance} className="admin-form" style={{ background: 'none', border: 'none', padding: 0 }}>
              {error && (
                <div className="error-alert" style={{ marginBottom: '16px', color: '#ff3e3e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiAlertCircle /> {error}
                </div>
              )}

              <div className="user-info-brief" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Đang điều chỉnh cho:</div>
                <div style={{ fontWeight: 700 }}>{selectedUser.name || selectedUser.email}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '8px' }}>
                  Số dư hiện tại: {selectedUser.balance.toLocaleString()} COINS
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Số lượng (COINS)</label>
                <input 
                  type="number" 
                  className="admin-form-input"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Nhập số lượng..."
                  min="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Ghi chú / Lý do</label>
                <textarea 
                  className="admin-form-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Nạp tiền khuyến mãi, Trừ phí dịch vụ..."
                  rows={3}
                  required
                />
              </div>

              <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  className={`admin-btn ${adjustmentType === 'add' ? 'admin-btn-primary' : 'admin-btn-danger'}`}
                  style={{ flex: 1 }}
                  disabled={saving}
                >
                  {saving ? 'Đang lý...' : (adjustmentType === 'add' ? 'Xác nhận nạp' : 'Xác nhận trừ')}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTaskModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiActivity className="gradient-text" style={{ fontSize: '1.5rem' }} />
                <div>
                  <h2 style={{ margin: 0 }}>Lịch sử Task</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Người dùng: {selectedUser.name || selectedUser.email}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setIsTaskModalOpen(false)}><FiX /></button>
            </div>

            <div className="task-history-summary" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="stat-card" style={{ padding: '16px' }}>
                <div className="stat-label">Tổng số task</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{userTasks.length}</div>
              </div>
              <div className="stat-card" style={{ padding: '16px', borderLeft: '4px solid var(--primary)' }}>
                <div className="stat-label">Tổng chi tiêu</div>
                <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                  {userTasks.reduce((acc, task) => acc + (task.price || 0), 0).toLocaleString()} <span style={{ fontSize: '0.8rem' }}>COINS</span>
                </div>
              </div>
            </div>

            <div className="admin-table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="admin-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th>Tên Task</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTasks ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
                  ) : userTasks.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Không có task nào.</td></tr>
                  ) : userTasks.map((task) => (
                    <tr key={task._id}>
                      <td><div style={{ fontWeight: 500 }}>{task.name || 'AI Task'}</div></td>
                      <td><span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{task.type}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{task.price?.toLocaleString() || 0}</td>
                      <td>
                        <span className={`admin-badge ${task.status === 'COMPLETED' ? 'admin-badge-success' : task.status === 'FAILED' ? 'admin-badge-danger' : 'admin-badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString('vi-VN') : '---'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className="admin-btn admin-btn-secondary" onClick={() => setIsTaskModalOpen(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-btn-adjust {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-btn-adjust.add:hover {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          border-color: #00ff88;
        }

        .admin-btn-adjust.subtract:hover {
          background: rgba(255, 62, 62, 0.1);
          color: #ff3e3e;
          border-color: #ff3e3e;
        }

        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
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
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
          animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
        }
      `}</style>
    </div>
  );
}
