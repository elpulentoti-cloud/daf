
import React, { useState, useEffect, Component, ReactNode } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import CashFlowView from './components/CashFlowView.tsx';
import EconomicIndicatorCards from './components/EconomicIndicatorCards.tsx';
import AlertOverlay from './components/AlertOverlay.tsx';
import OrgFlowView from './components/OrgFlowView.tsx';
import { MOCK_INDICATORS, MOCK_TRANSACTIONS, INITIAL_BALANCE } from './constants.tsx';
import { calculateProjections, detectAlerts } from './services/dataService.ts';
import { audioService } from './services/audioService.ts';
import { getFinancialInsights } from './services/geminiService.ts';
import { DailyProjection, Alert, AlertType, SoundType, UserRole } from './types.ts';

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

// Fix: Use the named Component import to ensure correct typing of state and props
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Use property initializers instead of constructor to ensure state is properly recognized on the instance
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    // Fix: Using this.state and this.props which are now properly inherited and visible to the compiler
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-10 text-white">
          <div className="max-w-md text-center">
            <i className="fa-solid fa-microchip text-emerald-500 text-5xl mb-6"></i>
            <h1 className="text-2xl font-bold mb-2">Error de Ejecución</h1>
            <p className="text-slate-400 mb-8">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="bg-emerald-500 px-8 py-3 rounded-xl font-bold">Reiniciar Sistema</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projections, setProjections] = useState<DailyProjection[]>([]);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const data = calculateProjections(MOCK_TRANSACTIONS, 60, INITIAL_BALANCE);
    setProjections(data);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setTimeout(() => {
      const alerts = detectAlerts(projections);
      if (alerts.length > 0) {
        setCurrentAlert(alerts[0]);
        audioService.playAlert(SoundType.SUBMARINO, 0.2).catch(() => {});
      }
    }, 1000);
  };

  const currentBalance = projections.length > 0 ? projections[0].finalBalance : INITIAL_BALANCE;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <i className="fa-solid fa-shield-halved text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">EDALTEC <span className="text-emerald-600">GAF</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Acceso Restringido</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input type="text" placeholder="Usuario Corporativo" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" required defaultValue="claudio.gutierrez" />
            <input type="password" placeholder="Contraseña de Seguridad" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" required defaultValue="********" />
            <button type="submit" className="w-full py-4 bg-[#0f172a] text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={UserRole.GERENTE_GAF} 
        logout={() => setIsLoggedIn(false)}
        currentBalance={currentBalance}
      >
        <div className="space-y-10">
          <EconomicIndicatorCards indicators={MOCK_INDICATORS} />
          
          {activeTab === 'dashboard' && (
            <Dashboard 
              projections={projections} 
              onInsightsRequest={async () => {
                setLoadingInsights(true);
                const data = await getFinancialInsights(projections);
                setInsights(data);
                setLoadingInsights(false);
              }}
              insights={insights}
              loadingInsights={loadingInsights}
            />
          )}
          
          {activeTab === 'projections' && <CashFlowView projections={projections} />}
          {activeTab === 'org' && <OrgFlowView />}
          
          {(activeTab === 'expenses' || activeTab === 'settings') && (
            <div className="financial-card p-20 text-center">
              <i className="fa-solid fa-screwdriver-wrench text-slate-200 text-6xl mb-6"></i>
              <h2 className="text-2xl font-bold text-slate-900">Módulo en Optimización</h2>
              <p className="text-slate-500 mt-2">Esta sección estará disponible en la próxima actualización de GAF v2.5</p>
            </div>
          )}
        </div>
        
        <AlertOverlay alert={currentAlert} onClose={() => setCurrentAlert(null)} />
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
