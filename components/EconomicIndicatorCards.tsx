
import React from 'react';
import { EconomicIndicator } from '../types.ts';

interface EconomicIndicatorCardsProps {
  indicators: EconomicIndicator[];
}

const EconomicIndicatorCards: React.FC<EconomicIndicatorCardsProps> = ({ indicators }) => {
  return (
    <div className="flex overflow-x-auto space-x-6 pb-6 no-scrollbar scroll-smooth">
      {indicators.map((ind, i) => (
        <div key={i} className="flex-shrink-0 w-52 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i className={`fa-solid ${ind.icon} text-lg`}></i>
            </div>
            <p className={`text-[10px] font-black px-2 py-1 rounded-lg ${ind.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {ind.change >= 0 ? '+' : ''}{ind.change}%
            </p>
          </div>
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">{ind.name}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-lg font-black text-gray-900 tracking-tight">
              {ind.value.toLocaleString('es-CL')}
            </p>
            <span className="text-[10px] font-bold text-gray-500">{ind.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EconomicIndicatorCards;
