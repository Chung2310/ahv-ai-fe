'use client';

import React, { useState, useEffect, useRef } from 'react';
import ImageComponent from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal/Reveal';
import Magnetic from '@/components/Effects/Magnetic';
import { MODELS } from '@/data/models';
import api from '@/lib/api';
import './workspace.css';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FiImage, FiCode, FiCpu, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

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

function ResultDisplay({ result, generating, modelImage, activeTab, lastResponse }: { 
  result: string | null, 
  generating: boolean, 
  modelImage?: string | null,
  activeTab: 'visual' | 'json',
  lastResponse: any
}) {
  const isUrl = result?.startsWith('http') || result?.startsWith('data:image') || result?.startsWith('data:video');
  const isError = result === 'error';

  if (activeTab === 'json') {
    return (
      <div className="result-stage json-view">
        <div className="json-container glass p-24">
          <div className="json-header flex-between mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">API Response Object</span>
            {lastResponse && <span className="status-badge success">Received</span>}
          </div>
          <pre className="json-content">
            {lastResponse ? JSON.stringify(lastResponse, null, 2) : "// No response data yet. Initiate a generation to see the result."}
          </pre>
        </div>
      </div>
    );
  }

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
          {lastResponse?.data?.status && (
             <div className="mt-20 px-16 py-8 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary animate-pulse">
               Current Status: {lastResponse.data.status.toUpperCase()}
             </div>
          )}
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
          <div className="error-icon text-red-500">⚠️</div>
          <h4>Generation Failed</h4>
          <p>There was an issue processing your request. Please check the JSON response for details.</p>
          <button className="view-log-btn" onClick={() => console.log(lastResponse)}>View Technical Logs</button>
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
            <p>Configure your model on the sidebar and initiate a generation.</p>
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
  const [fullModelPayload, setFullModelPayload] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [user, setUser] = useState<any>(null);
  
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const getMe = async () => {
    try {
      const response = await api.get('/api/v1/auths/me');
      if (response.data.success) {
        const freshUser = response.data.data.user;
        setUser((prev: any) => ({ ...prev, ...freshUser }));
        localStorage.setItem('user', JSON.stringify(freshUser));

        try {
          const walletRes = await api.get(`/api/v1/wallets/me`);
          if (walletRes.data.success && walletRes.data.data) {
            const balance = walletRes.data.data.balance || 0;
            setUser((prev: any) => ({ ...prev, balance }));
          }
        } catch (walletErr) {
          console.error('Failed to fetch wallet balance', walletErr);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch user in Workspace', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        router.push('/login');
        return;
      }
    }
  };

  useEffect(() => {
    const initWorkspace = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }

      try {
        const modelsRes = await api.get('/api/v1/aimodels');
        if (modelsRes.data.success) {
          const fetchedModels = modelsRes.data.data || [];
          setApiModels(fetchedModels);
          
          if (!selectedModel && fetchedModels.length > 0) {
            setSelectedModel(fetchedModels[0]._id || fetchedModels[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch models in Workspace', err);
      }

      await getMe();
    };

    initWorkspace();
  }, [router, modelIdFromUrl]);

  useEffect(() => {
    if (selectedModel && apiModels.length > 0) {
      const model = apiModels.find(m => (m._id || m.id) === selectedModel);
      if (model && model.payload) {
        try {
          const parsed = typeof model.payload === 'string' ? JSON.parse(model.payload) : model.payload;
          setFullModelPayload(parsed);
          if (parsed && parsed.payload) {
            setDynamicPayload(parsed.payload);
          } else {
            setDynamicPayload({});
          }
        } catch (e) {
          console.error('Failed to parse model payload', e);
          setDynamicPayload({});
          setFullModelPayload(null);
        }
      } else {
        setDynamicPayload({});
        setFullModelPayload(null);
      }
    }
  }, [selectedModel, apiModels]);

  const pollTaskStatus = async (taskId: string) => {
    stopPolling();
    
    pollTimerRef.current = setInterval(async () => {
      try {
        const response = await api.get(`/api/v1/tasks/${taskId}`);
        if (response.data.success) {
          const task = response.data.data;
          setLastResponse(response.data);
          
          if (task.status === 'succeeded') {
            const finalUrl = task.result?.url || task.resultUrl;
            setResultImage(finalUrl);
            setGenerating(false);
            stopPolling();
            getMe(); // Update balance
          } else if (task.status === 'failed') {
            setResultImage('error');
            setGenerating(false);
            stopPolling();
          }
        }
      } catch (err) {
        console.error('Polling Error:', err);
        // We don't stop on generic error, maybe it's a network glitch
      }
    }, 3000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResultImage(null);
    setLastResponse(null);
    setActiveTab('visual');
    stopPolling();
    
    try {
      // Reconstruct the full payload structure keeping system fields (task, webhook)
      // and merging the edited dynamicPayload into the nested 'payload' object
      const reconstructedPayload = {
        ...fullModelPayload,
        payload: {
          ...fullModelPayload?.payload,
          ...dynamicPayload
        }
      };

      const payloadRequest = {
        aiModelId: selectedModel,
        payload: reconstructedPayload
      };

      const response = await api.post('/api/v1/tasks', payloadRequest);
      setLastResponse(response.data);
      
      if (response.data.success) {
        const task = response.data.data;
        if (task.status === 'succeeded') {
          const finalUrl = task.result?.url || task.resultUrl;
          setResultImage(finalUrl);
          setGenerating(false);
          getMe();
        } else if (task.status === 'failed') {
          setResultImage('error');
          setGenerating(false);
        } else {
          // Start polling for pending/processing tasks
          pollTaskStatus(task._id);
        }
      } else {
        setResultImage('error');
        setGenerating(false);
      }
    } catch (err: any) {
      console.error('Generation Failed:', err);
      setLastResponse(err.response?.data || { error: err.message });
      setResultImage('error');
      setGenerating(false);
    }
  };

  const handleDynamicInputChange = (key: string, value: any) => {
    setDynamicPayload((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Reveal>
      <main className="workspace-page">
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
                <div className="user-balance-ws">
                  <div className="balance-icon-ws">💎</div>
                  <div className="balance-info-ws">
                    <span className="balance-label-ws">Credits</span>
                    <div className="balance-value-ws">
                      {(user?.balance ?? 0).toLocaleString()} <span>COINS</span>
                    </div>
                  </div>
                </div>
                <div className="user-info-ws">
                  <span className="user-name-ws">{user?.fullName || user?.name || user?.username || 'Explorer'}</span>
                  <span className="user-email-ws">{user?.email || 'No email synced'}</span>
                </div>
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
                        className="workspace-input" 
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
                {generating ? <span className="flex items-center justify-center gap-10"><FiLoader className="animate-spin" /> Processing...</span> : 'Generate Now'}
              </button>
            </Magnetic>
          </aside>

          <div className="workspace-main">
             <div className="workspace-tabs-container mb-24">
               <div className="workspace-tabs">
                  <button 
                    className={`tab-item ${activeTab === 'visual' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visual')}
                  >
                    <FiImage /> <span>Visual Preview</span>
                  </button>
                  <button 
                    className={`tab-item ${activeTab === 'json' ? 'active' : ''}`}
                    onClick={() => setActiveTab('json')}
                  >
                    <FiCode /> <span>Response JSON</span>
                  </button>
               </div>
            </div>

            {/* Model Header */}
            {selectedModel && apiModels.find(m => (m._id || m.id) === selectedModel) && (
              <ModelHeaderSection model={apiModels.find(m => (m._id || m.id) === selectedModel)} />
            )}

            <ResultDisplay 
              result={resultImage} 
              generating={generating} 
              activeTab={activeTab}
              lastResponse={lastResponse}
              modelImage={apiModels.find(m => (m._id || m.id) === selectedModel)?.image}
            />
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
