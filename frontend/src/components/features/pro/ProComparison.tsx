"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SimulationHistoryItem } from "@/lib/history";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from "recharts";
import { Scale, Info } from "lucide-react";

interface ProComparisonProps {
  history: SimulationHistoryItem[];
}

export default function ProComparison({ history }: ProComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleProject = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedProjects = history.filter(p => selectedIds.includes(p.id));

  // Prepare chart data for VPL
  const vplData = selectedProjects.map(p => ({
    name: p.project_name,
    VPL: p.results.realistic.vpl
  }));

  // Prepare chart data for Cash Flow
  // We assume all have the same number of months (12 by default from backend)
  const cashFlowData = Array.from({ length: 12 }).map((_, i) => {
    const dataPoint: any = { month: i + 1 };
    selectedProjects.forEach(p => {
      dataPoint[p.project_name] = p.results.realistic.cash_flow[i];
    });
    return dataPoint;
  });

  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Comparador Pro</h2>
          <p className="text-slate-500 font-medium">Selecione projetos para análise sobreposta</p>
        </div>
        <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-600">
          <Scale size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Project Selector */}
        <Card className="lg:col-span-1 border-none shadow-xl bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-black/5 h-fit">
          <CardHeader className="bg-slate-900 text-white py-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Seleção de Projetos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">Nenhum projeto salvo no histórico.</p>
            ) : (
              history.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => toggleProject(project.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedIds.includes(project.id) ? 'bg-blue-600/10 ring-1 ring-blue-600/20' : 'hover:bg-slate-100'}`}
                >
                  <Checkbox checked={selectedIds.includes(project.id)} />
                  <span className="text-sm font-bold text-slate-700 truncate">{project.project_name}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Comparison Dashboard */}
        <div className="lg:col-span-3 space-y-8">
          {selectedProjects.length < 2 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center">
               <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <Scale size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-400">Selecione ao menos 2 projetos</h3>
               <p className="text-slate-400 text-sm mt-2">Compare indicadores de viabilidade lado a lado</p>
            </div>
          ) : (
            <>
              {/* Summary Table */}
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Projeto</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">VPL</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">TIR</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Payback</th>
                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedProjects.map((p, idx) => (
                        <tr key={p.id}>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                              <span className="font-bold text-slate-900">{p.project_name}</span>
                            </div>
                          </td>
                          <td className="py-4 font-black">R$ {p.results.realistic.vpl.toLocaleString()}</td>
                          <td className="py-4 font-bold text-blue-600">{(p.results.realistic.tir * 100).toFixed(1)}%</td>
                          <td className="py-4 text-slate-500 font-medium">{p.results.realistic.payback_period} meses</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.results.realistic.vpl > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {p.results.realistic.vpl > 0 ? 'Viável' : 'Inviável'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* VPL Chart */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl rounded-[2rem] p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">VPL Comparado</CardTitle>
                  </CardHeader>
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vplData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Bar dataKey="VPL" radius={[8, 8, 0, 0]}>
                           {vplData.map((entry, index) => (
                              <Bar key={`cell-${index}`} fill={colors[index % colors.length]} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Cash Flow Overlap */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl rounded-[2rem] p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Fluxo de Caixa Mensal</CardTitle>
                  </CardHeader>
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend />
                        {selectedProjects.map((p, idx) => (
                          <Line 
                            key={p.id} 
                            type="monotone" 
                            dataKey={p.project_name} 
                            stroke={colors[idx % colors.length]} 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: colors[idx % colors.length] }}
                            activeDot={{ r: 6 }} 
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
