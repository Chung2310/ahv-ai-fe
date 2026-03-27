'use client';

import React, { useState } from 'react';
import ImageComponent from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal/Reveal';
import Magnetic from '@/components/Effects/Magnetic';
import { MODELS } from '@/data/models';
import api from '@/lib/api';
import './workspace.css';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ModelHeaderSection({ model: m }: { model: any }) {
  if (!m) return null;
  return (
    <Reveal>
      <div className="workspace-model-header">
        <div className="model-info-main">
          <h2>{m.name}</h2>
          <div className="model-meta-row">
            <span className="meta-badge verified">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Verified
            </span>
            <span className="meta-badge provider">{m.provider}</span>
          </div>
        </div>
        
        <div className="model-info-price">
          <span className="meta-badge price">{m.price} <span>COINS</span></span>
        </div>
      </div>
    </Reveal>
  );
}

function ResultDisplay({ result, generating, modelImage }: { result: string | null, generating: boolean, modelImage?: string | null }) {
  const isUrl = result?.startsWith('http') || result?.startsWith('data:image') || result?.startsWith('data:video');
  const isError = result && !isUrl && (result.includes('error') || result.includes('denied') || result.includes('Internal Server Error'));

  // Loading State
  if (generating) {
    return (
      <div className="result-stage loading">
        <div className="loading-overlay">
          <div className="futuristic-loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-core"></div>
          </div>
          <p className="loading-text">Synchronizing Neural Networks...</p>
          <div className="loading-bar-container">
            <div className="loading-bar-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  // Success State (Actual Result)
  if (isUrl) {
    return (
      <div className="result-stage success">
        <div className="result-preview-frame">
          {result!.match(/\.(mp4|webm|ogg|mov)$|^data:video/i) ? (
            <video src={result!} controls autoPlay loop />
          ) : (
            <img src={result!} alt="AI Result" />
          )}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="result-stage error">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h4>Generation Failed</h4>
          <p>There was an issue processing your request. Please check your configuration or try again.</p>
          <button className="view-log-btn" onClick={() => console.log(result)}>View Technical Logs</button>
        </div>
      </div>
    );
  }

  // Preview / Empty State
  return (
    <div className="result-stage preview">
      <div className="result-preview-frame">
        {modelImage ? (
          <>
            <div className="preview-badge">MODEL PREVIEW</div>
            {modelImage.match(/\.(mp4|webm|ogg|mov)$|^data:video/i) || modelImage.includes('/video/upload/') ? (
              <video src={modelImage} autoPlay loop muted playsInline />
            ) : (
              <img src={modelImage} alt="Model Preview" />
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-glow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <h3>AI Generation Ready</h3>
            <p>Configure your model on the sidebar and enter a prompt to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelIdFromUrl = searchParams.get('model');
  
  const [selectedModel, setSelectedModel] = useState(modelIdFromUrl || '');
  const [apiModels, setApiModels] = useState<any[]>([]);
  const [dynamicPayload, setDynamicPayload] = useState<any>({});
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const fullPrompt = 'An astronaut riding a horse on the moon, cinematic anime style';

  React.useEffect(() => {
    const initWorkspace = async () => {
      // Check authentication
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch models from API
      try {
        const modelsRes = await api.get('/api/v1/aimodels');
        if (modelsRes.data.success) {
          const fetchedModels = modelsRes.data.data || [];
          setApiModels(fetchedModels);
          
          // If no model selected yet, pick first one
          if (!selectedModel && fetchedModels.length > 0) {
            setSelectedModel(fetchedModels[0]._id || fetchedModels[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch models in Workspace', err);
      }

      // Fetch fresh user data
      try {
        const response = await api.get('/api/v1/auths/me');
        if (response.data.success) {
          const freshUser = response.data.data.user;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (err: any) {
        console.error('Failed to fetch user in Workspace', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          router.push('/login');
          return;
        }
      }

      // Typewriter effect
      let i = 0;
      const interval = setInterval(() => {
        setPrompt(fullPrompt.slice(0, i));
        i++;
        if (i > fullPrompt.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    };

    initWorkspace();
  }, [router, modelIdFromUrl]);

  // Handle payload parsing when selected model changes
  React.useEffect(() => {
    if (selectedModel && apiModels.length > 0) {
      const model = apiModels.find(m => (m._id || m.id) === selectedModel);
      if (model && model.payload) {
        try {
          const parsed = typeof model.payload === 'string' ? JSON.parse(model.payload) : model.payload;
          // According to user: payload structure has a nested "payload" object for editable fields
          if (parsed && parsed.payload) {
            setDynamicPayload(parsed.payload);
          } else {
            setDynamicPayload({});
          }
        } catch (e) {
          console.error('Failed to parse model payload', e);
          setDynamicPayload({});
        }
      } else {
        setDynamicPayload({});
      }
    }
  }, [selectedModel, apiModels]);

  const handleDynamicInputChange = (key: string, value: any) => {
    setDynamicPayload((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setResultImage(`https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80`);
      setGenerating(false);
    }, 2000);
  };

  return (
    <Reveal>
      <main className="workspace-page">
        {/* Advanced Background System */}

        <header className="workspace-header-premium">
          <div className="header-content-inner">
            <Link href="/" className="back-btn-ws-new">
              <div className="back-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </div>
              <span>Exit Studio</span>
            </Link>
            
            <Link href="/" className="logo-workspace-premium">
              <div className="logo-diamond"></div>
              <span className="logo-text">AHV <span className="gradient-text">AI</span> <span className="workspace-label-tag">Studio</span></span>
            </Link>

            <div className="header-right-actions">
              <div className="user-status-minimal">
                <span className="user-name-ws">{user?.fullName || 'Explorer'}</span>
                <div className="user-avatar-ws">
                  {user?.avatar ? <img src={user.avatar} alt="" /> : <span>{user?.fullName?.[0] || 'A'}</span>}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="workspace-container">
          {/* Left Sidebar: Settings */}
          <aside className="workspace-sidebar">
            <div className="sidebar-group">
              <label className="sidebar-label">Select AI Model</label>
              <select 
                className="workspace-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {apiModels.length > 0 ? apiModels.map(model => (
                  <option key={model._id || model.id} value={model._id || model.id}>
                    {model.name}
                  </option>
                )) : (
                  <option value="">Loading models...</option>
                )}
              </select>
            </div>

            {/* Dynamic Payload Configuration */}
            {Object.keys(dynamicPayload).length > 0 && (
              <div className="sidebar-group">
                <label className="sidebar-label">Model Configuration</label>
                <div className="dynamic-inputs-container">
                  {Object.entries(dynamicPayload).map(([key, value]) => (
                    <div key={key} className="dynamic-input-item">
                      <label className="dynamic-label">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <input 
                        type={typeof value === 'number' ? 'number' : 'text'}
                        className="workspace-select" 
                        value={value as any}
                        onChange={(e) => handleDynamicInputChange(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                        placeholder={`Enter ${key}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Magnetic>
              <button 
                className="btn-primary w-full py-4 text-lg font-bold"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Processing...' : 'Generate Now'}
              </button>
            </Magnetic>
          </aside>

          <div className="workspace-main">
            {/* Model Header */}
            {selectedModel && apiModels.find(m => (m._id || m.id) === selectedModel) && (
              <ModelHeaderSection model={apiModels.find(m => (m._id || m.id) === selectedModel)} />
            )}

            <ResultDisplay 
              result={resultImage} 
              generating={generating} 
              modelImage={apiModels.find(m => (m._id || m.id) === selectedModel)?.image}
            />

            <div className="workspace-input-area w-full max-w-[1000px]">
              <textarea 
                className="workspace-textarea"
                placeholder="Describe your idea in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleGenerate();
                  }
                }}
              ></textarea>
              <div className="input-footer">
                <div className="shortcut-tip">
                  <span className="key-box">CTRL</span> + <span className="key-box">ENTER</span> to generate
                </div>
                <div className="prompt-meta">
                  {prompt.length} / 2000
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Reveal>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="loading-container py-100 text-center">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-20 text-gray-400">Loading Workspace...</p>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
