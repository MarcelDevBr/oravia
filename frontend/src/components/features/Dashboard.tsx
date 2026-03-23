"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Clock, Target, AlertCircle, CheckCircle2, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface DashboardProps {
  results: any;
  inputs: any;
  onReset: () => void;
}

export default function Dashboard({ results, inputs, onReset }: DashboardProps) {
  const t = useTranslations('Dashboard');
  const chartData = inputs.monthly_sales.map((s: number, i: number) => ({
    name: `M${i + 1}`,
    vendas: s,
    custos: inputs.monthly_costs[i],
    caixa: s - inputs.monthly_costs[i]
  }));

  const isViable = results.vpl > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto py-10 px-4 md:px-6 space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{inputs.project_name}</h1>
          <p className="text-lg font-medium text-slate-400 mt-1">{inputs.sector} • {t('verdict_title')}</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl ${isViable ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"}`}>
          {isViable ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {isViable ? t('viable') : t('high_risk')}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI title={t('kpi_vpl')} value={`R$ ${results.vpl.toLocaleString()}`} icon={<TrendingUp className="text-blue-500" />} />
        <KPI title={t('kpi_tir')} value={`${(results.tir * 100).toFixed(2)}%`} icon={<Target className="text-emerald-500" />} />
        <KPI title={t('kpi_payback')} value={`${results.payback_months}`} suffix=" meses" icon={<Clock className="text-orange-500" />} />
        <KPI title={t('kpi_breakeven')} value={`R$ ${inputs.monthly_costs[0].toLocaleString()}`} icon={<TrendingDown className="text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-none shadow-2xl bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 md:p-8">
          <CardHeader className="px-0 pt-0 pb-10">
            <CardTitle className="text-xl font-bold text-slate-900">Fluxo de Caixa Mensal</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] px-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                   cursor={{ fill: '#f1f5f9' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="caixa" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative">
           <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[80px] rounded-full"></div>
           
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-2 text-blue-400">
                <Crown className="w-5 h-5" />
                <span className="text-xs font-black tracking-widest uppercase">{t('verdict_title')}</span>
              </div>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-xl font-medium leading-relaxed italic text-blue-50/90">
                   "Seu projeto possui um VPL de R$ {results.vpl.toLocaleString()}. 
                   {isViable ? " Os indicadores sugerem um retorno sólido." : " Considere reduzir os custos iniciais em pelo menos 15%."}"
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('success_prob')}</span>
                    <span className="text-2xl font-black text-white">82%</span>
                 </div>
                 <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "82%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-blue-500 h-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    />
                 </div>
              </div>
           </div>

           <div className="relative z-10 pt-8 space-y-4">
              <Button className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-blue-600/30 transition-transform active:scale-95">
                 {t('unlock_cta')}
              </Button>
              <Button variant="ghost" className="w-full text-slate-400 hover:text-white" onClick={onReset}>
                 {t('new_sim')}
              </Button>
           </div>
        </Card>
      </div>
    </motion.div>
  );
}

function KPI({ title, value, suffix = "", icon }: { title: string, value: string, suffix?: string, icon: React.ReactNode }) {
  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-white/50">
      <CardContent className="p-0 flex items-center justify-between">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
           <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">
             {value}<span className="text-base text-slate-400">{suffix}</span>
           </p>
        </div>
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
           {icon}
        </div>
      </CardContent>
    </Card>
  );
}
