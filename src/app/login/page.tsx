'use client';

import React from 'react';
import Link from 'next/link';
import './auth.css';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card animate-fade-in">
        <Link href="/" className="auth-logo">
          <div className="logo-icon">π</div>
          <span>PiAPI</span>
        </Link>
        
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to manage your AI models.</p>
        
        <div className="social-auth">
          <button className="social-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            Continue with Google
          </button>
          <button className="social-btn">
            <img src="https://www.svgrepo.com/show/475654/github-color.svg" alt="GitHub" />
            Continue with GitHub
          </button>
        </div>
        
        <div className="auth-divider">
          <span>or use email</span>
        </div>
        
        <form className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@company.com" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="btn-auth-submit">Log In</button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link href="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
