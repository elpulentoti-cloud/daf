
import React, { useState } from 'react';
import { UserRole } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  logout: () => void;
  currentBalance: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, logout, currentBalance }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Monitor Central', icon: 'fa-chart-pie' },
    { id: 'projections', label: 'Caja Proyectada', icon: 'fa-money-bill-trend-up' },
    { id: 'org', label: 'Organigrama GAF', icon: 'fa-sitemap' },
    { id: 'expenses', label: 'Control de Egresos', icon: 'fa-users-gear' },
    { id: 'settings', label: 'Ajustes', icon: 'fa-gears' },
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-[#0f172a] text-white transition-transform duration-300 transform 
        lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/20">
            <i className="fa-solid fa-bolt-lightning text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">EDALTEC <span className="text-emerald-500 italic">GAF</span></span>
        </div>
        
        <nav className="mt-8 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`
                flex items-center w-full px-5 py-4 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <i className={`fa-solid ${item.icon} w-6 text-lg`}></i>
              <span className="ml-4 font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">CG</div>
              <div className="ml-3">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Claudio G.</p>
                <p className="text-[9px] text-slate-500 font-medium">Gerente GAF</p>
              </div>
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-white"><i className="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500"><i className="fa-solid fa-bars text-xl"></i></button>
          
          <div className="hidden md:block">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sistema de Control de Liquidez</h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Caja Total</p>
              <p className="text-xl font-extrabold text-[#0f172a]">{formatCurrency(currentBalance)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 relative">
               <i className="fa-solid fa-bell"></i>
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
