"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  LayoutGrid, 
  BadgeDollarSign, 
  Receipt, 
  Calculator, 
  FileBarChart, 
  History, 
  ChevronRight,
  Sparkles,
  LogOut,
  Play
} from "lucide-react";

import ProOverview from "./pro/ProOverview";
import ProSales from "./pro/ProSales";
import ProOPEX from "./pro/ProOPEX";
import ProCAPEX from "./pro/ProCAPEX";
import ProReports from "./pro/ProReports";
import { getHistory, SimulationHistoryItem } from "@/lib/history";

interface DashboardProps {
  results: any;
  inputs: any;
  onReset: () => void;
}

type Tab = "overview" | "sales" | "opex" | "capex" | "reports" | "history";

export default function Dashboard({ results, inputs, onReset }: DashboardProps) {
  const t = useTranslations('Dashboard');
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [history, setHistory] = useState<SimulationHistoryItem[]>([]);
  
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const menuItems = [
    { id: "overview", label: t('menu_dashboard'), icon: <LayoutGrid size={20} /> },
    { id: "sales", label: t('menu_sales'), icon: <BadgeDollarSign size={20} /> },
    { id: "opex", label: t('menu_opex'), icon: <Receipt size={20} /> },
    { id: "capex", label: t('menu_capex'), icon: <Calculator size={20} /> },
    { id: "reports", label: t('menu_reports'), icon: <FileBarChart size={20} /> },
    { id: "history", label: t('menu_history'), icon: <History size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 flex flex-col p-6 relative group transition-all duration-500">
        <div className="flex items-center gap-3 mb-12">
           <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles className="text-white w-6 h-6" />
           </div>
           <span className="text-xl font-black text-white tracking-tighter italic">ORAVIA <span className="text-blue-500 not-italic">PRO</span></span>
        </div>

        <nav className="flex-1 space-y-2">
           {menuItems.map((item) => (
              <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as Tab)}
                 className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                 <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 group-active:scale-95'} transition-transform`}>
                    {item.icon}
                 </span>
                 <span className="text-sm font-bold tracking-tight">{item.label}</span>
                 {activeTab === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
              </button>
           ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
           <button 
              onClick={onReset}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-rose-400 font-bold hover:bg-rose-500/10 transition-colors"
           >
              <LogOut size={20} />
              <span className="text-sm">Nova Simulação</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
         {/* Top Header */}
         <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projeto Ativo</span>
               <h2 className="text-xl font-black text-slate-900 tracking-tight">{inputs.project_name} • <span className="text-blue-600">{inputs.sector}</span></h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Conectado ao Motor
               </div>
               <button className="h-10 px-6 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <Play size={14} className="fill-white" />
                  Recalcular Oracle
               </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
               >
                  {activeTab === "overview" && <ProOverview results={results} inputs={inputs} />}
                  {activeTab === "sales" && <ProSales />}
                  {activeTab === "opex" && <ProOPEX />}
                  {activeTab === "capex" && <ProCAPEX />}
                  {activeTab === "reports" && <ProReports />}
                  {activeTab === "history" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {history.map(item => (
                          <div key={item.id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/20 hover:border-blue-500 transition-all cursor-pointer group">
                             <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50">
                                   <History size={20} className="text-slate-400 group-hover:text-blue-500" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                             </div>
                             <h4 className="font-black text-lg text-slate-900 tracking-tight">{item.project_name}</h4>
                             <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.inputs.sector}</p>
                             <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">VPL</span>
                                <span className={`font-black ${(item.results.scenarios?.realistic.vpl || item.results.vpl) > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                   R$ {(item.results.scenarios?.realistic.vpl || item.results.vpl).toLocaleString()}
                                </span>
                             </div>
                          </div>
                       ))}
                    </div>
                  )}
               </motion.div>
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
