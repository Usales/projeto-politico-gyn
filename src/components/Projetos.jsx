
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  X,
  Search,
  Wallet,
  Landmark,
  Scale,
  ChevronRight,
  Clock3,
  Eye,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const ICONE_CATEGORIA = {
  Tributação: Wallet,
  "Segurança Pública": ShieldCheck,
  "Mobilidade Urbana": Landmark,
  Transparência: Eye,
  "Desenvolvimento Econômico": Scale,
};

function MiniaturaPDF({ titulo, temPdf }) {
  return (
    <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-t-xl bg-[#e9edf3] p-5">
      <div className="relative h-full w-36 rotate-[-2deg] rounded-sm border border-gray-300 bg-white p-3 shadow-xl">
        <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#111b30]">
            <Landmark size={15} className="text-[#f5b82e]" />
          </div>

          <div className="flex-1">
            <div className="h-1.5 w-14 rounded bg-gray-500" />
            <div className="mt-1 h-1 w-10 rounded bg-gray-300" />
          </div>
        </div>

        <div className="mb-3 line-clamp-4 text-[8px] font-bold uppercase leading-3 text-gray-700">
          {titulo}
        </div>

        <div className="space-y-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-1 rounded bg-gray-200"
              style={{ width: `${i % 3 === 0 ? 70 : 100}%` }}
            />
          ))}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between border-t border-gray-200 pt-2">
          <span className="text-[8px] font-semibold text-gray-400">
            DOCUMENTO
          </span>
          <FileText size={13} className="text-red-600" />
        </div>
      </div>

      <span className="absolute bottom-3 right-3 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
        {temPdf ? "PDF" : "SEM PDF"}
      </span>
    </div>
  );
}

function ModalProjeto({ projeto, fechar }) {
  if (!projeto) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-black/75 p-3 backdrop-blur-sm sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-projeto"
          className="flex max-h-[85dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101a2d] text-white shadow-2xl"
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b82e]">
                {projeto.categoria} · Documento legislativo
              </span>

              <h2
                id="titulo-modal-projeto"
                className="mt-2 text-xl font-bold leading-tight sm:text-2xl"
              >
                {projeto.titulo}
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-300">
                {projeto.descricao}
              </p>
            </div>

            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar detalhes"
              className="shrink-0 rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X size={21} />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5">
            <div>
              <h3 className="mb-4 text-base font-bold">
                Características principais
              </h3>

              {projeto.caracteristicas.length ? (
                <div className="space-y-4">
                  {projeto.caracteristicas.map((item, indice) => {
                    const Icone = ICONE_CATEGORIA[projeto.categoria] || FileText;

                    return (
                      <div
                        key={`${item.titulo}-${indice}`}
                        className="flex gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5b82e]/10 text-[#f5b82e]">
                          <Icone size={18} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold">
                            {item.titulo}
                          </h4>
                          <p className="mt-1 whitespace-pre-line text-sm leading-5 text-slate-300">
                            {item.descricao}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Nenhuma característica foi informada para este documento.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-[#172338] p-4">
              <div className="flex items-center gap-2">
                <Scale
                  size={18}
                  className="shrink-0 text-[#f5b82e]"
                />
                <h3 className="text-sm font-bold">
                  Dificuldade estimada de aprovação
                </h3>
              </div>

              <p className="mt-2 text-base font-bold text-[#f5b82e]">
                {projeto.dificuldade || "A avaliar"}
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-5 text-slate-300">
                {projeto.analise || "Ainda não há análise de viabilidade cadastrada."}
              </p>
            </div>

            <div className="flex items-start gap-2 text-xs leading-5 text-slate-400">
              <Clock3 size={15} className="mt-0.5 shrink-0" />
              <p>
                A publicação deste documento não significa que ele tenha sido
                formalmente protocolado ou aprovado. Confira o conteúdo e sua
                situação antes de utilizá-lo como referência legislativa.
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#0b1425] p-4 sm:p-5">
            {projeto.pdf_url ? (
              <a
                href={projeto.pdf_url}
                target="_blank"
                rel="noreferrer"
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5b82e] px-4 py-3 font-bold text-[#101827] transition hover:bg-[#ffd064]"
              >
                <Download size={19} />
                Abrir / baixar documento PDF
              </a>
            ) : (
              <p className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-slate-400">
                O PDF ainda não foi anexado a este documento.
              </p>
            )}
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Projetos() {
  const [documentos, setDocumentos] = useState([]);
  const [categoria, setCategoria] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDocumentos() {
      setCarregando(true);
      setErro("");

      if (!supabase) {
        setErro("Não foi possível conectar ao sistema de documentos.");
        setCarregando(false);
        return;
      }

      const { data, error } = await supabase
        .from("documentos")
        .select(
          "id, titulo, descricao, categoria, status, pdf_url, caracteristicas, dificuldade, analise, publicado, created_at"
        )
        .eq("publicado", true)
        .order("created_at", { ascending: false });

      if (!ativo) return;

      if (error) {
        setErro("Não foi possível carregar os documentos. Tente novamente mais tarde.");
      } else {
        setDocumentos(data || []);
      }

      setCarregando(false);
    }

    carregarDocumentos();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!selecionado) return;

    const overflowAnterior = document.body.style.overflow;
    const htmlOverflowAnterior = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function lidarComTecla(evento) {
      if (evento.key === "Escape") setSelecionado(null);
    }

    window.addEventListener("keydown", lidarComTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.documentElement.style.overflow = htmlOverflowAnterior;
      window.removeEventListener("keydown", lidarComTecla);
    };
  }, [selecionado]);

  const categorias = useMemo(
    () => [
      "Todos",
      ...new Set(documentos.map((item) => item.categoria).filter(Boolean)),
    ],
    [documentos]
  );

  const documentosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return documentos.filter((documento) => {
      const correspondeCategoria =
        categoria === "Todos" || documento.categoria === categoria;

      const texto = [
        documento.titulo,
        documento.descricao,
        documento.categoria,
        documento.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return correspondeCategoria && texto.includes(termo);
    });
  }, [documentos, categoria, busca]);

  return (
    <main className="min-h-screen bg-[#070f23] pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b82e]">
            Transparência legislativa
          </span>

          <h1 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Projetos de <span className="text-[#f5b82e]">Lei</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Conheça propostas para Goiânia, entenda seus objetivos e consulte
            os documentos disponibilizados para leitura.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categorias.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategoria(item)}
                aria-pressed={categoria === item}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  categoria === item
                    ? "border-[#f5b82e] bg-[#f5b82e] text-[#101827]"
                    : "border-white/15 bg-white/5 text-slate-300 hover:border-[#f5b82e]/60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 md:max-w-sm">
            <Search size={19} className="shrink-0 text-slate-400" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar projetos..."
              aria-label="Pesquisar projetos"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        {carregando && (
          <div className="mt-12 flex items-center justify-center gap-3 text-slate-300">
            <LoaderCircle className="animate-spin text-[#f5b82e]" size={23} />
            Carregando documentos...
          </div>
        )}

        {!carregando && erro && (
          <div
            role="alert"
            className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center"
          >
            <AlertCircle size={30} className="mx-auto text-red-300" />
            <p className="mt-3 text-sm text-red-200">{erro}</p>
          </div>
        )}

        {!carregando && !erro && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {documentosFiltrados.map((projeto, index) => (
                <motion.article
                  key={projeto.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#111b2e] transition hover:-translate-y-1 hover:border-[#f5b82e]/50 hover:shadow-xl hover:shadow-black/20"
                >
                  <MiniaturaPDF
                    titulo={projeto.titulo}
                    temPdf={Boolean(projeto.pdf_url)}
                  />

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f5b82e]/10 px-3 py-1 text-xs font-semibold text-[#f5b82e]">
                        {projeto.categoria}
                      </span>

                      {projeto.status && (
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {projeto.status}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display mt-3 text-xl font-bold leading-tight sm:text-2xl">
                      {projeto.titulo}
                    </h2>

                    <p className="mt-3 min-h-[72px] whitespace-pre-line text-sm leading-6 text-slate-300">
                      {projeto.descricao}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelecionado(projeto)}
                      className="mt-5 flex w-full items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                    >
                      <span className="flex items-center gap-2">
                        <Eye size={17} className="text-[#f5b82e]" />
                        Ver detalhes e PDF
                      </span>
                      <ChevronRight size={18} className="text-[#f5b82e]" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {documentosFiltrados.length === 0 && (
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                <FileText className="mx-auto text-slate-400" size={34} />
                <h2 className="font-display mt-3 text-xl font-bold sm:text-2xl">
                  Nenhum documento encontrado
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Tente outro termo ou selecione uma categoria diferente.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <ModalProjeto
        projeto={selecionado}
        fechar={() => setSelecionado(null)}
      />
    </main>
  );
}
