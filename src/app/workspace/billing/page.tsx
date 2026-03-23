'use client';

import React from 'react';
import WorkspaceSidebar from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import '../workspace.css';

export default function BillingPage() {
  return (
    <div className="workspace-layout">
      <WorkspaceSidebar />
      <main className="workspace-main">
        <header className="workspace-header">
          <h1 className="workspace-title">Billing & Plans</h1>
          <p className="workspace-subtitle">Manage your payment methods and credit balance.</p>
        </header>

        <div className="credit-card">
          <span className="plan-badge">Pro Plan</span>
          <p style={{ marginTop: '24px', opacity: 0.8 }}>Current balance</p>
          <div className="credit-amount">$42.50</div>
          <button className="btn-secondary" style={{ background: 'white', color: 'var(--primary)', border: 'none' }}>
            Top up Credits
          </button>
        </div>

        <h3 className="settings-title">Payment Methods</h3>
        <div className="data-card" style={{ padding: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem' }}>💳</div>
            <div>
              <p style={{ fontWeight: '700' }}>Visa ending in 4242</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expires 12/26</p>
            </div>
          </div>
          <button className="btn-icon">Edit</button>
        </div>

        <h3 className="settings-title">Recent Invoices</h3>
        <div className="data-card">
          <table className="api-key-list">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#INV-2024-001</td>
                <td>03/01/2024</td>
                <td>$50.00</td>
                <td><span className="stat-trend trend-up">Paid</span></td>
              </tr>
              <tr>
                <td>#INV-2024-002</td>
                <td>02/01/2024</td>
                <td>$35.20</td>
                <td><span className="stat-trend trend-up">Paid</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
