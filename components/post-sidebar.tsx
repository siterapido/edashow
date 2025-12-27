"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { SponsorsCarouselWidget } from "@/components/sponsors-carousel-widget";
import BannerDisplay from "@/components/BannerDisplay";

interface Author {
  name: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
  twitter_url?: string;
  instagram_url?: string;
}

interface Sponsor {
  id: string | number;
  name: string;
  logo?: any;
  logo_path?: string;
  website?: string;
}

interface PostSidebarProps {
  author?: Author;
  sponsors?: Sponsor[];
}

export function PostSidebar({ author, sponsors = [] }: PostSidebarProps) {
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
                {author.avatar_url && (
                  <AvatarImage
                    src={author.avatar_url}
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
            {(author.twitter_url || author.instagram_url) && (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                {author.twitter_url && (
                  <a
                    href={author.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    Twitter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {author.instagram_url && (
                  <a
                    href={author.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    Instagram
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Banner Sidebar - 300x250 */}
      <BannerDisplay location="article_sidebar" />

      {/* Widget de Parceiros - Carrossel */}
      {sponsors && sponsors.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">
              Nossos Parceiros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SponsorsCarouselWidget sponsors={sponsors} />
          </CardContent>
        </Card>
      )}

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













