"use client";

import { Instagram, Linkedin, Youtube, Mail, MapPin, Shield, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";

export function Footer() {
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [copyright, setCopyright] = useState<string>(`© ${new Date().getFullYear()} EDA Show. Todos os direitos reservados.`);

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [footerRes, settingsRes] = await Promise.all([
          fetch('/api/globals/footer'),
          fetch('/api/globals/site-settings')
        ]);

        if (footerRes.ok) {
          const footerData = await footerRes.json();
          if (footerData.links) setFooterLinks(footerData.links);
          if (footerData.copyright) {
            setCopyright(footerData.copyright.replace('{{year}}', new Date().getFullYear().toString()));
          }
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSiteSettings(settingsData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do footer:', error);
      }
    }

    loadFooterData();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">

          {/* Brand & About */}
          <div className="space-y-4 md:space-y-6">
            <Logo imageClassName="h-10 md:h-12 w-auto drop-shadow-none" variant="dark" />
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              O EDA.Show existe para dar visibilidade, credibilidade e autoridade a empresas e profissionais do mercado de saúde suplementar, conectando marcas, corretores e soluções de forma clara, estratégica e humana, em todo o Brasil.
            </p>
            <div className="flex gap-3 md:gap-4">
              {siteSettings?.socialMedia?.instagram && (
                <a href={siteSettings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.socialMedia?.youtube && (
                <a href={siteSettings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.socialMedia?.linkedin && (
                <a href={siteSettings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.socialMedia?.facebook && (
                <a href={siteSettings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {!siteSettings?.socialMedia && (
                <>
                  <a href="https://www.instagram.com/edsonedashow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.youtube.com/@edsonedashow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]">
                    <Youtube className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Institucional</h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.length > 0 ? (
                footerLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.url} className="text-sm md:text-base hover:text-primary transition-colors block py-1">
                      {link.label}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="/sobre" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Sobre o EDA Show</a></li>
                  <li><a href="/patrocinadores" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Patrocinadores</a></li>
                  <li><a href="/anuncie" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Anuncie Conosco</a></li>
                  <li><a href="/media-kit" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Media Kit</a></li>
                  <li><a href="/privacidade" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Política de Privacidade</a></li>
                  <li><a href="/termos" className="text-sm md:text-base hover:text-primary transition-colors block py-1">Termos de Uso</a></li>
                </>
              )}
              <li>
                <a href="/login" className="text-sm md:text-base hover:text-primary transition-colors flex items-center gap-2 py-1">
                  <Shield className="w-4 h-4" />
                  Área Administrativa
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-white font-bold text-base md:text-lg">Newsletter</h4>
            <p className="text-sm text-slate-400">Receba nossa curadoria diária de notícias.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Seu e-mail corporativo"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary flex-1 min-h-[44px]"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white min-h-[44px] whitespace-nowrap">
                Assinar
              </Button>
            </div>

            <div className="pt-4 md:pt-6 border-t border-slate-800 space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${siteSettings?.contact?.email || 'adm.edashow@gmail.com'}`} className="break-all hover:text-primary transition-colors">
                  {siteSettings?.contact?.email || 'adm.edashow@gmail.com'}
                </a>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{siteSettings?.contact?.address || 'Atuação Nacional - Brasil'}</span>
              </div>
              {siteSettings?.contact?.phone && (
                <div className="flex items-center gap-2 md:gap-3 text-sm">
                  <span className="w-4 h-4 text-primary shrink-0 font-bold">T</span>
                  <span>{siteSettings.contact.phone}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="pt-6 md:pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo imageClassName="h-8 w-auto drop-shadow-none" variant="dark" />
            <p className="text-xs md:text-sm text-slate-500">
              {copyright}
            </p>
          </div>
          <p className="text-xs md:text-sm text-slate-600">
            Desenvolvido com tecnologia de ponta.
          </p>
        </div>
      </div>
    </footer>
  );
}
