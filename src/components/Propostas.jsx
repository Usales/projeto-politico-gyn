import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { propostas } from "../data/site";

export default function Propostas() {
  return (
    <section id="propostas" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-5">
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
          <p className="mt-4 text-lg text-navy-900/70">
            Ideias simples, diretas e que podem ser acompanhadas por qualquer cidadão.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {propostas.map(({ icon: Icon, titulo, resumo, itens }, i) => (
            <motion.article
              key={titulo}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group rounded-3xl border border-navy-900/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition group-hover:bg-gold-400 group-hover:text-navy-950">
                <Icon size={26} />
              </span>
              <h3 className="font-display mt-6 text-xl font-bold text-navy-900">
                {titulo}
              </h3>
              <p className="mt-3 text-navy-900/70">{resumo}</p>
              <ul className="mt-6 space-y-3">
                {itens.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-navy-900/80">
                    <Check size={18} className="mt-0.5 shrink-0 text-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}