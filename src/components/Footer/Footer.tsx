import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">π</span>
            <span className="logo-text">PiAPI</span>
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
          <h4>Product</h4>
          <ul>
            <li><a href="/models">AI Models</a></li>
            <li><a href="/playground">Playground</a></li>
            <li><a href="/docs">API Docs</a></li>
            <li><a href="/pricing">Pricing</a></li>
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
          <p>&copy; 2024 PiAPI Inc. All rights reserved. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
