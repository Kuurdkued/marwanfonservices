
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  PlusCircle, 
  Clock, 
  History, 
  TrendingUp, 
  Settings,
  Cpu
} from 'lucide-react';
import { useNexus } from './NexusProvider';
import { OWNER_INFO } from '../constants';

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { isDarkMode } = useNexus();

  const navItems = [
    { to: "/", icon: LayoutGrid, label: "NEXUS" },
    { to: "/deploy", icon: PlusCircle, label: "DEPLOY" },
    { to: "/active", icon: Clock, label: "ACTIVE" },
    { to: "/vault", icon: History, label: "VAULT" },
    { to: "/fiscal", icon: TrendingUp, label: "FISCAL" },
    { to: "/core", icon: Settings, label: "CORE" },
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 glass border-r z-40 flex flex-col transition-all duration-500 ${isDarkMode ? 'border-white/5 bg-[#020617]/80' : 'border-black/5 bg-slate-50/80'}`}>
      <div className="p-8 flex flex-col items-center">
        <div className="relative group mb-4">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl opacity-50"></div>
          <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-2xl relative z-10 border border-white/10 overflow-hidden flex items-center justify-center">
            <img 
              src="https://raw.githubusercontent.com/Marwan Aziz/marwan-fon/main/logo.png" 
              alt="Marwan Fon Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
              }}
            />
            <div className="fallback hidden flex items-center justify-center">
              <Cpu className="text-blue-600 w-12 h-12" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-black text-xl italic tracking-tighter text-white">MARWAN <span className="text-blue-500">FON</span></h1>
          <p className="text-[9px] text-blue-400 font-black tracking-[0.2em] uppercase mt-0.5">Master Technical</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-full transition-all duration-300 group
              ${isActive 
                ? "bg-blue-600/10 text-white border-l-2 border-blue-500" 
                : "text-slate-500 hover:text-white hover:bg-white/5"}
            `}
          >
            {/* Fix: NavLink children must be a function to access isActive state within the children scope */}
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                <span className="font-black text-[11px] tracking-widest">{item.label}</span>
                {item.label === "NEXUS" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8">
        <div className="glass p-4 rounded-2xl border-white/5 bg-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">M</div>
          <div>
             <p className="text-[10px] text-slate-500 uppercase font-black">Principal</p>
             <p className="text-[11px] font-black text-white">{OWNER_INFO.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
