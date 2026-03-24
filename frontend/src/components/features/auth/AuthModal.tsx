"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, User, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-6 text-center space-y-2 relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={80} />
             </div>
             <div className="w-16 h-16 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-600/30 mb-4 rotate-3">
                <ShieldCheck size={32} className="text-white" />
             </div>
             <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
                {isLogin ? "Bem-vindo de volta" : "Criar sua conta Pro"}
             </CardTitle>
             <CardDescription className="text-slate-500 font-medium px-10">
                {isLogin ? "Acesse seus projetos e relatórios financeiros" : "Comece a projetar sua viabilidade econômica hoje"}
             </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleAuth} className="space-y-4">
               <div className="space-y-2">
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="password" 
                      placeholder="Sua senha secreta" 
                      className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
               </div>

               {error && (
                 <motion.p 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-rose-500 text-xs font-bold text-center bg-rose-50 py-3 rounded-xl"
                 >
                   ⚠️ {error}
                 </motion.p>
               )}

               <Button 
                 type="submit" 
                 disabled={loading}
                 className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95"
               >
                 {loading ? "Processando..." : (isLogin ? "Acessar Oráculo" : "Criar Conta Pro")}
               </Button>
            </form>

            <div className="mt-8 text-center">
               <button 
                 onClick={() => setIsLogin(!isLogin)}
                 className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-70 transition-opacity"
               >
                 {isLogin ? "Não tem conta? Cadastrar-se" : "Já possui conta? Entrar"}
               </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
