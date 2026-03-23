import {useTranslations} from 'next-intl';
import Stepper from "@/components/features/Stepper";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-400/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        <header className="py-6 px-10 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">O</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ORAVIA</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
             <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-[10px]">Products</a>
             <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-[10px]">Methodology</a>
             <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-[10px]">Pricing</a>
          </nav>
          <div className="flex items-center gap-6">
            <LocaleSwitcher />
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
               {t('cta')}
            </button>
          </div>
        </header>

        <section className="pt-24 pb-12 text-center space-y-6 px-4">
           <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] animate-fade-in">{t('subtitle')}</h2>
           <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter max-w-5xl mx-auto leading-[0.9] drop-shadow-sm">
             {t('title')}
           </h1>
           <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
             {t('description')}
           </p>
        </section>

        <section className="container mx-auto px-4 pb-32">
          <Stepper />
        </section>
      </div>
    </main>
  );
}
