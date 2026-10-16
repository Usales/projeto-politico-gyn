import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { propostas } from "../data/site";

export default function Propostas() {
  const [ativo, setAtivo] = useState(0);
  const atual = propostas[ativo];
  const IconeAtual = atual.icon;

  return (
    <section id="propostas" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Propostas
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-navy-900 md:text-5xl">
            Três pilares para Goiânia
          </h2>
          <p className="mt-4 text-base text-navy-900/70 md:text-lg">
            Ideias simples, diretas e que podem ser acompanhadas por qualquer cidadão.
          </p>
        </motion.div>

        {/* Abas: deslizam com o dedo no celular */}
        <div
          role="tablist"
          className="mt-10 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible"
        >
          {propostas.map(({ icon: Icon, titulo }, i) => (
            <button
              key={titulo}
              role="tab"
              aria-selected={ativo === i}
              onClick={() => setAtivo(i)}
              className={`flex min-h-14 shrink-0 snap-start items-center gap-3 rounded-2xl border px-5 py-3 text-left text-sm font-semibold transition sm:text-base ${
                ativo === i
                  ? "border-navy-900 bg-navy-900 text-white shadow-lg"
                  : "border-navy-900/10 bg-white text-navy-900 hover:border-gold-400"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  ativo === i ? "bg-gold-400 text-navy-950" : "bg-navy-900/5 text-navy-900"
                }`}
              >
                <Icon size={18} />
              </span>
              <span className="whitespace-nowrap lg:whitespace-normal">{titulo}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={ativo}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-6 grid gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy-900/5 sm:p-8 lg:grid-cols-5 lg:gap-10 lg:p-10"
          >
            <div className="lg:col-span-2">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                <IconeAtual size={30} />
              </span>
              <h3 className="font-display mt-6 text-2xl font-bold text-navy-900 md:text-3xl">
                {atual.titulo}
              </h3>
              <p className="mt-3 text-base text-navy-900/70 md:text-lg">{atual.resumo}</p>
            </div>

            <ul className="space-y-3 lg:col-span-3">
              {atual.itens.map((texto, n) => (
                <motion.li
                  key={texto}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + n * 0.08 }}
                  className="flex items-start gap-4 rounded-2xl bg-paper p-4 sm:p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400 text-navy-950">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <span className="pt-1 text-navy-900/85">{texto}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}