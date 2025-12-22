"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/payload/api";
import { useState } from "react";
import { PartnerLogo } from "@/components/partner-logo";

interface Author {
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

interface PostSidebarProps {
  author?: Author;
}

// Dados mockados de parceiros
const mockPartners = [
  {
    name: "ANS",
    logo: "/regulatory-agency-logo.jpg",
    url: "#",
  },
  {
    name: "SUSEP",
    logo: "/susep-logo-green.jpg",
    url: "#",
  },
  {
    name: "Conexão Saúde",
    logo: "/placeholder-logo.svg",
    url: "#",
  },
];

export function PostSidebar({ author }: PostSidebarProps) {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterStatus("success");
    setTimeout(() => {
      setEmail("");
      setNewsletterStatus("idle");
    }, 3000);
  };

  return (
    <aside className="space-y-6">
      {/* Widget de Autor */}
      {author && (
        <Card className="border border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">
              Sobre o Autor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 flex-shrink-0">
                {author.photo && (
                  <AvatarImage
                    src={getImageUrl(author.photo, "thumbnail")}
                    alt={author.name}
                  />
                )}
                <AvatarFallback className="text-lg">
                  {author.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 mb-1">{author.name}</h3>
                {author.role && (
                  <p className="text-sm text-slate-600 mb-2">{author.role}</p>
                )}
                {author.bio && (
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
            {author.social && (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    LinkedIn
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    Twitter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Espaço Publicitário - Retângulo Médio */}
      <Card className="border border-slate-200 bg-slate-50">
        <CardContent className="p-0">
          <div className="w-full h-[250px] bg-slate-50 flex items-center justify-center border border-dashed border-slate-300">
            <div className="text-center p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Espaço Publicitário
              </p>
              <p className="text-xs text-slate-400">300 x 250</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widget de Parceiros */}
      <Card className="border border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-900">
            Nossos Parceiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockPartners.map((partner, index) => (
              <a
                key={index}
                href={partner.url}
                className="flex flex-col items-center gap-2 p-3 border border-slate-200 bg-white hover:border-primary transition-colors group"
              >
                <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                  <PartnerLogo
                    src={partner.logo}
                    alt={partner.name}
                    name={partner.name}
                    size={64}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors text-center">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Widget */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold text-slate-900">
              Newsletter
            </CardTitle>
          </div>
          <p className="text-sm text-slate-600">
            Receba as principais notícias do setor
          </p>
        </CardHeader>
        <CardContent>
          {newsletterStatus === "success" ? (
            <div className="text-center py-4">
              <p className="text-sm font-medium text-green-700 mb-1">
                ✓ Inscrição realizada!
              </p>
              <p className="text-xs text-slate-600">
                Verifique sua caixa de entrada
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-slate-200 h-10 text-sm"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90 h-10 text-sm font-semibold"
              >
                Inscrever-se
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Espaço Publicitário - Vertical */}
      <Card className="border border-slate-200 bg-slate-50">
        <CardContent className="p-0">
          <div className="w-full h-[600px] bg-slate-50 flex items-center justify-center border border-dashed border-slate-300">
            <div className="text-center p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Espaço Publicitário
              </p>
              <p className="text-xs text-slate-400">300 x 600</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}









