import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  ArrowUpCircle, 
  HelpCircle, 
  Settings, 
  X,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Upgrade', path: '/upgrade', icon: ArrowUpCircle },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ duration: 0.2 }}
          className="fixed left-0 top-0 h-full w-64 bg-[#000000] text-[#FFFFFF] p-8 border-r border-[#D4AF37] z-50 flex flex-col shadow-2xl"
        >
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#222222]">
            <div>
              <h1 className="text-2xl italic font-serif text-[#D4AF37]">Reportli AI</h1>
              <p className="text-[10px] text-[#888888] uppercase tracking-widest mt-0.5">SaaS Intelligence</p>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path === '/home' && pathname === '/');
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={toggleSidebar}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-xs uppercase tracking-[0.18em] transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#181818] text-[#D4AF37] border-[#D4AF37] font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <item.icon size={16} className={isActive ? 'text-[#D4AF37]' : 'text-gray-400'} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-[#222222] space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono truncate" title="reportli.js active (rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW)">
              <Activity size={12} className="animate-pulse shrink-0" />
              <span className="truncate">rpl_live_ASy3hb...</span>
            </div>
            <div className="text-[10px] text-[#666666] tracking-widest">
              v2.4.0 &bull; App Router Enabled
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

