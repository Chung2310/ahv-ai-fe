'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { 
  FiSearch, FiRefreshCw, FiEye, FiClock, FiCheckCircle, 
  FiAlertCircle, FiLoader, FiX, FiInfo, FiCode, FiUser
} from 'react-icons/fi';

interface Task {
  _id: string;
  name: string;
  status: string;
  progress: number;
  type: string;
  payload: any;
  result: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    username?: string;
    email?: string;
  }
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTasks = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await api.get('/api/v1/tasks');
      if (response.data.success) {
        setTasks(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch tasks', err);
      setError('Không thể tải danh sách task.');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Polling mechanism
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchTasks(true);
      }, 10000); // Polling every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchTasks]);

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'COMPLETED':
        return <span className="admin-badge admin-badge-success" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}><FiCheckCircle /> HOÀN THÀNH</span>;
      case 'FAILED':
        return <span className="admin-badge admin-badge-danger" style={{ background: 'rgba(255, 62, 62, 0.1)', color: '#ff3e3e' }}><FiAlertCircle /> THẤT BẠI</span>;
      case 'PROCESSING':
        return <span className="admin-badge admin-badge-info" style={{ background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff' }}><FiLoader className="spin" /> ĐANG CHẠY</span>;
      case 'PENDING':
        return <span className="admin-badge admin-badge-warning" style={{ background: 'rgba(255, 170, 0, 0.1)', color: '#ffaa00' }}><FiClock /> ĐANG CHỜ</span>;
      default:
        return <span className="admin-badge admin-badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="admin-tasks">
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-title">Quản lý <span className="gradient-text">Tasks</span></h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="auto-refresh-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)}
              id="auto-refresh"
            />
            <label htmlFor="auto-refresh" style={{ cursor: 'pointer' }}>Tự động cập nhật (10s)</label>
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={() => fetchTasks()} disabled={loading}>
            <FiRefreshCw className={loading ? 'spin' : ''} /> Làm mới
          </button>
        </div>
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
              <th>ID / Tên Task</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Tiến độ</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && tasks.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh sách task...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Không có task nào được tìm thấy.</td></tr>
            ) : tasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{task.name || 'AI Task'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{task._id}</div>
                </td>
                <td>
                  <span className="task-type-label" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {task.type || 'N/A'}
                  </span>
                </td>
                <td>{getStatusBadge(task.status)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar-bg" style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${task.progress}%`, 
                          height: '100%', 
                          background: task.status === 'FAILED' ? '#ff3e3e' : 'var(--primary)',
                          boxShadow: task.status === 'FAILED' ? 'none' : '0 0 10px var(--primary-glow)'
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>{task.progress}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <FiUser size={12} />
                    {task.creator?.username || task.creator?.email || 'System'}
                  </div>
                </td>
                <td>{task.createdAt ? new Date(task.createdAt).toLocaleString('vi-VN') : 'N/A'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="admin-btn-icon" 
                    title="Xem chi tiết"
                    onClick={() => handleOpenDetail(task)}
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiInfo className="gradient-text" style={{ fontSize: '1.5rem' }} />
                <div>
                  <h2 style={{ margin: 0 }}>Chi tiết Task</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {selectedTask._id}</div>
                </div>
              </div>
              <button className="modal-close" onClick={handleCloseModal}><FiX /></button>
            </div>

            <div className="task-detail-body" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
              <div className="detail-section">
                <h3 className="detail-subtitle"><FiInfo /> Thông tin chung</h3>
                <div className="detail-info-grid">
                  <div className="info-item">
                    <span className="info-label">Tên:</span>
                    <span className="info-value">{selectedTask.name || 'AI Task'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Loại:</span>
                    <span className="info-value">{selectedTask.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Trạng thái:</span>
                    <span className="info-value">{getStatusBadge(selectedTask.status)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tiến độ:</span>
                    <span className="info-value">{selectedTask.progress}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ngày tạo:</span>
                    <span className="info-value">{selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleString('vi-VN') : '---'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cập nhật lúc:</span>
                    <span className="info-value">{selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleString('vi-VN') : '---'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-subtitle"><FiCode /> Payload & Kết quả</h3>
                <div className="json-container">
                  <div className="json-header">Dữ liệu yêu cầu (Payload)</div>
                  <pre className="json-block">
                    {JSON.stringify(selectedTask.payload, null, 2)}
                  </pre>
                </div>
                {selectedTask.result && (
                  <div className="json-container" style={{ marginTop: '16px' }}>
                    <div className="json-header">Kết quả xử lý</div>
                    <pre className="json-block">
                      {JSON.stringify(selectedTask.result, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedTask.error && (
                  <div className="error-container" style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,62,62,0.1)', border: '1px solid #ff3e3e', borderRadius: '12px' }}>
                    <div style={{ color: '#ff3e3e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiAlertCircle /> Lỗi xử lý
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ff8a8a', fontFamily: 'monospace' }}>
                      {selectedTask.error}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn-secondary" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .task-detail-body {
          padding: 8px 0;
        }
        
        .detail-subtitle {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
        }

        .detail-info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .info-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .info-value {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .json-container {
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          overflow: hidden;
          background: #050505;
        }

        .json-header {
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .json-block {
          padding: 16px;
          margin: 0;
          font-size: 0.8rem;
          color: #bebebe;
          max-height: 300px;
          overflow: auto;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
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
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.2s;
        }
        
        .modal-close:hover {
          color: white;
        }

        .admin-btn-icon {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .admin-btn-icon:hover {
          color: var(--primary);
          background: rgba(0, 243, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
