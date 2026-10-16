import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Propostas", href: "#propostas" },
  { label: "Sobre", href: "#sobre" },
  { label: "Participe", href: "#participe" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#inicio" className="font-display text-lg font-bold tracking-tight text-white">
          Gabriel <span className="text-gold-400">Henriques</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-white/80 transition hover:text-gold-400">
              {l.label}
            </a>
          ))}
          <a href="#participe" className="rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-500">
            Fale comigo
          </a>
        </nav>

        <button className="text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/90">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}