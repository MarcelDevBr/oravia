"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface OpexRow {
  id: number;
  category: string;
  item: string;
  type: "Fixa" | "Variável";
  values: number[];
}

export default function ProOPEX({ showInfo }: { showInfo?: boolean }) {
  const t = useTranslations('Dashboard');
  const [rows, setRows] = useState<OpexRow[]>([
    { id: 1, category: "Mão de Obra", item: "Salários + Encargos", type: "Fixa", values: Array(12).fill(15000) },
    { id: 2, category: "Marketing", item: "Anúncios Digitais", type: "Variável", values: Array(12).fill(2000) },
    { id: 3, category: "Infraestrutura", item: "Aluguel e Nuvem", type: "Fixa", values: Array(12).fill(3500) },
  ]);

  const months = ["mai-25", "jun-25", "jul-25", "ago-25", "set-25", "out-25", "nov-25", "dez-25", "jan-26", "fev-26", "mar-26", "abr-26"];

  const updateValue = (rowId: number, monthIdx: number, val: string) => {
    const newVal = parseInt(val) || 0;
    setRows(rows.map(r => r.id === rowId ? {
      ...r,
      values: r.values.map((v, i) => i === monthIdx ? newVal : v)
    } : r));
  };

  const calculateMonthTotal = (monthIdx: number) => {
    return rows.reduce((acc, r) => acc + r.values[monthIdx], 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('menu_opex')}</h2>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-rose-100">Despesas Operacionais</div>
        </div>
      </div>

      <div className="relative overflow-hidden border border-slate-200 rounded-[2rem] bg-white shadow-2xl shadow-slate-200/40">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
             <thead>
                <tr className="bg-slate-900 border-b border-white/10">
                   <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] sticky left-0 bg-slate-900 z-10 w-48">Categoria</th>
                   <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] w-48">Item de Despesa</th>
                   <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] w-32">Natureza</th>
                   {months.map(m => (
                      <th key={m} className="p-5 text-[10px] font-black uppercase text-white/70 tracking-[0.2em] text-center min-w-[100px] border-l border-white/5">{m}</th>
                   ))}
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                   <tr key={row.id} className="border-b border-slate-100 hover:bg-rose-50/20 transition-colors">
                      <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                         <input 
                            className="bg-transparent border-none focus:ring-0 w-full p-0 font-bold" 
                            value={row.category} 
                            onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, category: e.target.value} : r))}
                         />
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                         <input 
                            className="bg-transparent border-none focus:ring-0 w-full p-0" 
                            value={row.item} 
                            onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, item: e.target.value} : r))}
                         />
                      </td>
                      <td className="p-4">
                         <select 
                            className="bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 p-2"
                            value={row.type}
                            onChange={(e) => setRows(rows.map(r => r.id === row.id ? {...r, type: e.target.value as any} : r))}
                         >
                            <option value="Fixa">Fixa</option>
                            <option value="Variável">Variável</option>
                         </select>
                      </td>
                      {row.values.map((v, i) => (
                         <td key={i} className="p-3 text-center border-l border-slate-50">
                            <input 
                               type="number"
                               className="w-20 h-10 bg-slate-50 border border-slate-100 rounded-lg text-center font-bold text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                               value={v}
                               onChange={(e) => updateValue(row.id, i, e.target.value)}
                            />
                         </td>
                      ))}
                   </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">
                   <td className="p-5 sticky left-0 bg-slate-900 border-r border-white/10 z-10">Total Operacional (OPEX)</td>
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
        onClick={() => setRows([...rows, { id: Date.now(), category: "", item: "", type: "Fixa", values: Array(12).fill(0) }])}
        className="px-6 py-3 bg-white border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-rose-500 hover:text-rose-500 transition-all"
      >
        + Adicionar Nova Despesa
      </button>
    </div>
  );
}
