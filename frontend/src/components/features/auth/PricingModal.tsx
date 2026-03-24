"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const plans = [
    {
      name: "Standard",
      price: "Grátis",
      description: "Para pequenas validações iniciais.",
      features: ["Até 3 simulações locais", "Simulação de Fluxo de Caixa", "Dashboard Básico", "Custo Zero"],
      button: "Plano Atual",
      current: true,
      icon: <Zap size={24} className="text-slate-400" />
    },
    {
      name: "ORAVIA PRO",
      price: "R$ 97/mês",
      description: "O Oráculo completo para consultores.",
      features: ["Simulações em Nuvem ilimitadas", "Exportação de Relatórios PDF/Excel", "Comparativo Multicritério", "Suporte Prioritário", "Monte Carlo Avançado"],
      button: "Fazer Upgrade",
      premium: true,
      current: false,
      icon: <Crown size={24} className="text-blue-500" />
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-white rounded-[3rem] overflow-hidden">
          <CardHeader className="pt-12 pb-8 text-center bg-slate-50/50">
             <div className="flex justify-center mb-4">
                <div className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <Sparkles size={12} /> Desbloqueie o Oráculo
                </div>
             </div>
             <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">Evolua para o Próximo Nível</CardTitle>
             <CardDescription className="text-lg text-slate-500 font-medium px-20">
                Acesse ferramentas avançadas de análise financeira e tome decisões baseadas em dados profissionais.
             </CardDescription>
          </CardHeader>
          <CardContent className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {plans.map((plan) => (
                 <div 
                   key={plan.name} 
                   className={`relative p-8 rounded-[2.5rem] border-2 transition-all ${plan.premium ? 'border-blue-600 bg-blue-50/20 shadow-xl shadow-blue-600/5' : 'border-slate-100 bg-slate-50/30'}`}
                 >
                    {plan.premium && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">
                         Recomendado
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                       <div className={`p-4 rounded-2xl ${plan.premium ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white shadow-sm text-slate-400'}`}>
                          {plan.icon}
                       </div>
                       <div className="text-right">
                          <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">por usuário/mês</p>
                       </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-8">{plan.description}</p>
                    
                    <ul className="space-y-4 mb-10">
                       {plan.features.map(f => (
                         <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.premium ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                               <Check size={12} />
                            </div>
                            {f}
                         </li>
                       ))}
                    </ul>

                    <Button 
                      onClick={plan.premium ? () => window.open('https://checkout.stripe.com', '_blank') : undefined}
                      className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${plan.premium ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20' : 'bg-white border-2 border-slate-200 text-slate-400 cursor-default'}`}
                    >
                      {plan.button}
                    </Button>
                 </div>
               ))}
            </div>
            
            <div className="mt-12 text-center">
               <button 
                 onClick={onClose}
                 className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
               >
                 Agora não, prefiro continuar com o básico
               </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
