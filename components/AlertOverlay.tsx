
import React from 'react';
import { Alert, AlertType } from '../types.ts';

interface AlertOverlayProps {
  alert: Alert | null;
  onClose: () => void;
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`
        relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden
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
            {alert.type === AlertType.CRITICAL ? 'Alerta Crítica' : 'Notificación GAF'}
          </h2>
          
          <p className="text-slate-500 text-sm font-medium mb-8">
            {alert.message}
          </p>

          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monto Riesgo</p>
                <p className="text-lg font-extrabold text-slate-900">{formatCurrency(alert.amount || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fecha Proyectada</p>
                <p className="text-lg font-extrabold text-slate-900">{alert.criticalDate}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`
              w-full py-4 rounded-2xl font-black text-white transition-all transform hover:scale-[1.02] uppercase tracking-widest text-xs
              ${alert.type === AlertType.CRITICAL ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}
            `}
          >
            Aceptar Notificación
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertOverlay;
