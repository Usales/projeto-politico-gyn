import { motion } from "framer-motion";
import { Ear, Search, Binoculars, Megaphone } from "lucide-react";

// EDITE estes textos com a sua forma real de trabalhar
const passos = [
  {
    icon: Ear,
    titulo: "Ouvir",
    texto: "Escutar moradores, empreendedores e trabalhadores de cada região da cidade.",
  },
  {
    icon: Search,
    titulo: "Entender",
    texto: "Estudar leis, contratos e orçamento para saber onde o dinheiro público está indo.",
  },
  {
    icon: Binoculars,
    titulo: "Fiscalizar",
    texto: "Acompanhar de perto as ações do poder público e cobrar respostas claras.",
  },
  {
    icon: Megaphone,
    titulo: "Prestar contas",
    texto: "Contar de forma simples e aberta o que foi feito, para qualquer pessoa conferir.",
  },
];

export default function Atuacao() {
  return (
    <section id="atuacao" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Como eu atuo
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-navy-900 md:text-5xl">
            Do ouvir ao prestar contas
          </h2>
        </motion.div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map(({ icon: Icon, titulo, texto }, i) => (
            <motion.li
              key={titulo}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-navy-900/10 bg-paper p-7"
            >
              <span className="font-display pointer-events-none absolute -right-2 -top-4 text-8xl font-extrabold text-navy-900/5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Icon size={22} />
              </span>
              <h3 className="font-display relative mt-5 text-xl font-bold text-navy-900">{titulo}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-navy-900/70 sm:text-base">{texto}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}