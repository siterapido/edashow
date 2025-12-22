"use client";

import { Search, Menu, Bell, ChevronDown, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { CategoryMegaMenu } from "@/components/category-mega-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadNavigation() {
      try {
        const [navRes, settingsRes] = await Promise.all([
          fetch('/api/globals/header'),
          fetch('/api/globals/site-settings')
        ]);

        let dynamicItems: any[] = [];

        if (navRes.ok) {
          const navData = await navRes.json();
          if (navData.navigation && navData.navigation.length > 0) {
            dynamicItems = navData.navigation.map((item: any) => ({
              label: item.label,
              href: item.url, // Usando 'url' do CMS
              hasDropdown: item.hasDropdown,
              dropdownItems: item.dropdownItems?.map((di: any) => ({
                label: di.label,
                href: di.url, // Usando 'url' do CMS
                description: di.description
              }))
            }));
          }
        }

        // Se não houver itens dinâmicos, usa os padrões
        if (dynamicItems.length === 0) {
          dynamicItems = [
            { label: "Sobre Nós", href: "/sobre" },
            { label: "Patrocinadores", href: "/patrocinadores" },
            {
              label: "Conteúdo",
              href: "#",
              hasDropdown: true,
              dropdownItems: [
                { label: "Notícias", href: "/noticias", description: "Últimas notícias do setor" },
                { label: "Análises", href: "/analises", description: "Análises profundas e estudos" },
                { label: "Entrevistas", href: "/entrevistas", description: "Conversas exclusivas" },
                { label: "Opinião", href: "/opiniao", description: "Artigos e editoriais" },
                { label: "Colunas", href: "#", description: "Colunistas especializados" },
              ]
            },
            { label: "Eventos", href: "/events" },
          ];
        }

        setMenuItems(dynamicItems);
      } catch (error) {
        console.error('Erro ao carregar navegação:', error);
        // Fallback redundante
        setMenuItems([
          { label: "Sobre Nós", href: "/sobre" },
          { label: "Patrocinadores", href: "/patrocinadores" },
          { label: "Eventos", href: "/events" },
        ]);
      }
    }

    loadNavigation();
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          "bg-primary text-primary-foreground border-b border-primary-foreground/10 shadow-md",
          // Estilo específico para mobile inspirado no G1 (Mantendo cor laranja do projeto)
          "max-md:bg-[#FF6F00] max-md:h-14 max-md:flex max-md:items-center"
        )}
      >
        <div className="container mx-auto px-3 md:px-4">
          {/* Desktop Header Layout */}
          <div className="hidden md:flex items-center justify-between h-16 lg:h-20">
            <motion.div
              className="group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Logo
                containerClassName="flex items-center gap-2 group cursor-pointer"
                imageClassName="h-10 lg:h-12"
                priority
              />
            </motion.div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/90">
              {menuItems.map((item, i) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                      setActiveDropdown(item.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasDropdown) {
                      dropdownTimeoutRef.current = setTimeout(() => {
                        setActiveDropdown(null);
                      }, 200);
                    }
                  }}
                >
                  <motion.a
                    href={item.href}
                    className={cn(
                      "relative hover:text-white transition-colors py-2 flex items-center gap-1",
                      item.hasDropdown && "cursor-pointer"
                    )}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    whileHover="hover"
                    onClick={(e) => {
                      if (item.hasDropdown) {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === item.label ? null : item.label);
                      }
                    }}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )} />
                    )}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                      initial={{ scaleX: 0 }}
                      variants={{
                        hover: { scaleX: 1 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </motion.a>

                  {item.hasDropdown && item.label === "Conteúdo" && activeDropdown === item.label && (
                    <div
                      onMouseEnter={() => {
                        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                      }}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <AnimatePresence>
                        <CategoryMegaMenu />
                      </AnimatePresence>
                    </div>
                  )}

                  {item.hasDropdown && item.label !== "Conteúdo" && item.dropdownItems && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      {item.dropdownItems.map((dropdownItem: any) => (
                        <a
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-medium text-gray-900">{dropdownItem.label}</div>
                          <div className="text-sm text-gray-500">{dropdownItem.description}</div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="w-48 bg-white/10 text-white placeholder:text-white/70 pl-4 pr-10 rounded-full border-transparent focus:bg-white focus:text-primary focus:placeholder:text-muted-foreground focus:w-64 transition-all duration-300 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white group-focus-within:text-muted-foreground transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                asChild
              >
                <a href="/login" title="Área Administrativa">
                  <User className="w-5 h-5" />
                </a>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={requestNotificationPermission}
              >
                <Bell className={cn("w-5 h-5", notificationPermission === "granted" && "text-green-300")} />
              </Button>
            </div>
          </div>

          {/* Mobile Header Layout (G1 Style) */}
          <div className="md:hidden flex items-center justify-between w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onMenuClick}
            >
              <Menu className="w-7 h-7" />
            </Button>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Logo
                imageClassName="h-7 w-auto brightness-0 invert"
                priority
              />
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                asChild
              >
                <a href="/admin" title="Área Administrativa">
                  <User className="w-6 h-6" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => {
                  // No mobile, apenas redireciona para a página de busca se vazio, ou leva o termo
                  router.push(searchQuery.trim() ? `/busca?q=${encodeURIComponent(searchQuery.trim())}` : '/busca');
                }}
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
