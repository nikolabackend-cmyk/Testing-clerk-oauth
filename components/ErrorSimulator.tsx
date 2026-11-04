'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  WifiOff, 
  ServerCrash, 
  Bug, 
  RefreshCw, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Terminal, 
  Trash2,
  Copy,
  Activity
} from 'lucide-react';
import { triggerSimulatedError, SimulatedErrorEvent, getAllErrorCategories } from '@/lib/error-generator';

export default function ErrorSimulator({ variant = 'header' }: { variant?: 'header' | 'inline' | 'floating' }) {
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<SimulatedErrorEvent | null>(null);
  const [history, setHistory] = useState<SimulatedErrorEvent[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const categories = ['ALL', ...getAllErrorCategories()];

  const handleTriggerError = async (categoryFilter?: string) => {
    setLoading(true);
    try {
      const err = await triggerSimulatedError(categoryFilter || (selectedCategory !== 'ALL' ? selectedCategory : undefined));
      setLastError(err);
      setHistory(prev => [err, ...prev.slice(0, 19)]); // Keep last 20
      setShowToast(true);
      // Auto-hide toast after 6s
      setTimeout(() => {
        setShowToast(false);
      }, 6000);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (variant === 'inline') {
    return (
      <div className="p-6 border border-[#E0E0E0] bg-[#FFFFFF] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-700 border border-red-200">
                <Activity size={12} className="text-red-600 animate-pulse" /> Activity & Error Testing
              </span>
              {history.length > 0 && (
                <span className="text-xs text-[#666666] tracking-wider">
                  ({history.length} errors generated)
                </span>
              )}
            </div>
            <h3 className="text-xl font-serif">Simulate Real-time SaaS Activity & Errors</h3>
            <p className="text-xs text-[#666666] max-w-xl">
              Generates genuine API 500 crashes, network fetch failures, unhandled promise rejections, and runtime exceptions for your Reportli tracking script.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-trigger-inline-error"
              onClick={() => handleTriggerError()}
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 text-white text-xs uppercase tracking-widest font-semibold border border-red-700 hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Flame size={15} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Triggering...' : '⚡ Trigger Random Error'}</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2.5 bg-[#000000] text-white text-xs uppercase tracking-widest border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Terminal size={14} />
              <span>Error Console {history.length > 0 && `(${history.length})`}</span>
            </button>
          </div>
        </div>

        {/* Quick error category pills */}
        <div className="mt-4 pt-4 border-t border-[#F0F0F0] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#888888] font-medium mr-1">Quick trigger:</span>
          <button
            onClick={() => handleTriggerError('Network / Fetch')}
            className="px-2.5 py-1 text-[11px] bg-[#F5F5F5] hover:bg-red-50 hover:text-red-700 border border-[#E0E0E0] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <WifiOff size={11} /> Failed to Fetch
          </button>
          <button
            onClick={() => handleTriggerError('API 5xx Server')}
            className="px-2.5 py-1 text-[11px] bg-[#F5F5F5] hover:bg-red-50 hover:text-red-700 border border-[#E0E0E0] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ServerCrash size={11} /> 500 / 502 Server API
          </button>
          <button
            onClick={() => handleTriggerError('Runtime TypeError')}
            className="px-2.5 py-1 text-[11px] bg-[#F5F5F5] hover:bg-red-50 hover:text-red-700 border border-[#E0E0E0] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Bug size={11} /> TypeError / Undefined
          </button>
          <button
            onClick={() => handleTriggerError('Unhandled Promise')}
            className="px-2.5 py-1 text-[11px] bg-[#F5F5F5] hover:bg-red-50 hover:text-red-700 border border-[#E0E0E0] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle size={11} /> Unhandled Rejection
          </button>
        </div>

        {renderToastAndDrawer()}
      </div>
    );
  }

  // Default Header Variant
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          id="header-trigger-error-btn"
          onClick={() => handleTriggerError()}
          disabled={loading}
          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] uppercase tracking-wider font-bold border border-red-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          title="Click to trigger a new simulated error & API failure"
        >
          <Flame size={14} className={loading ? 'animate-spin text-yellow-300' : 'text-yellow-300'} />
          <span>{loading ? 'Failing...' : '⚡ Trigger Error'}</span>
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-1.5 border border-[#CCCCCC] hover:border-[#000000] text-[#333333] hover:text-[#000000] transition-colors relative cursor-pointer"
          title="Open Error Console & Logs"
        >
          <Terminal size={16} />
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {history.length > 9 ? '9+' : history.length}
            </span>
          )}
        </button>
      </div>

      {renderToastAndDrawer()}
    </>
  );

  function renderToastAndDrawer() {
    return (
      <>
        {/* Floating Toast Notification for immediate feedback */}
        {showToast && lastError && (
          <div className="fixed bottom-6 right-6 max-w-md w-full z-50 bg-[#111111] text-white p-4 border-l-4 border-red-500 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400 shrink-0" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                  {lastError.category} {lastError.httpStatus ? `[HTTP ${lastError.httpStatus}]` : ''}
                </span>
              </div>
              <button 
                onClick={() => setShowToast(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <h4 className="font-semibold text-sm mt-1 text-white">{lastError.title}</h4>
            <p className="font-mono text-xs text-red-200/90 mt-1.5 break-words bg-black/40 p-2 rounded border border-white/10">
              {lastError.message}
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>Time: {lastError.timestamp}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(lastError.message, lastError.id)}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedId === lastError.id ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
                  <span>{copiedId === lastError.id ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-[#D4AF37] hover:underline font-medium"
                >
                  View in Console →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Error Console Drawer */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
            <div className="w-full max-w-2xl bg-[#111111] text-white h-full flex flex-col shadow-2xl border-l border-[#333333]">
              
              {/* Header */}
              <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-[#181818]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-950/60 border border-red-700/50 text-red-400">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif text-white flex items-center gap-2">
                      Error & Activity Console
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-red-900/60 text-red-300 border border-red-700/50">
                        {history.length} Event{history.length === 1 ? '' : 's'}
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400">
                      Dispatched errors, network failures, and rejected promises for reportli.js
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Action Controls */}
              <div className="p-4 border-b border-[#222222] bg-[#141414] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerError()}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Flame size={14} className={loading ? 'animate-spin' : ''} />
                    <span>Trigger New Error</span>
                  </button>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-[#222222] text-xs text-white border border-[#333333] focus:border-[#D4AF37] outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c === 'ALL' ? 'All Categories (Random)' : c}</option>
                    ))}
                  </select>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={() => {
                      setHistory([]);
                      setLastError(null);
                    }}
                    className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 px-2.5 py-1.5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} /> Clear Logs
                  </button>
                )}
              </div>

              {/* Error List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
                {history.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
                    <Terminal size={36} className="text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-400">No errors generated yet</p>
                      <p className="text-xs text-gray-600 mt-1">Click &quot;Trigger New Error&quot; above to simulate real errors.</p>
                    </div>
                    <button
                      onClick={() => handleTriggerError()}
                      className="mt-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                    >
                      ⚡ Trigger First Error
                    </button>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="p-4 bg-[#1a1a1a] border border-[#2e2e2e] rounded-sm hover:border-red-500/50 transition-colors space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 font-bold uppercase ${
                            item.category.includes('5xx') || item.category.includes('Network')
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : item.category.includes('TypeError') || item.category.includes('Promise')
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-purple-950 text-purple-400 border border-purple-800'
                          }`}>
                            {item.category}
                          </span>
                          {item.httpStatus && (
                            <span className="text-red-400 font-bold">HTTP {item.httpStatus}</span>
                          )}
                          <span className="text-gray-500 text-[10px]">#{history.length - idx}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                          <span>{item.timestamp}</span>
                          <button
                            onClick={() => copyToClipboard(`${item.title}\n${item.message}`, item.id)}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                            title="Copy error details"
                          >
                            {copiedId === item.id ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-white font-sans">{item.title}</h4>
                      
                      <div className="p-2.5 bg-black/60 text-red-300/90 rounded border border-white/5 break-all text-[11px] leading-relaxed">
                        {item.message}
                      </div>

                      {item.endpoint && (
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 truncate">
                          <span className="text-gray-500">Target Endpoint:</span>
                          <span className="text-[#D4AF37] truncate">{item.endpoint}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer info */}
              <div className="p-4 border-t border-[#222222] bg-[#141414] text-[11px] text-gray-400 flex items-center justify-between">
                <span>Tracking Target: <strong className="text-gray-200">reportli.js (rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW)</strong></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Active Monitoring
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
