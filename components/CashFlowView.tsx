
import React, { useState } from 'react';
import { DailyProjection, AlertType } from '../types.ts';
import { MOCK_TRANSACTIONS } from '../constants.tsx';

interface CashFlowViewProps {
  projections: DailyProjection[];
}

const CashFlowView: React.FC<CashFlowViewProps> = ({ projections }) => {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  const getStatusColor = (status: AlertType) => {
    switch (status) {
      case AlertType.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
      case AlertType.WARNING: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Libro de Flujo de Caja</h3>
          <p className="text-sm font-medium text-slate-400 italic">Desglose de operaciones GAF Edaltec</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['DAILY', 'WEEKLY', 'MONTHLY'].map((p) => (
            <button 
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all 
                ${period === p ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {p === 'DAILY' ? 'Diario' : p === 'WEEKLY' ? 'Semanal' : 'Mensual'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-8 py-5 border-b border-slate-100">Fecha</th>
              <th className="px-8 py-5 border-b border-slate-100">Saldo Inicial</th>
              <th className="px-8 py-5 border-b border-slate-100">Movimientos</th>
              <th className="px-8 py-5 border-b border-slate-100">Saldo Proyectado</th>
              <th className="px-8 py-5 border-b border-slate-100 text-center">Riesgo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {projections.map((p, idx) => {
              // Buscar transacciones reales del mock para este día para mostrar responsables
              const dayT = MOCK_TRANSACTIONS.find(t => t.date === p.date);
              
              return (
                <tr key={idx} className={`hover:bg-slate-50/80 transition-colors ${p.status === AlertType.CRITICAL ? 'bg-red-50/30' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900">{p.date}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{idx === 0 ? 'Hoy' : `T+${idx}`}</div>
                  </td>
                  <td className="px-8 py-6 font-medium text-slate-500">{formatCurrency(p.initialBalance)}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-1">
                      {p.incomes > 0 && <span className="text-emerald-600 font-black text-xs">+{formatCurrency(p.incomes)}</span>}
                      {p.expenses > 0 && <span className="text-red-600 font-black text-xs">-{formatCurrency(p.expenses)}</span>}
                      {dayT && <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full w-fit uppercase">{dayT.responsible}</span>}
                    </div>
                  </td>
                  <td className={`px-8 py-6 font-black text-base tracking-tighter ${p.finalBalance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {formatCurrency(p.finalBalance)}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashFlowView;
