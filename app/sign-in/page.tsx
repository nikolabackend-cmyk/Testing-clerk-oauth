'use client';

import { signInWithGoogle } from '@/app/auth/actions';
import { LogIn, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-[#E0E0E0] p-8 md:p-12 shadow-sm"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex p-3 bg-black text-[#D4AF37] rounded-none">
            <Shield size={32} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold">Sign in to Reportli AI</h1>
            <p className="text-sm text-gray-500">
              Access your automated client reporting dashboard.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-bold uppercase tracking-widest text-xs border border-black disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-4 text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
            Secure authentication powered by Supabase & Google.<br />
            No password required.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
