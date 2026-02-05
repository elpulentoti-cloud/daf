
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CashFlowView from './components/CashFlowView';
import EconomicIndicatorCards from './components/EconomicIndicatorCards';
import AlertOverlay from './components/AlertOverlay';
import { MOCK_INDICATORS, MOCK_TRANSACTIONS, INITIAL_BALANCE } from './constants';
import { calculateProjections, detectAlerts } from './services/dataService';
import { audioService } from './services/audioService';
import { getFinancialInsights } from './services/geminiService';
import { DailyProjection, Alert, AlertType, SoundType, UserRole } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [projections, setProjections] = useState<DailyProjection[]>([]);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [indicators] = useState(MOCK_INDICATORS);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Auth Simulation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const data = calculateProjections(MOCK_TRANSACTIONS, 60, INITIAL_BALANCE);
      setProjections(data);

      const alerts = detectAlerts(data);
      if (alerts.length > 0) {
        setTimeout(() => {
          setCurrentAlert(alerts[0]);
          if (alerts[0].type === AlertType.CRITICAL) {
            audioService.playAlert(SoundType.SISMO, 0.3);
          }
        }, 2000);
      }
    }
  }, [isLoggedIn]);

  const handleInsightsRequest = async () => {
    setLoadingInsights(true);
    const data = await getFinancialInsights(projections);
    setInsights(data);
    setLoadingInsights(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#0f172a_100%)]"></div>
        <div className="relative z-10 w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
              <i className="fa-solid fa-building-columns text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">SISTEMA <span className="text-blue-600">DAF</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Control de Gestión Financiera</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Usuario Corporativo</label>
              <input 
                type="text" 
                placeholder="usuario@empresa.com"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform active:scale-95 uppercase tracking-widest text-xs"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
             <button className="text-slate-400 hover:text-blue-600 text-[11px] font-bold transition-colors">¿Olvidó su contraseña?</button>
             <p className="mt-4 text-slate-400 text-[10px] font-medium uppercase tracking-wider">¿No tiene cuenta? <button className="text-blue-600 font-black">Registrarse</button></p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            projections={projections} 
            onInsightsRequest={handleInsightsRequest}
            insights={insights}
            loadingInsights={loadingInsights}
          />
        );
      case 'projections':
        return <CashFlowView projections={projections} />;
      case 'collections':
        return (
          <div className="bg-white p-16 rounded-[2.5rem] text-center shadow-sm border border-slate-200">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <i className="fa-solid fa-file-invoice-dollar text-4xl text-blue-500"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Módulo de Cobranzas</h2>
            <p className="text-slate-400 max-w-md mx-auto mt-4 font-medium">Gestión avanzada de facturación, seguimiento de pagos y conciliación de cartera.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Por Cobrar 30D</p>
                <p className="text-xl font-black text-slate-900">$12.500.000</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pagos Vencidos</p>
                <p className="text-xl font-black text-red-500">$2.100.000</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meta del Mes</p>
                <p className="text-xl font-black text-blue-600">85%</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-40 text-slate-300">
            <i className="fa-solid fa-wrench text-6xl mb-6 opacity-20"></i>
            <p className="text-xl font-black uppercase tracking-widest text-slate-400">Funcionalidad en Desarrollo</p>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} logout={() => setIsLoggedIn(false)}>
      <div className="space-y-10">
        <EconomicIndicatorCards indicators={indicators} />
        {renderContent()}
      </div>
      
      <AlertOverlay 
        alert={currentAlert} 
        onClose={() => setCurrentAlert(null)} 
      />
      
      {/* Excel Tool Button */}
      <div className="fixed bottom-10 right-10 z-[120]">
        <button 
          title="Descargar Plantilla Corporativa"
          className="w-16 h-16 bg-green-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-green-700 hover:-translate-y-2 transition-all duration-300 group"
        >
          <i className="fa-solid fa-file-excel text-2xl"></i>
          <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl uppercase tracking-widest border border-slate-800">
            Descargar Plantilla .xlsx
          </span>
        </button>
      </div>
    </Layout>
  );
};

export default App;
