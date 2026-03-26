'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { registerSchema } from '@/utils/validation';
import '../login/auth.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate using Joi
    const { error: validationError } = registerSchema.validate(formData);
    if (validationError) {
      setError(validationError.details[0].message);
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/v1/auths/register', formData);
      // Success - Redirect to login
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
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
        
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the world's most powerful AI ecosystem.</p>
        
        <div className="social-auth">
          <button className="btn-social google-btn">
            <div className="btn-content">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
              <span>Sign up with Google</span>
            </div>
            <div className="rgb-border"></div>
          </button>
        </div>
        
        <div className="auth-divider">
          <span>or use credentials</span>
        </div>

        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User Name</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              placeholder="JohnDoe123" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              placeholder="Min. 8 characters" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-footer-note">
          By clicking Create Account, you agree to our <Link href="#" className="auth-link">Terms</Link> and <Link href="#" className="auth-link">Privacy Policy</Link>.
        </p>
        
        <div className="auth-footer">
          Already have an account? <Link href="/login" className="auth-link">Log in now</Link>
        </div>
      </div>
    </main>
  );
}
