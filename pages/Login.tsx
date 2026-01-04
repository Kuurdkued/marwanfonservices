
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fixed: Added 'Activity' to the imported icons from lucide-react
import { ShieldCheck, Lock, ArrowRight, Check, Activity } from 'lucide-react';
import { DEFAULT_PASSWORD } from '../constants';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [maintainUplink, setMaintainUplink] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === DEFAULT_PASSWORD) {
      if (maintainUplink) {
        localStorage.setItem('marwan_fon_uplink', 'true');
      }
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setPass('');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600 blur-[150px] rounded-full animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900 blur-[150px] rounded-full animate-pulse-slow"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-16 text-center z-10"
      >
        <div className="w-28 h-28 bg-white rounded-3xl p-4 shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8 flex items-center justify-center">
          <img 
            src="https://raw.githubusercontent.com/Marwan Aziz/marwan-fon/main/logo.png" 
            alt="Marwan Fon Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2">
          MARWAN <span className="text-blue-500">FON</span>
        </h1>
        <p className="text-[10px] text-blue-400 font-black tracking-[0.6em] uppercase opacity-70">
          SERVICES • NEXUS
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass p-10 md:p-14 rounded-[3.5rem] border-white/5 bg-[#0f172a]/40 shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">Authentication Protocol</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Master Security Key</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <Lock className={`w-5 h-5 transition-colors ${error ? 'text-rose-500' : 'text-slate-500'}`} />
              </div>
              <input 
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••••••••••••"
                className={`w-full bg-[#020617]/60 border ${error ? 'border-rose-500' : 'border-white/10'} rounded-[1.5rem] py-6 pl-16 pr-6 text-white text-xl tracking-widest placeholder-slate-800 focus:border-blue-500/50 transition-all shadow-inner`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setMaintainUplink(!maintainUplink)}>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${maintainUplink ? 'bg-blue-600 border-blue-600' : 'border-white/10 group-hover:border-white/30'}`}>
              {maintainUplink && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Maintain Uplink</span>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-black py-6 rounded-[1.5rem] shadow-[0_20px_40px_rgba(37,99,235,0.2)] flex items-center justify-center gap-3 group transition-all active:scale-95 text-xs tracking-[0.2em] uppercase"
          >
            Establish Access
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-rose-500 text-[10px] font-black mt-8 tracking-[0.2em] uppercase"
            >
              Protocol Denied: Invalid Security Key
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="mt-20 text-center space-y-8 z-10"
      >
        <div className="flex items-center gap-4 justify-center">
           <div className="h-[1px] w-12 bg-white/10"></div>
           <Activity className="w-4 h-4 text-slate-600" />
           <div className="h-[1px] w-12 bg-white/10"></div>
        </div>
        
        <div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Designed Exclusively For</p>
           <p className="text-xs font-black text-white italic uppercase tracking-tighter">Marwan Haji Aziz</p>
        </div>

        <div className="flex gap-10 justify-center">
           <div className="text-center">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-0.5">Build</p>
              <p className="text-[9px] font-black text-slate-400">v4.0.Nexus</p>
           </div>
           <div className="w-[1px] h-6 bg-white/5"></div>
           <div className="text-center">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-0.5">Protocol</p>
              <p className="text-[9px] font-black text-slate-400">AES-256</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
