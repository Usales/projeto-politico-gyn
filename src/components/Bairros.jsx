
import { useMemo, useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Clock3,
  Search,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

const bairrosIniciais = [
  { nome: "Santo Hilário", regiao: "Norte", visitado: false, data: "", observacoes: "" },
  { nome: "Jardim Guanabara", regiao: "Norte", visitado: false, data: "", observacoes: "" },
  { nome: "Jaó", regiao: "Norte", visitado: false, data: "", observacoes: "" },
  { nome: "Setor Urias Magalhães", regiao: "Norte", visitado: false, data: "", observacoes: "" },
  { nome: "Centro", regiao: "Central", visitado: false, data: "", observacoes: "" },
  { nome: "Setor Bueno", regiao: "Sul", visitado: false, data: "", observacoes: "" },
  { nome: "Jardim América", regiao: "Sul", visitado: false, data: "", observacoes: "" },
  { nome: "Campinas", regiao: "Oeste", visitado: false, data: "", observacoes: "" },
  { nome: "Finsocial", regiao: "Noroeste", visitado: false, data: "", observacoes: "" },
  { nome: "Residencial Havaí", regiao: "Leste", visitado: false, data: "", observacoes: "" },
];

const filtros = [
  { id: "todos", label: "Todos" },
  { id: "pendentes", label: "A visitar" },
  { id: "visitados", label: "Visitados" },
];

export default function Bairros() {
  const [bairros, setBairros] = useState(bairrosIniciais);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [selecionado, setSelecionado] = useState(null);

  const totalVisitados = bairros.filter((b) => b.visitado).length;
  const progresso = bairros.length
    ? Math.round((totalVisitados / bairros.length) * 100)
    : 0;

  const listaFiltrada = useMemo(() => {
    return bairros.filter((bairro) => {
      const correspondeBusca = bairro.nome
        .toLowerCase()
        .includes(busca.toLowerCase());

      const correspondeFiltro =
        filtro === "todos" ||
        (filtro === "visitados" && bairro.visitado) ||
        (filtro === "pendentes" && !bairro.visitado);

      return correspondeBusca && correspondeFiltro;
    });
  }, [bairros, busca, filtro]);

  function alternarVisita(nome) {
    setBairros((atual) =>
      atual.map((bairro) =>
        bairro.nome === nome
          ? {
              ...bairro,
              visitado: !bairro.visitado,
              data: !bairro.visitado
                ? new Date().toLocaleDateString("pt-BR")
                : "",
            }
          : bairro
      )
    );
  }

  const bairroSelecionado = bairros.find(
    (bairro) => bairro.nome === selecionado
  );

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
          Acompanhe o planejamento das visitas, registre as conversas
          com moradores e consulte as regiões que ainda precisam ser
          percorridas. O objetivo é ouvir a população e conhecer de
          perto as demandas de cada região.
        </p>

        {/* Indicadores */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <MapPin className="mb-3 text-gold-400" size={22} />
            <p className="text-3xl font-bold">{bairros.length}</p>
            <p className="mt-1 text-sm text-white/60">Bairros cadastrados</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <CheckCircle2 className="mb-3 text-green-400" size={22} />
            <p className="text-3xl font-bold">{totalVisitados}</p>
            <p className="mt-1 text-sm text-white/60">Visitas registradas</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Progresso</span>
              <span className="font-bold text-gold-400">{progresso}%</span>
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
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h2 className="text-xl font-bold">Mapa de Goiânia</h2>
              <p className="mt-1 text-sm text-white/60">
                Consulte a localização dos bairros.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                Visitados
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                A visitar
              </span>
            </div>
          </div>

          <iframe
            title="Mapa de Goiânia"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-49.35%2C-16.80%2C-49.10%2C-16.55&layer=mapnik&marker=-16.6869%2C-49.2648"
            className="h-[400px] w-full border-0 md:h-[500px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="p-4">
            <a
              href="https://www.openstreetmap.org/#map=12/-16.6869/-49.2648"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gold-400 hover:underline"
            >
              Abrir mapa completo <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {/* Lista */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold">
            Planejamento de visitas
          </h2>

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
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white outline-none placeholder:text-white/40 focus:border-gold-400"
              />
            </div>

            <div className="flex gap-2">
              {filtros.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFiltro(item.id)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    filtro === item.id
                      ? "bg-gold-400 text-navy-950"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {listaFiltrada.map((bairro) => (
              <div
                key={bairro.nome}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{bairro.nome}</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Região {bairro.regiao}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      bairro.visitado
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {bairro.visitado ? "Visitado" : "A visitar"}
                  </span>
                </div>

                {bairro.visitado && bairro.data && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
                    <CalendarDays size={15} />
                    Visita registrada em {bairro.data}
                  </p>
                )}

                {bairro.observacoes && (
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {bairro.observacoes}
                  </p>
                )}

                <button
                  onClick={() => alternarVisita(bairro.nome)}
                  className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    bairro.visitado
                      ? "border border-white/10 text-white/70 hover:bg-white/10"
                      : "bg-green-600 text-white hover:bg-green-500"
                  }`}
                >
                  {bairro.visitado
                    ? "Desfazer registro de visita"
                    : "Registrar visita"}
                </button>
              </div>
            ))}
          </div>

          {listaFiltrada.length === 0 && (
            <p className="mt-8 text-center text-white/50">
              Nenhum bairro encontrado para essa busca.
            </p>
          )}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/40">
          Os registros desta versão ficam apenas no estado da página.
          Para publicar um histórico permanente e sincronizado entre
          dispositivos, será necessário conectar um banco de dados.
        </p>
      </div>
    </section>
  );
}
