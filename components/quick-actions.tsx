"use client";

import { motion } from "framer-motion";
import { 
  Newspaper, 
  TrendingUp, 
  Radio, 
  Mic, 
  Mail, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";

const actions = [
  { icon: Newspaper, label: "Últimas Notícias", href: "#", color: "text-blue-600" },
  { icon: TrendingUp, label: "Mais Lidas", href: "#", color: "text-green-600" },
  { icon: Radio, label: "Ao Vivo", href: "#", color: "text-red-600" },
  { icon: Mic, label: "Podcasts", href: "#", color: "text-purple-600" },
  { icon: Calendar, label: "Agenda", href: "#", color: "text-orange-600" },
  { icon: Mail, label: "Newsletter", href: "#", color: "text-slate-600" },
];

export function QuickActions() {
  return (
    <section className="py-8 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Acesso Rápido</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="block group"
            >
              <Card className="flex flex-col items-center justify-center p-4 h-full border-none shadow-sm hover:shadow-md transition-all bg-white">
                <div className={`p-3 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors mb-3 ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 text-center">
                  {action.label}
                </span>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}












