'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { 
  Menu, 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Copy, 
  Check, 
  ExternalLink,
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  ArrowUpCircle,
  HelpCircle
} from 'lucide-react';
import { 
  useAuth,
  SignInButton, 
  UserButton 
} from '@clerk/nextjs';
import ErrorSimulator from './ErrorSimulator';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const pathname = usePathname() || '/home';
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  const navLinks = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Upgrade', path: '/upgrade', icon: ArrowUpCircle },
    { label: 'Support', path: '/support', icon: HelpCircle },
  ];

  const handleCopyUrl = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${pathname}`;
      navigator.clipboard?.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleOpenNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(pathname, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#000000] font-sans flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 w-full bg-[#FFFFFF] z-40 border-b border-[#E0E0E0] shadow-xs">
        {/* Main Header Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar} 
              className="p-2 border border-[#000000] hover:bg-[#D4AF37] hover:text-[#FFFFFF] transition-colors rounded-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <Link href="/home" className="flex items-baseline gap-2 group">
              <span className="font-bold text-lg md:text-xl uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
                Reportli AI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 bg-black text-white tracking-widest">
                SaaS
              </span>
            </Link>
          </div>

          {/* Desktop Direct Route Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 border-x border-[#EFEFEF] px-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path === '/home' && pathname === '/');
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-black text-[#D4AF37] border-b-2 border-[#D4AF37]'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <link.icon size={13} className={isActive ? 'text-[#D4AF37]' : 'text-gray-400'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ErrorSimulator variant="header" />
            <div className="flex items-center gap-2 border-l border-[#E0E0E0] pl-3">
              {isLoaded && !userId && (
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider border border-black hover:bg-black hover:text-[#D4AF37] transition-all cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              )}
              {isLoaded && userId && (
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "rounded-none border border-black",
                      userButtonTrigger: "rounded-none"
                    }
                  }}
                />
              )}
              {!isLoaded && (
                <div className="w-8 h-8 border border-black animate-pulse bg-gray-50" />
              )}
            </div>
          </div>
        </div>

        {/* Browser URL & Navigation Bar */}
        <div className="bg-[#F4F4F5] border-t border-[#E5E5E5] px-4 py-1.5 flex items-center justify-between text-xs gap-2">
          {/* Back, Forward, Reload buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => router.back()}
              className="p-1 text-gray-500 hover:text-black hover:bg-white rounded transition-colors cursor-pointer"
              title="Browser Back"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => router.forward()}
              className="p-1 text-gray-500 hover:text-black hover:bg-white rounded transition-colors cursor-pointer"
              title="Browser Forward"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => router.refresh()}
              className="p-1 text-gray-500 hover:text-black hover:bg-white rounded transition-colors cursor-pointer"
              title="Reload Route"
            >
              <RotateCw size={13} />
            </button>
          </div>

          {/* Simulated Browser URL Address Bar */}
          <div className="flex-1 max-w-2xl bg-white border border-[#D1D5DB] rounded-sm px-3 py-1 flex items-center justify-between gap-2 shadow-2xs font-mono text-[11px] overflow-hidden">
            <div className="flex items-center gap-1.5 truncate text-gray-700">
              <Globe size={13} className="text-emerald-600 shrink-0" />
              <span className="text-gray-400 select-none hidden sm:inline">https://reportli.ai</span>
              <span className="font-bold text-black">{pathname === '/' ? '/home' : pathname}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyUrl}
                className="text-gray-400 hover:text-black flex items-center gap-1 text-[10px] font-sans uppercase tracking-wider transition-colors cursor-pointer"
                title="Copy Browser URL"
              >
                {copiedUrl ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                <span className="hidden md:inline">{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleOpenNewTab}
                className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                title="Open Route in New Tab"
              >
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          {/* Quick Route Switcher on mobile/compact */}
          <div className="flex lg:hidden items-center gap-1 shrink-0 overflow-x-auto">
            <Link
              href="/home"
              className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${
                pathname === '/home' || pathname === '/' ? 'bg-black text-[#D4AF37] border-black' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${
                pathname.startsWith('/dashboard') ? 'bg-black text-[#D4AF37] border-black' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/reports"
              className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${
                pathname.startsWith('/reports') ? 'bg-black text-[#D4AF37] border-black' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Reports
            </Link>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area - padded down for two-tier header */}
      <main className="pt-28 p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E0E0E0] bg-white py-6 px-6 md:px-10 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-black">Reportli AI</span>
            <span>&bull;</span>
            <span>Active Tracker: <code className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">api_key=&quot;rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW&quot;</code></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
            <Link href="/home" className="hover:text-black">/home</Link>
            <Link href="/dashboard" className="hover:text-black">/dashboard</Link>
            <Link href="/reports" className="hover:text-black">/reports</Link>
            <Link href="/settings" className="hover:text-black">/settings</Link>
            <Link href="/upgrade" className="hover:text-black">/upgrade</Link>
            <Link href="/support" className="hover:text-black">/support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
