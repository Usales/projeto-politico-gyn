import { useCallback, useEffect, useMemo, useState } from "react";
import { Star, Eye, EyeOff, Pencil, Trash2, Plus, Search } from "lucide-react";
import { supabase } from "../lib/supabase";

const campo =
  "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40";
const botao =
  "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-sm font-semibold text-navy-900 transition hover:border-navy-900 disabled:opacity-50";
const botaoPrincipal =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gold-400 hover:text-navy-950 disabled:opacity-50";

function traduzir(error) {
  if (error.code === "23514")
    return "Algum campo não respeitou os limites (nome de 2 a 60 caracteres, texto de 5 a 600, sem links).";
  return error.message;
}

function Notas({ valor }) {
  return (
    <span className="inline-flex" role="img" aria-label={`Nota ${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          className={n <= valor ? "fill-gold-400 text-gold-400" : "text-navy-900/25"}
        />
      ))}
    </span>
  );
}

export default function AdminComentarios() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [editando, setEditando] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [novo, setNovo] = useState({
    nome: "Equipe Gabriel Henriques",
    bairro: "",
    comentario: "",
  });

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("comentarios")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErro(traduzir(error));
    else setItens(data ?? []);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Executa uma operação, confere se foi aplicada e recarrega a lista
  async function executar(fn) {
    setErro("");
    setOcupado(true);
    const { data, error } = await fn();
    setOcupado(false);
    if (error) {
      setErro(traduzir(error));
      return false;
    }
    if (Array.isArray(data) && data.length === 0) {
      setErro("A alteração não foi aplicada. Confira sua permissão e tente de novo.");
      return false;
    }
    await carregar();
    return true;
  }

  const alternar = (c) =>
    executar(() =>
      supabase.from("comentarios").update({ aprovado: !c.aprovado }).eq("id", c.id).select("id")
    );

  function excluir(c) {
    if (
      window.confirm(
        `Excluir definitivamente a opinião de "${c.nome}"? Esta ação não pode ser desfeita.`
      )
    ) {
      executar(() =>
        supabase.from("comentarios").delete().eq("id", c.id).select("id")
      );
    }
  }

  async function salvarEdicao() {
    const ok = await executar(() =>
      supabase
        .from("comentarios")
        .update({
          nome: editando.nome.trim(),
          bairro: editando.bairro.trim() || null,
          comentario: editando.comentario.trim(),
        })
        .eq("id", editando.id)
        .select("id")
    );
    if (ok) setEditando(null);
  }

  async function adicionar(e) {
    e.preventDefault();
    const ok = await executar(() =>
      supabase
        .from("comentarios")
        .insert({
          nome: novo.nome.trim(),
          bairro: novo.bairro.trim() || null,
          comentario: novo.comentario.trim(),
          avaliacao: null,
          origem: "equipe",
          aprovado: true,
          meta: {},
        })
        .select("id")
    );
    if (ok) {
      setNovo({ ...novo, bairro: "", comentario: "" });
      setAdicionando(false);
    }
  }

  const publicados = itens.filter((c) => c.aprovado).length;
  const avaliados = itens.filter((c) => c.aprovado && c.avaliacao);
  const media = avaliados.length
    ? avaliados.reduce((soma, c) => soma + c.avaliacao, 0) / avaliados.length
    : 0;

  const visiveis = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return itens.filter((c) => {
      const okStatus =
        filtro === "todos" || (filtro === "publicados" ? c.aprovado : !c.aprovado);
      const okBusca =
        !q || `${c.nome} ${c.bairro ?? ""} ${c.comentario}`.toLowerCase().includes(q);
      return okStatus && okBusca;
    });
  }, [itens, busca, filtro]);

  const resumo = [
    { rotulo: "Total", valor: itens.length },
    { rotulo: "Publicadas", valor: publicados },
    { rotulo: "Ocultas", valor: itens.length - publicados },
    { rotulo: "Média (visitantes)", valor: media ? media.toFixed(1).replace(".", ",") : "—" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {resumo.map((r) => (
          <div key={r.rotulo} className="rounded-2xl border border-navy-900/10 bg-white p-4">
            <p className="font-display text-2xl font-bold text-navy-900">{r.valor}</p>
            <p className="text-xs text-navy-900/60">{r.rotulo}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/40"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, bairro ou texto..."
            aria-label="Buscar opiniões"
            className={`${campo} pl-11`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["todos", "publicados", "ocultos"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              aria-pressed={filtro === f}
              className={`min-h-11 rounded-xl border px-4 text-sm font-semibold capitalize transition ${
                filtro === f
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/15 bg-white text-navy-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAdicionando((v) => !v)}
          className={botaoPrincipal}
        >
          <Plus size={18} /> Comunicado da equipe
        </button>
      </div>

      {adicionando && (
        <form onSubmit={adicionar} className="mt-4 space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <input
            className={campo}
            required
            minLength={2}
            maxLength={60}
            value={novo.nome}
            onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
            aria-label="Nome"
            placeholder="Nome"
          />
          <input
            className={campo}
            maxLength={60}
            value={novo.bairro}
            onChange={(e) => setNovo({ ...novo, bairro: e.target.value })}
            aria-label="Bairro"
            placeholder="Bairro (opcional)"
          />
          <textarea
            className={`${campo} min-h-28 resize-none`}
            required
            minLength={5}
            maxLength={600}
            value={novo.comentario}
            onChange={(e) => setNovo({ ...novo, comentario: e.target.value })}
            aria-label="Texto"
            placeholder="Texto do comunicado"
          />
          <p className="text-xs text-navy-900/60">
            Aparece com a etiqueta “Equipe” e não entra na média de estrelas.
          </p>
          <div className="flex gap-2">
            <button type="submit" disabled={ocupado} className={botaoPrincipal}>
              Publicar
            </button>
            <button type="button" onClick={() => setAdicionando(false)} className={botao}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {erro && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {carregando && <p className="text-navy-900/60">Carregando...</p>}

        {!carregando && visiveis.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy-900/20 p-8 text-center text-navy-900/60">
            Nenhuma opinião encontrada.
          </p>
        )}

        {visiveis.map((c) => (
          <article key={c.id} className="rounded-2xl border border-navy-900/10 bg-white p-5">
            {editando?.id === c.id ? (
              <div className="space-y-3">
                <input
                  className={campo}
                  value={editando.nome}
                  maxLength={60}
                  aria-label="Nome"
                  onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                />
                <input
                  className={campo}
                  value={editando.bairro}
                  maxLength={60}
                  placeholder="Bairro (opcional)"
                  aria-label="Bairro"
                  onChange={(e) => setEditando({ ...editando, bairro: e.target.value })}
                />
                <textarea
                  className={`${campo} min-h-28 resize-none`}
                  value={editando.comentario}
                  maxLength={600}
                  aria-label="Texto"
                  onChange={(e) => setEditando({ ...editando, comentario: e.target.value })}
                />
                <p className="text-xs text-navy-900/60">
                  A opinião ficará marcada publicamente como “editado pela moderação”.
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={salvarEdicao} disabled={ocupado} className={botaoPrincipal}>
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditando(null)} className={botao}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-navy-900">
                      {c.nome}
                      {c.origem === "equipe" && (
                        <span className="ml-2 rounded-full bg-navy-900 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-gold-400">
                          Equipe
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-navy-900/60">
                      {c.bairro ? `${c.bairro} · ` : ""}
                      {new Date(c.created_at).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                      {c.editado_em ? " · editado" : ""}
                      {c.meta?.dispositivo ? ` · ${c.meta.dispositivo}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.avaliacao ? <Notas valor={c.avaliacao} /> : null}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        c.aprovado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.aprovado ? "Publicado" : "Oculto"}
                    </span>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-line break-words text-navy-900/85">
                  {c.comentario}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => alternar(c)} disabled={ocupado} className={botao}>
                    {c.aprovado ? (
                      <>
                        <EyeOff size={16} /> Ocultar
                      </>
                    ) : (
                      <>
                        <Eye size={16} /> Publicar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditando({
                        id: c.id,
                        nome: c.nome,
                        bairro: c.bairro ?? "",
                        comentario: c.comentario,
                      })
                    }
                    className={botao}
                  >
                    <Pencil size={16} /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(c)}
                    disabled={ocupado}
                    className={`${botao} text-red-700`}
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}