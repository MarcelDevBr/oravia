import Stepper from "@/components/Stepper";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-400/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        <header className="py-6 px-10 flex justify-between items-center bg-white/30 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ORAVIA</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
             <a href="#" className="hover:text-blue-600 transition-colors">Produtos</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Metodologia</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Preços</a>
          </nav>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
             Acessar Oráculo
          </button>
        </header>

        <section className="pt-16 pb-12 text-center space-y-4">
           <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest animate-fade-in">Viabilidade Econômica 4.0</h2>
           <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
             A verdade matemática por trás do seu negócio.
           </h1>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto">
             Transformamos planilhas estáticas em diagnósticos financeiros inteligentes. 
             O Oráculo analisa o seu projeto em segundos.
           </p>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <Stepper />
        </section>
      </div>
    </main>
  );
}
