import { useEffect, useState } from "react";
import { LogOut, MessageSquare, PlaySquare, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import AdminComentarios from "./AdminComentarios";
import AdminVideos from "./AdminVideos";

// Impede que buscadores indexem esta página
function useNaoIndexar() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

const campo =
  "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    setEnviando(false);
    if (error) {
      setErro(
        error.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos."
          : "E-mail ou senha incorretos."
      );
    }
  }

  return (
    <form
      onSubmit={entrar}
      className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-xl"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
        <Lock size={22} />
      </span>
      <h1 className="font-display text-2xl font-extrabold text-navy-900">
        Acesso restrito
      </h1>

      <label className="block text-sm font-semibold text-navy-900">
        E-mail
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${campo} mt-1 font-normal`}
        />
      </label>

      <label className="block text-sm font-semibold text-navy-900">
        Senha
        <input
          type="password"
          required
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={`${campo} mt-1 font-normal`}
        />
      </label>

      {erro && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="min-h-12 w-full rounded-full bg-navy-900 px-6 py-3 font-semibold text-white transition hover:bg-gold-400 hover:text-navy-950 disabled:opacity-60"
      >
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function Admin() {
  useNaoIndexar();

  const [sessao, setSessao] = useState(undefined); // undefined = ainda verificando
  const [ehAdmin, setEhAdmin] = useState(null);
  const [aba, setAba] = useState("comentarios");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) =>
      setSessao(nova)
    );
    return () => data.subscription.unsubscribe();
  }, []);

  // Só refaz a checagem quando o usuário muda (não a cada renovação do token)
  const userId = sessao ? sessao.user.id : sessao;

  useEffect(() => {
    if (!supabase || userId === undefined) return;
    if (userId === null) {
      setEhAdmin(null);
      return;
    }
    let ativo = true;
    setEhAdmin(null);
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (ativo) setEhAdmin(!!data);
      });
    return () => {
      ativo = false;
    };
  }, [userId]);

  const sair = () => supabase.auth.signOut();

  const abas = [
    { id: "comentarios", label: "Opiniões", icon: MessageSquare },
    { id: "videos", label: "Vídeos", icon: PlaySquare },
  ];

  let conteudo;

  if (!supabase) {
    conteudo = <p className="text-navy-900/70">O Supabase não está configurado.</p>;
  } else if (sessao === undefined) {
    conteudo = <p className="text-navy-900/70">Carregando...</p>;
  } else if (!sessao) {
    conteudo = <Login />;
  } else if (ehAdmin === null) {
    conteudo = <p className="text-navy-900/70">Verificando permissão...</p>;
  } else if (!ehAdmin) {
    conteudo = (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-8 text-center shadow-xl">
        <p className="text-navy-900/80">
          Esta conta não tem permissão de administrador.
        </p>
        <button
          type="button"
          onClick={sair}
          className="min-h-11 rounded-full border border-navy-900/20 px-6 text-sm font-semibold text-navy-900"
        >
          Sair
        </button>
      </div>
    );
  } else {
    conteudo = (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">
              Painel administrativo
            </h1>
            <p className="mt-1 text-sm text-navy-900/70">{sessao.user.email}</p>
          </div>
          <button
            type="button"
            onClick={sair}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-900/20 bg-white px-5 text-sm font-semibold text-navy-900 transition hover:border-navy-900"
          >
            <LogOut size={17} /> Sair
          </button>
        </div>

        <p className="mt-2 text-xs text-navy-900/60">
          Sua sessão fica salva neste navegador. Em computador compartilhado, clique em Sair.
        </p>

        <div role="tablist" className="mt-8 flex gap-3">
          {abas.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={aba === id}
              onClick={() => setAba(id)}
              className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition ${
                aba === id
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/10 bg-white text-navy-900 hover:border-gold-400"
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {aba === "comentarios" ? <AdminComentarios /> : <AdminVideos />}
        </div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">{conteudo}</div>
    </main>
  );
}