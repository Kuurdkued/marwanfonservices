
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Plus, 
  Sun, 
  Eye, 
  Camera,
  Activity,
  ChevronRight,
  TrendingUp,
  User,
  Moon,
  CloudCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNexus } from '../components/NexusProvider';
import { getAllOperations, getAllIndexedDevices } from '../services/storage';
import { CURRENCY, OWNER_INFO } from '../constants';
import { useNavigate } from 'react-router-dom';

const Nexus: React.FC = () => {
  const { isPrivacyEnabled, togglePrivacy, toggleDarkMode, isDarkMode, toggleShowroom } = useNexus();
  const navigate = useNavigate();
  const ops = useMemo(() => getAllOperations(), []);
  const fleetCount = useMemo(() => getAllIndexedDevices().length, []);

  const metrics = useMemo(() => {
    const totalRev = ops.reduce((acc, op) => acc + (op.status === 'DONE' ? op.price : 0), 0);
    const active = ops.filter(o => o.status === 'IN-PROGRESS').length;
    const completed = ops.filter(o => o.status === 'DONE').length;
    return { totalRev, active, completed };
  }, [ops]);

  const chartData = [
    { name: 'Jan', value: metrics.totalRev * 0.4 },
    { name: 'Feb', value: metrics.totalRev * 0.6 },
    { name: 'Mar', value: metrics.totalRev * 0.5 },
    { name: 'Apr', value: metrics.totalRev * 0.8 },
    { name: 'May', value: metrics.totalRev },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IQ').format(val) + " " + CURRENCY;
  };

  const MetricCard = ({ title, value, icon: Icon, color, percent, isCurrency }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-[2rem] border-white/5 bg-white/[0.02] relative group overflow-hidden"
    >
      <div className="flex justify-between items-start mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
          <Icon className="w-7 h-7" />
        </div>
        {percent && (
          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/20">
            {percent}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className={`text-4xl font-black tracking-tight ${isPrivacyEnabled && isCurrency ? 'blur-xl' : ''}`}>
            {isCurrency ? formatCurrency(value) : value}
            <span className={`text-6xl absolute -bottom-4 right-0 opacity-10 ${color.replace('bg-', 'text-')}`}>.</span>
          </h3>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between gap-6">
        <div className="flex-1 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search secure database..." 
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:border-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Connected</span>
          </div>

          <button 
            onClick={toggleDarkMode} 
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-blue-600/10 border-blue-600/20 text-blue-400' : 'bg-white border-black/5 text-slate-600 shadow-sm'}`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={togglePrivacy} 
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${isPrivacyEnabled ? 'bg-amber-500/20 border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
            title="Privacy Mask"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button 
            onClick={toggleShowroom}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10`}
            title="Showroom Mode"
          >
            <Camera className="w-4 h-4" />
          </button>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
          
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Verified Admin</p>
                <p className="text-xs font-black text-white">{OWNER_INFO.name}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <User className="w-5 h-5" />
             </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-blue-500"></div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Command Central</span>
          </div>
          <h2 className="text-6xl font-black italic tracking-tighter text-white">ADMIN <span className="text-blue-500">NEXUS</span></h2>
          <p className="text-slate-500 text-sm mt-2">Orchestrating <span className="text-blue-400 font-bold">{ops.length}</span> secure technical operations in real-time.</p>
        </div>
        <button 
          onClick={() => navigate('/deploy')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-5 rounded-full shadow-[0_20px_40px_rgba(37,99,235,0.2)] flex items-center gap-3 group transition-all active:scale-95"
        >
          <div className="bg-white/20 p-1.5 rounded-full">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs tracking-[0.15em] uppercase">Initialize Mission</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Net Revenue" value={metrics.totalRev} icon={Wallet} color="bg-blue-600" percent="+12%" isCurrency />
        <MetricCard title="Completed" value={metrics.completed} icon={CheckCircle2} color="bg-emerald-500" percent="+5%" />
        <MetricCard title="Active Timers" value={metrics.active} icon={Clock} color="bg-orange-500" />
        <MetricCard title="Fleet Index" value={fleetCount} icon={Smartphone} color="bg-indigo-600" />
      </div>

      {/* Main Data View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black tracking-tight text-white uppercase">Income Trajectory</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Live Fiscal Analytics</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 {['D','W','M','Y'].map(t => (
                   <button key={t} className={`w-8 h-8 rounded-lg text-[10px] font-black border transition-all ${t === 'M' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>{t}</button>
                 ))}
              </div>
           </div>
           <div className={`h-64 w-full ${isPrivacyEnabled ? 'blur-3xl' : ''}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <Activity className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-lg font-black tracking-tight text-white uppercase">Security Stream</h3>
              </div>
           </div>
           <div className="space-y-6">
              {ops.length > 0 ? ops.slice(0, 5).map(op => (
                <div key={op.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${op.status === 'DONE' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-white truncate">{op.device.model}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{op.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" />
                </div>
              )) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-700 gap-4 opacity-30">
                  <Smartphone className="w-12 h-12" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No Active Logs</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Nexus;
