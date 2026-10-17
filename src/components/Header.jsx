import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";

// Seções da página inicial (âncoras)
const links = [
  { label: "Propostas", id: "propostas" },
  { label: "Como eu atuo", id: "atuacao" },
  { label: "Sobre", id: "sobre" },
  { label: "Dúvidas", id: "duvidas" },
  { label: "Participe", id: "participe" },
];

// Páginas independentes (rotas)
const acompanhar = [
  { label: "Opiniões da população", id: "opinioes", path: "/opinioes" },
  { label: "Bairros visitados", id: "bairros", path: "/bairros" },
  { label: "Projetos de Lei", id: "projetos", path: "/projetos" },
  { label: "Vídeos", id: "videos", path: "/videos" },
];

const ids = ["inicio", ...links.map((l) => l.id)];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const active = useActiveSection(ids, location.pathname);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSubmenuOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
        setSubmenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Leva a uma seção da página inicial
  function irPara(e, id) {
    e.preventDefault();
    setOpen(false);
    setSubmenuOpen(false);

    const rolar = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!isHome) {
      navigate("/");
      window.setTimeout(rolar, 200);
      return;
    }
    rolar();
  }

  // Abre uma página independente
  function abrirPagina(e, path) {
    e.preventDefault();
    setOpen(false);
    setSubmenuOpen(false);

    if (location.pathname !== path) {
      navigate(path);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const linkClass = (id) =>
    `text-sm font-medium transition hover:text-gold-400 ${
      isHome && active === id ? "text-gold-400" : "text-white/80"
    }`;

  const submenuAtivo = acompanhar.some((l) => l.path === location.pathname);

  return (
    <>
      <header
        className={`safe-top fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open || !isHome
            ? "border-b border-white/10 bg-navy-950/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          {/* Marca */}
          <Link
            to="/"
            onClick={(e) => irPara(e, "inicio")}
            className="font-display shrink-0 text-lg font-bold tracking-tight text-white"
          >
            Gabriel <span className="text-gold-400">Henriques</span>
          </Link>

          {/* Menu desktop */}
          <nav className="hidden items-center gap-6 lg:flex">
            {links
              .filter((l) => l.id !== "participe")
              .map((l) => (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => irPara(e, l.id)}
                  className={linkClass(l.id)}
                >
                  {l.label}
                </a>
              ))}

            {/* Submenu Acompanhe */}
            <div
              className="relative"
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSubmenuOpen((v) => !v)}
                aria-expanded={submenuOpen}
                className={`flex items-center gap-1 text-sm font-medium transition hover:text-gold-400 ${
                  submenuAtivo ? "text-gold-400" : "text-white/80"
                }`}
              >
                Acompanhe
                <ChevronDown
                  size={15}
                  className={`transition-transform ${submenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {submenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-50 w-64 pt-3"
                  >
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-950 p-2 shadow-xl">
                      {acompanhar.map((l) => (
                        <Link
                          key={l.id}
                          to={l.path}
                          onClick={(e) => abrirPagina(e, l.path)}
                          className={`block rounded-lg px-4 py-3 text-sm transition hover:bg-white/5 hover:text-gold-400 ${
                            location.pathname === l.path ? "text-gold-400" : "text-white/80"
                          }`}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/#participe"
              onClick={(e) => irPara(e, "participe")}
              className={linkClass("participe")}
            >
              Participe
            </a>

            <a
              href="/#participe"
              onClick={(e) => irPara(e, "participe")}
              className="rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-500"
            >
              Fale comigo
            </a>
          </nav>

          {/* Botão mobile */}
          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Barra de progresso */}
        <motion.div
          style={{ scaleX }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold-400"
        />
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="safe-bottom fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-navy-950 px-8 pb-8 pt-24 lg:hidden"
          >
            <nav className="flex flex-1 flex-col gap-1">
              {links.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => irPara(e, l.id)}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className={`font-display border-b border-white/10 py-3 text-2xl font-bold ${
                    isHome && active === l.id ? "text-gold-400" : "text-white"
                  }`}
                >
                  {l.label}
                </motion.a>
              ))}

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
                  Acompanhe
                </p>

                {acompanhar.map((l, i) => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * (links.length + i) }}
                  >
                    <Link
                      to={l.path}
                      onClick={(e) => abrirPagina(e, l.path)}
                      className={`block border-b border-white/10 py-3 text-lg ${
                        location.pathname === l.path ? "text-gold-400" : "text-white/80"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            <a
              href="/#participe"
              onClick={(e) => irPara(e, "participe")}
              className="mt-6 flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-4 text-lg font-semibold text-navy-950"
            >
              Fale comigo <ArrowRight size={20} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}