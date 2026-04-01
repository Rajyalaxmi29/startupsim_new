import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, Mail, Lock, LogIn } from 'lucide-react';

export function LoginView({ onLogin, loading }: { onLogin: (email: string, pass: string) => void, loading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f0]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 max-w-md w-full text-center space-y-8"
      >
        <div className="w-20 h-20 bg-foreground text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <Rocket className="w-10 h-10" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-serif tracking-tight">StartupSim</h1>
          <p className="text-muted leading-relaxed">Enter your credentials to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 ring-foreground/20 transition-all outline-none"
                placeholder="founder@startup.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 ring-foreground/20 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-foreground text-white font-medium py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In to Journey
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-muted italic">
          No backend required. Your progress is saved locally.
        </p>
      </motion.div>
    </div>
  );
}
