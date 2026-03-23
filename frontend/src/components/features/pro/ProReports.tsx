"use client";

import { useTranslations } from "next-intl";

export default function ProReports({ showInfo }: { showInfo?: boolean }) {
  const t = useTranslations('Dashboard');
  const months = ["mai-25", "jun-25", "jul-25", "ago-25", "set-25", "out-25", "nov-25", "dez-25", "jan-26", "fev-26", "mar-26", "abr-26"];

  // Mock data for now (to be replaced by real state later)
  const revenue = Array(12).fill(50000);
  const opex = Array(12).fill(25000);
  const taxes = revenue.map(r => r * 0.15);
  const netProfit = revenue.map((r, i) => r - opex[i] - taxes[i]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('menu_reports')}</h2>
        <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2">
           Exportar PDF (Pro)
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Demonstrativo de Resultados (DRE)</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Análise Mensal - Ano 1</p>
           </div>
           <div className="text-right text-[10px] font-black uppercase text-slate-400">Valores em Reais (BRL)</div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
           <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                 <tr className="bg-slate-50/50">
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest sticky left-0 bg-white/80 backdrop-blur z-10 w-64">Rubrica Financeira</th>
                    {months.map(m => (
                       <th key={m} className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center border-l border-slate-100">{m}</th>
                    ))}
                 </tr>
              </thead>
              <tbody>
                 <ReportRow label="Receita Operacional Bruta" values={revenue} highlight />
                 <ReportRow label="(-) Impostos e Deduções" values={taxes} negative />
                 <ReportRow label="Receita Líquida" values={revenue.map((r, i) => r - taxes[i])} />
                 <tr className="h-4"></tr>
                 <ReportRow label="(-) Custos Operacionais (OPEX)" values={opex} negative />
                 <ReportRow label="EBITDA / Lajida" values={revenue.map((r, i) => r - taxes[i] - opex[i])} highlight />
                 <ReportRow label="Margem EBITDA (%)" values={revenue.map((r, i) => (((r - taxes[i] - opex[i]) / r) * 100).toFixed(1) + "%")} />
                 <tr className="h-4 border-b border-slate-100"></tr>
                 <ReportRow label="Lucro Líquido do Período" values={netProfit} highlight bg="bg-blue-600 text-white" />
              </tbody>
           </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-4">
            <h4 className="text-lg font-black tracking-tight">Veredicto Estratégico</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
               Com base nas projeções detalhadas, seu negócio apresenta um **Ponto de Equilíbrio** no mês 7. 
               A margem líquida média de **22.4%** é superior à média do setor de tecnologia (18%). 
               Recomendamos manter o investimento em marketing conforme planejado.
            </p>
         </div>
         <div className="p-8 bg-emerald-500 rounded-[2rem] text-white flex flex-col justify-center items-center text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Payback Descontado</p>
            <p className="text-5xl font-black tracking-tighter">14 meses</p>
            <p className="text-xs font-bold opacity-80">Retorno rápido do investimento inicial</p>
         </div>
      </div>
    </div>
  );
}

function ReportRow({ label, values, highlight = false, negative = false, bg = "" }: { label: string, values: any[], highlight?: boolean, negative?: boolean, bg?: string }) {
  return (
    <tr className={`${bg || (highlight ? 'bg-slate-50 font-black' : 'hover:bg-slate-50')} transition-colors border-b border-slate-50`}>
       <td className={`p-4 text-xs ${highlight ? 'font-black' : 'font-medium text-slate-600'} sticky left-0 z-10 ${bg || 'bg-white'}`}>
          {label}
       </td>
       {values.map((v, i) => (
          <td key={i} className={`p-4 text-center text-xs font-bold border-l border-slate-100 ${negative ? 'text-rose-500' : ''}`}>
             {typeof v === 'number' ? `R$ ${v.toLocaleString()}` : v}
          </td>
       ))}
    </tr>
  );
}

function Button({ children, variant, className, ...props }: any) {
  return <button className={`px-4 py-2 flex items-center justify-center transition-all active:scale-95 ${variant === 'outline' ? 'border-2 border-slate-200 hover:border-slate-900 font-bold' : ''} ${className}`} {...props}>{children}</button>
}
