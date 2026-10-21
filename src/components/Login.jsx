
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

const styles = {
  page: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 20px",
    background: "#f5f3ef",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "36px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.10)",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#172033",
  },
  input: {
    display: "block",
    width: "100%",
    height: "46px",
    padding: "0 13px",
    border: "1px solid #d5d9e0",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#172033",
    background: "#fff",
    boxSizing: "border-box",
    outlineOffset: "2px",
  },
  button: {
    width: "100%",
    minHeight: "48px",
    border: "none",
    borderRadius: "999px",
    background: "#172033",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");

    if (!supabase) {
      setErro("O sistema de autenticação não está configurado.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error || !data.user) {
        setErro(
          error?.status === 429
            ? "Muitas tentativas. Aguarde alguns minutos."
            : "E-mail ou senha incorretos."
        );
        return;
      }

      const { data: administrador, error: erroPermissao } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (erroPermissao) {
        await supabase.auth.signOut();
        setErro("Não foi possível verificar sua permissão no sistema.");
        return;
      }

      if (!administrador) {
        await supabase.auth.signOut();
        setErro("Esta conta não tem permissão para acessar o painel.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "54px",
            height: "54px",
            marginBottom: "22px",
            borderRadius: "16px",
            background: "#172033",
            color: "#f4bf42",
          }}
        >
          <LockKeyhole size={26} />
        </div>

        <p
          style={{
            margin: "0 0 8px",
            color: "#a87910",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          ÁREA RESTRITA
        </p>

        <h1
          style={{
            margin: "0",
            color: "#172033",
            fontSize: "28px",
            lineHeight: 1.25,
            fontWeight: 800,
          }}
        >
          Painel administrativo
        </h1>

        <p
          style={{
            margin: "12px 0 26px",
            color: "#626b7a",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          Entre com suas credenciais para administrar o conteúdo do site.
        </p>

        <form onSubmit={entrar}>
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="login-email" style={styles.label}>
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={carregando}
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="login-senha" style={styles.label}>
              Senha
            </label>

            <div style={{ position: "relative" }}>
              <input
                id="login-senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={carregando}
                style={{ ...styles.input, paddingRight: "48px" }}
              />

              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "46px",
                  width: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  background: "transparent",
                  color: "#172033",
                  cursor: "pointer",
                }}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {erro && (
            <p
              role="alert"
              style={{
                margin: "0 0 18px",
                padding: "12px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            style={{
              ...styles.button,
              opacity: carregando ? 0.65 : 1,
              cursor: carregando ? "wait" : "pointer",
            }}
          >
            {carregando ? "Verificando acesso..." : "Entrar no painel"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
            color: "#626b7a",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          <LockKeyhole size={15} style={{ flexShrink: 0 }} />
          <span>Acesso exclusivo para administradores autorizados.</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            display: "block",
            width: "100%",
            marginTop: "16px",
            padding: "10px",
            border: "none",
            background: "transparent",
            color: "#172033",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Voltar ao site
        </button>
      </section>
    </main>
  );
}
