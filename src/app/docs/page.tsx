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
  
  const content = DOCS_CONTENT[currentSlug] || DOCS_CONTENT['introduction'];

  return (
    <main className="docs-page">
      <Header />
      
      <div className="docs-container">
        <DocsSidebar 
          currentSlug={currentSlug} 
          onSelect={(slug) => {
            setCurrentSlug(slug);
            window.scrollTo(0, 0);
          }} 
        />

        <div className="docs-content-wrapper">
          <article className="docs-content">
            <h1 className="docs-title">{content.title}</h1>
            <p className="docs-text">{content.content}</p>
            
            {content.code && (
              <CodeSnippet 
                code={content.code.snippet} 
                language={content.code.language} 
              />
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
