import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";

const campo =
  "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40";
const botao =
  "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-sm font-semibold text-navy-900 transition hover:border-navy-900 disabled:opacity-50";
const botaoPrincipal =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gold-400 hover:text-navy-950 disabled:opacity-50";

const ID_VALIDO = /^[A-Za-z0-9_-]{11}$/;

// Aceita o código de 11 caracteres ou links do YouTube
function extrairId(texto) {
  const t = texto.trim();
  if (ID_VALIDO.test(t)) return t;
  try {
    const url = new URL(t);
    const host = url.hostname.replace(/^www\./, "");
    let id = null;
    if (host === "youtu.be") {
      id = url.pathname.split("/")[1];
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      id = url.searchParams.get("v") || url.pathname.split("/")[2]; // /shorts/ID, /live/ID, /embed/ID
    }
    return id && ID_VALIDO.test(id) ? id : null;
  } catch {
    return null;
  }
}

const hoje = () => new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD no fuso local
const formVazio = () => ({ id: null, link: "", titulo: "", descricao: "", data: hoje() });

function traduzir(error) {
  if (error.code === "23505") return "Esse vídeo já está cadastrado.";
  if (error.code === "23514")
    return "Algum campo não respeitou os limites (título de 3 a 150 caracteres, descrição até 1000).";
  return error.message;
}

export default function AdminVideos() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(formVazio());

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("data_publicacao", { ascending: false });
    if (error) setErro(traduzir(error));
    else setItens(data ?? []);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

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

  async function salvar(e) {
    e.preventDefault();
    const id = extrairId(form.link);
    if (!id) {
      setErro("Link inválido. Cole o link completo do YouTube ou o código de 11 caracteres.");
      return;
    }
    const dados = {
      youtube_id: id,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      data_publicacao: form.data,
    };
    const ok = await executar(() =>
      form.id
        ? supabase.from("videos").update(dados).eq("id", form.id).select("id")
        : supabase.from("videos").insert(dados).select("id")
    );
    if (ok) {
      setForm(formVazio());
      setAberto(false);
    }
  }

  const alternar = (v) =>
    executar(() =>
      supabase.from("videos").update({ publicado: !v.publicado }).eq("id", v.id).select("id")
    );

  function excluir(v) {
    if (window.confirm(`Excluir o vídeo "${v.titulo}"? Esta ação não pode ser desfeita.`)) {
      executar(() => supabase.from("videos").delete().eq("id", v.id).select("id"));
    }
  }

  function editar(v) {
    setForm({
      id: v.id,
      link: v.youtube_id,
      titulo: v.titulo,
      descricao: v.descricao ?? "",
      data: v.data_publicacao,
    });
    setAberto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setForm(formVazio());
          setAberto((v) => !v);
        }}
        className={botaoPrincipal}
      >
        <Plus size={18} /> Novo vídeo
      </button>

      {aberto && (
        <form onSubmit={salvar} className="mt-4 space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-navy-900">
            {form.id ? "Editar vídeo" : "Novo vídeo"}
          </h2>

          <label className="block text-sm font-semibold text-navy-900">
            Link do YouTube
            <input
              className={`${campo} mt-1 font-normal`}
              required
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>

          <label className="block text-sm font-semibold text-navy-900">
            Título
            <input
              className={`${campo} mt-1 font-normal`}
              required
              minLength={3}
              maxLength={150}
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </label>

          <label className="block text-sm font-semibold text-navy-900">
            Descrição (opcional)
            <textarea
              className={`${campo} mt-1 min-h-28 resize-none font-normal`}
              maxLength={1000}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </label>

          <label className="block text-sm font-semibold text-navy-900">
            Data de publicação
            <input
              type="date"
              className={`${campo} mt-1 min-h-[3rem] font-normal`}
              required
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
          </label>

          <div className="flex gap-2">
            <button type="submit" disabled={ocupado} className={botaoPrincipal}>
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setAberto(false);
                setForm(formVazio());
              }}
              className={botao}
            >
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

        {!carregando && itens.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy-900/20 p-8 text-center text-navy-900/60">
            Nenhum vídeo cadastrado.
          </p>
        )}

        {itens.map((v) => (
          <article key={v.id} className="rounded-2xl border border-navy-900/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display font-bold text-navy-900">{v.titulo}</p>
                <p className="text-xs text-navy-900/60">
                  {new Date(`${v.data_publicacao}T12:00:00`).toLocaleDateString("pt-BR")} ·
                  código {v.youtube_id}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  v.publicado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {v.publicado ? "Publicado" : "Oculto"}
              </span>
            </div>

            {v.descricao && (
              <p className="mt-3 text-sm leading-relaxed text-navy-900/75">{v.descricao}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => alternar(v)} disabled={ocupado} className={botao}>
                {v.publicado ? (
                  <>
                    <EyeOff size={16} /> Ocultar
                  </>
                ) : (
                  <>
                    <Eye size={16} /> Publicar
                  </>
                )}
              </button>
              <button type="button" onClick={() => editar(v)} className={botao}>
                <Pencil size={16} /> Editar
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                target="_blank"
                rel="noreferrer"
                className={botao}
              >
                <ExternalLink size={16} /> Abrir no YouTube
              </a>
              <button
                type="button"
                onClick={() => excluir(v)}
                disabled={ocupado}
                className={`${botao} text-red-700`}
              >
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}