
import React from 'react';

const OrgFlowView: React.FC = () => {
  return (
    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight uppercase italic">Estructura Edaltec Group</h2>
        <div className="w-20 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-3 flex justify-center">
          <div className="w-72 bg-[#0f172a] p-6 rounded-3xl shadow-2xl text-center border-4 border-emerald-500/20 transform hover:-translate-y-1 transition-all">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Autoridad Máxima GAF</p>
            <p className="text-white font-black text-xl leading-tight">Claudio Gutiérrez</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contabilidad</p>
            <p className="text-[#0f172a] font-extrabold">Ariel Saavedra</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Operaciones</p>
            <p className="text-[#0f172a] font-extrabold">Pedro Aravena</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-64 bg-emerald-500 p-6 rounded-3xl shadow-xl text-center text-white">
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Administración</p>
            <p className="font-black text-lg">Manuel Vásquez</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Compras</p>
            <p className="text-[#0f172a] font-extrabold">Paulina</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Soporte</p>
            <p className="text-[#0f172a] font-extrabold">Rocío Navarro</p>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
           {['Bodega (Oscar)', 'Limpieza (Elizabeth)', 'Seguridad', 'Logística'].map((area) => (
             <div key={area} className="bg-slate-50 py-4 px-2 rounded-xl text-center border border-slate-100">
               <p className="text-[10px] font-bold text-slate-500">{area}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default OrgFlowView;
