"use client";

import { motion } from "framer-motion";
import { Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export function EdaBioSection() {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Buscar configurações do site
  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const response = await fetch('/api/globals/site-settings');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do site:', error);
      }
    }

    loadSiteSettings();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 md:py-16 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            {/* Profile Photo */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src="/images/eda-redacao.png"
                  alt="Eda Águia"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 192px"
                  priority
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Name */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-5">
                <span className="text-white">Eda</span>
                <span className="text-primary ml-2">Águia</span>
              </h2>

              {/* Bio */}
              <div className="space-y-3 sm:space-y-3.5 text-sm sm:text-base lg:text-base">
                <p className="text-slate-300 leading-relaxed">
                  Comunicador, <span className="text-primary font-semibold">palestrante</span> e criador de projetos que conectam o mercado de planos de saúde em todo o Brasil
                </p>

                <p className="text-slate-400 leading-relaxed">
                  Criador do <span className="text-white font-medium">Jogo das Águias</span>, <span className="text-white font-medium">EDA pelo Brasil</span> e do método <span className="text-primary font-semibold">Comunicação & Oratória – Corretor Faixa Preta</span>
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
                <a
                  href={siteSettings?.socialMedia?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110"
                  title="Siga no Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>

                <a
                  href={siteSettings?.socialMedia?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/50 flex items-center justify-center transition-all hover:scale-110"
                  title="Inscreva-se no YouTube"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
