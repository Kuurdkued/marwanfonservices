
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Nexus from './pages/Nexus';
import Deploy from './pages/Deploy';
import Timers from './pages/Timers';
import Vault from './pages/Vault';
import Login from './pages/Login';
import NexusIndex from './pages/NexusIndex';
import { NexusProvider, useNexus } from './components/NexusProvider';

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { isShowroomMode } = useNexus();

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500 selection:text-white">
      <Sidebar onLogout={onLogout} />
      
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-700 pl-64`}>
        <div className={`p-10 lg:p-14 flex-1 max-w-7xl mx-auto w-full`}>
          <Routes>
            <Route path="/" element={<Nexus />} />
            <Route path="/deploy" element={<Deploy />} />
            <Route path="/active" element={<Timers />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/fiscal" element={<NexusIndex />} />
            <Route path="/core" element={<div className="p-10 glass rounded-3xl text-center font-black">SYSTEM CORE MODULES - RESTRICTED</div>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        {!isShowroomMode && <Footer />}
      </main>

      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-900/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('marwan_fon_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('marwan_fon_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('marwan_fon_auth');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <NexusProvider>
      <Router>
        <MainLayout onLogout={handleLogout} />
      </Router>
    </NexusProvider>
  );
};

export default App;
