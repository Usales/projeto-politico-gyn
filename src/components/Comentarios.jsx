import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, ShieldCheck, MessageSquareQuote } from "lucide-react";
import { supabase } from "../lib/supabase";

const COOLDOWN_MS = 2 * 60 * 1000;

function Estrelas({ valor, onChange, tamanho = 28, somenteLeitura = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div
      role={somenteLeitura ? "img" : "radiogroup"}
      aria-label={`Nota ${valor} de 5`}
      className="flex"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const cheia = n <= (hover || valor);

        const icone = (
          <Star
            size={tamanho}
            className={
              cheia
                ? "fill-gold-400 text-gold-400"
                : "text-navy-900/25"
            }
          />
        );

        if (somenteLeitura) {
          return <span key={n}>{icone}</span>;
        }

        return (
          <button
            type="button"
            key={n}
            role="radio"
            aria-checked={valor === n}
            aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="flex h-11 w-11 items-center justify-center"
          >
            {icone}
          </button>
        );
      })}
    </div>
  );
}

function coletarMeta() {
  const ua = navigator.userAgent;

  return {
    dispositivo: /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Android/.test(ua)
        ? "Android"
        : "Computador/Outro",
    idioma: navigator.language,
    fuso: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export default function Comentarios() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    bairro: "",
    comentario: "",
    site: "",
  });
  const [nota, setNota] = useState(0);
  const [aceito, setAceito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarComentarios() {
      if (!supabase) {
        setCarregando(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("comentarios")
          .select(
            "id, created_at, nome, bairro, avaliacao, comentario, origem, editado_em"
          )
          .eq("aprovado", true)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Erro ao carregar opiniões:", error);
          setLista([]);
          return;
        }

        setLista(data ?? []);
      } catch (error) {
        console.error("Erro ao carregar opiniões:", error);
        setLista([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarComentarios();
  }, []);

  const avaliados = useMemo(
    () => lista.filter((c) => c.avaliacao),
    [lista]
  );

  const media = useMemo(() => {
    if (!avaliados.length) return 0;

    return (
      avaliados.reduce((soma, c) => soma + c.avaliacao, 0) /
      avaliados.length
    );
  }, [avaliados]);

  function atualizar(campo) {
    return (e) => {
      setForm((atual) => ({
        ...atual,
        [campo]: e.target.value,
      }));
    };
  }

  async function enviar(e) {
    e.preventDefault();
    setErro("");

    // Campo escondido: se for preenchido, não envia a opinião.
    if (form.site) {
      setEnviado(true);
      return;
    }

    if (!nota) {
      setErro("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    if (!aceito) {
      setErro("Marque a caixa de concordância para enviar.");
      return;
    }

    if (!supabase) {
      setErro("O envio de opiniões ainda não está configurado.");
      return;
    }

    try {
      const ultimo = Number(
        localStorage.getItem("ultima-opiniao") || 0
      );

      if (Date.now() - ultimo < COOLDOWN_MS) {
        setErro("Aguarde alguns minutos antes de enviar outra opinião.");
        return;
      }
    } catch {
      // Se o navegador bloquear o armazenamento, segue normalmente.
    }

    const nova = {
      nome: form.nome.trim(),
      bairro: form.bairro.trim() || null,
      avaliacao: nota,
      comentario: form.comentario.trim(),
    };

    setEnviando(true);

    try {
      const { error } = await supabase
        .from("comentarios")
        .insert({
          ...nova,
          meta: coletarMeta(),
        });

      if (error) {
        console.error("Erro ao enviar opinião:", error);
        setErro(
          "Não foi possível enviar agora. Tente novamente em instantes."
        );
        return;
      }

      try {
        localStorage.setItem(
          "ultima-opiniao",
          String(Date.now())
        );
      } catch {
        // Ignorar falhas de armazenamento local.
      }

      // A opinião enviada não é adicionada automaticamente à lista pública.
      // Ela só aparecerá depois de ser aprovada e carregada novamente.
      setEnviado(true);
      setForm({
        nome: "",
        bairro: "",
        comentario: "",
        site: "",
      });
      setNota(0);
      setAceito(false);
    } catch (error) {
      console.error("Erro ao enviar opinião:", error);
      setErro(
        "Não foi possível enviar agora. Tente novamente em instantes."
      );
    } finally {
      setEnviando(false);
    }
  }

  const campo =
    "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40";

  return (
    <section id="opinioes" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Opiniões
          </span>

          <h2 className="font-display mt-3 text-3xl font-extrabold text-navy-900 md:text-5xl">
            O que a população pensa
          </h2>

          <p className="mt-4 text-base text-navy-900/70 md:text-lg">
            Avalie as ideias, deixe sua opinião ou sua cobrança. Respeito é a única regra.
          </p>

          {avaliados.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <Estrelas
                valor={Math.round(media)}
                somenteLeitura
                tamanho={22}
              />

              <span className="font-display text-lg font-bold text-navy-900">
                {media.toFixed(1).replace(".", ",")}
              </span>

              <span className="text-sm text-navy-900/60">
                ({avaliados.length} opiniões)
              </span>
            </div>
          )}
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Formulário */}
          <motion.form
            onSubmit={enviar}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 rounded-3xl bg-white p-6 shadow-xl sm:p-8"
          >
            {enviado ? (
              <div className="py-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-navy-950">
                  <ShieldCheck />
                </span>

                <h3 className="font-display mt-4 text-xl font-bold text-navy-900">
                  Opinião recebida!
                </h3>

                <p className="mt-2 text-navy-900/70">
                  Obrigado por participar! Sua opinião foi enviada e poderá aparecer publicamente após a aprovação da moderação.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setEnviado(false);
                    setErro("");
                  }}
                  className="mt-6 min-h-11 rounded-full border border-navy-900/20 px-6 text-sm font-semibold text-navy-900"
                >
                  Enviar outra
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="mb-1 text-sm font-semibold text-navy-900">
                    Sua nota
                  </p>

                  <Estrelas
                    valor={nota}
                    onChange={setNota}
                  />
                </div>

                <input
                  className={campo}
                  placeholder="Seu nome (ou apelido)"
                  required
                  minLength={2}
                  maxLength={60}
                  autoComplete="given-name"
                  value={form.nome}
                  onChange={atualizar("nome")}
                />

                <input
                  className={campo}
                  placeholder="Bairro ou região (opcional)"
                  maxLength={60}
                  value={form.bairro}
                  onChange={atualizar("bairro")}
                />

                <div>
                  <textarea
                    className={`${campo} min-h-36 resize-none`}
                    placeholder="Sua opinião (não inclua dados pessoais de terceiros)"
                    required
                    minLength={5}
                    maxLength={600}
                    value={form.comentario}
                    onChange={atualizar("comentario")}
                  />

                  <p className="mt-1 text-right text-xs text-navy-900/50">
                    {form.comentario.length}/600
                  </p>
                </div>

                {/* Campo antispam escondido */}
                <input
                  type="text"
                  name="site"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.site}
                  onChange={atualizar("site")}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <label className="flex items-start gap-3 text-sm text-navy-900/75">
                  <input
                    type="checkbox"
                    checked={aceito}
                    onChange={(e) => setAceito(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-navy-900/30 accent-[#e8a317]"
                  />

                  <span>
                    Tenho 18 anos ou mais. Concordo, de forma específica, que meu
                    nome, minha nota e minha opinião, que podem revelar minhas
                    convicções políticas, sejam exibidos publicamente neste site
                    após aprovação, e que o tipo de aparelho, o idioma e o
                    fuso horário sejam guardados para estatísticas gerais. Li a{" "}
                    <a
                      href="/privacidade#politica"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline"
                    >
                      Política de Privacidade
                    </a>{" "}
                    e sei que posso pedir a exclusão a qualquer momento.
                  </span>
                </label>

                {erro && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white transition hover:bg-gold-400 hover:text-navy-950 disabled:opacity-60"
                >
                  {enviando ? "Enviando..." : "Enviar opinião"}
                  <Send size={18} />
                </button>
              </>
            )}
          </motion.form>

          {/* Lista de opiniões aprovadas */}
          <div className="space-y-4">
            {carregando && (
              <p className="text-navy-900/60">
                Carregando opiniões...
              </p>
            )}

            {!carregando && lista.length === 0 && (
              <div className="rounded-3xl border border-dashed border-navy-900/20 p-8 text-center">
                <MessageSquareQuote
                  className="mx-auto text-gold-500"
                  size={32}
                />

                <p className="mt-3 text-navy-900/70">
                  Ainda não há opiniões publicadas. Seja a primeira pessoa a participar!
                </p>
              </div>
            )}

            <div className="max-h-[38rem] space-y-4 overflow-y-auto overscroll-contain pr-1">
              {lista.map((c) => (
                <article
                  key={c.id}
                  className="rounded-2xl border border-navy-900/10 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-navy-900">
                        {c.nome}

                        {c.origem === "equipe" && (
                          <span className="ml-2 rounded-full bg-navy-900 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-gold-400">
                            Equipe
                          </span>
                        )}
                      </p>

                      <p className="text-xs text-navy-900/50">
                        {c.bairro ? `${c.bairro} · ` : ""}
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                        {c.editado_em ? " · editado pela moderação" : ""}
                      </p>
                    </div>

                    {c.avaliacao ? (
                      <Estrelas
                        valor={c.avaliacao}
                        somenteLeitura
                        tamanho={16}
                      />
                    ) : null}
                  </div>

                  <p className="mt-3 whitespace-pre-line break-words text-navy-900/80">
                    {c.comentario}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}