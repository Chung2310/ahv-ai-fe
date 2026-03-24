import React from 'react';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">A</span>
            <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
          </div>
          <p className="footer-desc">
            Nền tảng API AI mạnh mẽ nhất thế giới. 
            Mở rộng trí tuệ cho thế hệ ứng dụng tiếp theo.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">𝕏</a>
            <a href="#" className="social-link">GitHub</a>
            <a href="#" className="social-link">Discord</a>
          </div>
          <button type="submit" className="subscribe-btn skew-btn">
            <span>Đăng ký nhận tin</span>
          </button>
        </div>
        <div className="footer-col">
          <h4>Sản phẩm</h4>
          <ul>
            <li><Link href="/models">Mô hình AI</Link></li>
            <li><Link href="/workspace">Workspace</Link></li>
            <li><Link href="/docs">Tài liệu API</Link></li>
            <li><Link href="/pricing">Bảng giá</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Công ty</h4>
          <ul>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Tuyển dụng</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Pháp lý</h4>
          <ul>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản dịch vụ</a></li>
            <li><a href="#">Chính sách Cookie</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 AHV AI Inc. Bảo lưu mọi quyền. Được xây dựng với ❤️ dành cho các nhà phát triển.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
