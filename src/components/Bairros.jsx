import MapaBairros from "./MapaBairros";
import { useMemo, useState } from "react";
import {
  MapPin,
  CheckCircle2,
  CircleX,
  Search,
  CalendarDays,
} from "lucide-react";

const bairrosIniciais = [
  { nome: "Conjunto Palmares", regiao: "Leste", visitado: false, data: "" },
  { nome: "Santo Hilário", regiao: "Norte", visitado: false, data: "" },
  { nome: "Parque das Amendoeiras", regiao: "Norte", visitado: false, data: "" },
  { nome: "Recanto das Minas Gerais", regiao: "Norte", visitado: false, data: "" },
  { nome: "Jardim Guanabara", regiao: "Norte", visitado: false, data: "" },
  { nome: "Jaó", regiao: "Norte", visitado: false, data: "" },
  { nome: "Setor Urias Magalhães", regiao: "Norte", visitado: false, data: "" },
  { nome: "Centro", regiao: "Central", visitado: false, data: "" },
  { nome: "Setor Bueno", regiao: "Sul", visitado: false, data: "" },
  { nome: "Jardim América", regiao: "Sul", visitado: false, data: "" },
  { nome: "Campinas", regiao: "Oeste", visitado: false, data: "" },
  { nome: "Finsocial", regiao: "Noroeste", visitado: false, data: "" },
  { nome: "Residencial Havaí", regiao: "Leste", visitado: false, data: "" },
];

const filtros = [
  { id: "todos", label: "Todos" },
  { id: "pendentes", label: "A visitar" },
  { id: "visitados", label: "Visitados" },
];

const ordemRegioes = ["Central", "Norte", "Sul", "Leste", "Oeste", "Noroeste"];

export default function Bairros() {
  const [bairros, setBairros] = useState(bairrosIniciais);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const totalVisitados = bairros.filter((bairro) => bairro.visitado).length;

  const progresso = bairros.length
    ? Math.round((totalVisitados / bairros.length) * 100)
    : 0;

  const listaFiltrada = useMemo(() => {
    return bairros.filter((bairro) => {
      const correspondeBusca = bairro.nome
        .toLowerCase()
        .includes(busca.toLowerCase().trim());

      const correspondeFiltro =
        filtro === "todos" ||
        (filtro === "visitados" && bairro.visitado) ||
        (filtro === "pendentes" && !bairro.visitado);

      return correspondeBusca && correspondeFiltro;
    });
  }, [bairros, busca, filtro]);

  const bairrosPorRegiao = useMemo(() => {
    return ordemRegioes
      .map((regiao) => ({
        regiao,
        bairros: listaFiltrada.filter(
          (bairro) => bairro.regiao === regiao
        ),
      }))
      .filter((grupo) => grupo.bairros.length > 0);
  }, [listaFiltrada]);

  function alternarVisita(nome) {
    setBairros((atuais) =>
      atuais.map((bairro) => {
        if (bairro.nome !== nome) return bairro;

        const novoStatus = !bairro.visitado;

        return {
          ...bairro,
          visitado: novoStatus,
          data: novoStatus
            ? new Date().toLocaleDateString("pt-BR")
            : "",
        };
      })
    );
  }

  return (
    <section
      id="bairros"
      className="min-h-screen bg-navy-950 px-5 pb-20 pt-28 text-white md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-gold-400">
          Presença nos bairros
        </span>

        <h1 className="font-display mt-3 text-3xl font-extrabold md:text-5xl">
          Goiânia, bairro por bairro.
        </h1>

        <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
          Acompanhe o planejamento das visitas e consulte as regiões
          que ainda precisam ser percorridas. O objetivo é ouvir a
          população e conhecer de perto as demandas de cada região.
        </p>

        {/* Indicadores */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <MapPin className="mb-3 text-gold-400" size={22} />
            <p className="text-3xl font-bold">{bairros.length}</p>
            <p className="mt-1 text-sm text-white/60">
              Bairros cadastrados
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <CheckCircle2 className="mb-3 text-green-400" size={22} />
            <p className="text-3xl font-bold">{totalVisitados}</p>
            <p className="mt-1 text-sm text-white/60">
              Visitas registradas
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Progresso</span>
              <span className="font-bold text-gold-400">
                {progresso}%
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-white/60">
              Do planejamento cadastrado
            </p>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold">Mapa de Goiânia</h2>
          <p className="mt-2 text-sm text-white/60">
            Em verde, os bairros visitados. Em vermelho, os que ainda serão visitados.
          </p>
          <div className="mt-5">
            <MapaBairros bairros={bairros} />
          </div>
        </div>

        {/* Busca e filtros */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold">
            Planejamento de visitas
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Marque os bairros como visitados depois que as visitas acontecerem.
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar bairro..."
                aria-label="Buscar bairro"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white outline-none placeholder:text-white/40 focus:border-gold-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filtros.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFiltro(item.id)}
                  aria-pressed={filtro === item.id}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    filtro === item.id
                      ? "border-gold-400 bg-white/10 text-gold-400"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de bairros */}
        <div className="mt-8 space-y-8">
          {bairrosPorRegiao.map((grupo) => (
            <section
              key={grupo.regiao}
              aria-labelledby={`regiao-${grupo.regiao}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <h3
                  id={`regiao-${grupo.regiao}`}
                  className="text-lg font-bold text-gold-400"
                >
                  Região {grupo.regiao}
                </h3>

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-white/50">
                  {grupo.bairros.length}{" "}
                  {grupo.bairros.length === 1 ? "bairro" : "bairros"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {grupo.bairros.map((bairro) => (
                  <article
                    key={bairro.nome}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-semibold">{bairro.nome}</h4>

                        {bairro.visitado && bairro.data ? (
                          <p className="mt-2 flex items-center gap-2 text-xs text-white/50">
                            <CalendarDays size={14} />
                            Visitado em {bairro.data}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-white/45">
                            Visita ainda não realizada
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          bairro.visitado
                            ? "bg-green-400/10 text-green-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {bairro.visitado ? "Visitado" : "Pendente"}
                      </span>
                    </div>

                    {/* Ação disponível somente após registrar a visita */}
                    {bairro.visitado ? (
                      <button
                        type="button"
                        onClick={() => alternarVisita(bairro.nome)}
                        aria-label={`Desfazer visita em ${bairro.nome}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-green-400/30 px-4 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-400/10 focus:outline-none focus:ring-2 focus:ring-gold-400"
                      >
                        <CheckCircle2 size={17} />
                        Desmarcar visita
                      </button>
                    ) : (
                      <div
                        className="mt-4 inline-flex items-center gap-2 text-sm text-red-400/80"
                        aria-label="Bairro ainda não visitado"
                      >
                        <CircleX size={17} />
                        Ainda não visitado
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {listaFiltrada.length === 0 && (
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
            Nenhum bairro encontrado para essa busca.
          </p>
        )}
      </div>
    </section>
  );
}
