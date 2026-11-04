'use client';

import { useState } from 'react';
import { 
  Settings, 
  Key, 
  Copy, 
  Check, 
  Activity, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Layers, 
  Database,
  Flame
} from 'lucide-react';
import ErrorSimulator from '@/components/ErrorSimulator';
import { triggerSimulatedError } from '@/lib/error-generator';

export default function SettingsPage() {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const scriptCode = `<script\n  src="https://reportliai-sbs.reportliaihq.workers.dev/reportli.js"\n  api_key="rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW"\n  async\n></script>`;

  const handleCopyScript = () => {
    navigator.clipboard?.writeText(scriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText('rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-[#E0E0E0] pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-[#D4AF37]">
              Route: /settings
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Workspace & Tracking Configuration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Workspace Settings</h1>
          <p className="text-[#666666] text-xs uppercase tracking-widest">
            Manage reportli.js telemetry, API credentials, and multi-tenant pipelines
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => triggerSimulatedError('Rate Limit & Auth')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Flame size={14} />
            <span>Simulate Auth 401 Error</span>
          </button>
        </div>
      </div>

      {/* Tracking Script Card */}
      <div className="bg-white border border-[#E0E0E0] p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black text-[#D4AF37]">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-serif">Reportli SaaS Tracking Script</h2>
              <p className="text-xs text-gray-500">Live telemetry and activity collector embedded across your SaaS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Status: Active & Monitoring
            </span>
          </div>
        </div>

        {/* Script Embed Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-gray-700">Embedded Script Tag:</span>
            <button
              onClick={handleCopyScript}
              className="text-xs uppercase tracking-wider font-bold text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedScript ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              <span>{copiedScript ? 'Copied' : 'Copy Script Tag'}</span>
            </button>
          </div>
          <pre className="p-4 bg-[#141414] text-[#E0E0E0] font-mono text-xs overflow-x-auto rounded border border-black/10">
            {scriptCode}
          </pre>
        </div>

        {/* Data Key */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Workspace Tracking Key (<code className="font-mono">api_key</code>)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW"
                className="px-3 py-2 bg-gray-50 border border-gray-300 font-mono text-xs w-full text-gray-800"
              />
              <button
                onClick={handleCopyKey}
                className="px-3 py-2 border border-black bg-white hover:bg-black hover:text-white text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                {copiedKey ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Remote Script Worker URL
            </label>
            <input
              type="text"
              readOnly
              value="https://reportliai-sbs.reportliaihq.workers.dev/reportli.js"
              className="px-3 py-2 bg-gray-50 border border-gray-300 font-mono text-xs w-full text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Clerk Production Mode & Custom Domain Status */}
      <div className="bg-white border border-[#E0E0E0] p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black text-[#D4AF37]">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif">Clerk Authentication — Production Mode</h2>
              <p className="text-xs text-gray-500">Domain mapping and credentials for <span className="font-semibold text-black">reportliai.sbs</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Current: Development Instance (Active)
            </span>
          </div>
        </div>

        {/* DNS Status Callout */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              DNS CNAME Verified & Active on reportliai.sbs
            </div>
            <p className="text-xs text-emerald-800">
              <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded text-emerald-900">clerk.reportliai.sbs</code> points to <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded text-emerald-900">frontend-api.clerk.services</code>.
            </p>
          </div>
          <div className="text-[11px] font-mono bg-white px-3 py-1.5 border border-emerald-300 text-emerald-800">
            SSL & HTTP/2 Active
          </div>
        </div>

        {/* Production Steps */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            How to switch your instance to 100% Production:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-white font-bold">Step 1</span>
              <p className="font-semibold text-gray-900">Open Clerk Dashboard</p>
              <p className="text-gray-600 leading-relaxed">
                Log into <span className="font-semibold">dashboard.clerk.com</span> and switch the environment toggle from <span className="text-amber-700 font-medium">Development</span> to <span className="text-emerald-700 font-medium">Production</span>.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-white font-bold">Step 2</span>
              <p className="font-semibold text-gray-900">Get Production Secret Key</p>
              <p className="text-gray-600 leading-relaxed">
                Go to <span className="font-semibold">API Keys</span> in Clerk. Copy your Live Secret Key starting with <code className="font-mono text-[11px] bg-gray-200 px-1">sk_live_...</code>.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-white font-bold">Step 3</span>
              <p className="font-semibold text-gray-900">Deploy with Live Keys</p>
              <p className="text-gray-600 leading-relaxed">
                Set <code className="font-mono text-[11px]">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code className="font-mono text-[11px]">CLERK_SECRET_KEY</code> with your live keys.
              </p>
            </div>
          </div>
        </div>

        {/* Production Key Preview */}
        <div className="space-y-3 pt-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
            Production Environment Configuration (.env.local / Hosting Platform):
          </span>
          <pre className="p-4 bg-[#141414] text-[#E0E0E0] font-mono text-xs overflow-x-auto rounded border border-black/10">
{`# Production Clerk Configuration for reportliai.sbs
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsucmVwb3J0bGlhaS5zYnMk
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_SECRET_KEY_HERE

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/`}
          </pre>
          <p className="text-[11px] text-gray-500">
            Note: On Cloud Run preview URLs (<code className="font-mono">*.run.app</code>), the app safely uses development fallback so you can test sign-in without cross-domain cookie rejections. Production mode runs natively when accessed through <code className="font-mono font-semibold text-black">reportliai.sbs</code>.
          </p>
        </div>
      </div>

      {/* Integration Toggles & Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E0E0E0] p-6 space-y-4 shadow-2xs">
          <h3 className="text-lg font-serif flex items-center gap-2">
            <Database size={18} className="text-[#D4AF37]" />
            Pipeline & Sync Rules
          </h3>
          
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
              <div>
                <span className="font-semibold block text-gray-800">Automated Daily Sync</span>
                <span className="text-gray-500">Run Shopify & GA4 updates every morning at 06:00 UTC</span>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="h-4 w-4 accent-black cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
              <div>
                <span className="font-semibold block text-gray-800">Immediate Error Alerts</span>
                <span className="text-gray-500">Email notify upon unhandled pipeline failure</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 accent-black cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] p-6 space-y-4 shadow-2xs">
          <h3 className="text-lg font-serif flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            Security & Telemetry
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            All telemetry generated by <code className="font-mono">reportli.js</code> is dispatched with client identifier <code className="font-mono">rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW</code> directly to your monitoring collector.
          </p>
          <div className="pt-2">
            <button
              onClick={() => alert('Settings successfully updated.')}
              className="px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Error Simulator */}
      <ErrorSimulator variant="inline" />
    </div>
  );
}
