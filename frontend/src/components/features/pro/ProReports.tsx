"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText, TrendingUp, TrendingDown, Activity } from "lucide-react";

import { exportToPDF } from "@/lib/pdfExport";

interface ProReportsProps {
  results: any;
  inputs: any;
  showInfo?: boolean;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export default function ProReports({ results, inputs, showInfo, isPro, onUpgrade }: ProReportsProps) {
  const t = useTranslations('Dashboard');
  const realistic = results.scenarios?.realistic || results;
  
  const months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];

  // Real data from results
  const revenue = realistic.monthly_revenue || inputs.monthly_sales || Array(12).fill(0);
  const opex = inputs.monthly_costs || Array(12).fill(0);
  const taxes = revenue.map((r: number) => r * 0.15); // Standard tax assumption
  const ebitda = revenue.map((r: number, i: number) => r - opex[i] - taxes[i]);

  const handleExportPDF = async () => {
    await exportToPDF('report-container', `Relatorio_Oravia_${inputs.project_name}`);
  };

  return (
    <div className="space-y-8 print:p-0" id="report-container">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t('menu_reports')}</h2>
          <p className="text-slate-500 font-medium text-sm">Relatórios financeiros detalhados para exportação</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportPDF} variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 h-12 px-6 border-slate-200 group">
            <Printer size={16} className="group-hover:scale-110 transition-transform" /> Exportar PDF Pro
          </Button>
          <Button 
            onClick={!isPro ? onUpgrade : undefined}
            className={`rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 h-12 px-6 transition-all group relative overflow-hidden ${!isPro ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20'}`}
          >
            <Download size={16} /> 
            <span>Exportar Excel</span>
            {!isPro && (
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-slate-900 text-white text-[8px] px-2 py-1 rounded-full flex items-center gap-1 leading-none">
                   🔒 RECURSO PREMIUM
                </span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden print:border-none print:shadow-none print:rounded-none">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-end print:bg-white">
           <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                 <FileText size={20} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oravia Pro Report</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Demonstrativo de Resultados (DRE)</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em]">{inputs.project_name} • Projeção 12 Meses</p>
           </div>
           <div className="text-right space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Status da Análise</p>
              <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${realistic.vpl > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                 {realistic.vpl > 0 ? 'Viabilidade Confirmada' : 'Risco Identificado'}
              </span>
           </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
           <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] sticky left-0 bg-white/95 backdrop-blur z-10 w-80">Rubrica Financeira</th>
                    {months.map(m => (
                       <th key={m} className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center border-l border-slate-100">{m}</th>
                    ))}
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 <ReportRow label="Receita Operacional Bruta" values={revenue} highlight icon={<Activity size={12} className="text-blue-500" />} />
                 <ReportRow label="(-) Impostos (Simples Nac. Est.)" values={taxes} negative icon={<TrendingDown size={12} className="text-rose-400" />} />
                 <ReportRow label="Receita Líquida" values={revenue.map((r: number, i: number) => r - taxes[i])} subtotal />
                 <tr className="h-6 bg-slate-50/30">
                    <td colSpan={13}></td>
                 </tr>
                 <ReportRow label="(-) Custos Operacionais (OPEX)" values={opex} negative icon={<TrendingDown size={12} className="text-rose-400" />} />
                 <ReportRow label="EBITDA (LAJIDA)" values={ebitda} highlight icon={<TrendingUp size={12} className="text-emerald-500" />} />
                 <ReportRow label="Margem EBITDA (%)" values={revenue.map((r: number, i: number) => r > 0 ? (((ebitda[i]) / r) * 100).toFixed(1) + "%" : "0%")} />
                 <tr className="h-8 print:h-12 border-b border-slate-100"></tr>
                 <ReportRow 
                    label="Resultado Final Líquido" 
                    values={ebitda} // Assuming EBITDA = Net Profit for this simple model
                    highlight 
                    bg="bg-slate-900 text-white" 
                 />
              </tbody>
           </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:mt-10">
         <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg shadow-slate-200">
               <TrendingUp className="text-blue-600" size={32} />
            </div>
            <div className="space-y-4">
               <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">Veredicto Executivo</h4>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {realistic.vpl > 0 
                    ? `O Estudo de Viabilidade Econômica (EVE) resultou em um VPL positivo de R$ ${realistic.vpl.toLocaleString()}. O projeto demonstra maturidade financeira e capacidade de retorno superior à TMA estabelecida.`
                    : `O estudo indica necessidade de ajustes. O VPL negativo sugere que, sob as premissas atuais, o projeto não atinge o retorno mínimo esperado. Avalie redução de OPEX ou aumento de margem.`}
               </p>
            </div>
         </div>
         <div className={`p-10 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center space-y-2 shadow-2xl ${realistic.vpl > 0 ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Payback Period Estimado</p>
            <p className="text-6xl font-black tracking-tighter">{realistic.payback_months || 0} meses</p>
            <p className="text-xs font-bold opacity-80">{realistic.vpl > 0 ? 'Dentro do prazo aceitável para o setor' : 'Prazo acima do perfil de risco recomendado'}</p>
         </div>
      </div>
    </div>
  );
}

function ReportRow({ label, values, highlight = false, negative = false, subtotal = false, bg = "", icon }: { label: string, values: any[], highlight?: boolean, negative?: boolean, subtotal?: boolean, bg?: string, icon?: React.ReactNode }) {
  return (
    <tr className={`${bg || (highlight ? 'bg-slate-50/80 font-black' : subtotal ? 'bg-slate-50/30' : 'hover:bg-slate-50/50')} transition-colors border-b border-slate-50 relative`}>
       <td className={`p-6 text-sm ${highlight ? 'font-black text-slate-900' : 'font-semibold text-slate-500'} sticky left-0 z-10 ${bg || 'bg-white/95 backdrop-blur'}`}>
          <div className="flex items-center gap-3">
             {icon && <span className="shrink-0">{icon}</span>}
             {label}
          </div>
       </td>
       {values.map((v, i) => (
          <td key={i} className={`p-6 text-center text-xs font-bold border-l border-slate-100 ${negative ? 'text-rose-600' : highlight && !bg ? 'text-slate-900' : ''}`}>
             {typeof v === 'number' ? `R$ ${v.toLocaleString()}` : v}
          </td>
       ))}
    </tr>
  );
}
