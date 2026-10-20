import { useSyncExternalStore } from "react";

// Guarda a escolha da pessoa: "sim", "nao" ou null (ainda não escolheu)
const CHAVE = "consentimento-terceiros";

let atual = null;
try {
  atual = localStorage.getItem(CHAVE);
} catch {
  atual = null; // se o navegador bloquear o armazenamento, vale só nesta visita
}

const ouvintes = new Set();

export function definirConsentimento(valor) {
  atual = valor;
  try {
    if (valor === null) localStorage.removeItem(CHAVE);
    else localStorage.setItem(CHAVE, valor);
  } catch {
    /* ignorar */
  }
  ouvintes.forEach((fn) => fn());
}

function assinar(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export function useConsentimento() {
  return useSyncExternalStore(assinar, () => atual, () => null);
}