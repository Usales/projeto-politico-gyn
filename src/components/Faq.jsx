import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

// EDITE as perguntas e respostas conforme a sua situação
const perguntas = [
  {
    q: "Você já é candidato?",
    a: "Ainda não. Este site apresenta minhas ideias e minha forma de pensar a cidade. Qualquer informação sobre candidatura será divulgada no momento oportuno, respeitando a legislação eleitoral.",
  },
  {
    q: "Você faz parte de algum partido?",
    a: "No momento, não. Por enquanto o foco é apresentar propostas e ouvir a população.",
  },
  {
    q: "Como posso sugerir uma ideia ou relatar um problema?",
    a: "Use o formulário na seção Participe. A mensagem chega direto no meu WhatsApp. Você também pode me chamar pelo Instagram.",
  },
  {
    q: "Como acompanho o seu trabalho?",
    a: "Pelo Instagram, onde publico minhas posições e novidades, e aqui no site, que será atualizado com o tempo.",
  },
];

function Item({ q, a, aberto, onToggle, id }) {
  return (
    <div className="rounded-2xl border border-navy-900/10 bg-paper">
      <button
        onClick={onToggle}
        aria-expanded={aberto}
        aria-controls={id}
        className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900 md:px-6"
      >
        {q}
        <motion.span animate={{ rotate: aberto ? 45 : 0 }} className="shrink-0 text-gold-500">
          <Plus size={22} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 leading-relaxed text-navy-900/70 md:px-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [aberto, setAberto] = useState(0);

  return (
    <section id="duvidas" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-2 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Dúvidas
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-navy-900 md:text-5xl">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-navy-900/70">
            Não achou o que procurava? Fale comigo na seção Participe.
          </p>
        </div>

        <div className="space-y-3 lg:col-span-3">
          {perguntas.map((p, i) => (
            <Item
              key={p.q}
              id={`faq-${i}`}
              {...p}
              aberto={aberto === i}
              onToggle={() => setAberto(aberto === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}