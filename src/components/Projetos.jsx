
import { useState, useEffect } from "react";
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
} from "lucide-react";

const projetos = [
  {
    id: 1,
    titulo: "Redução responsável da carga tributária municipal",
    descricao:
      "Anteprojeto que estabelece diretrizes de transparência tributária, avaliação da arrecadação e identificação de oportunidades juridicamente viáveis de redução de tributos municipais em Goiânia.",
    categoria: "Tributação",
    status: "Anteprojeto para discussão legislativa",
    pdf: "/documentos/anteprojeto-reducao-tributaria-goiania.pdf",
    caracteristicas: [
      {
        titulo: "Objetivo",
        descricao:
          "Promover transparência na divulgação dos tributos municipais e identificar oportunidades de simplificação e redução responsável da carga tributária.",
        icone: Landmark,
      },
      {
        titulo: "Transparência tributária",
        descricao:
          "Prever diretrizes para a divulgação de informações sobre arrecadação, alterações tributárias, benefícios fiscais e custos de cumprimento das obrigações.",
        icone: FileText,
      },
      {
        titulo: "Responsabilidade fiscal",
        descricao:
          "Exigir a observância dos requisitos legais e a avaliação do impacto orçamentário-financeiro quando houver renúncia de receita.",
        icone: Wallet,
      },
      {
        titulo: "Limites jurídicos",
        descricao:
          "A proposta trata dos tributos municipais. Não pretende alterar impostos estaduais, como ICMS e IPVA, nem tributos federais.",
        icone: Scale,
      },
    ],
    dificuldade: "A avaliar",
    analise:
      "A viabilidade depende da análise da competência legislativa, das regras de iniciativa, da legislação tributária municipal e dos impactos orçamentários. O texto deve ser revisado pela Procuradoria Legislativa e por especialistas antes de eventual apresentação formal.",
  },
  {
    id: 2,
    titulo:
      "Transparência, Valorização e Proteção a GCM e ao Monitoramento das Metas de Segurança Pública de Goiânia",
    descricao:
      "Anteprojeto que estabelece diretrizes para ampliar a transparência da execução do Plano Municipal de Segurança Pública e Defesa Social 2024–2034, acompanhar suas metas e divulgar indicadores agregados de proteção e segurança ocupacional dos integrantes da Guarda Civil Metropolitana.",
    categoria: "Segurança Pública",
    status: "Anteprojeto para discussão legislativa",
    pdf: "/documentos/Transparência, Valorização e Proteção Institucional da Guarda Civil Metropolitana e Monitoramento das Metas de Segurança Pública de Goiânia.pdf",
    caracteristicas: [
      {
        titulo: "Objetivo",
        descricao:
          "Facilitar o acompanhamento público das metas e ações municipais de segurança, contribuindo para uma política orientada a resultados.",
        icone: ShieldCheck,
      },
      {
        titulo: "Transparência das metas",
        descricao:
          "Permitir o acompanhamento de prazos, responsáveis, situação de execução, resultados e informações orçamentárias disponíveis sobre as ações do plano municipal de segurança.",
        icone: FileText,
      },
      {
        titulo: "Valorização e proteção da GCM",
        descricao:
          "Promover a divulgação de indicadores agregados sobre capacitação, equipamentos de proteção, incidentes ocupacionais e medidas preventivas, respeitando a privacidade dos agentes.",
        icone: ShieldCheck,
      },
      {
        titulo: "Fiscalização e responsabilidade",
        descricao:
          "Apoiar o controle social e a fiscalização parlamentar, aproveitando os mecanismos administrativos existentes e preservando informações legalmente sigilosas.",
        icone: Scale,
      },
    ],
    dificuldade: "A avaliar",
    analise:
      "A viabilidade depende da análise da competência legislativa municipal, das regras de iniciativa e da compatibilidade com a legislação orçamentária, a proteção de dados pessoais e as competências dos órgãos municipais. A proposta busca aperfeiçoar a transparência de um plano já existente, sem criar outro plano de segurança ou interferir na gestão cotidiana da GCM. Recomenda-se revisão jurídica antes de eventual apresentação formal.",
  },
];

const categorias = [
  "Todos",
  "Tributação",
  "Segurança Pública",
];

function MiniaturaPDF({ titulo }) {
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

        <div className="mb-3 text-[8px] font-bold uppercase leading-3 text-gray-700">
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
        PDF
      </span>
    </div>
  );
}

function ModalProjeto({ projeto, fechar }) {
  return (
    <AnimatePresence>
      {projeto && (
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

                <div className="space-y-4">
                  {projeto.caracteristicas.map((item) => {
                    const Icone = item.icone;

                    return (
                      <div key={item.titulo} className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5b82e]/10 text-[#f5b82e]">
                          <Icone size={18} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold">
                            {item.titulo}
                          </h4>

                          <p className="mt-1 text-sm leading-5 text-slate-300">
                            {item.descricao}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  {projeto.dificuldade}
                </p>

                <p className="mt-2 text-sm leading-5 text-slate-300">
                  {projeto.analise}
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                <Clock3 size={15} className="mt-0.5 shrink-0" />

                <p>
                  Este documento é um anteprojeto para discussão política e
                  técnica. Ainda depende de conferência legislativa, análise
                  jurídica e avaliação dos impactos orçamentários antes de
                  eventual protocolo.
                </p>
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-[#0b1425] p-4 sm:p-5">
              <a
                href={projeto.pdf}
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5b82e] px-4 py-3 font-bold text-[#101827] transition hover:bg-[#ffd064]"
              >
                <Download size={19} />
                Baixar documento do PL (PDF)
              </a>

              <p className="mt-2 text-center text-xs text-slate-400">
                O download depende da existência do arquivo PDF correspondente.
              </p>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projetos() {
  const [categoria, setCategoria] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    if (!selecionado) return;

    const overflowAnterior = document.body.style.overflow;
    const htmlOverflowAnterior = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.documentElement.style.overflow = htmlOverflowAnterior;
    };
  }, [selecionado]);

  useEffect(() => {
    if (!selecionado) return;

    function lidarComTecla(e) {
      if (e.key === "Escape") {
        setSelecionado(null);
      }
    }

    window.addEventListener("keydown", lidarComTecla);

    return () => {
      window.removeEventListener("keydown", lidarComTecla);
    };
  }, [selecionado]);

  const projetosFiltrados = projetos.filter((projeto) => {
    const correspondeCategoria =
      categoria === "Todos" || projeto.categoria === categoria;

    const texto = `${projeto.titulo} ${projeto.descricao}`.toLowerCase();
    const correspondeBusca = texto.includes(busca.toLowerCase().trim());

    return correspondeCategoria && correspondeBusca;
  });

  return (
    <main className="min-h-screen bg-[#070f23] pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b82e]">
            Transparência legislativa
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
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

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projetosFiltrados.map((projeto, index) => (
            <motion.article
              key={projeto.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#111b2e] transition hover:-translate-y-1 hover:border-[#f5b82e]/50 hover:shadow-xl hover:shadow-black/20"
            >
              <MiniaturaPDF titulo={projeto.titulo} />

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f5b82e]/10 px-3 py-1 text-xs font-semibold text-[#f5b82e]">
                    {projeto.categoria}
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {projeto.status}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold leading-snug">
                  {projeto.titulo}
                </h2>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-300">
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

        {projetosFiltrados.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <FileText className="mx-auto text-slate-400" size={34} />

            <h2 className="mt-4 text-lg font-bold">
              Nenhum projeto encontrado
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Tente outro termo ou selecione uma categoria diferente.
            </p>
          </div>
        )}
      </section>

      <ModalProjeto
        projeto={selecionado}
        fechar={() => setSelecionado(null)}
      />
    </main>
  );
}
