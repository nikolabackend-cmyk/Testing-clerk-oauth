'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUpCircle, 
  Check, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  Flame
} from 'lucide-react';
import ErrorSimulator from '@/components/ErrorSimulator';
import { triggerSimulatedError } from '@/lib/error-generator';

export default function UpgradePage() {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: selectedBilling === 'monthly' ? '$49' : '$39',
      period: '/month',
      description: 'Ideal for boutique consulting agencies handling 1-3 clients.',
      clients: '3 Clients',
      reports: '25 Reports/mo',
      features: [
        'Shopify & Google Analytics 4',
        'Standard CSV export',
        'reportli.js client tracking',
        'Email support (24h SLA)',
      ],
      current: false,
      cta: 'Downgrade to Starter',
    },
    {
      name: 'Professional',
      price: selectedBilling === 'monthly' ? '$149' : '$119',
      period: '/month',
      description: 'Our most popular tier for growing digital and performance marketing agencies.',
      clients: '15 Clients',
      reports: '150 Reports/mo',
      features: [
        'Everything in Starter',
        'Meta Ads & Google Ads API Sync',
        'Executive PDF Generation Engine',
        'Priority Pipeline Workers (99.9% SLA)',
        'Custom Logo & Branded Reports',
        'Automated Scheduled Cron Exports',
      ],
      current: true,
      cta: 'Current Plan',
    },
    {
      name: 'Enterprise',
      price: selectedBilling === 'monthly' ? '$399' : '$319',
      period: '/month',
      description: 'Dedicated infrastructure with bespoke cross-channel data modeling.',
      clients: 'Unlimited Clients',
      reports: 'Unlimited Reports',
      features: [
        'Everything in Pro',
        'Dedicated Cloud Run Workers',
        'Custom Data Warehouse (BigQuery/Snowflake)',
        'Custom API Rate Limits (>1,000 req/min)',
        'Dedicated Account Manager',
      ],
      current: false,
      cta: 'Upgrade to Enterprise',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-[#E0E0E0] pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-[#D4AF37]">
              Route: /upgrade
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Subscription & Quota Management
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Plans & Quotas</h1>
          <p className="text-[#666666] text-xs uppercase tracking-widest">
            Scale your automated client reporting capacity
          </p>
        </div>

        {/* Billing Switcher */}
        <div className="flex items-center bg-gray-100 p-1 border border-gray-300">
          <button
            onClick={() => setSelectedBilling('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              selectedBilling === 'monthly' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedBilling('yearly')}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBilling === 'yearly' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            <span>Annual</span>
            <span className="text-[9px] bg-[#D4AF37] text-black px-1 font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Current Quota Consumption Card */}
      <div className="p-6 bg-white border border-[#E0E0E0] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-serif">Current Usage — Pro Tier</h3>
            <p className="text-xs text-gray-500">Billing cycle resets in 19 days</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerSimulatedError('Rate Limit & Auth')}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Flame size={12} />
              <span>Simulate 429 Rate Limit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Clients Used</span>
              <span className="text-gray-700">3 / 15</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Reports Compiled</span>
              <span className="text-gray-700">18 / 150</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>API Rate Quota</span>
              <span className="text-gray-700">120 req / min</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 bg-white border flex flex-col justify-between transition-all relative ${
              plan.current 
                ? 'border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]' 
                : 'border-[#E0E0E0] hover:border-black'
            }`}
          >
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#D4AF37] text-black text-[10px] uppercase font-bold tracking-widest">
                Active Plan
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-2xl font-serif">{plan.name}</h3>
                {plan.current && <Crown size={18} className="text-[#D4AF37]" />}
              </div>
              <p className="text-xs text-gray-600 min-h-[32px]">{plan.description}</p>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-serif font-bold">{plan.price}</span>
                <span className="text-xs text-gray-500">{plan.period}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-700">
                <div className="font-semibold text-black uppercase tracking-wider text-[11px]">Included:</div>
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => alert(`Plan selection: ${plan.name}`)}
                className={`w-full py-3 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer border ${
                  plan.current
                    ? 'bg-black text-[#D4AF37] border-black hover:bg-[#D4AF37] hover:text-black'
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Error Simulator */}
      <ErrorSimulator variant="inline" />
    </div>
  );
}
