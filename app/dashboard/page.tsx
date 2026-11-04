'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import ErrorSimulator from '@/components/ErrorSimulator';
import { triggerSimulatedError } from '@/lib/error-generator';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientQueryId = searchParams.get('client');

  const [clients, setClients] = useState([
    { id: 1, name: 'Ethereal Goods', channels: 'Shopify • GA4' },
    { id: 2, name: 'Solas Creative', channels: 'Meta Ads • Shopify' },
    { id: 3, name: 'Aura Collective', channels: 'GA4 • Meta Ads' },
  ]);
  const [search, setSearch] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Selected client derived from URL query parameter or null
  const selectedClient = clientQueryId 
    ? clients.find(c => c.id === parseInt(clientQueryId, 10)) || null 
    : null;

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectClient = (client: { id: number; name: string }) => {
    router.push(`/dashboard?client=${client.id}`);
  };

  const handleClearSelectedClient = () => {
    setReportError(null);
    setReportSuccess(false);
    router.push('/dashboard');
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setReportError(null);
    setReportSuccess(false);
    try {
      await new Promise(r => setTimeout(r, 1000));
      // Trigger genuine client error event for reportli tracking
      const err = await triggerSimulatedError('API 5xx Server');
      setReportError(`Error generating report: ${err.message}`);
    } catch (e: any) {
      setReportError(e?.message || 'Report generation failed');
    } finally {
      setGeneratingReport(false);
    }
  };

  if (selectedClient) {
    return (
      <div className="space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleClearSelectedClient} 
            className="flex items-center space-x-2 text-[#666666] hover:text-[#000000] uppercase text-xs tracking-widest border-b border-[#D4AF37] pb-0.5 cursor-pointer"
          >
            <ChevronLeft size={16} /> <span>Back to /dashboard</span>
          </button>
          <span className="font-mono text-xs text-gray-500">
            Route: /dashboard?client={selectedClient.id}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0E0E0] pb-6">
          <div>
            <h1 className="text-4xl font-serif">{selectedClient.name}</h1>
            <p className="text-[#666666] text-xs uppercase tracking-widest mt-1">Multi-Channel Client Report & Metrics Engine</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => triggerSimulatedError()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              ⚡ Test Error
            </button>
            <Link
              href="/reports"
              className="px-4 py-2 bg-black text-white hover:bg-[#D4AF37] hover:text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>View All Reports</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {reportError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-900 text-xs font-mono flex items-start gap-3 shadow-2xs">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-sans font-bold block mb-1">Pipeline Exception Logged to reportli.js:</strong>
              {reportError}
            </div>
          </div>
        )}

        <div className="p-8 border border-[#E0E0E0] bg-[#FFFFFF] shadow-sm">
          <p className="font-serif italic text-xl mb-2">Upload CSV files to generate reports:</p>
          <p className="text-xs text-[#666666] mb-6">Connect Shopify Orders, Google Analytics 4 sessions, and Meta Ads exports.</p>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 px-4 py-2.5 border border-[#000000] text-xs uppercase tracking-wider cursor-pointer hover:bg-black/5 transition-colors">
              <Upload size={14} />
              <span>Select CSV Dataset</span>
              <input type="file" className="hidden" />
            </label>
            <button 
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="px-6 py-2.5 bg-[#000000] text-[#FFFFFF] text-xs uppercase tracking-widest border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-colors cursor-pointer disabled:opacity-50"
            >
              {generatingReport ? 'Processing Pipeline...' : 'Generate Report & Sync'}
            </button>
          </div>
        </div>

        {/* Inline Error Simulator */}
        <ErrorSimulator variant="inline" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Header & Client Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-[#E0E0E0] pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-[#D4AF37]">
              Route: /dashboard
            </span>
            <span className="text-xs text-gray-500 font-mono">
              api_key=&quot;rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW&quot;
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Manage Clients</h1>
          <p className="text-[#666666] text-xs uppercase tracking-widest">
            Monitoring {clients.length} active reporting accounts
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-9 pr-4 py-2.5 border border-[#000000] text-xs w-56 md:w-64 outline-none focus:border-[#D4AF37]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            className="bg-[#000000] text-[#FFFFFF] px-5 py-2.5 text-xs uppercase tracking-widest border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#000000] transition-colors cursor-pointer"
            onClick={() => {
              const name = prompt('Client Name:');
              if (name) setClients([...clients, { id: Date.now(), name, channels: 'Shopify • GA4' }]);
            }}
          >
            + New Client
          </button>
        </div>
      </div>

      {/* Prominent Error & Activity Simulator Card */}
      <ErrorSimulator variant="inline" />

      {/* Client Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif">Client Accounts</h2>
          <span className="text-xs uppercase tracking-wider text-[#666666]">{filteredClients.length} accounts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClients.map(client => (
            <div key={client.id} className="relative p-8 border border-[#E0E0E0] bg-[#FFFFFF] h-64 flex flex-col group transition-all duration-300 hover:border-[#D4AF37] hover:shadow-md">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="font-serif italic text-2xl mb-2">{client.name}</h3>
              <div className="text-[#666666] text-[11px] uppercase tracking-widest mb-6">{client.channels || 'Shopify • GA4 • Meta Ads'}</div>
              
              <div className="text-xs text-gray-500 mb-4">
                Active tracker: <span className="font-mono text-gray-700">reportli.js</span>
              </div>

              <div className="mt-auto pt-4 border-t border-[#F0F0F0] flex items-center justify-between">
                <button 
                  onClick={() => handleSelectClient(client)}
                  className="text-xs uppercase tracking-widest font-bold border-b border-[#D4AF37] pb-0.5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  View Report &rarr;
                </button>
                <button
                  onClick={() => triggerSimulatedError()}
                  className="text-[11px] uppercase tracking-wider text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ⚡ Fail Sync
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-gray-500">Loading /dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
