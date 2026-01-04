
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Library, 
  Download, 
  Trash2, 
  Smartphone, 
  Cpu, 
  Battery, 
  Layers,
  CheckCircle,
  Loader2,
  ArrowRight,
  Plus
} from 'lucide-react';
import { fetchDeviceSpecs } from '../services/gemini';
import { saveToIndex, getAllIndexedDevices, removeFromIndex } from '../services/storage';
import { IndexedDevice } from '../types';

const NexusIndex: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedDevices, setSavedDevices] = useState<IndexedDevice[]>([]);
  const [previewDevice, setPreviewDevice] = useState<IndexedDevice | null>(null);

  useEffect(() => {
    setSavedDevices(getAllIndexedDevices());
  }, []);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const specs = await fetchDeviceSpecs(query);
    const newDevice: IndexedDevice = {
      ...specs,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: Date.now()
    };
    setPreviewDevice(newDevice);
    setLoading(false);
  };

  const handleSave = () => {
    if (previewDevice) {
      saveToIndex(previewDevice);
      setSavedDevices(getAllIndexedDevices());
      setPreviewDevice(null);
      setQuery('');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this hardware signature from the index?")) {
      removeFromIndex(id);
      setSavedDevices(getAllIndexedDevices());
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">NEXUS INDEX</h2>
          <p className="text-slate-500 font-medium mt-1">Master knowledge base of technical device signatures</p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2">
           <Library className="w-4 h-4 text-indigo-400" />
           <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{savedDevices.length} Models Indexed</span>
        </div>
      </header>

      {/* Global Search / Import Section */}
      <div className="glass p-8 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          Import Model Specifications
        </h3>
        <form onSubmit={handleFetch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter model name to download information (e.g. iPhone 15, S23 Ultra...)"
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:border-cyan-500/50 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 px-8 rounded-2xl transition-all disabled:opacity-50 flex items-center gap-3 font-bold text-white shadow-lg shadow-cyan-900/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            FETCH AI DATA
          </button>
        </form>

        <AnimatePresence>
          {previewDevice && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-10 pt-10 border-t border-white/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center">
                   <div className="w-full max-w-[200px] aspect-[1/2] mb-6 relative flex items-center justify-center p-6 bg-white/[0.02] rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-cyan-400/10 blur-3xl opacity-50"></div>
                      <img src={previewDevice.image} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" alt="" />
                   </div>
                   <h3 className="text-2xl font-black text-center">{previewDevice.model}</h3>
                   <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{previewDevice.brand}</p>
                </div>
                
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Display System', val: previewDevice.display, icon: '📱' },
                      { label: 'Platform Architecture', val: previewDevice.platform, icon: '🧠' },
                      { label: 'Memory / Storage', val: previewDevice.memory, icon: '💾' },
                      { label: 'Energy Capacity', val: previewDevice.battery, icon: '🔋' },
                    ].map((spec, i) => (
                      <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                           <span className="text-xs">{spec.icon}</span> {spec.label}
                        </p>
                        <p className="text-sm font-bold text-slate-200 leading-tight">{spec.val || 'Standard Signature'}</p>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleSave}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-95"
                  >
                    <Plus className="w-6 h-6" />
                    REGISTER IN HARDWARE INDEX
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Gallery / Index Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence>
          {savedDevices.map((device) => (
            <motion.div 
              key={device.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="glass p-5 rounded-[2.5rem] border-white/5 group relative overflow-hidden flex flex-col items-center"
            >
              <button 
                onClick={() => handleDelete(device.id)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white z-20"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="w-full aspect-[4/5] mb-4 relative flex items-center justify-center p-4 bg-white/[0.02] rounded-[2rem] overflow-hidden shadow-inner">
                 <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img src={device.image} alt="" className="w-full h-full object-contain relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:scale-110" />
              </div>

              <div className="text-center w-full px-2">
                <h4 className="font-black text-white text-sm line-clamp-1 leading-tight">{device.model}</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">{device.brand}</p>
              </div>

              <div className="mt-5 pt-5 border-t border-white/5 w-full grid grid-cols-2 gap-2 text-[8px] uppercase tracking-widest font-black text-slate-600">
                 <div className="flex items-center gap-1.5 p-2 bg-white/5 rounded-xl truncate">
                    <Cpu className="w-3 h-3 text-cyan-500/50" /> 
                    {device.memory?.split(',')[0] || 'N/A'}
                 </div>
                 <div className="flex items-center gap-1.5 p-2 bg-white/5 rounded-xl truncate">
                    <Battery className="w-3 h-3 text-emerald-500/50" /> 
                    {device.battery?.split(' ')[0] || 'N/A'}
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {savedDevices.length === 0 && !previewDevice && (
        <div className="h-[300px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-700 gap-4">
           <Smartphone className="w-12 h-12 opacity-10" />
           <p className="font-bold uppercase tracking-widest text-[10px] letter-spacing-[0.2em]">Knowledge Base Empty. Start Indexing Hardware signatures.</p>
        </div>
      )}
    </div>
  );
};

export default NexusIndex;
