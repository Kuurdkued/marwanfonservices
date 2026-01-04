
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Cpu, 
  Smartphone, 
  Database, 
  Battery, 
  Layers, 
  Plus,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Image as ImageIcon,
  Library,
  User,
  Key,
  Hash,
  Activity,
  ChevronDown
} from 'lucide-react';
import { fetchDeviceSpecs } from '../services/gemini';
import { DeviceSpecs, ServiceCategory, Operation, IndexedDevice } from '../types';
import { saveOperation, getAllIndexedDevices } from '../services/storage';
import { useNexus } from '../components/NexusProvider';
import { CURRENCY } from '../constants';

// FIXED: Defined sub-components OUTSIDE the main component to prevent focus loss during typing
const GroupHeader = ({ icon: Icon, title, isDarkMode }: { icon: any, title: string, isDarkMode: boolean }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-600/10 text-blue-600'}`}>
      <Icon className="w-4 h-4" />
    </div>
    <h3 className={`text-[11px] font-black uppercase tracking-[0.25em] ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{title}</h3>
  </div>
);

const CustomInput = ({ icon: Icon, label, placeholder, value, onChange, type = "text", required = false, mono = false, prefix = null, isDarkMode }: any) => (
  <div className={`glass p-6 rounded-[2rem] border-white/5 bg-white/[0.02] flex flex-col gap-3 group transition-all hover:bg-white/[0.04]`}>
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500/40 group-focus-within:text-blue-500 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      {prefix && <span className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500/60 uppercase">{prefix}</span>}
      <input 
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 ${prefix ? 'pl-20' : 'pl-14'} pr-5 text-white placeholder-slate-700 font-bold focus:border-blue-500/40 transition-all ${mono ? 'mono tracking-wider' : ''}`}
      />
    </div>
  </div>
);

const Deploy: React.FC = () => {
  const { isDarkMode } = useNexus();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<DeviceSpecs | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [indexedDevices, setIndexedDevices] = useState<IndexedDevice[]>([]);
  const [showIndexPicker, setShowIndexPicker] = useState(false);
  
  const [form, setForm] = useState({
    customerName: '',
    brand: '',
    imei: '',
    category: 'FRP Removal' as ServiceCategory,
    notes: '',
    password: '',
    price: ''
  });

  useEffect(() => {
    setIndexedDevices(getAllIndexedDevices());
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setImageLoaded(false);
    const data = await fetchDeviceSpecs(searchQuery);
    setSpecs(data);
    setForm(prev => ({ ...prev, brand: data.brand || '' }));
    setLoading(false);
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specs) return;

    const newOp: Operation = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: form.customerName,
      device: { ...specs, brand: form.brand || specs.brand },
      imei: form.imei,
      category: form.category,
      notes: form.notes,
      password: form.password,
      price: parseFloat(form.price) || 0,
      status: 'IN-PROGRESS',
      createdAt: Date.now()
    };

    saveOperation(newOp);
    alert("Operational Mission Initialized");
    setSpecs(null);
    setForm({ customerName: '', brand: '', imei: '', category: 'FRP Removal', notes: '', password: '', price: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className={`text-5xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>NEW <span className="text-blue-500">OPERATION</span></h2>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Initialize master technical documentation</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowIndexPicker(!showIndexPicker)}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all group font-black text-[10px] uppercase tracking-widest border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white border-black/5 text-slate-900 shadow-xl'}`}
          >
             <Library className="w-4 h-4" />
             Fleet Index
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="glass p-10 rounded-[3rem] border-white/5 shadow-2xl">
             <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ENTER MODEL (E.G. IPHONE 16 PRO...)"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-5 pl-14 text-white font-black tracking-tight focus:border-blue-500 transition-all placeholder-slate-700"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 px-10 rounded-2xl transition-all disabled:opacity-50 text-white font-black active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
                </button>
             </form>
          </div>

          <AnimatePresence>
            {specs && (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleDeploy} 
                className="space-y-12"
              >
                <div>
                   <GroupHeader icon={User} title="Client Information" isDarkMode={isDarkMode} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomInput 
                        icon={User} 
                        label="Customer Name" 
                        placeholder="OPTIONAL" 
                        value={form.customerName}
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => setForm({ ...form, customerName: e.target.value })}
                      />
                      <CustomInput 
                        icon={Key} 
                        label="Client Password" 
                        placeholder="INTERNAL REFERENCE" 
                        value={form.password}
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => setForm({ ...form, password: e.target.value })}
                      />
                   </div>
                </div>

                <div>
                   <GroupHeader icon={Smartphone} title="Device Identification" isDarkMode={isDarkMode} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomInput 
                        icon={Smartphone} 
                        label="Brand Name" 
                        placeholder="E.G. APPLE" 
                        value={form.brand}
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => setForm({ ...form, brand: e.target.value })}
                      />
                      <CustomInput 
                        icon={Hash} 
                        label="IMEI / Serial Number" 
                        placeholder="15-DIGIT IMEI" 
                        required
                        mono
                        value={form.imei}
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => setForm({ ...form, imei: e.target.value })}
                      />
                   </div>
                </div>

                <div>
                   <GroupHeader icon={Layers} title="Service Configuration" isDarkMode={isDarkMode} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-[2rem] border-white/5 bg-white/[0.02] flex flex-col gap-3 group transition-all hover:bg-white/[0.04]">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Service Protocol</label>
                        <div className="relative">
                           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500/40">
                             <Activity className="w-5 h-5" />
                           </div>
                           <select 
                             value={form.category}
                             onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
                             className="w-full bg-slate-950/40 border border-white/10 rounded-2xl py-4 pl-14 pr-10 text-white font-black appearance-none focus:border-blue-500 transition-all"
                           >
                             <option className="bg-slate-900">FRP Removal</option>
                             <option className="bg-slate-900">Passcode Removal</option>
                             <option className="bg-slate-900">iCloud Remove</option>
                             <option className="bg-slate-900">iCloud Bypass</option>
                             <option className="bg-slate-900">Locked iPhone Bypass</option>
                             <option className="bg-slate-900">Custom</option>
                           </select>
                           <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>

                      <CustomInput 
                        icon={Layers} 
                        label="Service Fee" 
                        placeholder="0.00" 
                        prefix="IQD"
                        type="number"
                        required
                        isDarkMode={isDarkMode}
                        value={form.price}
                        onChange={(e: any) => setForm({ ...form, price: e.target.value })}
                      />

                      <div className="md:col-span-2 glass p-6 rounded-[2.5rem] border-white/5 bg-white/[0.02] flex flex-col gap-3 group transition-all">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Laboratory Annotations</label>
                        <textarea 
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          placeholder="ADD TECHNICAL NOTES OR STATUS LOGS..."
                          className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-6 py-5 text-white h-32 resize-none font-bold italic focus:border-blue-500 transition-all placeholder-slate-800"
                        />
                      </div>
                   </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 group transition-all active:scale-[0.98] tracking-[0.1em]"
                >
                  <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  DEPLOY MISSION TO NEXUS COMMAND
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="relative sticky top-10">
          <AnimatePresence mode="wait">
            {specs ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-10 rounded-[4rem] border-white/10 flex flex-col items-center shadow-2xl"
              >
                <div className="w-full aspect-[3/4] mb-10 relative group flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full opacity-50"></div>
                  <motion.img 
                    key={specs.image}
                    src={specs.image} 
                    alt={specs.model}
                    onLoad={() => setImageLoaded(true)}
                    className={`max-h-full w-auto object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-xl'}`}
                  />
                </div>

                <div className="text-center mb-10">
                  <h4 className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black mb-2">Subject Identity</h4>
                  <h3 className={`text-4xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{specs.model}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">{specs.brand || 'Premium Unit'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    { label: 'Display', val: specs.display, icon: Smartphone },
                    { label: 'Platform', val: specs.platform, icon: Cpu },
                    { label: 'Memory', val: specs.memory, icon: Database },
                    { label: 'Battery', val: specs.battery, icon: Battery },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <s.icon className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{s.label}</span>
                      </div>
                      <p className="text-[10px] font-bold text-white truncate">{s.val || 'Standard'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-[600px] border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700 p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                   <Search className="w-10 h-10 opacity-10" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Awaiting Target</h4>
                <p className="text-[10px] font-bold opacity-30">ENTER A DEVICE MODEL TO ANALYZE TECHNICAL PARAMETERS</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Deploy;
