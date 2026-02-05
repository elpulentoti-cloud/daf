
import React from 'react';
import { Alert, AlertType } from '../types';

interface AlertOverlayProps {
  alert: Alert | null;
  onClose: () => void;
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`
        relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300
        border-t-8 ${alert.type === AlertType.CRITICAL ? 'border-red-600' : 'border-amber-500'}
      `}>
        <div className="p-10 text-center">
          <div className={`
            w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl
            ${alert.type === AlertType.CRITICAL ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-500'}
          `}>
            <i className={`fa-solid ${alert.type === AlertType.CRITICAL ? 'fa-triangle-exclamation' : 'fa-circle-exclamation'}`}></i>
          </div>
          
          <h2 className="text-2xl font-black mb-2 text-slate-900 tracking-tight uppercase">
            {alert.type === AlertType.CRITICAL ? 'Alerta Crítica' : 'Notificación de Riesgo'}
          </h2>
          
          <p className="text-slate-500 text-sm font-medium mb-8">
            {alert.message}
          </p>

          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Importe</p>
                <p className="text-lg font-extrabold text-slate-900">{formatCurrency(alert.amount || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fecha Estimada</p>
                <p className="text-lg font-extrabold text-slate-900">{alert.criticalDate}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`
              w-full py-4 rounded-2xl font-black text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs
              ${alert.type === AlertType.CRITICAL ? 'bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-500/20'}
            `}
          >
            Confirmar Lectura
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default AlertOverlay;
