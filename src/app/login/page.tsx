'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { loginSchema } from '@/utils/validation';
import './auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-login if token exists
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate using Joi
    const { error: validationError } = loginSchema.validate(formData);
    if (validationError) {
      setError(validationError.details[0].message);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/v1/auths/login', formData);
      const { token, user } = response.data.data;

      // Store token & user
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'admin' || user.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="auth-page">
      <div className="auth-card animate-fade-in">
        <Link href="/" className="auth-logo">
          <div className="logo-icon"></div>
          <span className="logo-text">AHV <span className="gradient-text">AI</span></span>
        </Link>
        
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in with your email to manage your AI models.</p>
        
        <div className="social-auth">
          <button className="btn-social google-btn">
            <div className="btn-content">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
              <span>Continue with Google</span>
            </div>
            <div className="rgb-border"></div>
          </button>
        </div>
        
        <div className="auth-divider">
          <span>or use email</span>
        </div>

        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required 
            />
          </div>
          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link href="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
