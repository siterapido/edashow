"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SlideData {
  id: number;
  badge: string;
  time: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  credit: string;
  statLabel: string;
  statValue: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "Destaque do Dia",
    time: "Há 2 horas",
    title: "Setor de saúde suplementar projeta expansão nacional para 2026",
    description: "Novas tecnologias e regulação favorável impulsionam crescimento recorde no último trimestre, segundo relatório da ANS.",
    image: "/modern-healthcare-building.jpg",
    imageAlt: "Saúde Suplementar",
    credit: "Foto: Divulgação / ANS",
    statLabel: "Em Alta",
    statValue: "+15% de crescimento no setor este ano"
  },
  {
    id: 2,
    badge: "Tecnologia",
    time: "Há 5 horas",
    title: "Inteligência Artificial revoluciona diagnóstico médico",
    description: "Plataformas de IA estão transformando a forma como médicos identificam doenças, reduzindo tempo de diagnóstico em até 70%.",
    image: "/conference-healthcare-panel.jpg",
    imageAlt: "Tecnologia em Saúde",
    credit: "Foto: Divulgação",
    statLabel: "Tendência",
    statValue: "70% redução no tempo de diagnóstico"
  },
  {
    id: 3,
    badge: "Regulação",
    time: "Há 1 dia",
    title: "ANS anuncia novas diretrizes para operadoras de saúde",
    description: "Normativas visam aumentar transparência e melhorar qualidade dos serviços prestados aos beneficiários do setor suplementar.",
    image: "/modern-building-ans.jpg",
    imageAlt: "ANS",
    credit: "Foto: Divulgação / ANS",
    statLabel: "Novidade",
    statValue: "Novas diretrizes em vigor"
  },
  {
    id: 4,
    badge: "Eventos",
    time: "Há 2 dias",
    title: "Maior evento de saúde suplementar do país acontece em São Paulo",
    description: "Especialistas de todo o Brasil se reúnem para debater o futuro do setor e apresentar as últimas inovações em saúde digital.",
    image: "/healthcare-launch-event.jpg",
    imageAlt: "Evento de Saúde",
    credit: "Foto: Divulgação",
    statLabel: "Destaque",
    statValue: "5.000+ participantes esperados"
  }
];

export function HeroSection() {
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
    if (!isAutoPlaying || isInitialMount) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Muda de slide a cada 6 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, isInitialMount]);

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative bg-[#0f172a] text-white overflow-hidden min-h-[500px] sm:min-h-[550px] lg:min-h-[700px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 sm:p-2.5 md:p-3 transition-all duration-300 group border border-white/20 hover:border-white/40 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 sm:p-2.5 md:p-3 transition-all duration-300 group border border-white/20 hover:border-white/40 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-primary w-8 h-2"
                : "bg-white/30 hover:bg-white/50 w-2 h-2"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative w-full h-full min-h-[500px] sm:min-h-[550px] lg:min-h-[700px]">
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
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14 lg:py-20 relative z-10 h-full">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center h-full">
                
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

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                    {currentSlideData.title}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
                    {currentSlideData.description}
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 sm:px-8 h-10 sm:h-11 md:h-12 text-sm sm:text-base shadow-lg shadow-primary/20 min-h-[44px]">
                      Ler matéria completa
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="border-slate-600 text-chart-3 hover:bg-slate-800 hover:text-white rounded-full px-5 sm:px-6 h-10 sm:h-11 md:h-12 text-sm sm:text-base min-h-[44px]">
                      <Share2 className="mr-2 w-4 h-4" />
                      Compartilhar
                    </Button>
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
