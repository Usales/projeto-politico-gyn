import {
  Wallet,
  Eye,
  Users,
  ShieldCheck,
  Building2,
  BookOpen,
} from "lucide-react";

/**
 * Dados públicos do site.
 * Mantenha os contatos atualizados antes de publicar.
 */
export const contato = {
  whatsapp: "5562995227774",
  instagram: "gabrielhenriques.gyn",
  tiktok: "gabrielhenriquesgyn", // << NOVO
  youtubeUrl: "https://www.youtube.com/@usales-z4x", // << NOVO
  // Canal de privacidade (LGPD): use um e-mail só da campanha
  email: "SEU-EMAIL-AQUI@exemplo.com",

  get whatsappUrl() {
    return `https://wa.me/${this.whatsapp}`;
  },

  get instagramUrl() {
    return `https://www.instagram.com/${this.instagram}/`;
  },

  get tiktokUrl() { // << NOVO
    return `https://www.tiktok.com/@${this.tiktok}`;
  },
};

/**
 * Identidade e apresentação do site.
 */
export const perfil = {
  nome: "Gabriel Henriques",
  cidade: "Goiânia - GO",
  objetivo: "Participação cidadã e melhoria da gestão pública",
  descricao:
    "Ideias, análises e propostas para uma Goiânia mais eficiente, transparente e favorável a quem trabalha e empreende.",
};

/**
 * Propostas e temas de atuação pública.
 *
 * Os textos expressam objetivos e compromissos de atuação,
 * não resultados garantidos nem competências exclusivas de um cargo.
 */
export const propostas = [
  {
    id: "economia",
    categoria: "Desenvolvimento econômico",
    icon: Wallet,
    titulo: "Impostos e liberdade econômica",
    resumo:
      "Reduzir impostos para baratear produtos e serviços, aumentando o poder de compra da população e movimentando o comércio local com responsabilidade.",
    objetivo:
      "Promover um ambiente de negócios mais simples e previsível em Goiânia.",
    itens: [
      "Defender a simplificação de procedimentos municipais para abertura e funcionamento de empresas.",
      "Fiscalizar a arrecadação e a aplicação dos recursos públicos.",
      "Estudar alternativas para reduzir a carga tributária municipal quando houver viabilidade legal e orçamentária.",
      "Incentivar políticas municipais de apoio aos pequenos negócios e aos trabalhadores autônomos.",
    ],
  },

  {
    id: "transparencia",
    categoria: "Controle e gestão pública",
    icon: Eye,
    titulo: "Fiscalização do poder público",
    resumo:
      "O cidadão tem o direito de entender como o dinheiro público é arrecadado, administrado e utilizado.",
    objetivo:
      "Fortalecer o controle dos gastos e ampliar o acesso às informações públicas.",
    itens: [
      "Acompanhar contratos, licitações, despesas e execução de obras municipais.",
      "Cobrar informações públicas acessíveis, atualizadas e compreensíveis.",
      "Fiscalizar a execução do orçamento e cobrar explicações sobre possíveis irregularidades.",
      "Apresentar relatórios e análises com dados verificáveis e fontes identificadas.",
    ],
  },

  {
    id: "participacao",
    categoria: "Cidadania",
    icon: Users,
    titulo: "Participação popular",
    resumo:
      "A população deve ter canais efetivos para apresentar problemas, acompanhar decisões e cobrar resultados.",
    objetivo:
      "Aproximar os cidadãos das decisões e da fiscalização da administração municipal.",
    itens: [
      "Incentivar a participação em audiências públicas e consultas populares.",
      "Defender canais acessíveis para registrar sugestões e demandas dos bairros.",
      "Divulgar as atividades legislativas e explicar decisões de interesse público.",
      "Acompanhar as demandas recebidas e informar os encaminhamentos realizados.",
    ],
  },

  {
    id: "seguranca",
    categoria: "Segurança urbana",
    icon: ShieldCheck,
    titulo: "Segurança e ordem urbana",
    resumo:
      "Espaços públicos bem cuidados, iluminação adequada e serviços municipais eficientes contribuem para uma cidade mais segura.",
    objetivo:
      "Fiscalizar as políticas municipais relacionadas à prevenção, à conservação urbana e à atuação da Guarda Civil Metropolitana.",
    itens: [
      "Cobrar manutenção da iluminação pública e dos espaços de circulação.",
      "Fiscalizar as condições de funcionamento e os recursos destinados aos serviços municipais de segurança.",
      "Acompanhar políticas de prevenção à violência em articulação com os órgãos competentes.",
      "Defender ações integradas entre o município e as demais autoridades responsáveis pela segurança pública.",
    ],
  },

  {
    id: "cidade",
    categoria: "Infraestrutura e serviços",
    icon: Building2,
    titulo: "Bairros bem cuidados",
    resumo:
      "Serviços públicos eficientes começam com atenção aos problemas cotidianos de cada bairro.",
    objetivo:
      "Cobrar manutenção urbana, prestação adequada dos serviços e respostas às demandas da população.",
    itens: [
      "Fiscalizar a manutenção de vias, calçadas, praças e demais equipamentos públicos municipais.",
      "Acompanhar solicitações de limpeza urbana, drenagem e conservação dos espaços públicos.",
      "Cobrar transparência nos cronogramas de obras e nos prazos de execução.",
      "Monitorar a qualidade dos serviços municipais e encaminhar problemas aos órgãos responsáveis.",
    ],
  },

  {
    id: "educacao-cidada",
    categoria: "Educação cidadã",
    icon: BookOpen,
    titulo: "Educação política e cidadania",
    resumo:
      "Uma população bem informada consegue compreender seus direitos e fiscalizar melhor seus representantes.",
    objetivo:
      "Facilitar o acesso a informações sobre o funcionamento do município e do Poder Legislativo.",
    itens: [
      "Explicar de forma simples as funções da Prefeitura e da Câmara Municipal.",
      "Divulgar informações sobre orçamento, leis municipais e decisões legislativas.",
      "Incentivar o acompanhamento das sessões e das audiências públicas.",
      "Publicar análises baseadas em documentos oficiais e fontes verificáveis.",
    ],
  },
];