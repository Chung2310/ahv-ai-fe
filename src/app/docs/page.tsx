'use client';

import React, { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import DocsSidebar from '@/components/DocsSidebar/DocsSidebar';
import CodeSnippet from '@/components/CodeSnippet/CodeSnippet';
import { DOCS_CONTENT } from '@/data/docs';
import './docs.css';

export default function DocsPage() {
  const [currentSlug, setCurrentSlug] = useState('introduction');
  const [activeStatus, setActiveStatus] = useState<any>(null);
  
  const content = DOCS_CONTENT[currentSlug] || DOCS_CONTENT['introduction'];

  const handleSlugChange = (slug: string) => {
    setCurrentSlug(slug);
    setActiveStatus(null);
    window.scrollTo(0, 0);
  };

  return (
    <main className="docs-page">
      {/* Background Effects */}
      <div className="mesh-bg-container">
        <div className="mesh-blob blob-green"></div>
        <div className="mesh-blob blob-accent"></div>
      </div>
      <div className="cyber-grid"></div>

      <Header />
      
      <div className="docs-container">
        <DocsSidebar 
          currentSlug={currentSlug} 
          onSelect={handleSlugChange} 
        />

        <div className="docs-content-wrapper">
          <article className="docs-content">
            <h1 className="docs-title">{content.title}</h1>
            <p className="docs-text">{content.content}</p>
            
            {/* Parameters Table */}
            {content.parameters && (
              <div className="docs-section">
                <h3 className="section-subtitle">Parameters</h3>
                <div className="table-container">
                  <table className="docs-table">
                    <thead>
                      <tr>
                        <th>Param</th>
                        <th>Type</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.parameters.map((p: any, i: number) => (
                        <tr key={i}>
                          <td className="code-font">{p.param}</td>
                          <td className="type-font">{p.type}</td>
                          <td>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Management Endpoints Table */}
            {content.management_endpoints && (
              <div className="docs-section">
                <h3 className="section-subtitle">Management Endpoints</h3>
                <div className="table-container">
                  <table className="docs-table">
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.management_endpoints.map((e: any, i: number) => (
                        <tr key={i}>
                          <td className="method-font">{e.method}</td>
                          <td className="code-font">{e.endpoint}</td>
                          <td>{e.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error Codes Table */}
            {content.error_codes && (
              <div className="docs-section">
                <h3 className="section-subtitle">Error Codes & Handling</h3>
                <div className="table-container">
                  <table className="docs-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.error_codes.map((e: any, i: number) => (
                        <tr key={i}>
                          <td className="code-font error-code">{e.code}</td>
                          <td>{e.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Statuses List */}
            {content.statuses && (
              <div className="docs-section">
                <h3 className="section-subtitle">Status Definitions</h3>
                <div className="status-grid">
                  {content.statuses.map((s: any, i: number) => (
                    <div 
                      key={i}
                      className={`status-item interactive ${activeStatus?.status === s.status ? 'active' : ''}`} 
                      onClick={() => setActiveStatus(activeStatus?.status === s.status ? null : s)}
                    >
                      <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span>
                      <span className="status-desc">{s.desc}</span>
                    </div>
                  ))}
                </div>

                {activeStatus && activeStatus.payload && (
                  <div className="status-payload-preview show">
                    <h4 className="snippet-title">Response Payload: {activeStatus.status}</h4>
                    <CodeSnippet 
                      code={activeStatus.payload} 
                      language="json" 
                    />
                  </div>
                )}
              </div>
            )}

            {/* Direct Endpoints List */}
            {content.direct_endpoints && (
              <div className="docs-section">
                <h3 className="section-subtitle">Available Direct Endpoints</h3>
                <div className="endpoint-list">
                  {content.direct_endpoints.map((e: any, i: number) => (
                    <div className="endpoint-item" key={i}>
                      <span className="method-badge post">POST</span>
                      <span className="endpoint-path">{e.endpoint}</span>
                      <span className="endpoint-desc">| {e.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.code && !content.snippets && (
              <div className="docs-section">
                <CodeSnippet 
                  code={content.code.snippet} 
                  language={content.code.language} 
                />
              </div>
            )}

            {content.snippets && (
              <div className="docs-section">
                {content.snippets.map((snip: any, i: number) => (
                  <div key={i} className="snippet-group">
                    {snip.title && <h4 className="snippet-title">{snip.title}</h4>}
                    <CodeSnippet 
                      code={snip.snippet} 
                      language={snip.language} 
                    />
                  </div>
                ))}
              </div>
            )}

            {content.next && (
              <div className="docs-footer">
                <div 
                  className="next-page-link" 
                  onClick={() => {
                    setCurrentSlug(content.next);
                    window.scrollTo(0, 0);
                  }}
                >
                  <span className="next-label">Next</span>
                  <span className="next-title">
                    {DOCS_CONTENT[content.next]?.title} →
                  </span>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}
