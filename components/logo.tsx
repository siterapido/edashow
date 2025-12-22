"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/payload/api";

type LogoProps = {
  containerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "light" | "dark" | "white";
};

/**
 * Componente Logo - Carrega o logo do CMS dinamicamente
 * 
 * Variantes:
 * - light: Logo principal (padrão)
 * - dark: Logo para fundo escuro
 * - white: Logo branco para header laranja
 */
export function Logo({
  containerClassName,
  imageClassName,
  priority = false,
  variant = "light",
}: LogoProps) {
  const router = useRouter();
  const [logoSrc, setLogoSrc] = useState<string>("");
  const [logoAlt, setLogoAlt] = useState<string>("EDA Show");

  useEffect(() => {
    async function loadLogo() {
      try {
        const response = await fetch('/api/globals/site-settings');
        
        if (!response.ok) {
          // Fallback para logos padrão
          setDefaultLogo();
          return;
        }

        const settings = await response.json();
        
        // Selecionar logo baseado na variante
        let logoMedia = null;
        if (variant === "white" && settings.logoWhite) {
          logoMedia = settings.logoWhite;
        } else if (variant === "dark" && settings.logoDark) {
          logoMedia = settings.logoDark;
        } else if (settings.logo) {
          logoMedia = settings.logo;
        }

        // Se encontrou logo no CMS, usar ele
        if (logoMedia) {
          const logoUrl = getImageUrl(logoMedia);
          setLogoSrc(logoUrl);
          
          // Atualizar alt text se disponível
          if (settings.siteName) {
            setLogoAlt(settings.siteName);
          }
        } else {
          // Fallback para logos padrão
          setDefaultLogo();
        }
      } catch (error) {
        console.warn('[Logo] Erro ao carregar logo do CMS, usando fallback:', error);
        setDefaultLogo();
      }
    }

    loadLogo();
  }, [variant]);

  const setDefaultLogo = () => {
    // Logos padrão baseados na variante
    if (variant === "dark") {
      setLogoSrc("/logo-dark.png");
    } else if (variant === "white") {
      setLogoSrc("/eda-show-logo.png");
    } else {
      setLogoSrc("/eda-show-logo.png");
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Não renderizar até ter o logo carregado
  if (!logoSrc) {
    return (
      <div className={cn("inline-flex items-center", containerClassName)}>
        <div className={cn(
          "h-10 w-40 bg-gray-200 animate-pulse rounded md:h-12",
          imageClassName
        )} />
      </div>
    );
  }
  
  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label={`Ir para a página inicial do ${logoAlt}`}
      className={cn("inline-flex items-center", containerClassName)}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={160}
        height={123}
        priority={priority}
        sizes="(max-width: 768px) 140px, 180px"
        className={cn(
          "h-10 w-auto object-contain drop-shadow-lg md:h-12",
          imageClassName
        )}
      />
    </Link>
  );
}









