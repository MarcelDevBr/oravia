"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSharedProject } from "@/lib/supabaseHistory";
import { SimulationHistoryItem } from "@/lib/history";
import ProOverview from "@/components/features/pro/ProOverview";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SharedProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<SimulationHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getSharedProject(id as string).then(data => {
        setProject(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando Oráculo...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Projeto não encontrado ou privado.</h1>
        <p className="text-slate-500 mb-8 max-w-md">O link que você acessou pode ter expirado ou o proprietário alterou a visibilidade para privado.</p>
        <Link href="/">
          <button className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20">
            Voltar para o Início
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header for Public View */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter italic">ORAVIA <span className="text-blue-500 not-italic">PRO</span></span>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <span className="text-sm font-bold text-slate-500">{project.project_name}</span>
        </div>
        <Link href="/">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-xs hover:scale-105 transition-all">
              Crie Seu Projeto <ArrowRight size={14} />
           </button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-10 pt-12">
        <div className="mb-12">
           <div className="flex items-center gap-2 text-blue-600 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visão Compartilhada</span>
           </div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tight">{project.project_name}</h1>
           <p className="text-lg text-slate-500 font-medium mt-2">{project.inputs.sector} • Analisado via Oravia Oracle</p>
        </div>

        <ProOverview results={project.results} inputs={project.inputs} />

        <footer className="mt-20 pt-12 border-t border-slate-200 text-center">
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gerado em {new Date(project.timestamp).toLocaleDateString()} via Oravia Pro</p>
        </footer>
      </main>
    </div>
  );
}
