
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  MessageCircle,
  ShieldCheck,
  Scale,
  Landmark,
} from "lucide-react";

const perguntas = [
  {
    q: "Como você define sua posição política?",
    a: "Sou um conservador reformista, identificado com a direita. Acredito na liberdade individual, na responsabilidade fiscal, na segurança pública, no respeito à lei e na valorização da família. Defendo reformas que melhorem a gestão pública, reduzam a burocracia e ampliem as oportunidades para quem trabalha e empreende.",
    icon: ShieldCheck,
  },
  {
    q: "O que significa ser um conservador reformista?",
    a: "Significa preservar valores e princípios que considero importantes, sem tratar os problemas atuais como se não pudessem ser corrigidos. Defendo mudanças responsáveis, baseadas em evidências, eficiência administrativa, respeito às instituições e uso criterioso do dinheiro público.",
    icon: Scale,
  },
  {
    q: "Quais são suas prioridades para Goiânia?",
    a: "Quero discutir soluções para a segurança urbana, a conservação dos bairros, a qualidade dos serviços públicos, a simplificação da vida de quem empreende e a transparência dos gastos municipais. As propostas devem ser avaliadas pela viabilidade legal, pelo custo e pelos benefícios para a população.",
    icon: Landmark,
  },
  {
    q: "Você já é candidato?",
    a: "Este site apresenta minhas ideias, meus princípios e minha visão para Goiânia. Qualquer decisão ou anúncio sobre uma candidatura será comunicado oportunamente, com respeito aos requisitos e aos prazos da legislação eleitoral.",
    icon: Landmark,
  },
  {
    q: "Você faz parte de algum partido?",
    a: "Minha posição política não se resume à filiação partidária. Uma eventual escolha partidária deve considerar a compatibilidade de princípios, propostas e compromissos públicos. Informações sobre filiação serão comunicadas com transparência quando houver uma definição.",
    icon: ShieldCheck,
  },
  {
    q: "Você pretende reduzir os impostos?",
    a: "Defendo uma tributação municipal justa, transparente e compatível com o desenvolvimento econômico. Reduções precisam considerar a legislação, o orçamento e a continuidade dos serviços essenciais. Minha prioridade é combater desperdícios, simplificar procedimentos e avaliar medidas fiscalmente responsáveis.",
    icon: Scale,
  },
  {
    q: "Como posso sugerir uma ideia ou relatar um problema?",
    a: "Você pode utilizar a seção Participe, caso o formulário esteja disponível, ou entrar em contato pelos canais oficiais indicados neste site. Relatos com local, descrição e informações verificáveis ajudam a compreender o problema e identificar os órgãos responsáveis.",
    icon: MessageCircle,
  },
  {
    q: "Como posso acompanhar suas ideias e atividades?",
    a: "Acompanhe as publicações no Instagram e as atualizações deste site. A proposta é compartilhar posicionamentos, análises de questões municipais e informações com fontes verificáveis, mantendo um canal aberto para críticas e sugestões.",
    icon: MessageCircle,
  },
];

function Item({ pergunta, index, aberto, onToggle }) {
  const uid = useId();
  const buttonId = `faq-button-${uid}`;
  const panelId = `faq-panel-${uid}`;
  const Icon = pergunta.icon;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        aberto
          ? "border-gold-500/50 bg-white shadow-sm"
          : "border-navy-900/10 bg-paper"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={aberto}
          aria-controls={panelId}
          className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-navy-900 md:px-6"
        >
          <span className="flex items-center gap-3">
            <Icon
              size={19}
              aria-hidden="true"
              className={aberto ? "shrink-0 text-gold-500" : "shrink-0 text-navy-900/50"}
            />
            <span className="font-semibold">{pergunta.q}</span>
          </span>

          <motion.span
            animate={{ rotate: aberto ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-gold-500"
            aria-hidden="true"
          >
            <Plus size={22} />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            key="conteudo"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pl-12 leading-relaxed text-navy-900/75 md:px-6 md:pl-14">
              {pergunta.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [aberto, setAberto] = useState(null);

  return (
    <section
      id="duvidas"
      aria-labelledby="faq-titulo"
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-5 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-2 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            Transparência
          </span>

          <h2
            id="faq-titulo"
            className="font-display mt-3 text-3xl font-extrabold text-navy-900 md:text-5xl"
          >
            Perguntas frequentes
          </h2>

          <p className="mt-4 leading-relaxed text-navy-900/70">
            Princípios, propostas e posicionamentos apresentados de forma
            direta. Informação clara é parte de uma relação responsável
            com o cidadão.
          </p>

          <a
            href="#participe"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-500"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Envie sua sugestão
          </a>
        </div>

        <div className="space-y-3 lg:col-span-3">
          {perguntas.map((pergunta, index) => (
            <Item
              key={pergunta.q}
              pergunta={pergunta}
              index={index}
              aberto={aberto === index}
              onToggle={() =>
                setAberto((atual) => (atual === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
