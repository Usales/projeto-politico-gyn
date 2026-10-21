
import { useEffect, useState } from "react";
import {
  LogOut,
  MessageSquare,
  PlaySquare,
  FileText,
  LoaderCircle,
  Lock,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import AdminComentarios from "./AdminComentarios";
import AdminVideos from "./AdminVideos";
import AdminDocumentos from "./AdminDocumentos";
import Login from "./Login";

function usarNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    const metaExistia = Boolean(meta);
    const conteudoAnterior = meta?.getAttribute("content");

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", "noindex, nofollow, noarchive");

    return () => {
      if (metaExistia) {
        meta.setAttribute("content", conteudoAnterior || "");
      } else {
        meta.remove();
      }
    };
  }, []);
}

export default function Admin() {
  usarNoIndex();

  const [sessao, setSessao] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [aba, setAba] = useState("documentos");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!supabase) {
      setErro("O Supabase não está configurado.");
      setVerificando(false);
      return;
    }

    let ativo = true;

    async function verificarUsuario(usuario) {
      if (!ativo) return;

      setSessao(usuario || null);
      setEhAdmin(false);
      setErro("");

      if (!usuario) {
        setVerificando(false);
        return;
      }

      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", usuario.id)
        .maybeSingle();

      if (!ativo) return;

      if (error) {
        setErro(
          "Não foi possível verificar suas permissões. Confira as políticas RLS da tabela admins."
        );
        setEhAdmin(false);
      } else {
        setEhAdmin(Boolean(data));
      }

      setVerificando(false);
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          if (ativo) {
            setErro("Não foi possível verificar sua sessão.");
            setVerificando(false);
          }
          return;
        }

        verificarUsuario(data.session?.user || null);
      })
      .catch(() => {
        if (ativo) {
          setErro("Não foi possível verificar sua sessão.");
          setVerificando(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      verificarUsuario(novaSessao?.user || null);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  async function sair() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setErro("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070f23] px-5 text-white">
        <div className="flex items-center gap-3">
          <LoaderCircle className="animate-spin text-[#f5b82e]" size={24} />
          <span>Verificando acesso administrativo...</span>
        </div>
      </main>
    );
  }

  if (!sessao) {
    return <Login />;
  }

  if (!ehAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070f23] px-5 py-20 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111b2e] p-7 text-center shadow-xl">
          <Lock size={38} className="mx-auto text-[#f5b82e]" />

          <h1 className="mt-4 text-2xl font-bold">
            Acesso não autorizado
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sua conta está autenticada, mas não possui permissão para acessar
            o painel administrativo.
          </p>

          {erro && (
            <p role="alert" className="mt-4 text-sm text-red-300">
              {erro}
            </p>
          )}

          <button
            type="button"
            onClick={sair}
            className="mt-6 rounded-xl bg-[#f5b82e] px-5 py-3 font-bold text-[#101827] hover:bg-[#ffd064]"
          >
            Sair da conta
          </button>
        </section>
      </main>
    );
  }

  const abas = [
    {
      id: "documentos",
      nome: "Documentos",
      icone: FileText,
    },
    {
      id: "opinioes",
      nome: "Opiniões",
      icone: MessageSquare,
    },
    {
      id: "videos",
      nome: "Vídeos",
      icone: PlaySquare,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070f23] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5b82e]">
              Área restrita
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Painel administrativo
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Gerencie o conteúdo publicado no site.
            </p>
          </div>

          <button
            type="button"
            onClick={sair}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:border-red-400/60 hover:text-red-200 sm:self-auto"
          >
            <LogOut size={18} />
            Sair
          </button>
        </header>

        {erro && ehAdmin && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {erro}
          </div>
        )}

        <nav
          aria-label="Seções administrativas"
          className="mt-7 flex flex-wrap gap-2 border-b border-white/10 pb-5"
        >
          {abas.map((item) => {
            const Icone = item.icone;
            const ativa = aba === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAba(item.id)}
                aria-current={ativa ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  ativa
                    ? "bg-[#f5b82e] text-[#101827]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-[#f5b82e]/50 hover:text-white"
                }`}
              >
                <Icone size={18} />
                {item.nome}
              </button>
            );
          })}
        </nav>

        <section className="mt-7">
          {aba === "documentos" && <AdminDocumentos />}

          {aba === "opinioes" && <AdminComentarios />}

          {aba === "videos" && <AdminVideos />}
        </section>
      </div>
    </main>
  );
}
