'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Reveal from '@/components/Reveal/Reveal';
import Magnetic from '@/components/Effects/Magnetic';
import { 
  FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle, 
  FiLoader, FiSearch, FiCalendar, FiImage, FiVideo, FiCode, FiRefreshCw, FiX
} from 'react-icons/fi';
import './history.css';

interface Task {
  _id: string;
  name: string;
  status: string;
  progress: number;
  type: string;
  payload: any;
  result: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TaskHistoryPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/tasks', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.data.success) {
        const data = response.data.data?.tasks || response.data.data || [];
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error('Failed to fetch user tasks', err);
      setError('Không thể tải lịch sử task. Vui lòng thử lại sau.');
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const resolveUrl = (url: any) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (url.startsWith('http')) return url;
    const baseURL = process.env.NEXT_PUBLIC_BACKEND || '';
    return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };

  const getModelName = (task: Task) => {
    const payload = task.payload || {};
    const modelId = payload.model || payload.modelId || payload.input?.model;
    
    if (modelId && typeof modelId === 'string') {
      return modelId.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }

    if (task.type) {
      return task.type.toUpperCase().replace(/_/g, ' ');
    }

    return 'Neural Task';
  };

  const getPromptBrief = (task: Task) => {
    const payload = task.payload || {};
    const prompt = payload.input?.prompt || payload.prompt || payload.input?.text || payload.text;
    
    if (prompt && typeof prompt === 'string') {
      return prompt.length > 80 ? prompt.substring(0, 80) + '...' : prompt;
    }
    return 'Computation parameters encrypted';
  };

  const isVideoResult = (result: any) => {
    if (typeof result !== 'string') return false;
    return result.match(/\.(mp4|webm|ogg|mov)$|^data:video/i);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': 
      case 'succeeded': return <FiCheckCircle />;
      case 'processing': 
      case 'starting': return <FiLoader className="animate-spin" />;
      case 'pending': return <FiClock />;
      case 'failed': return <FiAlertCircle />;
      default: return <FiClock />;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <header className="history-header">
           <Reveal>
             <Link href="/profile" className="back-link flex items-center gap-8 text-primary/60 hover:text-primary transition-colors text-sm font-bold mb-16">
               <FiArrowLeft /> Return to Neural Node
             </Link>
           </Reveal>

           <Reveal delay={0.1}>
             <h1 className="history-title gradient-text">Neural Archive</h1>
             <p className="history-subtitle">A synchronized ledger of your AI computations and synaptic generation history.</p>
           </Reveal>
           
           <Reveal delay={0.2}>
             <button className="btn-refresh rounded-full flex items-center gap-12" onClick={fetchTasks} disabled={loading}>
               <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
               RE-SYNC ARCHIVE
             </button>
           </Reveal>
        </header>

        {loading ? (
          <div className="history-loading py-100 flex flex-col items-center justify-center gap-24">
            <div className="futuristic-loader">
               <div className="loader-ring"></div>
               <div className="loader-core"></div>
            </div>
            <p className="text-muted font-bold tracking-[0.3em] font-mono text-xs animate-pulse">CONNECTING TO NEURAL MESH...</p>
          </div>
        ) : error ? (
          <div className="error-card glass p-40 text-center border-accent/20 max-w-md mx-auto rounded-3xl">
            <FiAlertCircle size={48} className="text-accent mx-auto mb-16" />
            <p className="text-sm font-bold mb-16 opacity-60 uppercase">{error}</p>
            <button className="btn-workspace-link" onClick={fetchTasks}>RETRY CORE LINK</button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="history-empty py-120 text-center flex flex-col items-center gap-24">
            <FiSearch size={40} className="text-white/10" />
            <div>
              <h2 className="text-xl font-black mb-8 opacity-40">Archive data not found</h2>
              <p className="text-muted text-xs">No generations detected in your local synaptic segment.</p>
            </div>
            <Magnetic>
              <Link href="/workspace" className="btn-workspace-link">
                EXECUTE NEW TASK
              </Link>
            </Magnetic>
          </div>
        ) : (
          <div className="history-list">
            {tasks.map((task, index) => (
              <Reveal key={task._id} delay={index * 0.05}>
                <div className="history-item" onClick={() => setSelectedTask(task)}>
                  <div className="item-preview">
                    {(task.status?.toLowerCase() === 'completed' || task.status?.toLowerCase() === 'succeeded') && resolveUrl(task.result) ? (
                      isVideoResult(task.result) ? (
                        <video src={resolveUrl(task.result) || undefined} muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={resolveUrl(task.result) || undefined} alt="" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/40 text-white/10">
                        {task.status?.toLowerCase() === 'processing' ? <FiLoader className="animate-spin text-primary" size={20} /> : <FiClock size={20} />}
                      </div>
                    )}
                    <div className="preview-overlay">
                       <span className="preview-badge">{task.type?.split(/[_-]/)[0] || 'DATA'}</span>
                    </div>
                  </div>

                  <div className="item-main">
                    <span className="item-name">{getModelName(task)}</span>
                    <span className="item-prompt-brief">{getPromptBrief(task)}</span>
                  </div>

                  <div className="item-meta">
                    <div className="meta-row">
                      <FiCalendar size={12} />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                    <div className="meta-row font-mono opacity-50" style={{ fontSize: '9px', letterSpacing: '1px' }}>
                      <FiCode size={10} />
                      <span>{task._id.slice(-8).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="item-status">
                    <span className={`status-chip ${task.status?.toLowerCase()}`}>
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-24 bg-black/98 backdrop-blur-xl" onClick={() => setSelectedTask(null)}>
           <div className="modal-content glass result-modal-container max-w-4xl w-full rounded-2xl border-white/10 relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button className="absolute top-20 right-20 z-20 p-10 rounded-full bg-black/60 text-white/40 hover:text-white transition-all border border-white/5" onClick={() => setSelectedTask(null)}>
                <FiX size={18} />
              </button>
              
              <div className="modal-visual-area">
                {(selectedTask.status?.toLowerCase() === 'completed' || selectedTask.status?.toLowerCase() === 'succeeded') && resolveUrl(selectedTask.result) ? (
                  isVideoResult(selectedTask.result) ? (
                    <video src={resolveUrl(selectedTask.result) || undefined} controls autoPlay loop className="max-h-[65vh] w-auto max-w-full m-auto" />
                  ) : (
                    <img src={resolveUrl(selectedTask.result) || undefined} alt="Full View" className="max-h-[65vh] w-auto max-w-full object-contain m-auto" />
                  )
                ) : (
                   <div className="text-center p-60 flex flex-col items-center justify-center min-h-[40vh]">
                     {selectedTask.status?.toLowerCase() === 'failed' ? (
                        <>
                          <FiAlertCircle size={48} className="text-accent mb-20 opacity-30" />
                          <h3 className="text-xl font-bold text-accent/80 mb-8 uppercase tracking-widest">Core Interface Error</h3>
                          <p className="text-white/30 text-xs max-w-xs">{selectedTask.error || 'Neural computation segment lost during transmission.'}</p>
                        </>
                     ) : (
                        <>
                          <div className="futuristic-loader mb-32">
                             <div className="loader-ring"></div>
                             <div className="loader-core"></div>
                          </div>
                          <h3 className="text-xl font-black text-primary/80 mb-8 uppercase tracking-[0.3em]">Processing Neuro-Stream</h3>
                          <p className="text-white/30 text-xs max-w-xs italic">Request is currently being materialized by the distributed GPU mesh.</p>
                        </>
                     )}
                   </div>
                )}
              </div>

              <div className="modal-info-panel p-32 bg-black">
                <div className="flex justify-between items-start mb-24">
                  <div>
                    <h3 className="text-xl font-black mb-4 text-white uppercase">{getModelName(selectedTask)}</h3>
                    <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Neural Computation Task · {formatDate(selectedTask.createdAt)}</p>
                  </div>
                  <span className={`status-chip ${selectedTask.status?.toLowerCase()}`}>
                    {getStatusIcon(selectedTask.status)}
                    {selectedTask.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div className="task-config-preview">
                     <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-10 flex items-center gap-6">Input Sequence</h4>
                     <pre className="p-16 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-white/30 overflow-auto max-h-120 font-mono">
                       {JSON.stringify(selectedTask.payload, null, 2)}
                     </pre>
                  </div>
                  <div className="task-config-preview">
                     <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-10 flex items-center gap-6">System Handlers</h4>
                     <pre className="p-16 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-white/30 overflow-auto max-h-120 font-mono">
                       {JSON.stringify(selectedTask.result, null, 2)}
                     </pre>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .flex-col { flex-direction: column; }
        .gap-6 { gap: 6px; }
        .gap-8 { gap: 8px; }
        .gap-12 { gap: 12px; }
        .gap-20 { gap: 20px; }
        .gap-24 { gap: 24px; }
        .mb-4 { margin-bottom: 4px; }
        .mb-8 { margin-bottom: 8px; }
        .mb-10 { margin-bottom: 10px; }
        .mb-16 { margin-bottom: 16px; }
        .mb-20 { margin-bottom: 20px; }
        .mb-24 { margin-bottom: 24px; }
        .mb-32 { margin-bottom: 32px; }
        .py-100 { padding-top: 100px; padding-bottom: 100px; }
        .py-120 { padding-top: 120px; padding-bottom: 120px; }
        .p-10 { padding: 10px; }
        .p-16 { padding: 16px; }
        .p-24 { padding: 24px; }
        .p-32 { padding: 32px; }
        .p-40 { padding: 40px; }
        .p-60 { padding: 60px; }
        .rounded-xl { border-radius: 12px; }
        .rounded-2xl { border-radius: 16px; }
        .rounded-full { border-radius: 999px; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xl { font-size: 1.25rem; }
        .font-black { font-weight: 900; }
        .font-bold { font-weight: 700; }
        .font-mono { font-family: monospace; }
        .uppercase { text-transform: uppercase; }
        .tracking-widest { letter-spacing: 0.1em; }
        .text-center { text-align: center; }
        .m-auto { margin: auto; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-20 { z-index: 20; }
        .z-50 { z-index: 50; }
        .bg-black { background: #000; }
        .bg-black\/60 { background: rgba(0, 0, 0, 0.6); }
        .bg-black\/98 { background: rgba(0, 0, 0, 0.98); }
        .backdrop-blur-xl { backdrop-filter: blur(24px); }
        .max-w-md { max-width: 28rem; }
        .max-w-4xl { max-width: 56rem; }
        .w-full { width: 100%; }
        .w-auto { width: auto; }
        .h-full { height: 100%; }
        .max-h-\[65vh\] { max-height: 65vh; }
        .max-h-120 { max-height: 120px; }
        .overflow-auto { overflow: auto; }
        .overflow-hidden { overflow: hidden; }
        .object-cover { object-fit: cover; }
        .object-contain { object-fit: contain; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @media (min-width: 768px) {
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
