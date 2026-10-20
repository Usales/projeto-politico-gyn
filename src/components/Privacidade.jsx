import { contato } from "../data/site";

const ATUALIZADO = "20 de outubro de 2026";

const politica = [
  {
    titulo: "1. Quem é o responsável",
    texto: [
      "Este site é mantido por Gabriel Henriques Sales, pessoa física, de Goiânia/GO, que é o controlador dos dados pessoais tratados aqui, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).",
      `O site tem caráter informativo e de apresentação de ideias e propostas. Contato para assuntos de privacidade: ${contato.email}.`,
    ],
  },
  {
    titulo: "2. Quais dados são tratados",
    itens: [
      "Opiniões enviadas na página “Opiniões da população”: nome ou apelido, bairro (opcional), nota de 1 a 5, texto da opinião e data e hora do envio.",
      "Dados técnicos básicos enviados junto com a opinião: tipo de aparelho (iPhone/iPad, Android ou computador), idioma do navegador e fuso horário. Servem apenas para estatísticas gerais.",
      "Formulário “Participe”: eu não guardo o que você escreve. Ao enviar, o site abre o seu WhatsApp com a mensagem pronta, e o envio passa a ser tratado pelo WhatsApp.",
      "Contato direto por WhatsApp, Instagram ou e-mail: os dados que você informar nessas conversas.",
    ],
    texto: [
      "Não coleto CPF, endereço nem localização por GPS. O site não usa cookies de publicidade, Google Analytics, Meta Pixel ou ferramentas semelhantes de rastreamento.",
    ],
  },
  {
    titulo: "3. Dados sensíveis",
    texto: [
      "Uma opinião sobre política, propostas ou governos pode revelar convicções políticas, que a LGPD classifica como dado pessoal sensível (art. 5º, II). Por isso, só publico opiniões com o seu consentimento específico e destacado, dado ao marcar a caixa de concordância antes do envio (art. 11, I).",
      "Por segurança, não escreva dados pessoais de terceiros (telefone, endereço, documentos) nem informações de saúde, religião ou outras de natureza sensível. Esse tipo de conteúdo será removido.",
    ],
  },
  {
    titulo: "4. Para que uso os dados e com qual base legal",
    itens: [
      "Exibir a sua opinião no site: consentimento (arts. 7º, I, e 11, I).",
      "Gerar estatísticas gerais de participação: consentimento.",
      "Moderar opiniões e prevenir spam e abusos, como o intervalo mínimo entre envios guardado no seu navegador: legítimo interesse (art. 7º, IX), apenas para dados que não sejam sensíveis.",
      "Responder mensagens que você enviar: consentimento.",
    ],
  },
  {
    titulo: "5. Com quem os dados são compartilhados",
    texto: [
      "Não vendo nem cedo dados para publicidade. Para o site funcionar, uso fornecedores que tratam dados em meu nome:",
    ],
    itens: [
      "Supabase: banco de dados onde ficam as opiniões.",
      "Netlify: hospedagem do site.",
      "WhatsApp (Meta): quando você escolhe falar comigo por lá.",
      "YouTube (Google) e OpenStreetMap: vídeos e mapa, somente se você permitir conteúdo de terceiros (seção 7).",
    ],
    depois: [
      "Esses fornecedores podem registrar o endereço IP em logs técnicos de segurança, segundo as próprias políticas. Alguns têm sede ou servidores fora do Brasil, o que pode envolver transferência internacional de dados. Também posso compartilhar dados quando a lei ou uma ordem judicial exigir.",
    ],
  },
  {
    titulo: "6. Por quanto tempo guardo os dados",
    texto: [
      "As opiniões e os dados técnicos ficam guardados enquanto o site estiver no ar ou até você pedir a exclusão, o que ocorrer primeiro. Reviso periodicamente e apago o que não for mais necessário.",
    ],
  },
  {
    titulo: "7. Cookies e conteúdo de terceiros",
    texto: [
      "O site não usa cookies de publicidade nem de análise de audiência. Guarda no seu navegador apenas dois itens técnicos: a sua escolha sobre conteúdo de terceiros e o horário do último envio de opinião, usado para limitar spam.",
      "Os vídeos do YouTube e o mapa de bairros (OpenStreetMap) só são carregados depois que você permite. Ao permitir, esses serviços recebem seu endereço IP e dados do seu navegador e podem usar cookies, conforme as próprias políticas. Você pode mudar a escolha a qualquer momento em “Preferências de privacidade”, no rodapé. As fontes de letra são hospedadas no próprio site.",
    ],
  },
  {
    titulo: "8. Seus direitos",
    texto: ["A qualquer momento e sem custo, você pode (art. 18 da LGPD):"],
    itens: [
      "confirmar se trato dados seus e ter acesso a eles;",
      "corrigir dados incompletos ou desatualizados;",
      "pedir anonimização, bloqueio ou eliminação de dados desnecessários ou tratados fora da lei;",
      "pedir a portabilidade dos dados;",
      "saber com quem os dados foram compartilhados;",
      "revogar o consentimento e pedir a eliminação dos dados tratados com base nele.",
    ],
    depois: [
      `Para exercer esses direitos, escreva para ${contato.email} informando o nome usado, a data aproximada e um trecho da opinião. Respondo em até 15 dias. Se achar que seus direitos não foram atendidos, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
    ],
  },
  {
    titulo: "9. Crianças e adolescentes",
    texto: [
      "O site é voltado a maiores de 18 anos. Não coleto de propósito dados de menores. Se identificar algum, removo.",
    ],
  },
  {
    titulo: "10. Segurança",
    texto: [
      "Uso conexão segura (HTTPS), regras no banco de dados que impedem a leitura pública dos dados técnicos e moderação das opiniões. Nenhum sistema é 100% seguro. Em caso de incidente relevante, comunicarei os titulares e a ANPD, como a lei determina.",
    ],
  },
  {
    titulo: "11. Mudanças nesta política",
    texto: [
      "Posso atualizar esta política. A data no topo mostra a versão em vigor.",
    ],
  },
];

const termos = [
  {
    titulo: "1. Aceitação e natureza do site",
    texto: [
      "Ao usar este site, você concorda com estes termos. O site apresenta ideias, propostas e atividades de Gabriel Henriques Sales de forma informativa. Nada aqui é pedido de voto nem oferta de produto ou serviço.",
    ],
  },
  {
    titulo: "2. Regras para enviar opiniões",
    texto: [
      "Para enviar uma opinião, você declara ter 18 anos ou mais e ser o único responsável pelo que escreve. É proibido enviar:",
    ],
    itens: [
      "ofensas, ameaças, discriminação ou discurso de ódio;",
      "informações sabidamente falsas ou acusações sem base contra pessoas;",
      "dados pessoais de terceiros;",
      "spam, propaganda, pedidos de dinheiro ou de voto;",
      "conteúdo ilegal ou que viole direitos de terceiros.",
    ],
  },
  {
    titulo: "3. Moderação e remoção",
    texto: [
      "Posso recusar, ocultar ou remover qualquer opinião, a qualquer momento e sem aviso, especialmente se ela descumprir estas regras ou a lei. As opiniões publicadas são de responsabilidade de quem as escreveu e não representam a posição do responsável pelo site.",
    ],
  },
  {
    titulo: "4. Licença sobre as opiniões",
    texto: [
      "Ao enviar uma opinião, você autoriza que ela seja exibida neste site, sem pagamento, enquanto estiver publicada. Você mantém a autoria e pode pedir a remoção quando quiser, como explica a Política de Privacidade.",
    ],
  },
  {
    titulo: "5. Conteúdo e propriedade intelectual",
    texto: [
      "Textos, imagens, vídeos e documentos do site são de autoria do responsável, salvo indicação em contrário. Citações são bem-vindas com crédito e link. Reprodução integral ou uso comercial depende de autorização. Dados do mapa: © colaboradores do OpenStreetMap, licença ODbL.",
    ],
  },
  {
    titulo: "6. Propostas e documentos",
    texto: [
      "As propostas e os anteprojetos publicados são ideias em discussão. Dependem de análise jurídica e do processo legislativo e não representam promessa de resultado.",
    ],
  },
  {
    titulo: "7. Links externos e disponibilidade",
    texto: [
      "Não controlo nem respondo por sites e serviços de terceiros indicados aqui. O site é oferecido no estado em que se encontra e pode mudar ou sair do ar a qualquer momento.",
    ],
  },
  {
    titulo: "8. Lei aplicável e foro",
    texto: [
      "Valem as leis brasileiras. Fica eleito o foro da comarca de Goiânia/GO, ressalvados os direitos que a lei assegure ao usuário em outro foro.",
    ],
  },
  {
    titulo: "9. Contato",
    texto: [`Dúvidas sobre estes termos: ${contato.email}.`],
  },
];

function Documento({ id, titulo, secoes }) {
  return (
    <article id={id} className="scroll-mt-24">
      <h2 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">
        {titulo}
      </h2>
      <p className="mt-2 text-sm text-navy-900/70">
        Última atualização: {ATUALIZADO}
      </p>

      <div className="mt-8 space-y-8">
        {secoes.map((s) => (
          <section key={s.titulo}>
            <h3 className="font-display text-xl font-bold text-navy-900">
              {s.titulo}
            </h3>

            {s.texto?.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-navy-900/80">
                {p}
              </p>
            ))}

            {s.itens && (
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-navy-900/80">
                {s.itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}

            {s.depois?.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-navy-900/80">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

export default function Privacidade() {
  const botao =
    "rounded-full border border-navy-900/20 bg-white px-5 py-2 text-sm font-semibold text-navy-900 transition hover:border-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

  return (
    <main className="min-h-screen bg-paper pb-24 pt-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h1 className="font-display text-4xl font-extrabold text-navy-900 md:text-5xl">
          Privacidade e termos de uso
        </h1>

        <nav aria-label="Neste documento" className="mt-6 flex flex-wrap gap-3">
          <a href="#politica" className={botao}>
            Política de Privacidade
          </a>
          <a href="#termos" className={botao}>
            Termos de Uso
          </a>
        </nav>

        <div className="mt-14 space-y-20">
          <Documento
            id="politica"
            titulo="Política de Privacidade"
            secoes={politica}
          />
          <Documento id="termos" titulo="Termos de Uso" secoes={termos} />
        </div>
      </div>
    </main>
  );
}