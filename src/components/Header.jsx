import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";

const links = [
  { label: "Propostas", id: "propostas" },
  { label: "Como eu atuo", id: "atuacao" },
  { label: "Sobre", id: "sobre" },
  { label: "Dúvidas", id: "duvidas" },
  { label: "Participe", id: "participe" },
];

const ids = ["inicio", ...links.map((l) => l.id)];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava a rolagem do fundo enquanto o menu está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  function irPara(e, id) {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  }

  return (
    <>
      <header
        className={`safe-top fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-white/10 bg-navy-950/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <a
            href="#inicio"
            onClick={(e) => irPara(e, "inicio")}
            className="font-display text-lg font-bold tracking-tight text-white"
          >
            Gabriel <span className="text-gold-400">Henriques</span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => irPara(e, l.id)}
                className={`text-sm font-medium transition hover:text-gold-400 ${
                  active === l.id ? "text-gold-400" : "text-white/80"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#participe"
              onClick={(e) => irPara(e, "participe")}
              className="rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-500"
            >
              Fale comigo
            </a>
          </nav>

          <button
            className="-mr-2 flex h-11 w-11 items-center justify-center text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        <motion.div
          style={{ scaleX }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold-400"
        />
      </header>

      {/* Menu mobile fica FORA do header, por causa do efeito de blur */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-navy-950 lg:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8 pt-28 pb-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => irPara(e, l.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                  className={`font-display border-b border-white/10 py-4 text-3xl font-bold ${
                    active === l.id ? "text-gold-400" : "text-white"
                  }`}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="safe-bottom px-8">
              <a
                href="#participe"
                onClick={(e) => irPara(e, "participe")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-4 text-lg font-semibold text-navy-950"
              >
                Fale comigo <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}