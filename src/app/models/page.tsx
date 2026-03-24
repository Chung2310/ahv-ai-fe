'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ModelCard from '@/components/ModelCard/ModelCard';
import { MODELS, CATEGORIES } from '@/data/models';
import './models.css';

export default function ModelsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...CATEGORIES];

  const filteredModels = MODELS.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = (m.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (m.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="models-page">
      {/* Background Effects */}
      <div className="mesh-bg-container">
        <div className="mesh-blob blob-green"></div>
        <div className="mesh-blob blob-accent"></div>
      </div>
      <div className="cyber-grid"></div>

      <Header />
      
      <div className="container">
        <div className="models-container">
          {/* Sidebar */}
          <aside className="models-sidebar">
            <h3 className="sidebar-title">Categories</h3>
            <div className="category-list">
              <button 
                className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All Models
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="models-main">
            <header className="models-header">
              <h1 className="models-title">Explore <span className="gradient-text">AI Models</span></h1>
              <p className="models-subtitle">The world's most powerful AI models, optimized for your projects.</p>
              
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search models..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </header>

            {filteredModels.length > 0 ? (
              <div className="models-grid">
                {filteredModels.map((m, idx) => (
                  <ModelCard 
                    key={idx}
                    title={m.title || ''}
                    category={m.category || ''}
                    description={m.description || ''}
                    image={m.image || ''}
                    tags={m.tags || []}
                    speed={m.speed}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No models found</h3>
                <p>Try a different keyword or clear your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
