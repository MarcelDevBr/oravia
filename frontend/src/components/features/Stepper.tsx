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
import { 
  Rocket, 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Globe,
  Briefcase,
  Zap
} from "lucide-react";
import Dashboard from "./Dashboard";
import { runMultiScenario } from "@/lib/api";
import { saveSimulation, getHistory, SimulationHistoryItem } from "@/lib/history";

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
        project_name: inputs.project_name,
        sector: inputs.sector,
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

  const handleSelectProject = (project: SimulationHistoryItem) => {
    setInputs(project.inputs);
    setResults(project.results);
    setStep(5);
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

  if (step === 5) return (
    <Dashboard 
      results={results} 
      inputs={inputs} 
      onReset={() => setStep(1)} 
      onSelectProject={handleSelectProject}
    />
  );

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-4xl mx-auto px-6 py-12">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Oravia<span className="text-blue-600">Pro</span></h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Configuração do EVE</p>
           </div>
           <div className="flex gap-2">
              {[1,2,3,4].map((s) => (
                 <motion.div 
                    key={s} 
                    animate={{ 
                       scale: step === s ? 1.1 : 1,
                       backgroundColor: step >= s ? "#2563eb" : "#e2e8f0"
                    }}
                    className={`w-10 h-1.5 rounded-full transition-colors`} 
                 />
              ))}
           </div>
        </div>
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
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-2xl ring-1 ring-white/50 p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Rocket size={120} />
              </div>
              <CardHeader className="px-0 pt-0 relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/30 text-white">
                   <Rocket size={32} />
                </div>
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('step1_title')}</CardTitle>
                <CardDescription className="text-lg text-slate-500 font-medium mt-2">{t('step1_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-10 mt-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Briefcase size={14} /> {t('project_name_label')}
                    </Label>
                    <Input 
                      id="name" 
                      className="h-16 text-xl border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 rounded-2xl bg-white/50 font-bold tracking-tight"
                      placeholder="Ex: Oravia Fintech" 
                      value={inputs.project_name} 
                      onChange={(e) => setInputs({...inputs, project_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="sector" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Globe size={14} /> {t('sector_label')}
                    </Label>
                    <Input 
                      id="sector" 
                      className="h-16 text-xl border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 rounded-2xl bg-white/50 font-bold tracking-tight"
                      placeholder="Ex: SaaS, Varejo..." 
                      value={inputs.sector}
                      onChange={(e) => setInputs({...inputs, sector: e.target.value})}
                    />
                  </div>
                </div>
                <Button className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-xl font-black rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={nextStep} disabled={!inputs.project_name}>
                  {t('next')} <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-2xl ring-1 ring-white/50 p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Coins size={120} />
              </div>
              <CardHeader className="px-0 pt-0 relative z-10">
                <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-600/30 text-white">
                   <Coins size={32} />
                </div>
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('step2_title')}</CardTitle>
                <CardDescription className="text-lg text-slate-500 font-medium mt-2">{t('step2_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-12 mt-8 relative z-10">
                <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('investment_label')}</Label>
                    <span className="font-black text-emerald-600 text-5xl tracking-tighter">R$ {(inputs.initial_investment as any).toLocaleString()}</span>
                  </div>
                  <Slider 
                    min={1000} 
                    max={1000000} 
                    step={5000} 
                    value={[inputs.initial_investment]}
                    onValueChange={(val: any) => setInputs({...inputs, initial_investment: Array.isArray(val) ? val[0] : val})}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>R$ 1k</span>
                     <span>R$ 1M+</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-16 font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs" onClick={prevStep}>
                    <ArrowLeft className="mr-2" size={16} /> {t('back')}
                  </Button>
                  <Button className="flex-[2] h-16 bg-blue-600 hover:bg-blue-500 text-xl font-black rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02]" onClick={nextStep}>
                    {t('next')} <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-2xl ring-1 ring-white/50 p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <TrendingUp size={120} />
              </div>
              <CardHeader className="px-0 pt-0 relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/30 text-white">
                   <TrendingUp size={32} />
                </div>
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('step3_title')}</CardTitle>
                <CardDescription className="text-lg text-slate-500 font-medium mt-2">{t('step3_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-10 mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Zap size={14} className="text-blue-500" /> {t('revenue_label')}
                    </Label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                       <Input type="number" className="h-16 pl-12 text-xl border-slate-200 rounded-2xl bg-white/50 font-black" value={inputs.monthly_sales[0] as number} onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setInputs({...inputs, monthly_sales: [val, val*1.1, val*1.2, val*1.3]})
                       }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <TrendingDown size={14} className="text-rose-500" /> {t('costs_label')}
                    </Label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                       <Input type="number" className="h-16 pl-12 text-xl border-slate-200 rounded-2xl bg-white/50 font-black" value={(inputs.monthly_costs as any)[0]} onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setInputs({...inputs, monthly_costs: [val, val, val, val]})
                       }} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-16 font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs" onClick={prevStep}>
                    <ArrowLeft className="mr-2" size={16} /> {t('back')}
                  </Button>
                  <Button className="flex-[2] h-16 bg-blue-600 hover:bg-blue-500 text-xl font-black rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02]" onClick={nextStep}>
                    {t('next')} <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-2xl ring-1 ring-white/50 p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Sparkles size={120} />
              </div>
              <CardHeader className="px-0 pt-0 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40 text-white relative">
                   {loading ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-white border-white/20 rounded-[2.5rem]"
                      />
                   ) : null}
                   <Sparkles size={40} className={loading ? "animate-pulse" : ""} />
                </div>
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('step4_title')}</CardTitle>
                <CardDescription className="text-lg text-slate-500 font-medium mt-2">{t('step4_description')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-10 mt-8 relative z-10">
                <div className="py-12 flex flex-col items-center">
                  {!loading && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-9xl drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] mb-4"
                    >
                      🔮
                    </motion.div>
                  )}
                  {loading && (
                    <div className="space-y-4 w-full max-w-xs mx-auto">
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ x: "-100%" }}
                             animate={{ x: "0%" }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="h-full w-full bg-blue-600"
                          />
                       </div>
                       <p className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">Processando Inteligência Financeira...</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1 h-16 font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs" onClick={prevStep} disabled={loading}>
                    <ArrowLeft className="mr-2" size={16} /> {t('back')}
                  </Button>
                  <Button className="flex-[2] h-16 bg-blue-600 hover:bg-blue-500 text-xl font-black rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.02]" onClick={handleSimulate} disabled={loading}>
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
