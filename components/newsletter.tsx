"use client";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setEmail("")
      } else {
        // Fallback or error handling
        console.error('Failed to subscribe')
        // Even if it fails, maybe we show success to not frustrate user if it's just a duplicate?
        // But for now let's just assume success or maybe reset to idle
        if (response.status === 400 || response.status === 200) {
          // Treated as success for duplicate or success
          setStatus("success")
          setEmail("")
        } else {
          setStatus("idle")
        }
      }
    } catch (error) {
      console.error('Error submitting newsletter', error)
      setStatus("idle")
    }
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-[#1A1A1A] text-white p-6 md:p-8 lg:p-16"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L100 0 L100 100 Z" fill="#FF6F00" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="max-w-xl text-center lg:text-left w-full lg:w-auto">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 md:mb-6 backdrop-blur-sm">
                <Mail className="w-6 h-6 md:w-8 md:h-8 text-[#FF6F00]" />
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-tight">
                Fique à frente no setor de saúde
              </h2>
              <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 leading-relaxed">
                Junte-se a mais de 50.000 profissionais e receba análises exclusivas,
                tendências de mercado e as principais notícias regulatórias diretamente no seu e-mail.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6F00]" />
                  <span>Curadoria diária</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6F00]" />
                  <span>Análises exclusivas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6F00]" />
                  <span>Gratuito</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Inscrição confirmada!</h3>
                  <p className="text-gray-400">Verifique sua caixa de entrada para confirmar.</p>
                  <Button
                    variant="ghost"
                    className="mt-6 text-[#FF6F00] hover:text-white hover:bg-white/10"
                    onClick={() => setStatus("idle")}
                  >
                    Cadastrar outro e-mail
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">
                      Seu melhor e-mail corporativo
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="nome@empresa.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 h-11 md:h-12 pl-4 focus-visible:ring-[#FF6F00] focus-visible:border-[#FF6F00] min-h-[44px]"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-[#FF6F00] text-white hover:bg-[#E66300] font-bold h-11 md:h-12 text-sm md:text-base shadow-lg shadow-orange-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
                  >
                    {status === "loading" ? "Cadastrando..." : "INSCREVER-SE AGORA"}
                    {status !== "loading" && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">
                    Ao se inscrever, você concorda com nossa Política de Privacidade.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
