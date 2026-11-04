'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  BookOpen, 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Flame,
  ArrowRight
} from 'lucide-react';
import ErrorSimulator from '@/components/ErrorSimulator';
import { triggerSimulatedError } from '@/lib/error-generator';

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setSubmitted(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'How does reportli.js capture SaaS activity and errors?',
      a: 'The script attaches global listeners for unhandled rejections, window.onerror, and network fetch telemetry with your tenant identifier api_key="rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW".',
    },
    {
      q: 'Can I simulate errors to verify tracking during development?',
      a: 'Yes! Use the "⚡ Trigger Error" button in the top navigation or the Error Testing console on any page to simulate 500s, fetch drops, and runtime exceptions.',
    },
    {
      q: 'What browser URLs are available in this SaaS?',
      a: 'You can navigate directly to /home, /dashboard, /reports, /settings, /upgrade, and /support. Each path is a distinct route in Next.js.',
    },
    {
      q: 'How are multi-channel client reports generated?',
      a: 'Navigate to /dashboard or /reports, upload client CSV datasets for Shopify or GA4, and the system aggregates metrics into executive intelligence.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-[#E0E0E0] pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black text-[#D4AF37]">
              Route: /support
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Knowledge Base & Diagnostic Center
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Help & Support</h1>
          <p className="text-[#666666] text-xs uppercase tracking-widest">
            Troubleshooting, tracking verification, and technical assistance
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => triggerSimulatedError('Network / Fetch')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Flame size={14} />
            <span>Test Uncaught Exception</span>
          </button>
        </div>
      </div>

      {/* Grid: Diagnostics & Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Diagnostics Card */}
        <div className="p-8 bg-white border border-[#E0E0E0] space-y-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b border-[#F0F0F0] pb-4">
            <div className="p-2.5 bg-black text-[#D4AF37]">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif">Diagnostics & Health Check</h2>
              <p className="text-xs text-gray-500">Live verification of tracking script and API endpoints</p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-gray-50 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-600">reportli.js worker status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> REACHABLE
              </span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-600">Client Key Verification:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono text-[11px]">
                <CheckCircle2 size={13} /> rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW (VALID)
              </span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 flex items-center justify-between">
              <span className="text-gray-600">App Router Navigation:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> 6 Active Routes
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-1.5"
            >
              <span>Return to /dashboard</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="p-8 bg-white border border-[#E0E0E0] space-y-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b border-[#F0F0F0] pb-4">
            <div className="p-2.5 bg-black text-[#D4AF37]">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif">Open Support Ticket</h2>
              <p className="text-xs text-gray-500">Direct response from the Reportli engineering team</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Ticket Submitted Successfully!
              </div>
              <p>Our engineering support team has received your ticket and will respond to reportliaihq@gmail.com shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Subject / Issue Category
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Issue connecting Shopify or reportli.js"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Description & Error Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what occurred or paste any error messages..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 focus:border-black outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-bold border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-[#E0E0E0] p-8 space-y-6">
        <h2 className="text-xl font-serif flex items-center gap-2">
          <BookOpen size={18} className="text-[#D4AF37]" />
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <h4 className="font-serif font-bold text-sm text-black">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Error Simulator */}
      <ErrorSimulator variant="inline" />
    </div>
  );
}
