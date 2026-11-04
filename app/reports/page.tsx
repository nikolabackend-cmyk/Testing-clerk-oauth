'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import ErrorSimulator from '@/components/ErrorSimulator';
import { triggerSimulatedError } from '@/lib/error-generator';

export default function ReportsPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const reportsList = [
    {
      id: 'REP-2026-081',
      clientId: 1,
      clientName: 'Ethereal Goods',
      period: 'August 2026 Monthly Executive',
      sources: ['Shopify', 'Google Analytics 4'],
      status: 'READY',
      date: '2026-09-01',
      size: '2.4 MB',
      roas: '3.84x',
    },
    {
      id: 'REP-2026-080',
      clientId: 2,
      clientName: 'Solas Creative',
      period: 'August 2026 Paid Ads & ROAS',
      sources: ['Meta Ads', 'Shopify'],
      status: 'READY',
      date: '2026-08-31',
      size: '1.8 MB',
      roas: '4.12x',
    },
    {
      id: 'REP-2026-079',
      clientId: 3,
      clientName: 'Aura Collective',
      period: 'Weekly Conversion Attribution',
      sources: ['Google Analytics 4', 'Meta Ads'],
      status: 'FAILED',
      date: '2026-08-28',
      size: '—',
      error: 'CSV schema validation failed for Shopify & GA4 metrics',
    },
    {
      id: 'REP-2026-078',
      clientId: 1,
      clientName: 'Ethereal Goods',
      period: 'Mid-Month Shopify Performance',
      sources: ['Shopify'],
      status: 'READY',
      date: '2026-08-15',
      size: '1.2 MB',
      roas: '3.65x',
    },
  ];

  const filteredReports = reportsList.filter(r => {
    const matchesSearch = r.clientName.toLowerCase().includes(search.toLowerCase()) || 
                          r.period.toLowerCase().includes(search.toLowerCase()) ||
                          r.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'READY') return r.status === 'READY';
    if (filter === 'FAILED') return r.status === 'FAILED';
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-[#E0E0E0] pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-[#D4AF37]">
              Route: /reports
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Compiled Datasets & Exports
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Reports Center</h1>
          <p className="text-[#666666] text-xs uppercase tracking-widest">
            Multi-platform client summaries and compiled audit exports
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => triggerSimulatedError('API 5xx Server')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Flame size={14} />
            <span>Simulate Report Error</span>
          </button>
          <Link
            href="/dashboard"
            className="bg-[#000000] text-[#FFFFFF] px-5 py-2.5 text-xs uppercase tracking-widest border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-colors"
          >
            + Generate in /dashboard
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 border border-[#E0E0E0]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2">Filter:</span>
          {['ALL', 'READY', 'FAILED'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                filter === opt
                  ? 'bg-black text-[#D4AF37] border-black font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 text-xs border border-[#CCCCCC] w-full sm:w-64 focus:border-black outline-none"
          />
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white border border-[#E0E0E0] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F8F8] border-b border-[#E0E0E0] uppercase tracking-wider font-semibold text-gray-500">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Period / Scope</th>
                <th className="py-3 px-4">Sources</th>
                <th className="py-3 px-4">Generated</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/75 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{report.id}</td>
                  <td className="py-3.5 px-4 font-serif text-sm font-semibold">{report.clientName}</td>
                  <td className="py-3.5 px-4 text-gray-700">{report.period}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {report.sources.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-gray-100 text-[10px] uppercase font-mono text-gray-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-500">{report.date}</td>
                  <td className="py-3.5 px-4">
                    {report.status === 'READY' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle size={11} /> Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard?client=${report.clientId}`}
                        className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                        title="Inspect in /dashboard"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => alert(`Downloading ${report.id} (${report.size})...`)}
                        className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold border border-black hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Download size={12} />
                        <span>Export</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Error Simulator */}
      <ErrorSimulator variant="inline" />
    </div>
  );
}
