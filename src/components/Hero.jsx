import { motion } from "framer-motion";
import { Wallet, Eye, Users, ArrowRight } from "lucide-react";

const pilares = [
  { icon: Wallet, label: "Impostos e liberdade econômica" },
  { icon: Eye, label: "Fiscalização do poder público" },
  { icon: Users, label: "Cidadania e participação popular" },
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 pt-28 pb-20 text-white md:pt-36"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gold-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block rounded-full border border-gold-400/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
            Goiânia · Goiás
          </span>

          <h1 className="font-display mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
            Menos imposto.
            <br />
            Mais liberdade.
            <br />
            <span className="text-gold-400">Poder sob vigilância.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-white/75">
            Sou Gabriel Henriques Sales. Acredito em um poder público que presta
            contas, em um cidadão que participa e em uma economia livre para
            crescer.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#propostas"
              className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3 font-semibold text-navy-950 transition hover:bg-gold-500"
            >
              Conheça as propostas <ArrowRight size={18} />
            </a>
            <a
              href="#participe"
              className="rounded-full border border-white/30 px-7 py-3 font-semibold transition hover:bg-white/10"
            >
              Participe
            </a>
          </div>

          <ul className="mt-10 space-y-3">
            {pilares.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-white/85">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gold-400">
                  <Icon size={18} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-gold-400" />
          <img
            src="/images/gabriel.png"
            alt="Gabriel Henriques Sales"
            className="relative aspect-square w-full rounded-3xl object-cover shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}