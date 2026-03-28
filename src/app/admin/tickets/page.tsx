'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FiTrash2, FiEye, FiCheckCircle, FiClock, FiAlertCircle, FiX, FiRefreshCcw, FiLoader } from 'react-icons/fi';

interface Ticket {
  _id: string;
  name?: string; // Legacy/Compatibility
  email?: string; // Legacy/Compatibility
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  category: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt?: string;
}

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/tickets');
      if (response.data.success) {
        setTickets(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch tickets:', err);
      setError('Không thể tải danh sách ticket. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await api.patch(`/api/v1/tickets/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setTickets(prev => prev.map(t => t._id === id ? { ...t, status: newStatus as any } : t));
        if (selectedTicket?._id === id) {
          setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa Ticket này?')) return;
    try {
      const response = await api.delete(`/api/v1/tickets/${id}`);
      if (response.data.success) {
        setTickets(prev => prev.filter(t => t._id !== id));
        setIsModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa Ticket.');
    }
  };

  const openTicketModal = async (ticketId: string) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    setSelectedTicket(null); // Clear old data
    try {
      const response = await api.get(`/api/v1/tickets/${ticketId}`);
      if (response.data.success) {
        // Handle both response formats
        const detail = response.data.data || response.data;
        setSelectedTicket(detail);
        console.log('Ticket Detail Loaded:', detail);
      }
    } catch (err: any) {
      console.error('Failed to fetch ticket detail:', err);
      alert('Không thể tải chi tiết ticket.');
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved': return 'admin-badge-success';
      case 'processing': return 'admin-badge-warning';
      case 'pending': return 'admin-badge-pending';
      case 'closed': return 'admin-badge-secondary';
      default: return 'admin-badge-primary';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Billing': return 'category-billing';
      case 'Feature': return 'category-feature';
      default: return 'category-support';
    }
  };

  return (
    <div className="admin-tickets">
      <header className="admin-header flex-between mb-32">
        <h1 className="admin-title">Hỗ Trợ <span className="gradient-text">Tickets</span></h1>
        <button className="admin-btn admin-btn-secondary" onClick={fetchTickets}>
          <FiRefreshCcw className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </header>

      {error && (
        <div className="error-alert mb-24 flex items-center gap-10" style={{ color: '#ff3e3e', background: 'rgba(255, 62, 62, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 62, 62, 0.2)' }}>
          <FiAlertCircle /> {error}
        </div>
      )}

      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người gửi</th>
              <th>Email</th>
              <th>Chủ đề</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-40">Đang tải danh sách...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-40 text-muted">Không có ticket nào.</td></tr>
            ) : tickets.map((ticket) => {
              const userName = ticket.user?.name || ticket.name || 'Người dùng ẩn danh';
              const userEmail = ticket.user?.email || ticket.email || 'Không có email';
              return (
                <tr 
                  key={ticket._id} 
                  onClick={() => openTicketModal(ticket._id)}
                  className="clickable-row"
                >
                  <td>
                    <div className="user-info">
                      <div className="avatar-small">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <strong>{userName}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted block text-xs">{userEmail}</span>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }}>{ticket.subject}</td>
                  <td>
                    <span className={`admin-badge ${getCategoryBadgeClass(ticket.category)}`}>
                      {ticket.category}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadgeClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Centered Modal Implementation */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal-content glass-vivid" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '700px', width: '90%' }}
          >
            {loadingDetail ? (
              <div className="modal-loader flex-center py-80 flex-col gap-16">
                <FiLoader className="animate-spin text-3xl text-primary" />
                <p className="text-muted">Đang tải thông tin chi tiết...</p>
              </div>
            ) : selectedTicket ? (
              <>
                <div className="modal-header">
                  <div className="flex flex-col">
                    <span className="text-xs text-primary font-bold uppercase tracking-wider mb-4">Ticket ID: {selectedTicket._id}</span>
                    <h2>Chi Tiết Yêu Cầu Hỗ Trợ</h2>
                  </div>
                  <button className="modal-close" onClick={() => setIsModalOpen(false)}><FiX /></button>
                </div>

                <div className="modal-body p-32">
                  {/* User Profile */}
                  <div className="user-profile mb-32 flex items-center gap-20">
                    <div className="avatar-large">
                      {(selectedTicket.user?.name || selectedTicket.name)?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedTicket.user?.name || selectedTicket.name || 'Người dùng ẩn danh'}</h3>
                      <p className="text-primary">{selectedTicket.user?.email || selectedTicket.email || 'Không có email'}</p>
                    </div>
                  </div>

                  {/* Subject & Category */}
                  <div className="grid-2 gap-24 mb-32">
                    <div>
                      <label className="section-label">Danh mục</label>
                      <div className={`admin-badge large ${getCategoryBadgeClass(selectedTicket.category)}`}>
                        {selectedTicket.category}
                      </div>
                    </div>
                    <div>
                      <label className="section-label">Trạng thái</label>
                      <select 
                        className={`status-select ${getStatusBadgeClass(selectedTicket.status)}`}
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusUpdate(selectedTicket._id, e.target.value)}
                        disabled={updating}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-32">
                    <label className="section-label">Chủ đề</label>
                    <div className="subject-box glass p-16 font-bold text-lg">
                      {selectedTicket.subject}
                    </div>
                  </div>

                  <div className="mb-40">
                    <label className="section-label">Nội dung tin nhắn</label>
                    <div className="message-box glass p-24 white-space-pre-wrap line-height-relaxed">
                      {selectedTicket.message}
                    </div>
                  </div>

                  {/* Status Selection */}
                  {/* Timeline Info */}
                  <div className="border-t border-glass pt-32 mt-32 text-sm text-muted">
                    <p>Ngày tạo: {new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}</p>
                    <p>Cập nhật cuối: {new Date(selectedTicket.updatedAt || selectedTicket.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="modal-footer p-32 border-t border-glass flex-end gap-16">
                   <button className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Đóng</button>
                   <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(selectedTicket._id)}>Xóa Ticket</button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-tickets { padding: 20px; }
        .clickable-row { cursor: pointer; transition: background 0.2s; }
        .clickable-row:hover { background: rgba(255, 255, 255, 0.03); }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .flex-center { display: flex; justify-content: center; align-items: center; }
        .flex-end { display: flex; justify-content: flex-end; align-items: center; }
        .flex-col { display: flex; flex-direction: column; }
        .items-center { align-items: center; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; }
        .gap-10 { gap: 10px; }
        .gap-12 { gap: 12px; }
        .gap-16 { gap: 16px; }
        .gap-20 { gap: 20px; }
        .gap-24 { gap: 24px; }
        .mb-32 { margin-bottom: 32px; }
        .mb-40 { margin-bottom: 40px; }
        .p-16 { padding: 16px; }
        .p-24 { padding: 24px; }
        .p-32 { padding: 32px; }
        .py-80 { padding-top: 80px; padding-bottom: 80px; }
        
        .user-info { display: flex; gap: 12px; align-items: center; }
        .avatar-small {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--primary-glow);
          color: var(--primary);
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 0.8rem; flex-shrink: 0;
        }
        .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .text-xs { font-size: 0.75rem; }
        .text-xl { font-size: 1.25rem; }
        .text-3xl { font-size: 1.875rem; }
        
        .category-billing { background: rgba(255, 62, 235, 0.1); color: #ff3eeb; }
        .category-feature { background: rgba(0, 243, 255, 0.1); color: #00f3ff; }
        .category-support { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
        .admin-badge-pending { background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); }
        .admin-badge-warning { background: rgba(255, 150, 0, 0.1); color: #ff9600; }
        .admin-badge-success { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          justify-content: center; align-items: center;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }
        
        .modal-content {
          background: #0a0a0a;
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          max-height: 90vh;
        }
        
        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between; align-items: center;
        }
        
        .modal-body { overflow-y: auto; scrollbar-width: thin; }
        
        .modal-close {
          background: none; border: none; color: var(--text-muted);
          font-size: 1.5rem; cursor: pointer; transition: color 0.2s;
        }
        .modal-close:hover { color: white; }
        
        .section-label {
          display: block; font-size: 0.7rem; text-transform: uppercase;
          letter-spacing: 1px; color: var(--text-muted); font-weight: 700;
          margin-bottom: 12px;
        }
        
        .avatar-large {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--primary-glow);
          color: var(--primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem; font-weight: 800;
        }
        
        .subject-box { border-radius: 12px; border: 1px solid var(--glass-border); }
        .message-box { border-radius: 16px; border: 1px solid var(--glass-border); }
        
        .status-grid-opts {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        }
        
        .status-opt-card {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border); border-radius: 12px;
          cursor: pointer; transition: all 0.2s; color: var(--text-muted);
        }
        
        .status-opt-card:hover {
          background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.2);
        }
        
        .status-opt-card.active {
          background: rgba(0, 255, 136, 0.1); border-color: var(--primary); color: white;
        }
        
        .status-radio {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid var(--glass-border); position: relative;
        }
        .active .status-radio { border-color: var(--primary); }
        .active .status-radio::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 6px; height: 6px; border-radius: 50%; background: var(--primary);
        }
        
        .status-select {
          appearance: none;
          width: 100%;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length 19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          transition: all 0.2s;
        }
        
        .status-select:focus { outline: none; box-shadow: 0 0 15px var(--primary-glow); }
        .status-select option { background: #0a0a0a; color: white; text-transform: none; }
        
        .admin-badge.large { padding: 10px; display: block; text-align: center; border-radius: 10px; }

        .line-height-relaxed { line-height: 1.8; }
        .white-space-pre-wrap { white-space: pre-wrap; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.95) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminTickets;
