
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  ArrowUpRight,
  Download,
  Loader2,
  Image as ImageIcon,
  FileText,
  Camera,
  Clock,
  Shield,
  Box,
  Monitor,
  CheckCircle,
  Banknote
} from 'lucide-react';
import { getAllOperations, deleteOperation } from '../services/storage';
import { Operation } from '../types';
import { useNexus } from '../components/NexusProvider';
import { CURRENCY } from '../constants';

const Vault: React.FC = () => {
  const { isPrivacyEnabled, isDarkMode } = useNexus();
  const [ops, setOps] = useState<Operation[]>([]);
  const [search, setSearch] = useState('');
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    setOps(getAllOperations().filter(o => o.status === 'DONE'));
  }, []);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IQ', {
      maximumFractionDigits: 0,
    }).format(val) + " " + CURRENCY;
  };

  const filteredOps = useMemo(() => {
    return ops.filter(o => 
      o.device.model.toLowerCase().includes(search.toLowerCase()) ||
      (o.imei && o.imei.includes(search)) ||
      o.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [ops, search]);

  const handleDelete = (id: string) => {
    if (confirm("Permanently erase this record from the Vault?")) {
      deleteOperation(id);
      setOps(prev => prev.filter(o => o.id !== id));
      setSelectedOp(null);
    }
  };

  const handleDownloadTextReport = (op: Operation) => {
    const reportContent = `
MARWAN FON SERVICES - TECHNICAL REPORT
=======================================
REPORT ID: ${op.id}
DEVICE: ${op.device.model} (${op.device.brand})
SERVICE: ${op.category}
IMEI/SERIAL: ${op.imei}
STATUS: SECURE / COMPLETED
DATE: ${formatDate(op.completedAt || op.createdAt)}
TIME: ${formatTime(op.completedAt || op.createdAt)}
FEE: ${formatCurrency(op.price)}

LABORATORY NOTES:
${op.notes || 'No notes provided.'}

SYSTEM SPECIFICATIONS:
Display: ${op.device.display}
Platform: ${op.device.platform}
Memory: ${op.device.memory}
Energy: ${op.device.battery}
=======================================
Principal: Marwan Haji Aziz
Contact: +964 750 321 3212
© 2026 Marwan Fon Services
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${op.device.model}_${op.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadImageReport = async (op: Operation) => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1600;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Inter, sans-serif';
    ctx.fillText('MARWAN FON', 80, 140);
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('SERVICES LABORATORY • SECURE INTERNAL ARCHIVE', 80, 175);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.font = 'black 180px Inter, sans-serif';
    ctx.fillText('SECURE', 80, 380);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('TECHNICAL ARCHIVE ID: ' + op.id, 80, 480);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 96px Inter, sans-serif';
    ctx.fillText(op.device.model, 80, 580);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(op.device.brand || 'Premium Device', 80, 640);

    const drawMetaBox = (label: string, value: string, x: number, y: number, w: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(x, y, w, 130);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeRect(x, y, w, 130);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(label.toUpperCase(), x + 25, y + 40);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText(value, x + 25, y + 90);
    };

    const row1Y = 750;
    const row2Y = 900;
    const boxWidth = 510;

    drawMetaBox('Service Category', op.category, 80, row1Y, boxWidth);
    drawMetaBox('IMEI / Serial', op.imei, 610, row1Y, boxWidth);
    drawMetaBox('Completion Date', formatDate(op.completedAt || op.createdAt), 80, row2Y, boxWidth);
    drawMetaBox('Completion Time', formatTime(op.completedAt || op.createdAt), 610, row2Y, boxWidth);

    ctx.fillStyle = 'rgba(34, 211, 238, 0.04)';
    ctx.fillRect(80, 1100, 1040, 320);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
    ctx.strokeRect(80, 1100, 1040, 320);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('HARDWARE SIGNATURE & SPECIFICATIONS', 110, 1150);

    const drawSpecLine = (label: string, val: string, x: number, y: number) => {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(label + ':', x, y);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText(val || 'Validated Signature', x, y + 25);
    };

    drawSpecLine('Display System', op.device.display || 'N/A', 110, 1200);
    drawSpecLine('Platform Architecture', op.device.platform || 'N/A', 580, 1200);
    drawSpecLine('Memory / Storage', op.device.memory || 'N/A', 110, 1310);
    drawSpecLine('Energy Capacity', op.device.battery || 'N/A', 580, 1310);

    if (op.device.image) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = op.device.image;

      await new Promise((resolve) => {
        img.onload = () => {
          const aspect = img.width / img.height;
          const targetW = 420;
          const targetH = targetW / aspect;
          
          const centerX = canvas.width - 320;
          const centerY = 350;
          
          const glow = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 300);
          glow.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
          glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(centerX - 300, centerY - 300, 600, 600);
          
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 80;
          ctx.drawImage(img, canvas.width - 520, 180, targetW, targetH);
          ctx.shadowBlur = 0;
          resolve(null);
        };
        img.onerror = () => {
          resolve(null);
        };
      });
    }

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('PRINCIPAL: MARWAN HAJI AZIZ', 80, canvas.height - 100);
    ctx.fillText('DIRECT LINE: +964 750 321 3212', 80, canvas.height - 80);
    ctx.textAlign = 'right';
    ctx.fillText('ELECTRONICALLY VERIFIED • MARWAN FON TECHNICAL LABS © 2026', canvas.width - 80, canvas.height - 80);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Technical_Archive_${op.device.model}_${op.id}.png`;
      link.click();
    } catch (err) {
      handleDownloadTextReport(op);
    }
    setIsGenerating(false);
  };

  // Fixed: Explicitly defined as React.FC to allow 'key' prop in JSX mapping
  const OperationCard: React.FC<{ op: Operation }> = ({ op }) => (
    <motion.div 
      whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
      onClick={() => {
        setImageLoaded(false);
        setSelectedOp(op);
      }}
      className="glass p-6 rounded-[2.5rem] border-white/5 group cursor-pointer relative overflow-hidden perspective-card"
    >
      <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-100 transition-all group-hover:text-cyan-500">
        <ArrowUpRight className="w-5 h-5" />
      </div>
      
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-full h-44 relative mb-4 flex items-center justify-center overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
          <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src={op.device.image} 
            alt="" 
            loading="lazy"
            className="w-full h-full object-contain p-5 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:scale-110" 
          />
        </div>
        <div className="flex items-center gap-1.5 justify-center mb-1">
          <Shield className="w-3 h-3 text-cyan-500" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-black">Certified Secure</p>
        </div>
        <h3 className={`text-xl font-black truncate w-full px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{op.device.model}</h3>
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">{op.category}</p>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
        <div className="flex flex-col">
           <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Archive Date</span>
           <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{formatDate(op.completedAt || op.createdAt)}</span>
        </div>
        <div className={`text-right ${isPrivacyEnabled ? 'blur-md' : ''}`}>
           <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Revenue</span>
           <span className="block text-[11px] font-black text-emerald-500 tracking-tight">{formatCurrency(op.price)}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12">
      <canvas ref={canvasRef} className="hidden" />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-white dark:text-white light:text-slate-900">THE VAULT</h2>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-1">Archived technical documentation of secured operations</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Technical Archives..."
              className={`w-full bg-slate-950/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-tech-cyan/50 font-bold`}
            />
          </div>
          <button className="p-4 glass rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredOps.map(op => <OperationCard key={op.id} op={op} />)}
      </div>

      {filteredOps.length === 0 && (
         <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700 gap-6">
            <ShieldCheck className="w-16 h-16 opacity-5" />
            <p className="font-black uppercase tracking-[0.4em] text-[10px]">Technical Archives Vacant</p>
         </div>
      )}

      {/* Operation Detail Overlay */}
      <AnimatePresence>
        {selectedOp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-3xl"
            onClick={() => setSelectedOp(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className={`glass max-w-6xl w-full p-8 md:p-14 rounded-[4rem] border-white/10 relative overflow-hidden shadow-[0_0_120px_rgba(34,211,238,0.15)] max-h-[95vh] overflow-y-auto custom-scrollbar`}
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tech-cyan/5 blur-[150px] rounded-full pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                 {/* Left Column: Device Showcase */}
                 <div className="flex flex-col items-center justify-center relative w-full">
                    <div className="relative w-full aspect-[4/5] max-h-[480px] flex items-center justify-center p-10 bg-gradient-to-br from-white/[0.04] to-transparent rounded-[4rem] border border-white/5 shadow-inner group">
                      {!imageLoaded && (
                        <div className="absolute flex flex-col items-center justify-center">
                          <Loader2 className="w-12 h-12 animate-spin text-tech-cyan/50 mb-4" />
                          <ImageIcon className="w-16 h-16 opacity-5 text-white" />
                        </div>
                      )}
                      <img 
                        src={selectedOp.device.image} 
                        alt="" 
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.95)] transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-3xl'}`} 
                      />
                    </div>
                    
                    <div className="text-center w-full mt-12">
                       <p className="text-[11px] uppercase tracking-[0.6em] text-tech-cyan font-black mb-3">TECHNICAL ARCHIVE: {selectedOp.id}</p>
                       <h3 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">{selectedOp.device.model}</h3>
                       <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs mt-3">{selectedOp.device.brand || 'Nexus Signature'}</p>
                    </div>

                    <div className="w-full mt-10 space-y-4">
                       <h4 className="text-[11px] uppercase tracking-widest text-slate-400 font-black flex items-center gap-4">
                         <div className="w-2 h-4 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                         Laboratory Notes
                       </h4>
                       <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-white/5 text-sm md:text-base text-slate-300 italic leading-relaxed shadow-inner">
                          "{selectedOp.notes || 'No technical anomalies documented for this operation.'}"
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Record Data & Actions */}
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <h4 className="text-[11px] uppercase tracking-widest text-slate-400 font-black flex items-center gap-4">
                         <div className="w-2 h-4 bg-tech-cyan rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                         Mission Metadata
                       </h4>
                       <div className="grid grid-cols-2 gap-5">
                          {[
                            { label: 'IMEI Signature', val: selectedOp.imei, icon: <Monitor className="w-4 h-4"/> },
                            { label: 'Technical Category', val: selectedOp.category, icon: <Shield className="w-4 h-4"/> },
                            { label: 'Fiscal Trajectory', val: formatCurrency(selectedOp.price), icon: <Banknote className="w-4 h-4"/>, privacy: true, color: 'text-emerald-500' },
                            { label: 'Completion Date', val: formatDate(selectedOp.completedAt || selectedOp.createdAt), icon: <Clock className="w-4 h-4"/> },
                            { label: 'Completion Time', val: formatTime(selectedOp.completedAt || selectedOp.createdAt), icon: <Clock className="w-4 h-4"/> },
                            { label: 'Security Status', val: 'Validated', icon: <CheckCircle className="w-4 h-4"/> },
                          ].map((box, i) => (
                            <div key={i} className="p-5 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-lg group/item hover:bg-white/[0.08] transition-all duration-500">
                               <p className="text-[10px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                 <span className="opacity-30">{box.icon}</span> {box.label}
                               </p>
                               <p className={`text-sm md:text-base font-black text-white truncate ${box.privacy && isPrivacyEnabled ? 'blur-2xl' : ''} ${box.color || ''}`}>
                                 {box.val}
                               </p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-6">
                       <div className="flex flex-col sm:flex-row gap-5">
                          <button 
                            disabled={isGenerating}
                            onClick={() => handleDownloadImageReport(selectedOp)}
                            className="flex-1 bg-white hover:bg-slate-200 text-slate-950 font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-xs tracking-[0.2em] shadow-2xl"
                          >
                             {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                             CERTIFICATE
                          </button>
                          <button 
                            onClick={() => handleDownloadTextReport(selectedOp)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/10 text-xs tracking-[0.2em] shadow-2xl"
                          >
                             <FileText className="w-5 h-5" />
                             REPORT
                          </button>
                       </div>
                       
                       <button 
                        onClick={() => handleDelete(selectedOp.id)}
                        className="w-full py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.5rem] transition-all flex items-center justify-center gap-3 font-black text-[10px] tracking-[0.3em] uppercase"
                       >
                          <Trash2 className="w-4 h-4" />
                          Purge Technical Record
                       </button>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedOp(null)}
                className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all z-10 hover:rotate-90 duration-500"
              >
                <ChevronRight className="w-7 h-7 text-slate-300" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vault;
