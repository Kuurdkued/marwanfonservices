
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, CheckCircle2, AlertTriangle, User, Hash } from 'lucide-react';
import { getAllOperations, updateOperation } from '../services/storage';
import { Operation } from '../types';

const LiveTimer: React.FC<{ startTime: number }> = ({ startTime }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const it = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(it);
  }, []);

  const diff = now - startTime;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div className="flex items-baseline gap-1 font-black text-3xl mono tracking-tighter text-white">
      <span>{h.toString().padStart(2, '0')}</span>
      <span className="text-cyan-500 animate-pulse">:</span>
      <span>{m.toString().padStart(2, '0')}</span>
      <span className="text-cyan-500 animate-pulse">:</span>
      <span>{s.toString().padStart(2, '0')}</span>
    </div>
  );
};

const Timers: React.FC = () => {
  const [ops, setOps] = useState<Operation[]>([]);

  useEffect(() => {
    setOps(getAllOperations().filter(o => o.status === 'IN-PROGRESS'));
  }, []);

  const handleMarkDone = (id: string) => {
    updateOperation(id, { status: 'DONE', completedAt: Date.now() });
    setOps(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">ACTIVE NEXUS</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time technical operation timers</p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
           <AlertTriangle className="w-4 h-4 text-amber-500" />
           <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Priority Surveillance</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {ops.length > 0 ? ops.map((op) => (
            <motion.div 
              key={op.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center p-2 border border-white/5">
                    <img src={op.device.image} alt="" className="w-full h-full object-contain drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{op.device.model}</h3>
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">{op.category}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold">
                          <User className="w-3 h-3" />
                          {op.customerName || 'Private Client'}
                       </div>
                       <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold">
                          <Hash className="w-3 h-3" />
                          {op.imei}
                       </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Elapsed Duration</p>
                  <LiveTimer startTime={op.createdAt} />
                </div>
              </div>

              <div className="mt-10 flex gap-4 relative z-10">
                <button 
                  onClick={() => handleMarkDone(op.id)}
                  className="flex-1 bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 hover:border-emerald-500/30 text-emerald-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  FINALIZE OPERATION
                </button>
                <button className="px-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="lg:col-span-2 h-[400px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-600 gap-4">
               <Clock className="w-12 h-12 opacity-20" />
               <p className="font-bold uppercase tracking-widest text-xs">No Active Operations Found</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timers;
