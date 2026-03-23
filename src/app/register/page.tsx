'use client';

import React from 'react';
import Link from 'next/link';
import '../login/auth.css'; // Reuse login styles

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Link href="/" className="auth-logo">
          <div className="logo-icon">π</div>
          <span>PiAPI</span>
        </Link>
        
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start building your AI application today.</p>
        
        <div className="social-auth">
          <button className="social-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            Sign up with Google
          </button>
        </div>
        
        <div className="auth-divider">
          <span>or use email</span>
        </div>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="John Doe" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@company.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Min. 8 characters" 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>Create Account</button>
        </form>
        
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '20px' }}>
          By clicking Create Account, you agree to our <Link href="#" className="auth-link">Terms</Link> and <Link href="#" className="auth-link">Privacy Policy</Link>.
        </p>
        
        <div className="auth-footer">
          Already have an account? <Link href="/login" className="auth-link">Log in now</Link>
        </div>
      </div>
    </main>
  );
}
