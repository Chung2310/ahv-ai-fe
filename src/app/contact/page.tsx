'use client';

import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Reveal from '@/components/Reveal/Reveal';
import TicketForm from '@/components/Contact/TicketForm';
import './contact.css';

export default function ContactPage() {
  return (
    <main className="contact-page min-h-screen pt-20">
      <Header />

      {/* Background Decor */}
      <div className="mesh-bg-container">
        <div className="mesh-blob blob-accent"></div>
        <div className="mesh-blob blob-purple"></div>
      </div>
      <div className="cyber-grid"></div>

      <div className="container py-80 relative z-10">
        <Reveal width="100%" direction="up">
          <div className="contact-header text-center mb-80">
            <h1 className="section-title">Kết Nối Với <span className="gradient-text">Chúng Tôi.</span></h1>
            <p className="section-subtitle">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Đừng ngần ngại gửi yêu cầu!</p>
          </div>
        </Reveal>

        <div className="contact-layout">
          {/* Contact Info Sidebar */}
          <Reveal direction="left" delay={0.2}>
            <div className="contact-info-grid">
              <div className="info-card glass">
                <div className="info-icon">📍</div>
                <h3>Địa chỉ</h3>
                <p>Số 123 Đường Công Nghệ, Quận Cầu Giấy, TP. Hà Nội, Việt Nam</p>
              </div>
              <div className="info-card glass">
                <div className="info-icon">📧</div>
                <h3>Email Hỗ Trợ</h3>
                <p>support@ahv.ai</p>
                <p>business@ahv.ai</p>
              </div>
              <div className="info-card glass">
                <div className="info-icon">💬</div>
                <h3>Mạng xã hội</h3>
                <p>Facebook: @ahvai.official</p>
                <p>Twitter: @ahv_ai</p>
              </div>
              <div className="info-card glass">
                <div className="info-icon">📞</div>
                <h3>Hotline</h3>
                <p>+84 (24) 1234 5678</p>
                <p>Thứ 2 - Thứ 7 (8:00 - 18:00)</p>
              </div>
            </div>
          </Reveal>

          {/* Ticket Form Main */}
          <Reveal direction="right" delay={0.4}>
            <TicketForm />
          </Reveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}
