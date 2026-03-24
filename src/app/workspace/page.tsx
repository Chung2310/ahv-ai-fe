'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/Reveal/Reveal';
import Magnetic from '@/components/Effects/Magnetic';
import './workspace.css';

export default function WorkspacePage() {
  const [prompt, setPrompt] = useState('Một phi hành gia đang cưỡi ngựa trên mặt trăng, phong cách anime cinematic');
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    // Giả lập API call
    setTimeout(() => {
      setResultImage(`https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80`);
      setGenerating(false);
    }, 2000);
  };

  return (
    <Reveal>
      <main className="workspace-page">
        <div className="section-header text-center mb-16">
          <h1 className="gradient-text text-5xl font-bold mb-4">AI Workspace</h1>
          <p className="text-gray-400 text-xl">Thử nghiệm và sáng tạo với các mô hình AI mạnh mẽ nhất</p>
        </div>

        <div className="workspace-container">
          {/* Left Sidebar: Settings */}
          <aside className="workspace-sidebar">
            <div className="sidebar-group mb-8">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 block">Chọn Mô Hình</label>
              <select 
                className="workspace-select"
              >
                <option>Flux.1 [Dev]</option>
                <option>Stable Diffusion XL</option>
                <option>Midjourney v6</option>
                <option>DALL-E 3</option>
              </select>
            </div>

            <div className="sidebar-group mb-8">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 block">Kích Thước</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="ratio-btn active">1:1 Square</button>
                <button className="ratio-btn">16:9 Wide</button>
                <button className="ratio-btn">9:16 Portrait</button>
                <button className="ratio-btn">4:3 Standard</button>
              </div>
            </div>

            <div className="sidebar-group mb-8">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 block">Độ Phân Giải</label>
              <select className="workspace-select">
                <option>1024 x 1024</option>
                <option>2048 x 2048 (Upscaled)</option>
              </select>
            </div>

            <Magnetic>
              <button 
                className="btn-primary w-full py-4 text-lg font-bold"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Đang khởi tạo...' : 'Khởi Tạo Ngay'}
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
                <h3 className="text-2xl font-bold mb-2">Sẵn sàng sáng tạo?</h3>
                <p className="text-gray-400">Nhập prompt bên dưới và chọn mô hình để bắt đầu.</p>
              </div>
            ) : (
              <div className="result-preview relative w-full aspect-square max-w-[600px] rounded-24 overflow-hidden border border-white/10 group">
                {generating ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                    <div className="loading-spinner mb-4"></div>
                    <p className="text-cyan-400 animate-pulse font-medium">Đang xử lý dữ liệu AI...</p>
                  </div>
                ) : null}
                
                {resultImage && (
                  <Image 
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

            <div className="workspace-input-area w-full max-w-[800px] mt-8">
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-24 p-6 text-lg focus:outline-none focus:border-cyan-500/50 transition-all min-h-[120px] resize-none"
                placeholder="Mô tả ý tưởng của bạn tại đây..."
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
