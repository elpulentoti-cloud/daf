
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DailyProjection } from '../types';

interface DashboardProps {
  projections: DailyProjection[];
  onInsightsRequest: () => void;
  insights: { summary: string, recommendations: string[], riskLevel: string } | null;
  loadingInsights: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ projections, onInsightsRequest, insights, loadingInsights }) => {
  const [dataWindow, setDataWindow] = useState(30);
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  const chartData = projections.slice(0, dataWindow).map(p => ({
    name: p.date.split('-').slice(1).reverse().join('/'),
    saldo: p.finalBalance,
  }));

  const currentLiquidity = projections[0]?.finalBalance || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-2">
          {[15, 30, 90, 365].map(days => (
            <button 
              key={days}
              onClick={() => setDataWindow(days)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                ${dataWindow === days ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
            >
              {days} Días
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Caja Disponible', val: formatCurrency(currentLiquidity), color: 'border-blue-500', icon: 'fa-box-open' },
          { label: 'Ingresos Mensuales', val: formatCurrency(projections.slice(0, 30).reduce((a,p)=>a+p.incomes,0)), color: 'border-green-500', icon: 'fa-arrow-down' },
          { label: 'Egresos Mensuales', val: formatCurrency(projections.slice(0, 30).reduce((a,p)=>a+p.expenses,0)), color: 'border-red-500', icon: 'fa-arrow-up' },
          { label: 'Vencimientos 7D', val: formatCurrency(1200000), color: 'border-amber-500', icon: 'fa-clock' },
        ].map((item, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${item.color} hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
              <i className={`fa-solid ${item.icon} text-slate-200`}></i>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Evolución de Disponibilidad</h3>
              <p className="text-xs text-slate-400">Proyección basada en compromisos vigentes</p>
            </div>
            <button className="text-blue-500 text-xs font-bold uppercase hover:underline">Exportar Reporte</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000000}M`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  formatter={(v: any) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <i className="fa-solid fa-robot text-4xl"></i>
            </div>
            <h3 className="text-sm font-bold mb-6 flex items-center uppercase tracking-wider">
              <i className="fa-solid fa-sparkles text-blue-400 mr-2"></i>
              Asistente Financiero AI
            </h3>
            
            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Procesando Análisis...</p>
              </div>
            ) : insights ? (
              <div className="space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4">{insights.summary}</p>
                <div className="space-y-2">
                  {insights.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start text-[11px] text-slate-400 hover:text-white transition-colors">
                      <i className="fa-solid fa-circle-check text-blue-400 mt-1 mr-2 text-[8px]"></i>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={onInsightsRequest}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg"
                >
                  Recalcular Insights
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400 mb-6 font-medium">Genere recomendaciones estratégicas basadas en su flujo real.</p>
                <button 
                  onClick={onInsightsRequest}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all uppercase text-[10px] tracking-widest"
                >
                  Analizar Datos
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center">
              <i className="fa-solid fa-tasks mr-2 text-blue-500"></i>
              Tareas Pendientes
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Cierre Mensual', status: 'En progreso', icon: 'fa-flag-checkered', color: 'text-blue-500 bg-blue-50' },
                { label: 'Revisión Proveedores', status: 'Pendiente', icon: 'fa-handshake', color: 'text-slate-400 bg-slate-50' }
              ].map((task, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.color}`}>
                    <i className={`fa-solid ${task.icon}`}></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-bold text-slate-800 uppercase">{task.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{task.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
