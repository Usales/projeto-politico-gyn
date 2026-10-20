import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, BriefcaseBusiness, Scale, Volume2 } from "lucide-react";
import { useConsentimento } from "../lib/consentimento";
import AvisoTerceiros from "./AvisoTerceiros";

// ID do vídeo no YouTube (a parte depois de "v=" no link)
const YOUTUBE_ID = "IBfWH6IWmWI";

const valores = [
  {
    titulo: "Transparência",
    texto: "Fiscalização dos gastos públicos e responsabilidade com o dinheiro do cidadão.",
    icon: Eye,
  },
  {
    titulo: "Liberdade econômica",
    texto: "Menos burocracia, incentivo ao empreendedorismo e valorização de quem trabalha.",
    icon: BriefcaseBusiness,
  },
  {
    titulo: "Reformas responsáveis",
    texto: "Respeito à lei, eficiência administrativa e mudanças com resultados concretos.",
    icon: Scale,
  },
];

function VideoSobre() {
  const caixaRef = useRef(null);
  const iframeRef = useRef(null);
  const naTela = useInView(caixaRef, { amount: 0.5 });
  const permitido = useConsentimento() === "sim";
  const [carregado, setCarregado] = useState(false);

  function comando(func) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  }

  useEffect(() => {
    // Sem permissão: nada de terceiros é carregado
    if (!permitido) {
      setCarregado(false);
      return;
    }
    // Com permissão: carrega ao chegar na seção, toca ao entrar e pausa ao sair
    if (naTela && !carregado) {
      setCarregado(true);
      return;
    }
    if (carregado) comando(naTela ? "playVideo" : "pauseVideo");
  }, [naTela, carregado, permitido]);

  const origem = encodeURIComponent(window.location.origin);

  return (
    <>
      <div
        ref={caixaRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-950 shadow-2xl"
      >
        {!permitido && (
          <AvisoTerceiros
            servico="o vídeo do YouTube"
            link={`https://www.youtube.com/watch?v=${YOUTUBE_ID}`}
          />
        )}

        {permitido && !carregado && (
          <img
            src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {permitido && carregado && (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${origem}`}
            title="Para onde vai o dinheiro de Goiânia"
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full"
          />
        )}
      </div>

      {permitido && (
        <p className="mt-3 flex items-center gap-2 text-xs text-white/50">
          <Volume2 size={14} className="shrink-0" />
          O vídeo começa sem som. Toque no ícone de som do player para ativar o áudio.
        </p>
      )}
    </>
  );
}

export default function Sobre() {
  return (
    <section id="sobre" className="bg-navy-900 py-20 text-white md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Sobre mim
          </span>

          <h2 className="font-display mt-3 text-3xl font-extrabold md:text-5xl">
            Gabriel Henriques Sales
          </h2>

          <p className="mt-3 text-sm font-semibold text-gold-400">
            Conservador reformista · Direita
          </p>

          <p className="mb-3 mt-6 text-sm text-white/60">
            Assista: Para onde vai o dinheiro de Goiânia
          </p>

          <VideoSobre />

          <a
            href="#propostas"
            className="mt-6 inline-flex rounded-xl bg-gold-400 px-5 py-3 font-bold text-navy-900 transition hover:bg-gold-300"
          >
            Conheça minhas propostas
          </a>
        </motion.div>

        <div className="space-y-3 md:col-span-2">
          {valores.map((valor, i) => {
            const Icon = valor.icon;

            return (
              <motion.article
                key={valor.titulo}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <Icon size={21} className="shrink-0 text-gold-400" />
                  <h3 className="font-display font-bold text-gold-400">
                    {valor.titulo}
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {valor.texto}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}