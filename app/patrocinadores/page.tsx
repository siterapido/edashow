import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { SponsorsGrid } from "@/components/sponsors-grid";
import { Award, ShieldCheck, Zap } from "lucide-react";

import { getSponsors } from "@/lib/payload/api";

export const metadata: Metadata = {
  title: "Patrocinadores | EDA Show",
  description: "Conheça as empresas que apoiam o EDA Show, o maior comunicador da saúde suplementar.",
};

export default async function PatrocinadoresPage() {
  const sponsors = await getSponsors();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section mais chamativo */}
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-32">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Elite da Saúde Suplementar</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Empresas que <span className="text-primary">Impulsionam</span> o Setor
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              O EDA Show conecta marcas, corretores e soluções através de uma comunicação estratégica e humana. Conheça nossos parceiros de excelência.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-20">
        {/* Destaques Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Visibilidade Nacional</h3>
              <p className="text-sm text-slate-500">Alcance em todos os estados do Brasil através do nosso portal e redes.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Autoridade no Setor</h3>
              <p className="text-sm text-slate-500">Sua marca posicionada ao lado do maior comunicador da área.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Credibilidade Única</h3>
              <p className="text-sm text-slate-500">Parcerias estratégicas que geram resultados reais e mensuráveis.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Nossos Patrocinadores</h2>
            <div className="h-px flex-1 bg-slate-200 ml-8 hidden md:block" />
          </div>
          
          <SponsorsGrid sponsors={sponsors} />
        </div>

        <div className="mt-24 text-center">
          <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Quer ver sua marca aqui?</h3>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Junte-se à maior plataforma de comunicação do setor de saúde suplementar e conecte-se com milhares de profissionais diariamente.
            </p>
            <a 
              href="/anuncie" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              Seja um Patrocinador
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}



