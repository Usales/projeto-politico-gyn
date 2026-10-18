import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, CalendarDays } from "lucide-react";

const CANAL_URL = "https://www.youtube.com/channel/UCoyKBK0rYXIe6g0WcOefx7w";

// Para adicionar outro vídeo, copie um bloco inteiro e troque os dados.
// "id" é o código depois de "v=" no link do YouTube. "data" no formato AAAA-MM-DD.
const videos = [
  {
    id: "IBfWH6IWmWI",
    titulo: "Para onde vai o dinheiro de Goiânia?",
    descricao:
      "Comecei um trabalho de análise das contas públicas, dos contratos, das despesas e dos problemas da administração municipal. A ideia é transformar informações complexas em explicações acessíveis e discutir soluções com base em dados, transparência e responsabilidade fiscal.",
    data: "2026-10-18",
  },
];

const miniatura = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const linkYoutube = (id) => `https://www.youtube.com/watch?v=${id}`;
const formatarData = (data) =>
  new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");

export default function Videos() {
  const [idAtual, setIdAtual] = useState(videos[0]?.id);
  const [tocando, setTocando] = useState(false);
  const playerRef = useRef(null);

  const atual = videos.find((v) => v.id === idAtual);

  function selecionar(id) {
    setIdAtual(id);
    setTocando(false);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-[#070f23] pb-20 pt-32 text-white">
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b82e]">
            Acompanhe
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-[#f5b82e]">Vídeos</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Análises das contas públicas, explicações simples e discussões
            sobre os problemas de Goiânia.
          </p>
        </div>

        {!atual ? (
          <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            Ainda não há vídeos publicados.
          </p>
        ) : (
          <>
            {/* Player principal */}
            <motion.div
              key={atual.id}
              ref={playerRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 grid gap-8 lg:grid-cols-5"
            >
              <div className="lg:col-span-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                  {tocando ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${atual.id}?autoplay=1&playsinline=1&rel=0`}
                      title={atual.titulo}
                      allow="autoplay; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="h-full w-full"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTocando(true)}
                      aria-label={`Reproduzir: ${atual.titulo}`}
                      className="group absolute inset-0 h-full w-full"
                    >
                      <img
                        src={miniatura(atual.id)}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                      <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />
                      <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5b82e] text-[#101827] shadow-xl transition group-hover:scale-110">
                        <Play size={34} className="ml-1 fill-current" />
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays size={14} />
                  Publicado em {formatarData(atual.data)}
                </p>

                <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
                  {atual.titulo}
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {atual.descricao}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={linkYoutube(atual.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f5b82e] px-5 py-3 font-bold text-[#101827] transition hover:bg-[#ffd064]"
                  >
                    <ExternalLink size={18} />
                    Assistir no YouTube
                  </a>

                  <a
                    href={CANAL_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:bg-white/10"
                  >
                    Ver o canal
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Grade: só aparece quando houver mais de um vídeo */}
            {videos.length > 1 && (
              <div className="mt-16">
                <h2 className="text-xl font-bold">Todos os vídeos</h2>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video) => (
                    <button
                      type="button"
                      key={video.id}
                      onClick={() => selecionar(video.id)}
                      aria-pressed={video.id === idAtual}
                      className={`overflow-hidden rounded-2xl border bg-[#111b2e] text-left transition hover:-translate-y-1 hover:border-[#f5b82e]/50 ${
                        video.id === idAtual
                          ? "border-[#f5b82e]"
                          : "border-white/10"
                      }`}
                    >
                      <div className="relative aspect-video bg-black">
                        <img
                          src={miniatura(video.id)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5b82e] text-[#101827]">
                          <Play size={18} className="ml-0.5 fill-current" />
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold leading-snug">
                          {video.titulo}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatarData(video.data)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}