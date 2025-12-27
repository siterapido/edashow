"use client";

import { Variants } from "framer-motion";

/**
 * Variante de animação fadeIn com direção configurável
 * @param direction - Direção da animação: "up", "down", "left", "right" ou "none"
 * @param delay - Delay em segundos antes de iniciar a animação
 * @returns Variantes de animação para usar com motion components
 */
export const fadeIn = (
  direction: "up" | "down" | "left" | "right" | "none" = "up",
  delay: number = 0
): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

/**
 * Container variant para animações em cascata (stagger)
 * Use com motion.section ou motion.div para animar filhos sequencialmente
 */
export const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Variante de animação de escala (zoom in/out)
 * @param delay - Delay em segundos antes de iniciar a animação
 * @returns Variantes de animação
 */
export const scaleIn = (delay: number = 0): Variants => {
  return {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
      },
    },
  };
};

/**
 * Variante de animação de slide horizontal
 * @param direction - Direção: "left" ou "right"
 * @param delay - Delay em segundos
 * @returns Variantes de animação
 */
export const slideIn = (
  direction: "left" | "right" = "left",
  delay: number = 0
): Variants => {
  return {
    hidden: {
      x: direction === "left" ? -100 : 100,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay,
      },
    },
  };
};

/**
 * Variante de animação de rotação
 * @param delay - Delay em segundos
 * @returns Variantes de animação
 */
export const rotateIn = (delay: number = 0): Variants => {
  return {
    hidden: {
      rotate: -180,
      opacity: 0,
      scale: 0.5,
    },
    show: {
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
      },
    },
  };
};

/**
 * Configuração padrão de viewport para animações on-scroll
 * Use com a prop viewport do motion component
 */
export const viewportConfig = {
  once: true,
  margin: "-50px",
  amount: 0.3,
} as const;














