'use client';

import React from 'react';
import WorkspaceSidebar from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import '../workspace.css';

export default function ApiKeysPage() {
  const apiKeys = [
    { name: 'Production Key', key: 'pk_live_********************', created: '2024-03-20', lastUsed: '2 mins ago' },
    { name: 'Staging Env', key: 'pk_test_********************', created: '2024-03-15', lastUsed: 'Yesterday' },
    { name: 'Local Dev', key: 'pk_test_********************', created: '2024-03-01', lastUsed: '5 days ago' },
  ];

  return (
    <div className="workspace-layout">
      <WorkspaceSidebar />
      
      <main className="workspace-main">
        <header className="workspace-page-header">
          <div>
            <h1 className="workspace-title">API Keys</h1>
            <p className="workspace-subtitle">Manage your secret keys to authenticate your API requests.</p>
          </div>
          <button className="btn-create">
            <span>+</span> Create New Key
          </button>
        </header>

        <div className="data-card">
          <table className="api-key-list">
            <thead>
              <tr>
                <th>Name</th>
                <th>API Key</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700' }}>{item.name}</td>
                  <td className="key-code">{item.key}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.created}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.lastUsed}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" title="Copy">📋</button>
                      <button className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
