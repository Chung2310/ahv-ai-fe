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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/api/v1/aimodels');
        if (response.data.success) {
          setModels(response.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const filteredModels = models.filter(m => {
    const matchesSearch = (m.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (m.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesSearch;
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
          {/* Main Content */}
          <div className="models-main">
            <header className="models-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
              <h1 className="models-title">Khám Phá <span className="gradient-text">AI Models</span></h1>
              <p className="models-subtitle">Những mô hình trí tuệ nhân tạo mạnh mẽ nhất, được tối ưu hóa cho công việc sáng tạo của bạn.</p>
              
              <div className="search-container" style={{ marginTop: '32px' }}>
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm công cụ AI..." 
                  className="search-input"
                  style={{ width: '100%', maxWidth: '600px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </header>

            {loading ? (
              <div className="loading-container py-100 text-center">
                <div className="loading-spinner mx-auto"></div>
                <p className="mt-20 text-gray-400">Discovering AI Models...</p>
              </div>
            ) : filteredModels.length > 0 ? (
              <div className="models-grid">
                {filteredModels.map((m, idx) => (
                  <ModelCard 
                    key={idx}
                    id={m._id || m.id}
                    title={m.name || ''}
                    provider={m.provider || 'ahv'}
                    description={m.description || ''}
                    image={m.image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'}
                    price={m.price}
                    tags={['AI', 'Technology']}
                    speed={m.status === 'active' ? 'Active' : 'Offline'}
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
