import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wallet, Eye, Users, ArrowRight, MapPin, ChevronDown } from "lucide-react";

const pilares = [
  { icon: Wallet, label: "Impostos e liberdade econômica" },
  { icon: Eye, label: "Fiscalização do poder público" },
  { icon: Users, label: "Cidadania e participação popular" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yFoto = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yBlob = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 pt-28 pb-24 text-white"
    >
      {/* Fundo decorativo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <motion.div
        style={{ y: yBlob }}
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-400/15 blur-3xl md:h-[34rem] md:w-[34rem]"
      />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-navy-800 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-block rounded-full border border-gold-400/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400"
          >
            Goiânia · Goiás
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display mt-6 text-[clamp(2.25rem,7.5vw,4.25rem)] font-extrabold leading-[1.05]"
          >
            Menos imposto.
            <br />
            Mais liberdade.
            <br />
            <span className="text-gold-400">Poder sob vigilância.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-lg text-base text-white/75 sm:text-lg">
            Sou Gabriel Henriques Sales. Acredito em um poder público que presta contas, em um
            cidadão que participa e em uma economia livre para crescer.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#propostas"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 font-semibold text-navy-950 transition hover:bg-gold-500"
            >
              Conheça as propostas <ArrowRight size={18} />
            </a>
            <a
              href="#participe"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 py-3 font-semibold transition hover:bg-white/10"
            >
              Participe
            </a>
          </motion.div>

          <motion.ul variants={item} className="mt-10 space-y-3">
            {pilares.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/85 sm:text-base">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400">
                  <Icon size={18} />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: yFoto }}
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm md:max-w-md"
        >
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl bg-gold-400 sm:-bottom-4 sm:-right-4" />
          <img
            src="/images/gabriel.png"
            alt="Gabriel Henriques Sales"
            decoding="async"
            className="relative aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-2xl"
          />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-navy-950/80 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-navy-950">
              <MapPin size={18} />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold">Goiânia, GO</span>
              <span className="block text-xs text-white/60">Cidadania em ação</span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#propostas"
        aria-label="Rolar para baixo"
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/50 md:block"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="block"
        >
          <ChevronDown />
        </motion.span>
      </motion.a>
    </section>
  );
}