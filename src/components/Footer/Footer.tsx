import React from 'react';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo">
            <span className="logo-icon"></span>
            <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
          </Link>
          <p className="footer-desc">
            The world's most powerful AI API platform. 
            Scaling intelligence for the next generation of applications.
          </p>
          
          <Link href="/register" className="subscribe-btn skew-btn">
            <span>Get Started</span>
          </Link>
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
            <li><Link href="/#about">About Us</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/#careers">Careers</Link></li>
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
