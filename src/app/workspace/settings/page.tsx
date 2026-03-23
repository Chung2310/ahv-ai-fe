'use client';

import React from 'react';
import WorkspaceSidebar from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import '../workspace.css';

export default function SettingsPage() {
  return (
    <div className="workspace-layout">
      <WorkspaceSidebar />
      <main className="workspace-main">
        <header className="workspace-header">
          <h1 className="workspace-title">Settings</h1>
          <p className="workspace-subtitle">Configure your personal information and account security.</p>
        </header>

        <div className="settings-section">
          <div className="settings-group">
            <h3 className="settings-title">Personal Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" defaultValue="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" defaultValue="john@company.com" />
            </div>
            <button className="btn-create">Update Profile</button>
          </div>

          <div className="settings-group">
            <h3 className="settings-title">Security</h3>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
            <button className="btn-secondary" style={{ fontWeight: '700' }}>Change Password</button>
          </div>

          <div className="settings-group">
            <h3 className="settings-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Once you delete your account, all data will be permanently removed. Please be certain.
            </p>
            <button className="btn-secondary" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
