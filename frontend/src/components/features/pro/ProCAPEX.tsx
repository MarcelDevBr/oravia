"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CapexRow {
  id: number;
  item: string;
  type: string;
  value: number;
  useful_life: number; // months
  residual_value: number;
}

export default function ProCAPEX() {
  const t = useTranslations('Dashboard');
  const [rows, setRows] = useState<CapexRow[]>([
    { id: 1, item: "Computadores e Laptops", type: "Equipamentos", value: 25000, useful_life: 36, residual_value: 0 },
    { id: 2, item: "Mobiliário Escritório", type: "Móveis", value: 15000, useful_life: 60, residual_value: 1000 },
    { id: 3, item: "Licenças de Software", type: "Intangível", value: 5000, useful_life: 12, residual_value: 0 },
  ]);

  const calculateDepreciation = (row: CapexRow) => {
    return (row.value - row.residual_value) / row.useful_life;
  };

  const totalInvestment = rows.reduce((acc, r) => acc + r.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('menu_capex')}</h2>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-emerald-100">Investimentos Iniciais</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="p-6 bg-slate-900 rounded-3xl text-white">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Investido</p>
            <p className="text-4xl font-black mt-2 tracking-tight">R$ {totalInvestment.toLocaleString()}</p>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Depreciação Total / Mês</p>
            <p className="text-4xl font-black mt-2 tracking-tight text-slate-900">R$ {rows.reduce((acc, r) => acc + calculateDepreciation(r), 0).toFixed(2)}</p>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ROI Estimado (Backup)</p>
            <p className="text-4xl font-black mt-2 tracking-tight text-blue-600">--</p>
         </div>
      </div>

      <div className="relative overflow-hidden border border-slate-200 rounded-3xl bg-white shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Item de Investimento</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Valor de Compra</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Vida Útil (Meses)</th>
                 <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Deprec. Mensal</th>
              </tr>
           </thead>
           <tbody>
              {rows.map((row) => (
                 <tr key={row.id} className="border-b border-slate-100 hover:bg-emerald-50/20 transition-colors group">
                    <td className="p-4 font-bold text-slate-700">
                       <input 
                          className="bg-transparent border-none focus:ring-0 w-full p-0 font-bold" 
                          value={row.item} 
                          onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, item: e.target.value} : r))}
                       />
                    </td>
                    <td className="p-4">
                       <input 
                          className="bg-transparent border-none focus:ring-0 w-full p-0 text-slate-500 font-medium" 
                          value={row.type} 
                          onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, type: e.target.value} : r))}
                       />
                    </td>
                    <td className="p-4 font-black text-slate-800">
                       R$ <input 
                          type="number"
                          className="bg-transparent border-none focus:ring-0 w-32 p-0 inline font-black text-slate-800" 
                          value={row.value} 
                          onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, value: parseInt(e.target.value) || 0} : r))}
                       />
                    </td>
                    <td className="p-4 text-center">
                       <input 
                          type="number"
                          className="w-16 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 group-hover:bg-white transition-all shadow-sm"
                          value={row.useful_life}
                          onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, useful_life: parseInt(e.target.value) || 1} : r))}
                       />
                    </td>
                    <td className="p-4 text-right font-bold text-rose-500">
                       R$ {calculateDepreciation(row).toFixed(2)}
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
      <button 
        onClick={() => setRows([...rows, { id: Date.now(), item: "", type: "Geral", value: 0, useful_life: 12, residual_value: 0 }])}
        className="px-6 py-3 bg-white border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all"
      >
        + Adicionar Novo Ativo
      </button>
    </div>
  );
}
