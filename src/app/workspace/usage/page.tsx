'use client';

import React from 'react';
import WorkspaceSidebar from '@/components/WorkspaceSidebar/WorkspaceSidebar';
import '../workspace.css';

export default function UsagePage() {
  const usageData = [
    { label: 'Mar 17', value: '45%' },
    { label: 'Mar 18', value: '60%' },
    { label: 'Mar 19', value: '30%' },
    { label: 'Mar 20', value: '85%' },
    { label: 'Mar 21', value: '70%' },
    { label: 'Mar 22', value: '95%' },
    { label: 'Today', value: '40%' },
  ];

  return (
    <div className="workspace-layout">
      <WorkspaceSidebar />
      <main className="workspace-main">
        <header className="workspace-header">
          <h1 className="workspace-title">Usage</h1>
          <p className="workspace-subtitle">Monitor your API usage and activity.</p>
        </header>

        <div className="data-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 className="settings-title">Requests (Last 7 Days)</h3>
          <div className="usage-chart-container">
            {usageData.map((data, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div 
                  className="chart-bar" 
                  style={{ height: data.value }}
                ></div>
                <span className="chart-label">{data.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Total requests: <strong>12,402</strong>
          </p>
        </div>

        <h3 className="settings-title">Breakdown by Model</h3>
        <div className="data-card">
          <table className="api-key-list">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Total Requests</th>
                <th>Success Rate</th>
                <th>Avg. Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Flux.1 Pro</td>
                <td>8,240</td>
                <td style={{ color: 'var(--accent)' }}>99.8%</td>
                <td>$0.02 / req</td>
              </tr>
              <tr>
                <td>SDXL 1.0</td>
                <td>3,120</td>
                <td style={{ color: 'var(--accent)' }}>99.5%</td>
                <td>$0.01 / req</td>
              </tr>
              <tr>
                <td>Face Swap v2</td>
                <td>1,042</td>
                <td style={{ color: 'var(--accent)' }}>100.0%</td>
                <td>$0.05 / req</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
