
import { useEffect, useState } from "react";
import {
  FilePlus2,
  Pencil,
  Trash2,
  Upload,
  X,
  Save,
  FileText,
  LoaderCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const FORMULARIO_VAZIO = {
  titulo: "",
  descricao: "",
  categoria: "Tributação",
  status: "Anteprojeto para discussão legislativa",
  dificuldade: "A avaliar",
  analise: "",
  publicado: true,
  caracteristicas: [
    { titulo: "Objetivo", descricao: "" },
    { titulo: "Característica principal", descricao: "" },
    { titulo: "Responsabilidade e viabilidade", descricao: "" },
  ],
};

const CAMPO =
  "w-full rounded-xl border border-white/15 bg-[#0b1425] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#f5b82e]";

const ROTULO = "mb-2 block text-sm font-semibold text-slate-200";

export default function AdminDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO);
  const [documentoEditando, setDocumentoEditando] = useState(null);
  const [arquivo, setArquivo] = useState(null);
  const [removerPdf, setRemoverPdf] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarDocumentos();
  }, []);

  async function carregarDocumentos() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErro(`Não foi possível carregar os documentos: ${error.message}`);
    } else {
      setDocumentos(data || []);
    }

    setCarregando(false);
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function iniciarEdicao(documento) {
    setDocumentoEditando(documento);
    setArquivo(null);
    setRemoverPdf(false);
    setErro("");
    setSucesso("");

    setFormulario({
      titulo: documento.titulo || "",
      descricao: documento.descricao || "",
      categoria: documento.categoria || "Geral",
      status:
        documento.status ||
        "Anteprojeto para discussão legislativa",
      dificuldade: documento.dificuldade || "A avaliar",
      analise: documento.analise || "",
      publicado: documento.publicado ?? true,
      caracteristicas: Array.isArray(documento.caracteristicas)
        ? documento.caracteristicas
        : [],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function novoDocumento() {
    setDocumentoEditando(null);
    setFormulario({
      ...FORMULARIO_VAZIO,
      caracteristicas: FORMULARIO_VAZIO.caracteristicas.map((item) => ({
        ...item,
      })),
    });
    setArquivo(null);
    setRemoverPdf(false);
    setErro("");
    setSucesso("");
  }

  function atualizarCaracteristica(indice, campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      caracteristicas: atual.caracteristicas.map((item, i) =>
        i === indice ? { ...item, [campo]: valor } : item
      ),
    }));
  }

  function adicionarCaracteristica() {
    setFormulario((atual) => ({
      ...atual,
      caracteristicas: [
        ...atual.caracteristicas,
        { titulo: "", descricao: "" },
      ],
    }));
  }

  function excluirCaracteristica(indice) {
    setFormulario((atual) => ({
      ...atual,
      caracteristicas: atual.caracteristicas.filter(
        (_, i) => i !== indice
      ),
    }));
  }

  async function salvarDocumento(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    if (!supabase) {
      setErro("A conexão com o Supabase não está configurada.");
      return;
    }

    if (!formulario.titulo.trim()) {
      setErro("Informe o título do documento.");
      return;
    }

    if (arquivo && arquivo.type !== "application/pdf") {
      setErro("Selecione um arquivo PDF válido.");
      return;
    }

    if (arquivo && arquivo.size > 15 * 1024 * 1024) {
      setErro("O PDF deve ter no máximo 15 MB.");
      return;
    }

    setSalvando(true);

    let pdfPath = documentoEditando?.pdf_path || null;
    let pdfUrl = documentoEditando?.pdf_url || null;
    let caminhoPdfAntigo = null;

    try {
      if (removerPdf) {
        caminhoPdfAntigo = pdfPath;
        pdfPath = null;
        pdfUrl = null;
      }

      if (arquivo) {
        const nomeSeguro = arquivo.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9._-]/g, "-");

        const novoCaminho = `${crypto.randomUUID()}-${nomeSeguro}`;

        const { error: erroUpload } = await supabase.storage
          .from("documentos")
          .upload(novoCaminho, arquivo, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (erroUpload) throw erroUpload;

        if (pdfPath) caminhoPdfAntigo = pdfPath;

        pdfPath = novoCaminho;

        const { data: urlData } = supabase.storage
          .from("documentos")
          .getPublicUrl(novoCaminho);

        pdfUrl = urlData.publicUrl;
      }

      const dados = {
        titulo: formulario.titulo.trim(),
        descricao: formulario.descricao.trim(),
        categoria: formulario.categoria,
        status: formulario.status.trim(),
        dificuldade: formulario.dificuldade.trim() || "A avaliar",
        analise: formulario.analise.trim(),
        publicado: formulario.publicado,
        caracteristicas: formulario.caracteristicas
          .filter((item) => item.titulo.trim() || item.descricao.trim())
          .map((item) => ({
            titulo: item.titulo.trim(),
            descricao: item.descricao.trim(),
          })),
        pdf_url: pdfUrl,
        pdf_path: pdfPath,
        updated_at: new Date().toISOString(),
      };

      let resultado;

      if (documentoEditando) {
        resultado = await supabase
          .from("documentos")
          .update(dados)
          .eq("id", documentoEditando.id)
          .select()
          .single();
      } else {
        resultado = await supabase
          .from("documentos")
          .insert(dados)
          .select()
          .single();
      }

      if (resultado.error) throw resultado.error;

      if (
        caminhoPdfAntigo &&
        caminhoPdfAntigo !== pdfPath
      ) {
        const { error: erroRemocao } = await supabase.storage
          .from("documentos")
          .remove([caminhoPdfAntigo]);

        if (erroRemocao) {
          console.error(
            "O documento foi salvo, mas o PDF antigo não foi removido:",
            erroRemocao
          );
        }
      }

      setSucesso(
        documentoEditando
          ? "Documento atualizado com sucesso."
          : "Documento cadastrado com sucesso."
      );

      novoDocumento();
      await carregarDocumentos();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar o documento.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirDocumento(documento) {
    const confirmado = window.confirm(
      `Deseja realmente excluir "${documento.titulo}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    setErro("");
    setSucesso("");
    setExcluindo(documento.id);

    try {
      const { error } = await supabase
        .from("documentos")
        .delete()
        .eq("id", documento.id);

      if (error) throw error;

      if (documento.pdf_path) {
        const { error: erroPdf } = await supabase.storage
          .from("documentos")
          .remove([documento.pdf_path]);

        if (erroPdf) {
          console.error("Não foi possível remover o PDF:", erroPdf);
        }
      }

      if (documentoEditando?.id === documento.id) {
        novoDocumento();
      }

      setSucesso("Documento excluído.");
      await carregarDocumentos();
    } catch (error) {
      setErro(error.message || "Não foi possível excluir o documento.");
    } finally {
      setExcluindo(null);
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center gap-3 p-6 text-slate-300">
        <LoaderCircle className="animate-spin" size={20} />
        Carregando documentos...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar documentos</h2>
          <p className="mt-1 text-sm text-slate-400">
            Cadastre, edite, publique ou exclua documentos legislativos.
          </p>
        </div>

        <button
          type="button"
          onClick={novoDocumento}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5b82e] px-4 py-3 font-bold text-[#101827] hover:bg-[#ffd064]"
        >
          <FilePlus2 size={18} />
          Novo documento
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {erro}
        </div>
      )}

      {sucesso && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200"
        >
          {sucesso}
        </div>
      )}

      <form
        onSubmit={salvarDocumento}
        className="space-y-6 rounded-2xl border border-white/10 bg-[#111b2e] p-5 sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">
              {documentoEditando ? "Editar documento" : "Cadastrar documento"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Os campos marcados com * são obrigatórios.
            </p>
          </div>

          {documentoEditando && (
            <button
              type="button"
              onClick={novoDocumento}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
              aria-label="Cancelar edição"
              title="Cancelar edição"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div>
          <label className={ROTULO}>Título *</label>
          <input
            className={CAMPO}
            value={formulario.titulo}
            onChange={(e) => atualizarCampo("titulo", e.target.value)}
            placeholder="Título do documento"
            required
            maxLength={250}
          />
        </div>

        <div>
          <label className={ROTULO}>Descrição</label>
          <textarea
            className={CAMPO}
            rows={3}
            value={formulario.descricao}
            onChange={(e) => atualizarCampo("descricao", e.target.value)}
            placeholder="Resumo do documento"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={ROTULO}>Categoria</label>
            <select
              className={CAMPO}
              value={formulario.categoria}
              onChange={(e) => atualizarCampo("categoria", e.target.value)}
            >
              <option>Tributação</option>
              <option>Segurança Pública</option>
              <option>Mobilidade Urbana</option>
              <option>Transparência</option>
              <option>Desenvolvimento Econômico</option>
              <option>Geral</option>
            </select>
          </div>

          <div>
            <label className={ROTULO}>Status</label>
            <input
              className={CAMPO}
              value={formulario.status}
              onChange={(e) => atualizarCampo("status", e.target.value)}
              placeholder="Ex.: Anteprojeto para discussão legislativa"
            />
          </div>
        </div>

        <div>
          <label className={ROTULO}>Dificuldade estimada de aprovação</label>
          <select
            className={CAMPO}
            value={formulario.dificuldade}
            onChange={(e) => atualizarCampo("dificuldade", e.target.value)}
          >
            <option>A avaliar</option>
            <option>Baixa</option>
            <option>Moderada</option>
            <option>Alta</option>
            <option>Muito alta</option>
          </select>
        </div>

        <div>
          <label className={ROTULO}>Análise de viabilidade</label>
          <textarea
            className={CAMPO}
            rows={4}
            value={formulario.analise}
            onChange={(e) => atualizarCampo("analise", e.target.value)}
            placeholder="Explique os aspectos jurídicos, políticos e orçamentários."
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-bold">Características principais</h4>
            <button
              type="button"
              onClick={adicionarCaracteristica}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-[#f5b82e]"
            >
              + Adicionar característica
            </button>
          </div>

          {formulario.caracteristicas.map((item, indice) => (
            <div
              key={indice}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0b1425] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#f5b82e]">
                  Característica {indice + 1}
                </span>

                <button
                  type="button"
                  onClick={() => excluirCaracteristica(indice)}
                  className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                  aria-label={`Excluir característica ${indice + 1}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <input
                className={CAMPO}
                value={item.titulo}
                onChange={(e) =>
                  atualizarCaracteristica(indice, "titulo", e.target.value)
                }
                placeholder="Título da característica"
              />

              <textarea
                className={CAMPO}
                rows={2}
                value={item.descricao}
                onChange={(e) =>
                  atualizarCaracteristica(indice, "descricao", e.target.value)
                }
                placeholder="Descrição da característica"
              />
            </div>
          ))}
        </div>

        <div>
          <label className={ROTULO}>Arquivo PDF</label>

          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/20 bg-[#0b1425] p-6 text-center transition hover:border-[#f5b82e]/70">
            <Upload size={26} className="text-[#f5b82e]" />
            <span className="text-sm font-semibold">
              {arquivo ? arquivo.name : "Clique para selecionar um PDF"}
            </span>
            <span className="text-xs text-slate-400">
              Formato PDF · Máximo de 15 MB
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                setArquivo(e.target.files?.[0] || null);
                setRemoverPdf(false);
              }}
            />
          </label>

          {documentoEditando?.pdf_url && !removerPdf && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <a
                href={documentoEditando.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#f5b82e] underline"
              >
                <FileText size={16} />
                Abrir PDF atual
              </a>

              <button
                type="button"
                onClick={() => {
                  setRemoverPdf(true);
                  setArquivo(null);
                }}
                className="text-red-300 hover:text-red-200"
              >
                Remover PDF atual
              </button>
            </div>
          )}

          {removerPdf && (
            <p className="mt-2 text-sm text-amber-200">
              O PDF atual será removido ao salvar.
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#0b1425] p-4">
          <input
            type="checkbox"
            checked={formulario.publicado}
            onChange={(e) => atualizarCampo("publicado", e.target.checked)}
            className="mt-1 accent-[#f5b82e]"
          />
          <span>
            <span className="flex items-center gap-2 font-semibold">
              {formulario.publicado ? (
                <Eye size={17} className="text-emerald-300" />
              ) : (
                <EyeOff size={17} className="text-slate-400" />
              )}
              Publicar na página pública
            </span>
            <span className="mt-1 block text-sm text-slate-400">
              Desmarque para salvar como rascunho, visível somente no painel administrativo.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {documentoEditando && (
            <button
              type="button"
              onClick={novoDocumento}
              className="rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/5"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5b82e] px-5 py-3 font-bold text-[#101827] hover:bg-[#ffd064] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {salvando ? "Salvando..." : "Salvar documento"}
          </button>
        </div>
      </form>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold">
            Documentos cadastrados ({documentos.length})
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Documentos publicados e rascunhos.
          </p>
        </div>

        {documentos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#111b2e] p-8 text-center">
            <FileText size={32} className="mx-auto text-slate-400" />
            <p className="mt-3 text-slate-300">
              Nenhum documento cadastrado ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documentos.map((documento) => (
              <article
                key={documento.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#111b2e] p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-xl bg-[#f5b82e]/10 p-3 text-[#f5b82e]">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="break-words font-bold">
                      {documento.titulo}
                    </h4>
                    <p className="mt-1 text-sm text-slate-400">
                      {documento.categoria} · {documento.status}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        documento.publicado
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-slate-500/15 text-slate-300"
                      }`}
                    >
                      {documento.publicado ? "Publicado" : "Rascunho"}
                    </span>
                    {!documento.pdf_url && (
                      <p className="mt-1 text-xs text-amber-200">
                        Ainda sem PDF anexado
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => iniciarEdicao(documento)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-[#f5b82e]"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => excluirDocumento(documento)}
                    disabled={excluindo === documento.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {excluindo === documento.id ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
