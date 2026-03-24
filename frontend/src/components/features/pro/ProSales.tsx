"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface SalesRow {
  id: number;
  segment: string;
  product: string;
  price: number;
  quantities: number[];
}

export default function ProSales({ showInfo }: { showInfo?: boolean }) {
  const t = useTranslations('Dashboard');
  const [rows, setRows] = useState<SalesRow[]>([
    { id: 1, segment: "Segmento 1", product: "Produto 1", price: 3500, quantities: Array(12).fill(1) },
    { id: 2, segment: "Segmento 2", product: "Produto 2", price: 7000, quantities: Array(12).fill(1) },
    { id: 3, segment: "Segmento 3", product: "Produto 3", price: 10000, quantities: Array(12).fill(1) },
  ]);

  const updateQuantity = (rowId: number, monthIdx: number, val: string) => {
    const newVal = parseInt(val) || 0;
    setRows(rows.map(r => r.id === rowId ? {
      ...r,
      quantities: r.quantities.map((q, i) => i === monthIdx ? newVal : q)
    } : r));
  };

  const calculateMonthTotal = (monthIdx: number) => {
    return rows.reduce((acc, r) => acc + (r.price * r.quantities[monthIdx]), 0);
  };

  const months = ["mai-25", "jun-25", "jul-25", "ago-25", "set-25", "out-25", "nov-25", "dez-25", "jan-26", "fev-26", "mar-26", "abr-26"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('menu_sales')}</h2>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-blue-100">Ano 1</div>
        </div>
      </div>

      <div className="relative overflow-hidden border border-slate-200 rounded-[2rem] bg-white shadow-2xl shadow-slate-200/40">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
             <thead>
                <tr className="bg-slate-900 border-b border-white/10">
                   <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] sticky left-0 bg-slate-900 z-10 w-48">Segmento</th>
                   <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] w-48">Produto ou Serviço</th>
                   <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] w-32">Preço (R$)</th>
                   {months.map(m => (
                      <th key={m} className="p-5 text-[10px] font-black uppercase text-white/70 tracking-[0.2em] text-center min-w-[100px] border-l border-white/5">{m}</th>
                   ))}
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                   <tr key={row.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white group-hover:bg-blue-50/30 z-10 border-r border-slate-100">
                         <input 
                            className="bg-transparent border-none focus:ring-0 w-full p-0 font-bold" 
                            value={row.segment} 
                            onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, segment: e.target.value} : r))}
                         />
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                         <input 
                            className="bg-transparent border-none focus:ring-0 w-full p-0" 
                            value={row.product} 
                            onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, product: e.target.value} : r))}
                         />
                      </td>
                      <td className="p-4 font-black text-slate-800">
                         <input 
                            type="number"
                            className="bg-transparent border-none focus:ring-0 w-full p-0" 
                            value={row.price} 
                            onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, price: parseInt(e.target.value) || 0} : r))}
                         />
                      </td>
                      {row.quantities.map((q, i) => (
                         <td key={i} className="p-3 text-center border-l border-slate-50">
                            <input 
                               type="number"
                               className="w-16 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                               value={q}
                               onChange={(e) => updateQuantity(row.id, i, e.target.value)}
                            />
                         </td>
                      ))}
                   </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
                   <td className="p-5 sticky left-0 bg-slate-900 border-r border-white/10 z-10">Total Receita Bruta</td>
                   <td className="p-5" colSpan={2}>-</td>
                   {months.map((_, i) => (
                      <td key={i} className="p-5 text-center border-l border-white/5 whitespace-nowrap">
                         R$ {calculateMonthTotal(i).toLocaleString()}
                      </td>
                   ))}
                </tr>
             </tbody>
          </table>
        </div>
      </div>
      <button 
        onClick={() => setRows([...rows, { id: Date.now(), segment: "", product: "", price: 0, quantities: Array(12).fill(0) }])}
        className="px-6 py-3 bg-white border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-500 transition-all flex items-center gap-2 group"
      >
        <span className="text-xl group-hover:scale-125 transition-transform">+</span> Adicionar Nova Linha
      </button>
    </div>
  );
}
