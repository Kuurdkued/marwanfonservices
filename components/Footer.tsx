
import React from 'react';
import { OWNER_INFO } from '../constants';
import { useNexus } from './NexusProvider';

const Footer: React.FC = () => {
  const { isShowroomMode } = useNexus();
  if (isShowroomMode) return null;

  return (
    <footer className="mt-auto py-12 px-8 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <h3 className="font-bold text-lg tracking-tight">{OWNER_INFO.company}</h3>
          </div>
          <p className="text-slate-500 text-sm max-w-md">
            Ultra-premium technical management portal. Internal use only. Unauthorized access is strictly prohibited.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Principal</p>
            <p className="text-sm font-medium text-slate-300">{OWNER_INFO.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Contact</p>
            <p className="text-sm font-medium text-slate-300">{OWNER_INFO.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Support</p>
            <p className="text-sm font-medium text-slate-300">{OWNER_INFO.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Security</p>
            <p className="text-sm font-medium text-cyan-400">Encrypted / Offline</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-slate-600">
        <p>&copy; 2026 {OWNER_INFO.company}. All Rights Reserved.</p>
        <p>System Version 3.4.0_GOLD</p>
      </div>
    </footer>
  );
};

export default Footer;
