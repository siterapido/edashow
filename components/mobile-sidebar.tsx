"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainLinks = [
  { label: "Página Inicial", href: "/" },
  { label: "Notícias", href: "/noticias" },
  { label: "Eventos", href: "/events" },
  { label: "Patrocinadores", href: "/patrocinadores" },
  { label: "Análises", href: "/analises" },
  { label: "Entrevistas", href: "/entrevistas" },
  { label: "Opinião", href: "/opiniao" },
  { label: "Colunistas", href: "/columnists" },
];

const secondaryLinks = [
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Anuncie", href: "/anuncie" },
  { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos", href: "/termos" },
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-[101] w-[85%] max-w-xs bg-white md:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Logo imageClassName="h-8" />
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-4 bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="O que você está procurando?"
                    className="w-full h-10 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Main Links */}
              <nav className="flex-1 p-4 space-y-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 text-base font-semibold text-gray-900 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </nav>

              {/* Secondary Links */}
              <div className="p-4 bg-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
                  Informações
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className="p-2 text-xs font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Profile/Footer */}
              <div className="p-6 border-t mt-auto">
                <p className="mt-4 text-[10px] text-center text-gray-400 font-medium">
                  © {new Date().getFullYear()} EDA SHOW. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



