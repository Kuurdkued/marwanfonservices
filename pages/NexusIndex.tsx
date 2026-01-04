
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
  Plus,
  LayoutGrid,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { fetchDeviceSpecs } from '../services/gemini';
import { saveToIndex, getAllIndexedDevices, removeFromIndex } from '../services/storage';
import { IndexedDevice } from '../types';
import { useNexus } from '../components/NexusProvider';

const NexusIndex: React.FC = () => {
  const { isDarkMode } = useNexus();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedDevices, setSavedDevices] = useState<IndexedDevice[]>([]);
  const [previewDevice, setPreviewDevice] = useState<IndexedDevice | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');

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
    if (confirm("Remove this hardware signature from the internal archive?")) {
      removeFromIndex(id);
      setSavedDevices(getAllIndexedDevices());
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-white">FLEET <span className="text-blue-500">MEDIA</span></h2>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-1">Internal Archive of High-Fidelity Hardware Signatures</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1">
             <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
             >
                <LayoutGrid className="w-5 h-5" />
             </button>
             <button 
              onClick={() => setViewMode('gallery')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'gallery' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
             >
                <ImageIcon className="w-5 h-5" />
             </button>
          </div>
          <div className="px-5 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
             <Library className="w-4 h-4 text-blue-400" />
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{savedDevices.length} Archives</span>
          </div>
        </div>
      </header>

      {/* Import Terminal */}
      <section className="glass p-10 rounded-[3rem] border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-8">
           <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
              <Download className="w-5 h-5" />
           </div>
           <h3 className="text-lg font-black text-white uppercase tracking-tight">Technical Data Acquisition</h3>
        </div>

        <form onSubmit={handleFetch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER MODEL NAME FOR DEEP ANALYSIS..."
              className="w-full bg-slate-950/60 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-white font-bold placeholder-slate-800 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-10 rounded-2xl transition-all disabled:opacity-50 flex items-center gap-4 font-black text-white shadow-xl shadow-blue-500/20"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            <span className="text-xs tracking-[0.2em]">INITIALIZE</span>
          </button>
        </form>

        <AnimatePresence>
          {previewDevice && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="flex flex-col items-center">
                 <div className="w-full aspect-[3/4] mb-8 relative flex items-center justify-center p-10 bg-white/[0.03] rounded-[3rem] overflow-hidden border border-white/5 group">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <img src={previewDevice.image} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" alt="" />
                 </div>
                 <h3 className="text-3xl font-black text-white italic tracking-tighter text-center">{previewDevice.model}</h3>
                 <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">{previewDevice.brand}</p>
              </div>
              
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Display System', val: previewDevice.display, icon: <Smartphone className="w-4 h-4"/> },
                    { label: 'Platform Architecture', val: previewDevice.platform, icon: <Cpu className="w-4 h-4"/> },
                    { label: 'Memory / Storage', val: previewDevice.memory, icon: <Layers className="w-4 h-4"/> },
                    { label: 'Energy Capacity', val: previewDevice.battery, icon: <Battery className="w-4 h-4"/> },
                  ].map((spec, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 shadow-inner group hover:bg-white/[0.04] transition-all">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                         <span className="text-blue-500/50">{spec.icon}</span> {spec.label}
                      </p>
                      <p className="text-sm font-black text-slate-200 leading-tight">{spec.val || 'Standard Signature'}</p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 text-xs tracking-[0.2em] uppercase"
                >
                  <CheckCircle className="w-6 h-6" />
                  Archive Hardware Signature
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Internal Archive Grid */}
      <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 md:grid-cols-2'}`}>
        <AnimatePresence>
          {savedDevices.map((device) => (
            <motion.div 
              key={device.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass group relative overflow-hidden flex flex-col items-center transition-all ${viewMode === 'grid' ? 'p-6 rounded-[3rem]' : 'p-10 rounded-[4rem] flex-row gap-10'}`}
            >
              <button 
                onClick={() => handleDelete(device.id)}
                className="absolute top-6 right-6 p-3 rounded-2xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white z-20"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className={`relative flex items-center justify-center bg-white/[0.02] rounded-[2.5rem] overflow-hidden shadow-inner border border-white/5 ${viewMode === 'grid' ? 'w-full aspect-[4/5] mb-6' : 'w-1/3 aspect-[3/4]'}`}>
                 <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img src={device.image} alt="" className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-1000 group-hover:scale-110 p-6" />
              </div>

              <div className={`flex flex-col ${viewMode === 'grid' ? 'text-center w-full' : 'flex-1 text-left'}`}>
                <h4 className="font-black text-white text-lg italic tracking-tight line-clamp-1 leading-tight">{device.model}</h4>
                <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">{device.brand}</p>
                
                {viewMode === 'gallery' && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Platform</p>
                        <p className="text-xs font-bold text-slate-300 truncate">{device.platform}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Display</p>
                        <p className="text-xs font-bold text-slate-300 truncate">{device.display}</p>
                     </div>
                  </div>
                )}

                <div className={`mt-6 pt-6 border-t border-white/5 w-full grid grid-cols-2 gap-3 text-[9px] uppercase tracking-widest font-black text-slate-500 ${viewMode === 'grid' ? 'block' : 'hidden md:grid'}`}>
                   <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-2xl truncate">
                      <Cpu className="w-3.5 h-3.5 text-blue-500/50" /> 
                      {device.memory?.split(',')[0] || 'N/A'}
                   </div>
                   <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-2xl truncate">
                      <Battery className="w-3.5 h-3.5 text-blue-500/50" /> 
                      {device.battery?.split(' ')[0] || 'N/A'}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {savedDevices.length === 0 && !previewDevice && (
        <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700 gap-6 opacity-30">
           <Smartphone className="w-16 h-16" />
           <p className="font-black uppercase tracking-[0.4em] text-[10px] text-center max-w-xs">Laboratory Media Archive Vacant. Start Indexing Hardware Signatures.</p>
        </div>
      )}
    </div>
  );
};

export default NexusIndex;
