import { Link } from "react-router-dom";
import { definirConsentimento, useConsentimento } from "../lib/consentimento";

export default function BannerConsentimento() {
  const consentimento = useConsentimento();

  if (consentimento !== null) return null;

  const botao =
    "min-h-11 flex-1 rounded-full px-6 py-2 text-sm font-semibold transition md:flex-none";

  return (
    <div
      role="dialog"
      aria-labelledby="titulo-consentimento"
      aria-describedby="texto-consentimento"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-navy-950 px-5 pt-4 text-white shadow-2xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p id="titulo-consentimento" className="font-display font-bold">
            Sua privacidade
          </p>
          <p
            id="texto-consentimento"
            className="mt-1 max-w-3xl text-sm leading-relaxed text-white/75"
          >
            Este site não usa cookies de publicidade nem de análise de
            audiência. Os vídeos do YouTube e o mapa (OpenStreetMap) são de
            terceiros e só carregam se você permitir, pois esses serviços
            recebem seu endereço IP e podem usar cookies. Veja a{" "}
            <Link to="/privacidade#politica" className="underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => definirConsentimento("nao")}
            className={`${botao} bg-white text-navy-950 hover:bg-white/90`}
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => definirConsentimento("sim")}
            className={`${botao} bg-gold-400 text-navy-950 hover:bg-gold-500`}
          >
            Permitir
          </button>
        </div>
      </div>
    </div>
  );
}