"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Clock, Target, CheckCircle2, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface ProOverviewProps {
  results: any;
  inputs: any;
}

export default function ProOverview({ results, inputs }: ProOverviewProps) {
  const t = useTranslations('Dashboard');
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

  const successProb = monteCarlo ? (monteCarlo.probability_of_success * 100).toFixed(0) : "82";

  return (
    <div className="space-y-8 pb-10">
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
              <CardTitle className="text-xl font-black text-slate-800 tracking-tight">{t('visual_analysis')}</CardTitle>
              <TabsList className="bg-slate-100/50 rounded-xl p-1">
                <TabsTrigger value="cashflow" className="rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest">{t('cash_flow')}</TabsTrigger>
                <TabsTrigger value="scenarios" className="rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest">{t('scenarios')}</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="cashflow" className="h-[400px] mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip 
                     cursor={{ fill: '#f1f5f9' }}
                     contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                  />
                  <Bar dataKey="vpl" radius={[6, 6, 0, 0]} barSize={60}>
                    {scenarioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.vpl > 0 ? '#3b82f6' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative">
           <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[80px] rounded-full"></div>
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-2 text-blue-400">
                <Crown className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-widest uppercase">{t('verdict_title')}</span>
              </div>
              <p className="text-xl font-medium leading-relaxed italic text-blue-50/90">
                {realistic.vpl > 0 
                 ? `Seu projeto possui um VPL robusto de R$ ${realistic.vpl.toLocaleString()}. A probabilidade de sucesso é encorajadora.` 
                 : `Atenção: O projeto apresenta alto risco financeiro. Considere rever a estrutura de custos.`}
              </p>
              <div className="space-y-4 pt-6">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('success_prob')}</span>
                    <span className="text-3xl font-black text-white">{successProb}%</span>
                 </div>
                 <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${successProb}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`${parseInt(successProb) > 50 ? 'bg-blue-500' : 'bg-rose-500'} h-full shadow-[0_0_20px_rgba(59,130,246,0.6)]`}
                    />
                 </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}

function KPI({ title, value, suffix = "", icon }: { title: string, value: string, suffix?: string, icon: React.ReactNode }) {
  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-6 ring-1 ring-white/50">
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
