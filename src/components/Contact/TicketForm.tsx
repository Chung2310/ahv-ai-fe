'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import './TicketForm.css';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Support',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  useEffect(() => {
    // Autofill user info if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          name: user.fullName || user.name || user.username || '',
          email: user.email || ''
        }));
      } catch (e) {
        console.error('Failed to parse user for ticket form', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Assuming /api/v1/tickets or /api/v1/contacts endpoint exists or will exist
      const response = await api.post('/api/v1/tickets', formData);
      
      if (response.data.success) {
        setStatus({ type: 'success', message: 'Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.' });
        setFormData(prev => ({ ...prev, subject: '', message: '' }));
      }
    } catch (err: any) {
      console.error('Failed to send ticket:', err);
      // For now, even if API fails (mock-up), show success to user if desired, 
      // but strictly following backend standards we should show error if actual fail.
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form-card glass">
      <h2 className="form-title">Gửi <span className="gradient-text">Yêu Cầu Hỗ Trợ</span></h2>
      <p className="form-subtitle">Hãy cho chúng tôi biết vấn đề của bạn, đội ngũ hỗ trợ sẽ phản hồi trong vòng 24h.</p>

      {status.type && (
        <div className={`status-alert ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-row">
          <div className="form-group flex-1">
            <label>Họ và Tên</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Nhập tên của bạn" 
              required 
            />
          </div>
          <div className="form-group flex-1">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="email@example.com" 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Chủ đề</label>
          <input 
            type="text" 
            name="subject" 
            value={formData.subject} 
            onChange={handleChange} 
            placeholder="Ví dụ: Lỗi thanh toán, Hướng dẫn sử dụng..." 
            required 
          />
        </div>

        <div className="form-group">
          <label>Danh mục</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Support">Hỗ trợ kỹ thuật</option>
            <option value="Billing">Thanh toán & Gói cước</option>
            <option value="Feature">Góp ý tính năng</option>
            <option value="Other">Vấn đề khác</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nội dung chi tiết</label>
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..." 
            rows={5} 
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-submit-ticket" disabled={loading}>
          {loading ? (
            <span className="flex-center gap-10">
              <div className="loading-spinner-small"></div> Đang gửi...
            </span>
          ) : (
            'Gửi Ticket Ngay'
          )}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
