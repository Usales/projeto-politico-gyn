
import { useEffect, useState } from "react";
import { LogOut, MessageSquare, PlaySquare } from "lucide-react";
import { supabase } from "../lib/supabase";
import AdminComentarios from "./AdminComentarios";
import AdminVideos from "./AdminVideos";
import Login from "./Login";

// Impede que buscadores indexem esta página
function useNaoIndexar() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      meta.remove();
    };
  }, []);
}

export default function Admin() {
  useNaoIndexar();

  const [sessao, setSessao] = useState(undefined);
  const [ehAdmin, setEhAdmin] = useState(null);
  const [erroPermissao, setErroPermissao] = useState(false);
  const [aba, setAba] = useState("comentarios");

  // Obtém a sessão e acompanha alterações de autenticação.
  useEffect(() => {
    if (!supabase) {
      setSessao(null);
      return;
    }

    let ativo = true;

    async function verificarSessao() {
      const { data, error } = await supabase.auth.getSession();

      if (!ativo) return;

      if (error) {
        setSessao(null);
        return;
      }

      setSessao(data.session);
    }

    verificarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = sessao ? sessao.user.id : sessao;

  // Verifica se o usuário autenticado consta na tabela admins.
  useEffect(() => {
    if (!supabase || userId === undefined) return;

    if (userId === null) {
      setEhAdmin(null);
      setErroPermissao(false);
      return;
    }

    let ativo = true;

    async function verificarAdministrador() {
      setEhAdmin(null);
      setErroPermissao(false);

      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!ativo) return;

      if (error) {
        setEhAdmin(false);
        setErroPermissao(true);
        return;
      }

      setEhAdmin(Boolean(data));
    }

    verificarAdministrador();

    return () => {
      ativo = false;
    };
  }, [userId]);

  async function sair() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setSessao(null);
    setEhAdmin(null);
  }

  const abas = [
    {
      id: "comentarios",
      label: "Opiniões",
      icon: MessageSquare,
    },
    {
      id: "videos",
      label: "Vídeos",
      icon: PlaySquare,
    },
  ];

  let conteudo;

  if (!supabase) {
    conteudo = (
      <p className="text-navy-900/70">
        O Supabase não está configurado. Verifique as variáveis de ambiente.
      </p>
    );
  } else if (sessao === undefined) {
    conteudo = (
      <p className="text-navy-900/70">
        Verificando sessão...
      </p>
    );
  } else if (!sessao) {
    conteudo = <Login />;
  } else if (erroPermissao) {
    conteudo = (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-8 text-center shadow-xl">
        <h1 className="font-display text-xl font-bold text-navy-900">
          Não foi possível verificar o acesso
        </h1>

        <p className="text-sm text-navy-900/70">
          O sistema não conseguiu consultar suas permissões. Verifique a
          configuração de acesso à tabela admins no Supabase.
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
  } else if (ehAdmin === null) {
    conteudo = (
      <p className="text-navy-900/70">
        Verificando permissão de administrador...
      </p>
    );
  } else if (!ehAdmin) {
    conteudo = (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-8 text-center shadow-xl">
        <h1 className="font-display text-xl font-bold text-navy-900">
          Acesso não autorizado
        </h1>

        <p className="text-navy-900/80">
          Esta conta está autenticada, mas não tem permissão de administrador.
        </p>

        <button
          type="button"
          onClick={sair}
          className="min-h-11 rounded-full border border-navy-900/20 px-6 text-sm font-semibold text-navy-900"
        >
          Sair da conta
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

            <p className="mt-1 text-sm text-navy-900/70">
              {sessao.user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={sair}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-900/20 bg-white px-5 text-sm font-semibold text-navy-900 transition hover:border-navy-900"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>

        <p className="mt-2 text-xs text-navy-900/60">
          Sua sessão fica salva neste navegador. Em computador compartilhado,
          clique em Sair ao terminar.
        </p>

        <div
          role="tablist"
          aria-label="Seções administrativas"
          className="mt-8 flex flex-wrap gap-3"
        >
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
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {aba === "comentarios" ? (
            <AdminComentarios />
          ) : (
            <AdminVideos />
          )}
        </div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-paper pb-24 pt-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {conteudo}
      </div>
    </main>
  );
}
