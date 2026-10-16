
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  X,
  Search,
  ShieldCheck,
  Wallet,
  Landmark,
  Scale,
  ChevronRight,
  Clock3,
  Eye,
} from "lucide-react";

const projetos = [
  {
    id: 1,
    titulo: "Projeto demonstrativo: Segurança urbana",
    descricao:
      "Exemplo de proposta voltada à prevenção da violência e à melhoria da segurança nos espaços públicos.",
    categoria: "Segurança",
    status: "Exemplo ilustrativo",
    pdf: "/documentos/projeto-exemplo-1.pdf",
    caracteristicas: [
      {
        titulo: "Objetivo",
        descricao:
          "Estabelecer medidas municipais de prevenção e melhorar a utilização segura dos espaços públicos.",
        icone: ShieldCheck,
      },
      {
        titulo: "Competência municipal",
        descricao:
          "A proposta precisará respeitar as competências constitucionais do Município e dos órgãos de segurança.",
        icone: Landmark,
      },
      {
        titulo: "Impacto financeiro",
        descricao:
          "Será necessário avaliar custos de implementação, estrutura administrativa e disponibilidade orçamentária.",
        icone: Wallet,
      },
    ],
    dificuldade: "A avaliar",
    analise:
      "A dificuldade dependerá do texto definitivo, da competência legislativa, dos custos e do apoio político. Não é possível estimar a aprovação sem uma análise concreta.",
  },
  {
    id: 2,
    titulo: "Projeto demonstrativo: Empreendedorismo",
    descricao:
      "Exemplo de iniciativa para simplificar procedimentos municipais e facilitar a atividade de pequenos negócios.",
    categoria: "Economia",
    status: "Exemplo ilustrativo",
    pdf: "/documentos/projeto-exemplo-2.pdf",
    caracteristicas: [
      {
        titulo: "Objetivo",
        descricao:
          "Estudar a simplificação de procedimentos administrativos para pequenos empreendedores.",
        icone: Wallet,
      },
      {
        titulo: "Competência municipal",
        descricao:
          "Verificar quais licenças, procedimentos e regras locais podem ser alterados por lei municipal.",
        icone: Scale,
      },
      {
        titulo: "Impacto financeiro",
        descricao:
          "Avaliar eventuais custos administrativos e possíveis efeitos sobre a arrecadação municipal.",
        icone: Landmark,
      },
    ],
    dificuldade: "A avaliar",
    analise:
      "A viabilidade dependerá das regras municipais envolvidas, da existência de renúncia de receita, dos requisitos legais e da articulação com os vereadores.",
  },
];

const categorias = ["Todos", "Segurança", "Economia"];

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
            {/* Cabeçalho fixo */}
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

            {/* Somente esta área terá rolagem */}
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
                  <Scale size={18} className="shrink-0 text-[#f5b82e]" />
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
                  Situação: {projeto.status}. As informações de tramitação e
                  viabilidade devem ser atualizadas conforme a situação real.
                </p>
              </div>
            </div>

            {/* Rodapé fixo: o botão não rola com o conteúdo */}
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

  // Impede que a página de fundo role enquanto o modal estiver aberto.
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

  // Permite fechar o modal com a tecla Escape.
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
    const correspondeBusca = texto.includes(busca.toLowerCase());

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
