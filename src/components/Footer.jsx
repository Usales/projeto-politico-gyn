import { ArrowUp } from "lucide-react";
import { contato } from "../data/site";

const links = [
  { label: "Propostas", href: "#propostas" },
  { label: "Como eu atuo", href: "#atuacao" },
  { label: "Sobre", href: "#sobre" },
  { label: "Dúvidas", href: "#duvidas" },
  { label: "Participe", href: "#participe" },
];

export default function Footer() {
  return (
    <footer className="safe-bottom bg-navy-950 pt-14 text-white/60">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-white">
              Gabriel <span className="text-gold-400">Henriques</span>
            </p>
            <p className="mt-2 max-w-xs text-sm">
              Menos imposto, mais liberdade, poder sob vigilância e cidadão participando.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="py-1 transition hover:text-gold-400">
                {l.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-12 w-12 items-center justify-center self-start rounded-full border border-white/20 text-white transition hover:bg-gold-400 hover:text-navy-950"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Gabriel Henriques Sales · Goiânia, GO</p>
          <a
            href={`https://instagram.com/${contato.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-gold-400"
          >
            @{contato.instagram}
          </a>
        </div>
        <p className="mt-4 text-xs text-white/40">
          Conteúdo de caráter informativo, de apresentação de ideias e propostas.
        </p>
      </div>
    </footer>
  );
}