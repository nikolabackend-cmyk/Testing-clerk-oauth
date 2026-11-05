'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ArrowUpCircle, 
  HelpCircle, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Layers, 
  ShieldCheck,
  Zap,
  Flame,
  LogIn
} from 'lucide-react';
import ErrorSimulator from '@/components/ErrorSimulator';
import { triggerSimulatedError } from '@/lib/error-generator';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {}
      finally {
        setIsLoaded(true);
      }
    }
    checkUser();
  }, []);
  const quickLinks = [
    {
      title: 'Client Dashboard',
      url: '/dashboard',
      description: 'Manage client accounts, upload CSV datasets, and run report generation pipelines.',
      icon: LayoutDashboard,
      badge: '3 Clients Active',
    },
    {
      title: 'Reports Center',
      url: '/reports',
      description: 'Access compiled monthly multi-channel reports, Shopify metrics, and GA4 summaries.',
      icon: FileText,
      badge: '18 Generated',
    },
    {
      title: 'Settings & Tracking',
      url: '/settings',
      description: 'Inspect reportli.js tracking key (rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW), webhook credentials, and platform connectors.',
      icon: Settings,
      badge: 'Active Key',
    },
    {
      title: 'Upgrade & Quotas',
      url: '/upgrade',
      description: 'Expand report compilation limits, add team members, and unlock automated cron runs.',
      icon: ArrowUpCircle,
      badge: 'Pro Tier',
    },
  ];

  const recentClients = [
    { id: 1, name: 'Ethereal Goods', channels: 'Shopify • GA4', lastReport: 'Today, 09:40 AM', status: 'Synced' },
    { id: 2, name: 'Solas Creative', channels: 'Meta Ads • Shopify', lastReport: 'Yesterday', status: 'Synced' },
    { id: 3, name: 'Aura Collective', channels: 'GA4 • Meta Ads', lastReport: '3 days ago', status: 'Ready' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Hero */}
      <div className="border-b border-[#E0E0E0] pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Activity size={12} className="text-emerald-600 animate-pulse" />
                Browser Route: /home
              </span>
              <span className="text-xs text-gray-500 font-mono">
                reportli.js active &bull; key: rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif">
              {user ? `Welcome back, ${user.email?.split('@')[0]}` : 'Welcome to Reportli AI'}
            </h1>
            <p className="text-[#666666] text-sm max-w-2xl leading-relaxed">
              {user 
                ? 'Your automated multi-platform client reporting workspace is ready. Access your synchronized dashboards and multi-channel metrics below.'
                : 'Automated multi-platform client reporting SaaS. Connect Shopify, Google Analytics 4, and Meta Ads to deliver automated executive intelligence.'
              }
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isLoaded && !user ? (
              <Link href="/api/auth/login">
                <button className="px-6 py-3 bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 border border-[#D4AF37] shadow-sm cursor-pointer">
                  <LogIn size={14} />
                  <span>Sign In to Access App</span>
                </button>
              </Link>
            ) : null}

            <Link
              href="/dashboard"
              className={`px-6 py-3 text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 shadow-sm ${
                isLoaded && user 
                  ? 'bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]' 
                  : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <span>{isLoaded && user ? 'Go to /dashboard' : 'Open /dashboard'}</span>
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => triggerSimulatedError()}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Flame size={14} />
              <span>Simulate Error</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key SaaS Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-[#E0E0E0] space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Active Clients</span>
            <Users size={16} />
          </div>
          <div className="text-3xl font-serif font-bold">3</div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+1 added this month</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-[#E0E0E0] space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Reports Compiled</span>
            <Layers size={16} />
          </div>
          <div className="text-3xl font-serif font-bold">18</div>
          <div className="text-[11px] text-gray-500">
            Across 3 active channels
          </div>
        </div>

        <div className="p-6 bg-white border border-[#E0E0E0] space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Pipeline Uptime</span>
            <ShieldCheck size={16} />
          </div>
          <div className="text-3xl font-serif font-bold">99.8%</div>
          <div className="text-[11px] text-emerald-600">
            Zero degradation today
          </div>
        </div>

        <div className="p-6 bg-white border border-[#E0E0E0] space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">API Quota</span>
            <Zap size={16} />
          </div>
          <div className="text-3xl font-serif font-bold">120 <span className="text-sm font-normal text-gray-400">/min</span></div>
          <div className="text-[11px] text-gray-500">
            Rate limit for Pro Tier
          </div>
        </div>
      </div>

      {/* Primary Navigation Hub */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif">SaaS Application Modules</h2>
          <span className="text-xs uppercase tracking-wider text-gray-500">Direct Browser URLs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="p-6 bg-white border border-[#E0E0E0] hover:border-[#D4AF37] transition-all group flex flex-col justify-between h-52 relative shadow-2xs hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-black text-[#D4AF37] inline-flex">
                    <item.icon size={18} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-gray-100 text-gray-700">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-500 group-hover:text-black">
                      {item.url}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-serif group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0F0F0] flex items-center justify-between text-xs uppercase tracking-wider font-bold group-hover:text-[#D4AF37] transition-colors">
                <span>Open {item.title}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Embedded Activity & Error Testing Console */}
      <ErrorSimulator variant="inline" />

      {/* Quick Access to Recent Clients */}
      <div className="p-8 bg-white border border-[#E0E0E0]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-serif">Recent Client Accounts</h3>
            <p className="text-xs text-gray-500 mt-0.5">Quickly jump to client workspace reports in /dashboard</p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs uppercase tracking-widest font-bold border-b border-[#D4AF37] pb-0.5 hover:text-[#D4AF37] transition-colors"
          >
            View All in /dashboard &rarr;
          </Link>
        </div>

        <div className="divide-y divide-[#F0F0F0]">
          {recentClients.map((client) => (
            <div key={client.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 px-2 transition-colors">
              <div>
                <h4 className="font-serif text-lg">{client.name}</h4>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{client.channels}</span>
                  <span>&bull;</span>
                  <span>Last report: {client.lastReport}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {client.status}
                </span>
                <Link
                  href={`/dashboard?client=${client.id}`}
                  className="text-xs uppercase tracking-wider font-bold px-3 py-1.5 bg-black text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  Inspect Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
