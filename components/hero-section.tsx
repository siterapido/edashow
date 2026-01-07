"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Share2, ChevronLeft, ChevronRight, Instagram, Youtube, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SlideData {
  id: string;
  badge: string;
  time: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  credit: string;
  statLabel: string;
  statValue: string;
  statValue: string;
  slug?: string;
  authorName?: string;
  authorRole?: string;
  authorImage?: string;
}

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  featured_image?: any;
  published_at?: string;
  category?: any;
  featured?: boolean;
  slug?: string;
  author?: {
    name?: string;
    photo_url?: string;
    bio?: string;
  };
}

interface HeroSectionProps {
  posts?: Post[];
}

// Slides de fallback caso não haja posts
const fallbackSlides: SlideData[] = [
  {
    id: "fallback-1",
    badge: "Destaque",
    time: "Há 2 horas",
    title: "Setor de saúde suplementar projeta expansão nacional para 2026",
    description: "Novas tecnologias e regulação favorável impulsionam crescimento recorde no último trimestre, segundo relatório da ANS.",
    image: "/modern-healthcare-building.jpg",
    imageAlt: "Saúde Suplementar",
    credit: "Foto: Divulgação",
    statLabel: "Em Alta",
    statValue: "+15% de crescimento no setor este ano",
    slug: undefined
  },
  {
    id: "fallback-2",
    badge: "Tecnologia",
    time: "Há 5 horas",
    title: "Inteligência Artificial revoluciona diagnóstico médico",
    description: "Plataformas de IA estão transformando a forma como médicos identificam doenças, reduzindo tempo de diagnóstico em até 70%.",
    image: "/conference-healthcare-panel.jpg",
    imageAlt: "Tecnologia em Saúde",
    credit: "Foto: Divulgação",
    statLabel: "Tendência",
    statValue: "70% redução no tempo de diagnóstico",
    slug: undefined
  },
  {
    id: "fallback-3",
    badge: "Regulação",
    time: "Há 1 dia",
    title: "ANS anuncia novas diretrizes para operadoras de saúde",
    description: "Normativas visam aumentar transparência e melhorar qualidade dos serviços prestados aos beneficiários do setor suplementar.",
    image: "/modern-building-ans.jpg",
    imageAlt: "ANS",
    credit: "Foto: Divulgação / ANS",
    statLabel: "Novidade",
    statValue: "Novas diretrizes em vigor",
    slug: undefined
  },
  {
    id: "fallback-4",
    badge: "Eventos",
    time: "Há 2 dias",
    title: "Maior evento de saúde suplementar do país acontece em São Paulo",
    description: "Especialistas de todo o Brasil se reúnem para debater o futuro do setor e apresentar as últimas inovações em saúde digital.",
    image: "/healthcare-launch-event.jpg",
    imageAlt: "Evento de Saúde",
    credit: "Foto: Divulgação",
    statLabel: "Destaque",
    statValue: "5.000+ participantes esperados",
    slug: undefined
  }
];


function getCategoryBadge(category?: string): string {
  const categoryMap: Record<string, string> = {
    news: 'Notícias',
    analysis: 'Análise',
    interviews: 'Entrevista',
    opinion: 'Opinião',
  };
  return categoryMap[category || 'news'] || 'Notícias';
}

export function HeroSection({ posts = [] }: HeroSectionProps) {
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

  // Converter posts para slides
  const slides = useMemo(() => {
    if (posts.length === 0) {
      return fallbackSlides;
    }

    // Priorizar posts em destaque, depois os mais recentes
    const sortedPosts = [...posts]
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      })
      .slice(0, 6); // Limitar a 6 slides

    return sortedPosts.map((post, index) => {
      const publishedAt = post.published_at
        ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
        : 'Recente';

      const categorySlug = typeof post.category === 'object' ? post.category.slug : post.category;

      // Author logic
      const authorName = post.author?.name || "Redação Eda Show";
      const authorRole = post.author?.bio || "Equipe Editorial";
      const isRedacao = authorName.includes('Redação') || authorName.includes('Redacao');
      const authorImage = isRedacao ? '/images/eda-redacao.png' : (post.author?.photo_url || '/images/eda-redacao.png');

      return {
        id: post.id || `post-${index}`,
        badge: getCategoryBadge(categorySlug),
        time: publishedAt,
        title: post.title || 'Sem título',
        description: post.excerpt || 'Leia a matéria completa para saber mais.',
        image: post.cover_image_url || post.featured_image?.url || '/placeholder.jpg',
        imageAlt: post.title || 'Imagem do post',
        credit: `Foto: ${authorName}`, // Or keep "Divulgação" if preferred, using author name for now
        statLabel: post.featured ? 'Destaque' : 'Novo',
        statValue: categorySlug === 'interviews' ? 'Entrevista exclusiva' : 'Matéria em destaque',
        slug: post.slug,
        // Passing specific author data to be used in rendering if needed, 
        // effectively flattening it into the slide object for easier access
        authorName,
        authorRole,
        authorImage
      };
    });
  }, [posts]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const slideTransition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.4 },
    scale: { duration: 0.4 }
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Marcar que o componente já foi montado
  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isInitialMount || slides.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Muda de slide a cada 6 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, isInitialMount, slides.length]);

  // Garantir que currentSlide não exceda o tamanho do array
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative bg-[#0f172a] text-white overflow-hidden h-[600px] sm:h-[650px] md:h-screen"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Navigation Controls - Side Arrows (Desktop) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 lg:p-4 transition-all duration-300 group border border-white/20 hover:border-white/40 min-w-[44px] min-h-[44px] lg:min-w-[56px] lg:min-h-[56px] items-center justify-center"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 lg:p-4 transition-all duration-300 group border border-white/20 hover:border-white/40 min-w-[44px] min-h-[44px] lg:min-w-[56px] lg:min-h-[56px] items-center justify-center"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Hero Navigation Indicators & Mobile Controls */}
      <div className="absolute left-4 sm:left-16 md:left-20 lg:left-24 bottom-6 sm:bottom-12 z-30 flex items-center gap-6">
        {/* Mobile-only arrows */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={prevSlide}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-all duration-300 group border border-white/20 hover:border-white/40 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-all duration-300 group border border-white/20 hover:border-white/40 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Indicators (Dots) */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${index === currentSlide
                ? "bg-primary w-8 h-2"
                : "bg-white/30 hover:bg-white/50 w-2 h-2"
                }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative w-full h-full">
        <AnimatePresence initial={isInitialMount} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial={isInitialMount ? "center" : "enter"}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <motion.img
                src={currentSlideData.image}
                alt={currentSlideData.imageAlt}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-900/80" />
            </div>

            {/* Navigation Buttons - Adjusted for mobile */}
            <div className={`swiper-button-prev !bg-black/20 hover:!bg-black/40 !w-10 !h-10 sm:!w-12 sm:!h-12 !rounded-full !backdrop-blur-sm after:!text-sm sm:after:!text-lg after:!font-bold !text-white transition-all transform hover:scale-105 active:scale-95 !left-4 sm:!left-6 lg:!left-10 z-50`} style={{ top: 'auto', bottom: '15%' }} />
            <div className={`swiper-button-next !bg-black/20 hover:!bg-black/40 !w-10 !h-10 sm:!w-12 sm:!h-12 !rounded-full !backdrop-blur-sm after:!text-sm sm:after:!text-lg after:!font-bold !text-white transition-all transform hover:scale-105 active:scale-95 !right-4 sm:!right-6 lg:!right-10 z-50`} style={{ top: 'auto', bottom: '15%' }} />
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-16 md:px-20 lg:px-24 py-6 sm:py-16 md:py-20 lg:py-24 relative z-10 h-full">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center h-full min-h-0">

                {/* Main Content */}
                <motion.div
                  key={`content-${currentSlide}`}
                  initial="hidden"
                  animate="show"
                  variants={fadeIn("right", 0.3)}
                  className="space-y-3 sm:space-y-4 lg:space-y-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <Badge className="bg-primary text-white hover:bg-primary/90 border-none px-3 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      {currentSlideData.badge}
                    </Badge>
                    <span className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
                      <Clock className="w-3 h-3" />
                      {currentSlideData.time}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                    {currentSlideData.title}
                  </h1>

                  <p className="text-sm sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
                    {currentSlideData.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={currentSlideData.authorImage || "/images/eda-redacao.png"}
                        alt={currentSlideData.authorName || "Redação"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-semibold text-white">Por {currentSlideData.authorName || "Redação Eda Show"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 pt-2 sm:pt-4">
                    <div className="flex justify-start">
                      {currentSlideData.slug ? (
                        <Button asChild size="default" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-4 sm:px-6 h-8 sm:h-9 text-xs sm:text-sm shadow-lg shadow-primary/20 min-h-[36px]">
                          <Link href={`/posts/${currentSlideData.slug}`}>
                            Conteúdo
                            <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button size="default" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-4 sm:px-6 h-8 sm:h-9 text-xs sm:text-sm shadow-lg shadow-primary/20 min-h-[36px]">
                          Conteúdo
                          <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                  key={`image-${currentSlide}`}
                  initial="hidden"
                  animate="show"
                  variants={fadeIn("left", 0.5)}
                  className="relative mt-8 lg:mt-0 hidden md:block"
                >
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[16/10] group cursor-pointer">
                    <motion.img
                      src={currentSlideData.image}
                      alt={currentSlideData.imageAlt}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                    {/* Image Caption/Credit */}
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs text-white/60">
                      {currentSlideData.credit}
                    </div>
                  </div>

                  {/* Floating Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-4 lg:-bottom-6 -left-4 lg:-left-6 bg-white dark:bg-slate-800 p-3 lg:p-4 rounded-xl shadow-xl max-w-[180px] lg:max-w-[200px] hidden lg:block"
                  >
                    <div className="flex items-center gap-2 lg:gap-3 mb-1.5 lg:mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-500 uppercase">{currentSlideData.statLabel}</span>
                    </div>
                    <p className="text-xs lg:text-sm font-bold text-slate-800 dark:text-white leading-tight">
                      {currentSlideData.statValue}
                    </p>
                  </motion.div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
