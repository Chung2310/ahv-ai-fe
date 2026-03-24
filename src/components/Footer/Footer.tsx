import React from 'react';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon"></span>
            <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
          </div>
          <p className="footer-desc">
            The world's most powerful AI API platform. 
            Scaling intelligence for the next generation of applications.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">𝕏</a>
            <a href="#" className="social-link">GitHub</a>
            <a href="#" className="social-link">Discord</a>
          </div>
          <button type="submit" className="subscribe-btn skew-btn">
            <span>Subscribe</span>
          </button>
        </div>
        <div className="footer-col">
          <h4>Products</h4>
          <ul>
            <li><Link href="/models">AI Models</Link></li>
            <li><Link href="/workspace">Workspace</Link></li>
            <li><Link href="/docs">API Docs</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 AHV AI Inc. All rights reserved. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
