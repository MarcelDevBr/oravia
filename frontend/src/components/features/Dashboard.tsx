"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Clock, Target, AlertCircle, CheckCircle2, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { getHistory, SimulationHistoryItem } from "@/lib/history";
import { useEffect, useState } from "react";

interface DashboardProps {
  results: any;
  inputs: any;
  onReset: () => void;
}

export default function Dashboard({ results, inputs, onReset }: DashboardProps) {
  const t = useTranslations('Dashboard');
  const [history, setHistory] = useState<SimulationHistoryItem[]>([]);
  
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const realistic = results.scenarios?.realistic || results;
  const monteCarlo = results.monte_carlo;
  
  const chartData = inputs.monthly_sales.map((s: number, i: number) => ({
    name: `M${i + 1}`,
    vendas: s,
    custos: inputs.monthly_costs[i],
    caixa: s - inputs.monthly_costs[i]
  }));

  const scenarioData = results.scenarios ? [
    { name: t('pessimistic'), vpl: results.scenarios.pessimistic.vpl },
    { name: t('realistic'), vpl: results.scenarios.realistic.vpl },
    { name: t('optimistic'), vpl: results.scenarios.optimistic.vpl },
  ] : [];

  const isViable = realistic.vpl > 0;
  const successProb = monteCarlo ? (monteCarlo.probability_of_success * 100).toFixed(0) : "82";

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
        <KPI title={t('kpi_vpl')} value={`R$ ${realistic.vpl.toLocaleString()}`} icon={<TrendingUp className="text-blue-500" />} />
        <KPI title={t('kpi_tir')} value={`${(realistic.tir * 100).toFixed(2)}%`} icon={<Target className="text-emerald-500" />} />
        <KPI title={t('kpi_payback')} value={`${realistic.payback_months}`} suffix=" meses" icon={<Clock className="text-orange-500" />} />
        <KPI title={t('kpi_breakeven')} value={`R$ ${inputs.monthly_costs[0].toLocaleString()}`} icon={<TrendingDown className="text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-none shadow-2xl bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 md:p-8">
          <Tabs defaultValue="cashflow" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <CardTitle className="text-xl font-bold text-slate-900">{t('visual_analysis')}</CardTitle>
              <TabsList className="bg-slate-100 rounded-xl p-1">
                <TabsTrigger value="cashflow" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold">{t('cash_flow')}</TabsTrigger>
                <TabsTrigger value="scenarios" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold">{t('scenarios')}</TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold">{t('history')}</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="cashflow" className="h-[400px] mt-0">
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
            </TabsContent>

            <TabsContent value="scenarios" className="h-[400px] mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="vpl" radius={[6, 6, 0, 0]} barSize={60}>
                    {scenarioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.vpl > 0 ? '#3b82f6' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="history" className="h-[400px] mt-0 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
                {history.length > 0 ? history.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all group">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.project_name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {new Date(item.timestamp).toLocaleDateString()} • {item.inputs.sector}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${(item.results.scenarios?.realistic.vpl || item.results.vpl) > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        VPL: R$ {(item.results.scenarios?.realistic.vpl || item.results.vpl).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Clock className="w-8 h-8 opacity-20" />
                    <p className="font-medium">{t('no_history')}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
                   {isViable 
                    ? `Seu projeto possui um VPL robusto de R$ ${realistic.vpl.toLocaleString()}. A probabilidade de sucesso é encorajadora.` 
                    : `Atenção: O projeto apresenta alto risco financeiro. Considere rever a estrutura de custos ou o investimento inicial.`}
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('success_prob')}</span>
                    <span className="text-2xl font-black text-white">{successProb}%</span>
                 </div>
                 <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${successProb}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`${parseInt(successProb) > 50 ? 'bg-blue-500' : 'bg-rose-500'} h-full shadow-[0_0_20px_rgba(59,130,246,0.6)]`}
                    />
                 </div>
                 {monteCarlo && (
                   <p className="text-[10px] text-slate-500 font-medium italic">
                     {t('simulation_disclaimer')}
                   </p>
                 )}
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
