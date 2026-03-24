'use client';

import React, { useState } from 'react';
import ImageComponent from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal/Reveal';
import Magnetic from '@/components/Effects/Magnetic';
import { MODELS } from '@/data/models';
import './workspace.css';

import api from '@/lib/api';
import './workspace.css';

import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
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

      // Initial state from localStorage for faster UI
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }

      // Fetch fresh user data
      try {
        const response = await api.get('/api/v1/users/me');
        if (response.data.success) {
          const freshUser = response.data.data;
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
  }, [router]);

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
        {/* Background Effects */}
        <div className="mesh-bg-container">
          <div className="mesh-blob blob-green"></div>
          <div className="mesh-blob blob-accent"></div>
        </div>
        <div className="cyber-grid"></div>

        <div className="workspace-header-top mb-8 px-6">
          <div className="header-left">
            <Link href="/" className="back-btn-ws">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Back</span>
            </Link>
          </div>
          <div className="header-center">
            <Link href="/" className="logo workspace-logo">
              <span className="logo-icon"></span>
              <span className="logo-text">AHV <span className="gradient-text">AI</span> <span className="workspace-badge">Workspace</span></span>
            </Link>
          </div>
          
        </div>

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
                {MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar-group">
              <label className="sidebar-label">Dimensions</label>
              <div className="ratio-grid">
                <button className="ratio-btn active">1:1</button>
                <button className="ratio-btn">16:9</button>
                <button className="ratio-btn">9:16</button>
                <button className="ratio-btn">4:3</button>
              </div>
            </div>

            <div className="sidebar-group">
              <label className="sidebar-label">Resolution</label>
              <select className="workspace-select">
                <option>1024 x 1024</option>
                <option>2048 x 2048 (HD)</option>
              </select>
            </div>

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

          {/* Center/Right: Main Workspace */}
          <div className="workspace-main">
            {!resultImage && !generating ? (
              <div className="empty-state">
                <div className="empty-icon-glow mb-6">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Ready to Create?</h3>
                <p className="text-gray-400">Enter a prompt below and select a model to start generating.</p>
              </div>
            ) : (
              <div className="result-preview relative w-full aspect-square max-w-[600px] rounded-24 overflow-hidden border border-white/10 group">
                {generating ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                    <div className="loading-spinner mb-4"></div>
                    <p className="text-cyan-400 animate-pulse font-medium">Processing AI data...</p>
                  </div>
                ) : null}
                
                {resultImage && (
                  <ImageComponent 
                    src={resultImage} 
                    alt="AI Generated Result"
                    fill
                    className={`object-cover transition-all duration-700 ${generating ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
                    unoptimized
                  />
                )}
                
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-cyan-500/20 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3"/></svg>
                  </button>
                </div>
              </div>
            )}

            <div className="workspace-input-area w-full max-w-[900px]">
              <textarea 
                className="workspace-textarea text-center"
                placeholder="Describe your idea here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </main>
    </Reveal>
  );
}
