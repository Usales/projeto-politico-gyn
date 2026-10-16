
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Wallet,
  Eye,
  Users,
  ArrowRight,
  MapPin,
  ChevronDown,
} from "lucide-react";

const pilares = [
  { icon: Wallet, label: "Impostos e liberdade econômica" },
  { icon: Eye, label: "Fiscalização do poder público" },
  { icon: Users, label: "Cidadania e participação popular" },
];

const slogans = [
  {
    linhas: [
      "Tolerância zero",
      "com o crime.",
      "Segurança de verdade.",
    ],
  },
  {
    linhas: [
      "Imposto menor.",
      "Comércio livre.",
      "Consumidor Feliz.",
    ],
  },
  {
    linhas: [
      "Serviço eficiente.",
      "Dinheiro bem investido.",
      "Respeito ao cidadão.",
    ],
  },
  {
    linhas: [
      "Cultura livre.",
      "Incentivo real.",
      "Identidade valorizada.",
    ],
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function SloganRotativo() {
  const [indice, setIndice] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((atual) => (atual + 1) % slogans.length);
    }, 4500);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div
      className="relative mt-6 h-[13.5rem] overflow-hidden sm:h-[15rem] md:h-[17rem]"
      aria-live="off"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.h1
          key={indice}
          initial={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 14 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -14 }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.3,
            ease: "easeOut",
          }}
          className="font-display text-[clamp(2rem,5.2vw,3.8rem)] font-extrabold leading-[1.12] tracking-tight"
        >
          {slogans[indice].linhas.map((linha, i) => (
            <span
              key={linha}
              className={`block ${
                i === 2 ? "text-gold-400" : "text-white"
              }`}
            >
              {linha}
            </span>
          ))}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yFoto = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 70]
  );

  const yBlob = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -140]
  );

  const fade = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 0]
  );

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 pb-24 pt-28 text-white md:px-8"
    >
      {/* Fundo decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        aria-hidden="true"
        style={{ y: yBlob }}
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-400/15 blur-3xl md:h-[34rem] md:w-[34rem]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-navy-800 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
        {/* Apresentação */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="min-w-0"
        >
          <motion.span
            variants={item}
            className="inline-block rounded-full border border-gold-400/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400"
          >
            Goiânia · Goiás
          </motion.span>

          <motion.div variants={item}>
            <SloganRotativo />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Sou Gabriel Henriques Sales, acredito em uma Goiânia que valoriza o trabalhador,
            empreendedor e quem contribui para o desenvolvimento da cidade.
          </motion.p>

          {/* Botões */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <a
              href="#propostas"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 font-semibold text-navy-950 transition hover:bg-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
            >
              Conheça as propostas
              <ArrowRight size={18} aria-hidden="true" />
            </a>

            <a
              href="#participe"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 py-3 font-semibold transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
            >
              Participe
            </a>
          </motion.div>

          {/* Pilares */}
          <motion.ul
            variants={item}
            className="mt-10 space-y-3"
          >
            {pilares.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-sm text-white/85 sm:text-base"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400">
                  <Icon size={18} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Fotografia: posição independente do slogan */}
        <motion.div
          initial={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.96 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : 0.15,
          }}
          style={{ y: yFoto }}
          className="relative mx-auto mt-4 w-full max-w-[19rem] self-start sm:max-w-sm md:mt-20 md:max-w-md"
        >
          <div
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl bg-gold-400 sm:-bottom-4 sm:-right-4"
          />

          <img
            src="/images/gabriel.png"
            alt="Gabriel Henriques Sales"
            fetchPriority="high"
            decoding="async"
            className="relative aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-2xl"
          />

          {/* Identificação da cidade */}
          <motion.div
            animate={
              reduceMotion
                ? { y: 0 }
                : { y: [0, -6, 0] }
            }
            transition={{
              repeat: reduceMotion ? 0 : Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-navy-950/90 px-4 py-3 shadow-xl backdrop-blur-md sm:-left-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-navy-950">
              <MapPin size={18} aria-hidden="true" />
            </span>

            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold">
                Goiânia, GO
              </span>
              <span className="block text-xs text-white/60">
                Cidadania em ação
              </span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de rolagem */}
      <motion.a
        href="#propostas"
        aria-label="Conheça as propostas"
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/50 transition hover:text-gold-400 md:block"
      >
        <motion.span
          animate={
            reduceMotion ? { y: 0 } : { y: [0, 8, 0] }
          }
          transition={{
            repeat: reduceMotion ? 0 : Infinity,
            duration: 1.8,
          }}
          className="block"
        >
          <ChevronDown aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
