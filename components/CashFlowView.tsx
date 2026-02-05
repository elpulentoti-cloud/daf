
import React, { useState } from 'react';
import { DailyProjection, AlertType } from '../types';

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
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusLabel = (status: AlertType) => {
    switch (status) {
      case AlertType.CRITICAL: return 'Déficit';
      case AlertType.WARNING: return 'Alerta';
      default: return 'Normal';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Proyección Detallada de Caja</h3>
          <p className="text-sm text-gray-500">Trazabilidad total de ingresos y egresos</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setPeriod('DAILY')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === 'DAILY' ? 'bg-white shadow-sm text-daf-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Diario
          </button>
          <button 
            onClick={() => setPeriod('WEEKLY')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === 'WEEKLY' ? 'bg-white shadow-sm text-daf-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Semanal
          </button>
          <button 
            onClick={() => setPeriod('MONTHLY')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === 'MONTHLY' ? 'bg-white shadow-sm text-daf-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mensual
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4 border-b">Fecha</th>
              <th className="px-6 py-4 border-b">Saldo Inicial</th>
              <th className="px-6 py-4 border-b">Ingresos</th>
              <th className="px-6 py-4 border-b">Egresos</th>
              <th className="px-6 py-4 border-b">Saldo Final</th>
              <th className="px-6 py-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {projections.map((p, idx) => (
              <tr key={idx} className={`hover:bg-gray-50 transition-colors ${p.status === AlertType.CRITICAL ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 font-medium text-gray-900">{p.date}</td>
                <td className="px-6 py-4 text-gray-600">{formatCurrency(p.initialBalance)}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">+{formatCurrency(p.incomes)}</td>
                <td className="px-6 py-4 text-red-600 font-semibold">-{formatCurrency(p.expenses)}</td>
                <td className={`px-6 py-4 font-bold ${p.finalBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(p.finalBalance)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      p.status === AlertType.CRITICAL ? 'bg-red-400' : p.status === AlertType.WARNING ? 'bg-amber-400' : 'bg-green-400'
                    }`}></span>
                    {getStatusLabel(p.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashFlowView;
