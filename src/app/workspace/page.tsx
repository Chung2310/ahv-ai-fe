'use client';

import React from 'react';
import WorkspaceSidebar from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import './workspace.css';

export default function WorkspacePage() {
  return (
    <div className="workspace-layout">
      <WorkspaceSidebar />
      
      <main className="workspace-main">
        <header className="workspace-header">
          <h1 className="workspace-title">Dashboard</h1>
          <p className="workspace-subtitle">Overview of your AI usage and projects.</p>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">
              <span>Total Requests</span>
              <span className="stat-trend trend-up">↑ 12.5%</span>
            </div>
            <div className="stat-value">124,592</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">
              <span>Average Latency</span>
              <span className="stat-trend">240ms</span>
            </div>
            <div className="stat-value">210ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">
              <span>Credit Balance</span>
            </div>
            <div className="stat-value">$42.50</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">
              <span>Active Keys</span>
            </div>
            <div className="stat-value">3</div>
          </div>
        </section>

        <section className="dashboard-content">
          <div className="data-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Ready to get started?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Select a model from the Models Library and start integrating into your app.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="/models" className="btn-create">Explore Models</a>
              <a href="/docs" className="btn-secondary">Read Docs</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
