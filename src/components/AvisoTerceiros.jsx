import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { definirConsentimento } from "../lib/consentimento";

export default function AvisoTerceiros({ servico, link }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-navy-950 p-5 text-center text-white">
      <ShieldAlert size={30} className="text-gold-400" aria-hidden="true" />

      <p className="max-w-md text-sm leading-relaxed text-white/80">
        Para mostrar {servico}, este site precisa carregar um serviço de
        terceiros, que passa a receber o seu endereço IP e pode usar cookies.
        Quer permitir?
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => definirConsentimento("sim")}
          className="min-h-11 rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-500"
        >
          Permitir e carregar
        </button>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Abrir no site original
          </a>
        )}
      </div>

      <Link to="/privacidade#politica" className="text-xs text-white/60 underline">
        Política de Privacidade
      </Link>
    </div>
  );
}