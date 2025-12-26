"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getColumnists } from "@/lib/supabase/api"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"
import { useEffect, useState } from "react"

interface ColumnistsProps {
  initialColumnists?: any[]
}

export function Columnists({ initialColumnists = [] }: ColumnistsProps) {
  const [columnists, setColumnists] = useState<any[]>([]);

  useEffect(() => {
    if (initialColumnists.length > 0) {
      setColumnists(initialColumnists);
    } else {
      const fetchData = async () => {
        try {
          const data = await getColumnists({
            limit: 20
          });
          setColumnists(data || []);
        } catch (e) {
          console.error('Erro ao buscar colunistas:', e);
          setColumnists([]);
        }
      };
      fetchData();
    }
  }, [initialColumnists]);

  if (columnists.length === 0) {
    return null;
  }


  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="bg-slate-50 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <motion.h2
            variants={fadeIn("right")}
            className="text-3xl font-bold text-slate-900"
          >
            Nossos <span className="text-primary">Colunistas</span>
          </motion.h2>
          <motion.div variants={fadeIn("left")}>
            <Link href="/colunas" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
              Ver todos &rarr;
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columnists.map((columnist: any, index: number) => (
            <motion.div
              key={columnist.id}
              variants={fadeIn("up", index * 0.1)}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                href={`/columnists/${columnist.slug}`}
                className="block group h-full"
              >
                <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-white">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    className="mb-4"
                  >
                    <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-inner group-hover:border-primary/20 transition-colors">
                      {columnist.avatar_url && (
                        <AvatarImage
                          src={columnist.avatar_url}
                          alt={columnist.name}
                        />
                      )}
                      <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl font-bold">
                        {columnist.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-primary transition-colors">
                    {columnist.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 min-h-[2.5em]">
                    {columnist.role || columnist.bio || 'Colunista Convidado'}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-auto pt-4 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Ler artigos
                  </motion.div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
