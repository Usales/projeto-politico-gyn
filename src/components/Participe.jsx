import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, AtSign } from "lucide-react";
import { contato } from "../data/site";

export default function Participe() {
  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function enviar(e) {
    e.preventDefault();
    const texto =
      `Olá, Gabriel! Meu nome é ${nome}.` +
      (bairro ? ` Sou do bairro/região: ${bairro}.` : "") +
      `\n\n${mensagem}`;
    const url = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  const campo =
    "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40";

  return (
    <section id="participe" className="bg-paper py-24">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Participe
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-navy-900 md:text-5xl">
            Sua voz importa
          </h2>
          <p className="mt-4 text-lg text-navy-900/70">
            Mande uma sugestão, uma crítica ou um problema do seu bairro. Toda
            mensagem é lida.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={`https://wa.me/${contato.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 font-medium text-navy-900 transition hover:text-gold-500"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <MessageCircle size={20} />
              </span>
              Chamar no WhatsApp
            </a>
            <a
              href={`https://instagram.com/${contato.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 font-medium text-navy-900 transition hover:text-gold-500"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <AtSign size={20} />
              </span>
              @{contato.instagram}
            </a>
          </div>
        </motion.div>

        <motion.form
          onSubmit={enviar}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4 rounded-3xl bg-white p-8 shadow-xl"
        >
          <input className={campo} placeholder="Seu nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
          <input className={campo} placeholder="Bairro ou região (opcional)" value={bairro} onChange={(e) => setBairro(e.target.value)} />
          <textarea className={`${campo} min-h-32 resize-none`} placeholder="Sua mensagem" required value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white transition hover:bg-gold-400 hover:text-navy-950"
          >
            Enviar pelo WhatsApp <Send size={18} />
          </button>
        </motion.form>
      </div>
    </section>
  );
}