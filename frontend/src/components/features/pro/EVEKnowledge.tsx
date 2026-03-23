"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Target, ShieldCheck, BarChart3, HelpCircle } from "lucide-react";

export default function EVEKnowledge() {
  const t = useTranslations('Dashboard');

  const pillars = [
    { title: t('pillar_costs_title'), desc: "Investimento inicial, custos fixos e variáveis.", icon: <BarChart3 className="text-blue-500" /> },
    { title: t('pillar_revenue_title'), desc: "Volume de vendas, demanda e sazonalidade.", icon: <Target className="text-emerald-500" /> },
    { title: t('pillar_indicators_title'), desc: "VPL, TIR, Payback e Ponto de Equilíbrio.", icon: <BarChart3 className="text-orange-500" /> },
  ];

  const types = [
    { type: t('tab_economic'), question: t('ques_economic') },
    { type: t('tab_financial'), question: t('ques_financial') },
    { type: t('tab_technical'), question: t('ques_technical') },
    { type: t('tab_commercial'), question: t('ques_commercial') },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <section className="space-y-4">
         <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('eve_title')}</h2>
         <p className="text-xl text-slate-500 leading-relaxed font-medium">
            {t('eve_subtitle')}
         </p>
         <div className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl text-blue-900 font-medium italic">
            "{t('eve_definition')}"
         </div>
      </section>

      <section className="space-y-6">
         <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen size={24} className="text-blue-600" /> Os Pilares do EVE
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
               <Card key={i} className="border-none shadow-xl bg-white rounded-3xl p-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                     {p.icon}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{p.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
               </Card>
            ))}
         </div>
      </section>

      <section className="space-y-6">
         <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <HelpCircle size={24} className="text-blue-600" /> Por que fazer um EVE?
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-600 text-white rounded-lg font-black text-xs">{i}</div>
                  <p className="text-sm font-bold text-slate-700">{(t as any)(`why_eve_${i}`)}</p>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-6">
         <h3 className="text-2xl font-black text-slate-900">Matriz de Viabilidade</h3>
         <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-900 text-white">
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest">Tipo de Viabilidade</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest">O que responde?</th>
                  </tr>
               </thead>
               <tbody>
                  {types.map((row, i) => (
                     <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-5 font-black text-slate-800 uppercase tracking-widest text-[10px]">{row.type}</td>
                        <td className="p-5 text-sm font-bold text-slate-600">{row.question}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}
