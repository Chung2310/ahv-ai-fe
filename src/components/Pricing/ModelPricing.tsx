'use client';

import React, { useState, useEffect } from 'react';
import Reveal from '../Reveal/Reveal';
import api from '@/lib/api';
import './ModelPricing.css';

interface ModelItem {
  name: string;
  price: string;
  unit: string;
}

interface GroupedModels {
  image: ModelItem[];
  video: ModelItem[];
  text: ModelItem[];
}

const ModelPricing = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [models, setModels] = useState<GroupedModels>({ image: [], video: [], text: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get('/api/v1/aimodels');
        if (response.data.success) {
          const rawModels = response.data.data || [];
          
          const grouped: GroupedModels = {
            image: [],
            video: [],
            text: []
          };

          rawModels.forEach((m: any) => {
            const nameLower = (m.name || '').toLowerCase();
            const descLower = (m.description || '').toLowerCase();
            
            const modelItem: ModelItem = {
              name: m.name || 'AI Model',
              price: m.price ? `$${m.price}` : '$0.00',
              unit: nameLower.includes('token') || descLower.includes('token') ? '1M tokens' : 'request/image'
            };

            // Heuristic categorization
            if (nameLower.includes('video') || nameLower.includes('kling') || nameLower.includes('luma')) {
              grouped.video.push(modelItem);
            } else if (nameLower.includes('gpt') || nameLower.includes('claude') || nameLower.includes('gemini') || nameLower.includes('text')) {
              grouped.text.push(modelItem);
            } else {
              // Default to image for others as it's the primary provider focus
              grouped.image.push(modelItem);
            }
          });

          setModels(grouped);
        }
      } catch (err) {
        console.error('Failed to fetch pricing models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const tabs = Object.keys(models) as Array<keyof GroupedModels>;

  return (
    <section className="model-pricing-section">
      <div className="container">
        <Reveal width="100%" direction="up">
          <div className="section-header">
            <h2 className="section-title">API <span className="gradient-text">Pay-as-you-go</span></h2>
            <p className="section-subtitle">Only pay for what you use. Transparent pricing per request.</p>
          </div>
        </Reveal>

        <div className="model-tabs">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {models[tab].length > 0 && <span className="tab-count">{models[tab].length}</span>}
            </button>
          ))}
        </div>

        <div className="model-table-wrapper">
          {loading ? (
            <div className="py-40 text-center">
              <div className="loading-spinner mx-auto"></div>
              <p className="mt-20 text-gray-400">Loading model pricing...</p>
            </div>
          ) : (
            <table className="model-table">
              <thead>
                <tr>
                  <th>Model Name</th>
                  <th>Price</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {models[activeTab as keyof GroupedModels].length > 0 ? (
                  models[activeTab as keyof GroupedModels].map((model, index) => (
                    <tr key={index}>
                      <td>{model.name}</td>
                      <td className="price-cell">{model.price}</td>
                      <td>per {model.unit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-40 text-gray-500">
                      No {activeTab} models currently available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModelPricing;
