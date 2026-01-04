
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  RefreshCw, 
  Database, 
  Zap, 
  Monitor, 
  Smartphone,
  Copy,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import { useNexus } from '../components/NexusProvider';
import { exportDatabase, importDatabase } from '../services/storage';

const Core: React.FC = () => {
  const { isDarkMode, toggleDarkMode, togglePrivacy, isPrivacyEnabled } = useNexus();
  const [syncString, setSyncString] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    const str = exportDatabase();
    setSyncString(str);
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!syncString) return;
    const success = importDatabase(syncString);
    if (success) {
      setImportStatus('success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setImportStatus('error');
    }
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header>
        <h2 className="text-5xl font-black italic tracking-tighter text-white">SYSTEM <span className="text-blue-500">CORE</span></h2>
        <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Manage technical protocols and global state</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* Sync Protocol */}
        <section className="glass p-10 rounded-[3rem] border-white/5 bg-white/[0.01]">
          <SectionHeader icon={RefreshCw} title="Technical Uplink" subtitle="Cross-Device Data Synchronization" />
          
          <div className="space-y-6">
            <p className="text-slate-400 text-sm leading-relaxed">
              To synchronize your records across devices, generate a <span className="text-blue-500 font-bold">Nexus Uplink Key</span>. 
              Copy the string from your primary device and paste it below on your secondary terminal.
            </p>

            <div className="relative">
              <textarea 
                value={syncString}
                onChange={(e) => setSyncString(e.target.value)}
                placeholder="PASTE UPLINK KEY HERE..."
                className="w-full bg-slate-950/60 border border-white/5 rounded-3xl p-6 text-blue-400 mono text-xs h-32 focus:border-blue-500/50 transition-all placeholder-slate-800"
              />
              <button 
                onClick={handleExport}
                className="absolute right-4 bottom-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Generate Key'}
              </button>
            </div>

            <button 
              onClick={handleImport}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                importStatus === 'success' ? 'bg-emerald-600 text-white' : 
                importStatus === 'error' ? 'bg-rose-600 text-white' : 
                'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20'
              }`}
            >
              {importStatus === 'success' ? <Check className="w-5 h-5" /> : 
               importStatus === 'error' ? <AlertCircle className="w-5 h-5" /> : 
               <Download className="w-5 h-5" />}
              {importStatus === 'success' ? 'Protocol Synchronized' : 
               importStatus === 'error' ? 'Invalid Uplink Key' : 
               'Downlink & Initialize Data'}
            </button>
          </div>
        </section>

        {/* Global Configuration */}
        <section className="glass p-10 rounded-[3rem] border-white/5 bg-white/[0.01]">
           <SectionHeader icon={Settings} title="Interface Protocols" subtitle="Visual & Privacy Standards" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={toggleDarkMode}
                className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-4">
                  <Monitor className="w-6 h-6 text-blue-500" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Atmosphere</p>
                    <p className="text-sm font-black text-white uppercase">{isDarkMode ? 'Night Ops' : 'Daylight'}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-all ${isDarkMode ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'ml-6' : 'ml-0'}`} />
                </div>
              </button>

              <button 
                onClick={togglePrivacy}
                className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Privacy Shield</p>
                    <p className="text-sm font-black text-white uppercase">{isPrivacyEnabled ? 'Active' : 'Disabled'}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-all ${isPrivacyEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${isPrivacyEnabled ? 'ml-6' : 'ml-0'}`} />
                </div>
              </button>
           </div>
        </section>

        {/* System Info */}
        <div className="flex flex-col items-center gap-6 opacity-30 text-center">
           <Zap className="w-8 h-8 text-blue-500" />
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Nexus Master Core</p>
              <p className="text-xs font-black text-white italic tracking-tighter">SECURED ENCRYPTED ENVIRONMENT v4.0.0</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Core;
