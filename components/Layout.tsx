
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  logout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, logout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Resumen Ejecutivo', icon: 'fa-chart-line' },
    { id: 'projections', label: 'Flujo de Caja', icon: 'fa-calendar-check' },
    { id: 'collections', label: 'Cobranzas', icon: 'fa-file-invoice-dollar' },
    { id: 'expenses', label: 'Egresos', icon: 'fa-wallet' },
    { id: 'settings', label: 'Configuración', icon: 'fa-sliders' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Corporate Slate */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-slate-900 text-slate-100 transition-transform duration-300 transform 
        lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-slate-800 shadow-xl
      `}>
        <div className="flex flex-col items-center justify-center h-24 border-b border-slate-800 px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-building-columns text-white"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">SISTEMA <span className="text-blue-400">DAF</span></span>
          </div>
        </div>
        
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`
                flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i>
              <span className="ml-3 font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs font-bold text-white uppercase">{role}</p>
                <p className="text-[10px] text-slate-400">Usuario Activo</p>
              </div>
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-20 px-8 bg-white border-b border-slate-200 z-50">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Consolidado</p>
              <p className="text-lg font-extrabold text-slate-900">$25.450.000 <span className="text-slate-400 text-xs font-normal">CLP</span></p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-bell text-xl"></i>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>

        <footer className="h-14 bg-white border-t border-slate-200 px-8 flex items-center justify-between text-slate-400 text-[11px] font-medium uppercase tracking-wider">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-chart-pie text-blue-500"></i>
              <span>Analítica</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-shield-check text-green-500"></i>
              <span>Seguridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-cloud-arrow-up text-indigo-500"></i>
              <span>Cumplimiento</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span>© 2026 SISTEMA DAF</span>
            <span className="text-slate-200">|</span>
            <span>Versión 2.0.4</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
