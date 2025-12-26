"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export type CardType = "news" | "article" | "video" | "opinion";

interface EditorialCardProps {
  type?: CardType;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  author?: string;
  date?: string;
  featured?: boolean;
  slug?: string;
}

export function EditorialCard({
  type = "news",
  title,
  excerpt,
  image,
  category,
  author,
  date,
  featured = false,
  slug
}: EditorialCardProps) {
  const cardContent = (
    <Card className={`h-full shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col py-0 gap-0 group bg-white ${featured ? 'ring-2 ring-primary/20 border-primary/30' : 'border border-slate-100 hover:border-slate-200'}`}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <PlayCircle className="w-12 h-12 text-white opacity-90 drop-shadow-lg" />
          </div>
        )}
        <Badge className={`absolute top-3 left-3 ${featured ? 'bg-primary text-white border-none' : 'bg-white/90 text-slate-700 backdrop-blur-sm shadow-sm border-none'}`}>
          {category}
        </Badge>
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Destaque
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4 md:p-5">
        {type === "opinion" && author && (
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Opinião / {author}
          </p>
        )}

        <h3 className={`font-bold leading-tight mb-2 transition-colors text-slate-900 group-hover:text-primary ${featured ? 'text-xl' : 'text-lg'}`}>
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm line-clamp-3 text-slate-600">
            {excerpt}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 md:p-5 pt-0 flex justify-between items-center mt-auto">
        <span className="text-xs text-slate-400">
          {date || "Há 2 horas"}
        </span>
        <div className="flex items-center font-medium text-sm text-primary group-hover:text-primary/80 transition-colors">
          Ler mais
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </CardFooter>
    </Card>
  );

  if (slug) {
    return (
      <motion.div whileHover={{ y: -5 }} className="h-full">
        <Link href={`/posts/${slug}`} className="block h-full cursor-pointer">
          {cardContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      {cardContent}
    </motion.div>
  );
}

interface EditorialBlockProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  cards: EditorialCardProps[];
}

export function EditorialBlock({ title, subtitle, ctaText = "Ver mais", ctaLink = "#", cards }: EditorialBlockProps) {
  return (
    <section className="py-8 md:py-12 border-b border-slate-100 last:border-0">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm md:text-base text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <Link href={ctaLink}>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 hidden sm:flex">
              {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <EditorialCard key={index} {...card} />
          ))}
        </div>

        <div className="mt-6 md:mt-8 text-center sm:hidden">
          <Link href={ctaLink}>
            <Button variant="outline" className="w-full border-primary text-primary min-h-[44px]">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
