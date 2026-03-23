"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Dashboard from "./Dashboard";
import { runMultiScenario } from "@/lib/api";
import { saveSimulation } from "@/lib/history";

interface FinancialInputs {
  project_name: string;
  sector: string;
  initial_investment: number;
  tma: number;
  monthly_sales: number[];
  monthly_costs: number[];
}

export default function Stepper() {
  const t = useTranslations('Stepper');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [inputs, setInputs] = useState<FinancialInputs>({
    project_name: "",
    sector: "",
    initial_investment: 100000,
    tma: 0.12,
    monthly_sales: [30000, 40000, 50000, 60000],
    monthly_costs: [15000, 15000, 15000, 15000]
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSimulate = async () => {
    if (!inputs.project_name || !inputs.sector) {
      alert("Por favor, preencha o nome e setor do projeto.");
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      // Generate scenarios automatically
      const realisticSales = inputs.monthly_sales;
      const realisticCosts = inputs.monthly_costs;

      const multiInputs = {
        initial_investment: inputs.initial_investment,
        tma: inputs.tma,
        scenarios: {
          realistic: {
            monthly_sales: realisticSales,
            monthly_costs: realisticCosts
          },
          optimistic: {
            monthly_sales: realisticSales.map(s => s * 1.2),
            monthly_costs: realisticCosts.map(c => c * 0.9)
          },
          pessimistic: {
            monthly_sales: realisticSales.map(s => s * 0.8),
            monthly_costs: realisticCosts.map(c => c * 1.1)
          }
        }
      };

      const data = await runMultiScenario(multiInputs);
      setResults(data);
      
      // Save to history
      saveSimulation(inputs.project_name, inputs, data);
      
      setStep(5);
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Falha na simulação. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  if (step === 5) return <Dashboard results={results} inputs={inputs} onReset={() => setStep(1)} />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 px-6">
        <div className="flex justify-between mb-4">
           {[1,2,3,4].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                {s}
              </div>
           ))}
        </div>
        <Progress value={(step / 4) * 100} className="h-1.5 bg-slate-100" />
      </div>

      <AnimatePresence mode="wait" custom={step}>
        <motion.div
          key={step}
          custom={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {step === 1 && (
            <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50 p-6 md:p-10 rounded-3xl">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{t('step1_title')}</CardTitle>
                <CardDescription className="text-base text-slate-500">{t('step1_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Project Name</Label>
                  <Input 
                    id="name" 
                    className="h-14 text-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-2xl bg-white/50"
                    placeholder="Ex: Oravia Fintech" 
                    value={inputs.project_name} 
                    onChange={(e) => setInputs({...inputs, project_name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="sector" className="text-xs font-bold uppercase tracking-widest text-slate-400">Sector / Industry</Label>
                  <Input 
                    id="sector" 
                    className="h-14 text-lg border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-2xl bg-white/50"
                    placeholder="Ex: SaaS, Retail..." 
                    value={inputs.sector}
                    onChange={(e) => setInputs({...inputs, sector: e.target.value})}
                  />
                </div>
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20" onClick={nextStep} disabled={!inputs.project_name}>{t('next')}</Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50 p-6 md:p-10 rounded-3xl">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{t('step2_title')}</CardTitle>
                <CardDescription className="text-base text-slate-500">{t('step2_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Initial Investment</Label>
                    <span className="font-black text-blue-600 text-4xl tracking-tighter">R$ {(inputs.initial_investment as any).toLocaleString()}</span>
                  </div>
                  <Slider 
                    min={1000} 
                    max={1000000} 
                    step={5000} 
                    value={[inputs.initial_investment]}
                    onValueChange={(val: any) => setInputs({...inputs, initial_investment: Array.isArray(val) ? val[0] : val})}
                    className="py-4"
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-14 font-bold text-slate-400 hover:text-slate-900" onClick={prevStep}>{t('back')}</Button>
                  <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20" onClick={nextStep}>{t('next')}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50 p-6 md:p-10 rounded-3xl">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{t('step3_title')}</CardTitle>
                <CardDescription className="text-base text-slate-500">{t('step3_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Monthly Revenue Average</Label>
                  <Input type="number" className="h-14 text-lg border-slate-200 rounded-2xl bg-white/50" value={inputs.monthly_sales[0] as number} onChange={(e) => {
                     const val = parseFloat(e.target.value);
                     setInputs({...inputs, monthly_sales: [val, val*1.1, val*1.2, val*1.3]})
                  }} />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Monthly Operational Costs</Label>
                  <Input type="number" className="h-14 text-lg border-slate-200 rounded-2xl bg-white/50" value={(inputs.monthly_costs as any)[0]} onChange={(e) => {
                     const val = parseFloat(e.target.value);
                     setInputs({...inputs, monthly_costs: [val, val, val, val]})
                  }} />
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-14 font-bold text-slate-400 hover:text-slate-900" onClick={prevStep}>{t('back')}</Button>
                  <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20" onClick={nextStep}>{t('next')}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50 p-6 md:p-10 rounded-3xl text-center">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{t('step4_title')}</CardTitle>
                <CardDescription className="text-base text-slate-500">{t('step4_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-10 pt-10">
                <div className="relative h-32 w-32 mx-auto">
                  {loading ? (
                    <>
                      <motion.div 
                        className="absolute inset-0 border-4 border-blue-600/20 rounded-full"
                      />
                      <motion.div 
                        className="absolute inset-0 border-4 border-t-blue-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </>
                  ) : (
                    <div className="text-8xl drop-shadow-2xl">🔮</div>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-14 font-bold text-slate-400 hover:text-slate-900" onClick={prevStep} disabled={loading}>{t('back')}</Button>
                  <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20" onClick={handleSimulate} disabled={loading}>
                    {loading ? t('simulating') : t('simulate')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
