
import { motion } from "framer-motion";
import { Eye, BriefcaseBusiness, Scale } from "lucide-react";

const valores = [
  {
    titulo: "Transparência",
    texto: "Fiscalização dos gastos públicos e responsabilidade com o dinheiro do cidadão.",
    icon: Eye,
  },
  {
    titulo: "Liberdade econômica",
    texto: "Menos burocracia, incentivo ao empreendedorismo e valorização de quem trabalha.",
    icon: BriefcaseBusiness,
  },
  {
    titulo: "Reformas responsáveis",
    texto: "Respeito à lei, eficiência administrativa e mudanças com resultados concretos.",
    icon: Scale,
  },
];

export default function Sobre() {
  return (
    <section id="sobre" className="bg-navy-900 py-20 text-white md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Sobre mim
          </span>

          <h2 className="font-display mt-3 text-3xl font-extrabold md:text-5xl">
            Gabriel Henriques Sales
          </h2>

          <p className="mt-3 text-sm font-semibold text-gold-400">
            Conservador reformista · Direita
          </p>

          <p className="mt-5 leading-relaxed text-white/75 md:text-lg">
            Minha trajetória reúne estudos nas áreas de tecnologia, pela
            Faculdade SENAI FATESG, segurança pública pela Faculdade
            Sensu e Direito como concurseiro autodidata. Também atuo como empreendedor no setor alimentício.
            Essas experiências ampliam minha visão sobre gestão, análise
            de problemas e busca por soluções eficientes, competências
            fundamentais para uma administração responsável.
          </p>

          <p className="mt-4 leading-relaxed text-white/75 md:text-lg">
            Minha visão para Goiânia é pautada pela responsabilidade fiscal,
            transparência administrativa, segurança pública e liberdade
            econômica. Acima de tudo, defendo o respeito ao cidadão e a
            aplicação responsável dos recursos públicos. Faço uma crítica
            à condução da atual gestão de Sandro Mabel quando a prioridade
            dada à arrecadação não vem acompanhada, na mesma medida, de
            melhorias perceptíveis nos serviços oferecidos à população.
            Acredito que governar exige planejamento, decisões fundamentadas
            e compromisso permanente com o interesse público.
          </p>

          <a
            href="#propostas"
            className="mt-6 inline-flex rounded-xl bg-gold-400 px-5 py-3 font-bold text-navy-900 transition hover:bg-gold-300"
          >
            Conheça minhas propostas
          </a>
        </motion.div>

        <div className="space-y-3 md:col-span-2">
          {valores.map((valor, i) => {
            const Icon = valor.icon;

            return (
              <motion.article
                key={valor.titulo}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <Icon size={21} className="shrink-0 text-gold-400" />
                  <h3 className="font-display font-bold text-gold-400">
                    {valor.titulo}
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {valor.texto}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
