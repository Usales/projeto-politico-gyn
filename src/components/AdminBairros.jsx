
import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  CircleX,
  RefreshCw,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const REGIOES = [
  "Central",
  "Norte",
  "Sul",
  "Leste",
  "Oeste",
  "Noroeste",
];

const FORM_VAZIO = {
  nome: "",
  regiao: "Norte",
  visitado: false,
  data_visita: "",
};

function mensagemErro(erro) {
  if (erro?.code === "23505") {
    return "Já existe um bairro com esse nome.";
  }

  if (erro?.code === "42501" || erro?.code === "PGRST301") {
    return "Permissão negada. Confira seu acesso de administrador no Supabase.";
  }

  return erro?.message || "Ocorreu um erro inesperado.";
}

export default function AdminBairros() {
  const [bairros, setBairros] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarBairros = useCallback(async () => {
    if (!supabase) {
      setErro("Supabase não está configurado neste ambiente.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("bairros")
      .select(
        "id, nome, regiao, visitado, data_visita, poligono, area_km2, created_at, updated_at"
      )
      .order("nome", { ascending: true });

    if (error) {
      setErro(mensagemErro(error));
      setBairros([]);
    } else {
      setBairros(data || []);
    }

    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarBairros();
  }, [carregarBairros]);

  function iniciarEdicao(bairro) {
    setEditandoId(bairro.id);
    setForm({
      nome: bairro.nome || "",
      regiao: bairro.regiao || "Norte",
      visitado: Boolean(bairro.visitado),
      data_visita: bairro.data_visita || "",
    });
    setErro("");
    setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErro("");
  }

  async function salvarBairro(event) {
    event.preventDefault();
    if (!supabase || salvando) return;

    const nome = form.nome.trim();

    if (!nome) {
      setErro("Informe o nome do bairro.");
      return;
    }

    if (!REGIOES.includes(form.regiao)) {
      setErro("Selecione uma região válida.");
      return;
    }

    if (form.visitado && !form.data_visita) {
      setErro("Informe a data da visita realizada.");
      return;
    }

    setSalvando(true);
    setErro("");
    setSucesso("");

    const registro = {
      nome,
      regiao: form.regiao,
      visitado: form.visitado,
      data_visita: form.visitado ? form.data_visita : null,
    };

    const resultado = editandoId
      ? await supabase
          .from("bairros")
          .update(registro)
          .eq("id", editandoId)
          .select("id")
          .maybeSingle()
      : await supabase
          .from("bairros")
          .insert(registro)
          .select("id")
          .maybeSingle();

    if (resultado.error) {
      setErro(mensagemErro(resultado.error));
    } else if (!resultado.data) {
      setErro(
        "Nenhum registro foi alterado. Verifique se sua conta tem permissão de administrador."
      );
    } else {
      setSucesso(editandoId ? "Bairro atualizado." : "Bairro cadastrado.");
      setForm(FORM_VAZIO);
      setEditandoId(null);
      await carregarBairros();
    }

    setSalvando(false);
  }

  async function alternarVisita(bairro) {
    if (!supabase) return;

    const novoStatus = !bairro.visitado;
    const hoje = new Date();
    const dataHoje = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0"),
      String(hoje.getDate()).padStart(2, "0"),
    ].join("-");

    const data_visita = novoStatus ? dataHoje : null;

    const confirmar = window.confirm(
      novoStatus
        ? `Registrar visita a "${bairro.nome}" hoje?`
        : `Desfazer o registro de visita a "${bairro.nome}"?`
    );

    if (!confirmar) return;

    setErro("");
    setSucesso("");

    const { error } = await supabase
      .from("bairros")
      .update({ visitado: novoStatus, data_visita })
      .eq("id", bairro.id);

    if (error) {
      setErro(mensagemErro(error));
      return;
    }

    setSucesso(
      novoStatus
        ? `Visita a ${bairro.nome} registrada.`
        : `Visita a ${bairro.nome} desmarcada.`
    );

    await carregarBairros();
  }

  async function excluirBairro(bairro) {
    if (!supabase) return;

    const confirmar = window.confirm(
      `Excluir "${bairro.nome}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmar) return;

    setErro("");
    setSucesso("");

    const { error } = await supabase
      .from("bairros")
      .delete()
      .eq("id", bairro.id);

    if (error) {
      setErro(mensagemErro(error));
      return;
    }

    if (editandoId === bairro.id) cancelarEdicao();

    setSucesso(`Bairro "${bairro.nome}" excluído.`);
    await carregarBairros();
  }

  const bairrosFiltrados = bairros.filter((bairro) =>
    `${bairro.nome} ${bairro.regiao}`
      .toLowerCase()
      .includes(busca.trim().toLowerCase())
  );

  const visitados = bairros.filter((bairro) => bairro.visitado).length;
  const progresso = bairros.length
    ? Math.round((visitados / bairros.length) * 100)
    : 0;

  return (
    <section className="space-y-6 text-white">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar bairros</h2>
          <p className="mt-1 text-sm text-white/60">
            Cadastre bairros e controle as visitas realizadas.
          </p>
        </div>

        <button
          type="button"
          onClick={carregarBairros}
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Atualizar lista
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <MapPin className="mb-2 text-[#f5b82e]" size={20} />
          <p className="text-2xl font-bold">{bairros.length}</p>
          <p className="text-sm text-white/60">Bairros cadastrados</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <CheckCircle2 className="mb-2 text-green-400" size={20} />
          <p className="text-2xl font-bold">{visitados}</p>
          <p className="text-sm text-white/60">Visitados</p>
        </div>

        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-white/60">Progresso das visitas</span>
            <strong className="text-[#f5b82e]">{progresso}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
        >
          {erro}
        </div>
      )}

      {sucesso && (
        <div
          role="status"
          className="rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-200"
        >
          {sucesso}
        </div>
      )}

      <form
        onSubmit={salvarBairro}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">
            {editandoId ? "Editar bairro" : "Cadastrar bairro"}
          </h3>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
            >
              <X size={16} />
              Cancelar
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            Nome do bairro
            <input
              value={form.nome}
              onChange={(event) =>
                setForm((atual) => ({ ...atual, nome: event.target.value }))
              }
              maxLength={120}
              required
              placeholder="Ex.: Jardim Guanabara"
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#0b1425] px-4 py-3 text-white outline-none focus:border-[#f5b82e]"
            />
          </label>

          <label className="block text-sm">
            Região
            <select
              value={form.regiao}
              onChange={(event) =>
                setForm((atual) => ({ ...atual, regiao: event.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#0b1425] px-4 py-3 text-white outline-none focus:border-[#f5b82e]"
            >
              {REGIOES.map((regiao) => (
                <option key={regiao} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-sm">
          <input
            type="checkbox"
            checked={form.visitado}
            onChange={(event) =>
              setForm((atual) => ({
                ...atual,
                visitado: event.target.checked,
                data_visita: event.target.checked
                  ? atual.data_visita ||
                    new Date().toLocaleDateString("en-CA")
                  : "",
              }))
            }
            className="h-4 w-4 accent-[#f5b82e]"
          />
          Bairro já visitado
        </label>

        {form.visitado && (
          <label className="block text-sm">
            Data da visita
            <input
              type="date"
              value={form.data_visita}
              onChange={(event) =>
                setForm((atual) => ({
                  ...atual,
                  data_visita: event.target.value,
                }))
              }
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#0b1425] px-4 py-3 text-white outline-none focus:border-[#f5b82e] md:max-w-xs"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5b82e] px-5 py-3 font-bold text-[#101827] transition hover:bg-[#ffd064] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {editandoId ? <Pencil size={17} /> : <Plus size={17} />}
          {salvando
            ? "Salvando..."
            : editandoId
              ? "Salvar alterações"
              : "Cadastrar bairro"}
        </button>
      </form>

      <div>
        <label className="block text-sm">
          Buscar bairro
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Digite o nome ou a região..."
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#f5b82e]"
          />
        </label>
      </div>

      {carregando ? (
        <p className="rounded-xl border border-white/10 p-6 text-center text-white/60">
          Carregando bairros...
        </p>
      ) : bairrosFiltrados.length === 0 ? (
        <div className="rounded-xl border border-white/10 p-6 text-center text-white/60">
          {bairros.length === 0
            ? "Nenhum bairro cadastrado no banco de dados."
            : "Nenhum bairro corresponde à busca."}
        </div>
      ) : (
        <div className="space-y-3">
          {bairrosFiltrados.map((bairro) => (
            <article
              key={bairro.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-bold">{bairro.nome}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Região {bairro.regiao}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-3 py-1 ${
                        bairro.visitado
                          ? "bg-green-400/10 text-green-300"
                          : "bg-red-400/10 text-red-300"
                      }`}
                    >
                      {bairro.visitado ? "Visitado" : "Pendente"}
                    </span>

                    {bairro.data_visita && (
                      <span className="text-white/50">
                        Data:{" "}
                        {new Date(
                          `${bairro.data_visita}T12:00:00`
                        ).toLocaleDateString("pt-BR")}
                      </span>
                    )}

                    {bairro.area_km2 != null && (
                      <span className="text-white/50">
                        Área: {Number(bairro.area_km2).toLocaleString("pt-BR", {
                          maximumFractionDigits: 3,
                        })}{" "}
                        km²
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => alternarVisita(bairro)}
                    title={
                      bairro.visitado
                        ? "Desfazer visita"
                        : "Registrar visita hoje"
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    {bairro.visitado ? (
                      <CircleX size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    {bairro.visitado ? "Desmarcar" : "Visitei"}
                  </button>

                  <button
                    type="button"
                    onClick={() => iniciarEdicao(bairro)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => excluirBairro(bairro)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
