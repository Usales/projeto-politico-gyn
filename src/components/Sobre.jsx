import { motion } from "framer-motion";

const valores = [
  { titulo: "Transparência", texto: "Tudo o que é público deve estar aberto a quem paga a conta." },
  { titulo: "Liberdade", texto: "Quem trabalha e empreende precisa de espaço para crescer." },
  { titulo: "Participação", texto: "Cidadania é ação diária, e não apenas voto de tempos em tempos." },
];

export default function Sobre() {
  return (
    <section id="sobre" className="bg-navy-900 py-24 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="md:col-span-3"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Sobre
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold md:text-5xl">
            Gabriel Henriques Sales
          </h2>

          {/* EDITE ESTE TEXTO COM A SUA HISTÓRIA REAL */}
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Sou de Goiânia e acredito que a cidade pode ser melhor quando o
            cidadão participa e o poder público presta contas. Este espaço
            existe para apresentar minhas ideias e ouvir quem vive a cidade
            todos os dias.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Aqui você vai encontrar minhas propostas, minhas posições e um
            canal direto para falar comigo.
          </p>
        </motion.div>

        <div className="space-y-4 md:col-span-2">
          {valores.map((v, i) => (
            <motion.div
              key={v.titulo}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="font-display text-lg font-bold text-gold-400">{v.titulo}</h3>
              <p className="mt-1 text-white/70">{v.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}