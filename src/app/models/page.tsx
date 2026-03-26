'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ModelCard from '@/components/ModelCard/ModelCard';
import { CATEGORIES } from '@/data/models';
import api from '@/lib/api';
import './models.css';

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/api/v1/resources', {
          params: { type: 'style', limit: 100 }
        });
        if (response.data.success) {
          const data = response.data.data?.resources || response.data.data || [];
          setModels(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const categories = ['All', ...CATEGORIES];

  const filteredModels = models.filter(m => {
    const matchesCategory = selectedCategory === 'All' || 
                           (m.categoryId?.name === selectedCategory) || 
                           (m.category === selectedCategory);
    const matchesSearch = (m.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
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

            {loading ? (
              <div className="loading-container py-100 text-center">
                <div className="loading-spinner mx-auto"></div>
                <p className="mt-20 text-gray-400">Discovering AI Styles...</p>
              </div>
            ) : filteredModels.length > 0 ? (
              <div className="models-grid">
                {filteredModels.map((m, idx) => (
                  <ModelCard 
                    key={idx}
                    title={m.name || ''}
                    category={m.categoryId?.name || m.category || 'AI Style'}
                    description={m.description || ''}
                    image={m.data?.resources?.appDisplayImage?.[0] || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'}
                    tags={['AI', m.type || 'Style']}
                    speed={m.data?.isTrending ? 'Turbo' : 'Standard'}
                    delay={idx * 0.05}
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
