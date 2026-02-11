
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DailyProjection } from '../types.ts';

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
    name: p.date.split('-').slice(2).join('/'),
    saldo: p.finalBalance,
  }));

  return (
    <div className="space-y-8">
      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 w-fit shadow-sm">
        {[15, 30, 60].map(days => (
          <button 
            key={days}
            onClick={() => setDataWindow(days)}
            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all
              ${dataWindow === days ? 'bg-[#0f172a] text-white' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {days} Días
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Caja Hoy', val: formatCurrency(projections[0]?.finalBalance || 0), icon: 'fa-vault', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Egresos Mes', val: formatCurrency(projections.slice(0, 30).reduce((a,p)=>a+p.expenses,0)), icon: 'fa-arrow-trend-down', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Ingresos Mes', val: formatCurrency(projections.slice(0, 30).reduce((a,p)=>a+p.incomes,0)), icon: 'fa-arrow-trend-up', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Nivel Riesgo', val: insights?.riskLevel || 'BAJO', icon: 'fa-shield-check', color: 'text-[#0f172a]', bg: 'bg-slate-100' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
            <p className={`text-lg font-black mt-1 ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-8 italic">Tendencia de Liquidez</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} />
                <Tooltip />
                <Area type="monotone" dataKey="saldo" stroke="#10b981" strokeWidth={3} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-emerald-500 mb-6">
              <i className="fa-solid fa-sparkles"></i>
              <span className="text-[10px] font-bold uppercase tracking-widest">AI Financial Advisor</span>
            </div>
            {loadingInsights ? (
              <div className="py-20 text-center"><i className="fa-solid fa-spinner animate-spin text-3xl"></i></div>
            ) : insights ? (
              <div className="space-y-6">
                <p className="text-sm font-medium leading-relaxed">{insights.summary}</p>
                <div className="space-y-2">
                  {insights.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start bg-white/5 p-3 rounded-xl">
                      <span className="text-emerald-500 font-bold mr-2">{i+1}.</span>
                      <p className="text-[11px] text-slate-300">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <i className="fa-solid fa-brain text-4xl text-white/10 mb-6"></i>
                <p className="text-xs text-slate-400 mb-8">Obtén recomendaciones Kaizen basadas en tus flujos reales.</p>
                <button onClick={onInsightsRequest} className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all">Analizar Ahora</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
