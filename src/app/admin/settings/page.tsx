'use client';

import React from 'react';

export default function AdminSettings() {
  return (
    <div className="admin-settings">
      <header className="admin-header">
        <h1 className="admin-title">System <span className="gradient-text">Settings</span></h1>
      </header>
      <div className="admin-placeholder" style={{ padding: '80px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
        <h2 style={{ marginBottom: '12px' }}>Global Configurations</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage API keys, environment variables, and site-wide metadata here.</p>
      </div>
    </div>
  );
}
