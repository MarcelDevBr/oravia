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
  Play,
  BookOpen,
  TrendingUp,
  Crown,
  User as UserIcon,
  Zap,
  Globe,
  Share2,
  Trash2
} from "lucide-react";

import ProOverview from "./pro/ProOverview";
import ProSales from "./pro/ProSales";
import ProOPEX from "./pro/ProOPEX";
import ProCAPEX from "./pro/ProCAPEX";
import ProReports from "./pro/ProReports";
import EVEKnowledge from "./pro/EVEKnowledge";
import ProComparison from "./pro/ProComparison";
import { getHistory, SimulationHistoryItem, deleteSimulation } from "@/lib/history";
import { supabase } from "@/lib/supabase";
import AuthModal from "./auth/AuthModal";
import PricingModal from "./auth/PricingModal";
import { togglePublic } from "@/lib/supabaseHistory";

interface DashboardProps {
  results: any;
  inputs: any;
  onReset: () => void;
  onSelectProject?: (project: SimulationHistoryItem) => void;
}

export type Tab = "overview" | "sales" | "opex" | "capex" | "reports" | "history" | "eve" | "comparison";

export default function Dashboard({ results, inputs, onReset, onSelectProject }: DashboardProps) {
  const t = useTranslations('Dashboard');
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [history, setHistory] = useState<SimulationHistoryItem[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  
  const refreshHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useEffect(() => {
    refreshHistory();

    // Check for session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsPro(currentUser?.user_metadata?.role === 'pro' || !!currentUser); // Mock: all logged in are Pro for now
      refreshHistory();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsPro(currentUser?.user_metadata?.role === 'pro' || !!currentUser);
      refreshHistory();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTogglePublic = async () => {
    if (!isPro) {
      setPricingModalOpen(true);
      return;
    }
    const newStatus = !inputs.is_public;
    await togglePublic(inputs.id, newStatus);
    // Refresh the current project inputs locally
    onSelectProject?.({ ...inputs, is_public: newStatus });
    alert(newStatus ? "Projeto agora é público! Link copiado." : "Projeto agora é privado.");
    if (newStatus) {
      navigator.clipboard.writeText(`${window.location.origin}/share/${inputs.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteSimulation(id);
    await refreshHistory();
  };

  const menuItems = [
    { id: "overview", label: t('menu_dashboard'), icon: <LayoutGrid size={20} /> },
    { id: "sales", label: t('menu_sales'), icon: <BadgeDollarSign size={20} /> },
    { id: "opex", label: t('menu_opex'), icon: <Receipt size={20} /> },
    { id: "capex", label: t('menu_capex'), icon: <Calculator size={20} /> },
    { id: "reports", label: t('menu_reports'), icon: <FileBarChart size={20} /> },
    { id: "comparison", label: "Comparativo", icon: <TrendingUp size={20} /> },
    { id: "eve", label: "Conceitos EVE", icon: <BookOpen size={20} /> },
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

        <div className="mt-8 px-2 space-y-6">
            <div className="mb-6">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Usuário</p>
               {user ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 group relative">
                     <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-black text-xs text-white">
                        {user.email?.[0].toUpperCase()}
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">{user.email}</span>
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                           <Crown size={8} /> {isPro ? "Pro Member" : "Standard User"}
                        </span>
                     </div>
                     {!isPro && (
                        <button 
                           onClick={() => setPricingModalOpen(true)}
                           className="ml-auto p-2 text-blue-500 hover:scale-110 transition-transform"
                           title="Fazer Upgrade"
                        >
                           <Zap size={14} />
                        </button>
                     )}
                     <button 
                        onClick={() => supabase.auth.signOut()}
                        className="p-2 text-slate-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Sair"
                     >
                        <LogOut size={14} />
                     </button>
                  </div>
               ) : (
                  <button 
                     onClick={() => setAuthModalOpen(true)}
                     className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all group"
                  >
                     <UserIcon size={18} className="group-hover:scale-110 transition-transform" />
                     <span className="text-xs font-black uppercase tracking-widest">Entrar / Cadastrar</span>
                  </button>
               )}
            </div>

            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Meus Projetos</p>
               <div className="space-y-1 max-h-[25vh] overflow-y-auto custom-scrollbar">
                  {history.map((project) => (
                     <div 
                        key={project.id}
                        onClick={() => onSelectProject?.(project)}
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${inputs.id === project.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'}`}
                     >
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${inputs.id === project.id ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`} />
                           <span className="text-xs font-bold truncate">{project.project_name}</span>
                           {project.version > 1 && (
                              <span className="text-[8px] font-black bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded-md shrink-0 uppercase">v{project.version}</span>
                           )}
                        </div>
                        <button 
                           onClick={(e) => handleDelete(e, project.id)}
                           className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                        >
                           <Trash2 size={12} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

        <div className="pt-6 border-t border-white/5 space-y-2 mt-auto">
           <div 
              onClick={() => setShowInfo(!showInfo)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border ${showInfo ? 'bg-blue-600/10 border-blue-600/30 text-blue-400' : 'text-slate-500 border-transparent hover:bg-white/5'}`}
           >
              <Sparkles size={18} className={showInfo ? 'animate-pulse' : ''} />
              <div className="flex flex-col">
                 <span className="text-xs font-bold leading-none">{t('mod_edu')}</span>
                 <span className="text-[10px] opacity-50 font-medium">Auto-ajuda</span>
              </div>
              <div className={`ml-auto w-8 h-4 rounded-full relative transition-colors ${showInfo ? 'bg-blue-600' : 'bg-slate-700'}`}>
                 <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${showInfo ? 'left-5' : 'left-1'}`} />
              </div>
           </div>
           
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
         <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projeto Ativo</span>
                  {inputs.version > 1 && (
                     <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md uppercase border border-blue-200">Versão {inputs.version}</span>
                  )}
               </div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">{inputs.project_name} • <span className="text-blue-600">{inputs.sector}</span></h2>
            </div>
            <div className="flex items-center gap-4">
               {user && (
                  <div className="flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
                     <button 
                        onClick={handleTogglePublic}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${inputs.is_public ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'}`}
                     >
                        {inputs.is_public ? <Globe size={14} /> : <Share2 size={14} />}
                        {inputs.is_public ? "Público" : "Compartilhar"}
                     </button>
                  </div>
               )}
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
                  {activeTab === "overview" && <ProOverview results={results} inputs={inputs} showInfo={showInfo} />}
                  {activeTab === "sales" && <ProSales showInfo={showInfo} />}
                  {activeTab === "opex" && <ProOPEX showInfo={showInfo} />}
                  {activeTab === "capex" && <ProCAPEX showInfo={showInfo} />}
                  {activeTab === "reports" && <ProReports results={results} inputs={inputs} showInfo={showInfo} isPro={isPro} onUpgrade={() => setPricingModalOpen(true)} />}
                  {activeTab === "comparison" && <ProComparison history={history} isPro={isPro} onUpgrade={() => setPricingModalOpen(true)} />}
                  {activeTab === "eve" && <EVEKnowledge />}
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

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <PricingModal 
        isOpen={pricingModalOpen} 
        onClose={() => setPricingModalOpen(false)} 
      />
    </div>
  );
}
