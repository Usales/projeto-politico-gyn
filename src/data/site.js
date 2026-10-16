import { Wallet, Eye, Users } from "lucide-react";

export const contato = {
  // Somente números: 55 + DDD + número. Exemplo: 5562999999999
  whatsapp: "5562999999999",
  instagram: "gabrielhenriques.gyn",
};

export const propostas = [
  {
    icon: Wallet,
    titulo: "Impostos e liberdade econômica",
    resumo:
      "Uma cidade onde empreender é mais simples e o dinheiro do contribuinte rende mais.",
    itens: [
      "Defender menos burocracia para abrir e manter um negócio",
      "Lutar por uma carga tributária mais justa e transparente",
      "Apoiar o pequeno empreendedor e o trabalho autônomo",
    ],
  },
  {
    icon: Eye,
    titulo: "Fiscalização do poder público",
    resumo:
      "Quem administra dinheiro público precisa explicar cada centavo gasto.",
    itens: [
      "Acompanhar contratos, gastos e obras do poder público",
      "Defender portais de transparência claros e de fácil leitura",
      "Divulgar o que for descoberto de forma simples e aberta",
    ],
  },
  {
    icon: Users,
    titulo: "Cidadania e participação popular",
    resumo:
      "A população não deve aparecer só na hora do voto, e sim participar das decisões.",
    itens: [
      "Criar canais diretos para ouvir sugestões e cobranças",
      "Incentivar a participação em audiências e conselhos",
      "Explicar de forma simples como o poder público funciona",
    ],
  },
];