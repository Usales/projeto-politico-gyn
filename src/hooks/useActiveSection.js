import { useEffect, useState } from "react";

/**
 * Identifica a seção atualmente visível para destacar
 * o item correspondente no menu de navegação.
 *
 * @param {string[]} ids - IDs das seções monitoradas.
 * @param {string} pathname - Página atual (refaz a busca ao trocar de página).
 * @returns {string} ID da seção ativa.
 */
export function useActiveSection(ids = [], pathname = "") {
  const [active, setActive] = useState(() => ids[0] ?? "");

  // Mantém uma dependência estável quando os IDs não mudam.
  const idsKey = JSON.stringify(ids);

  useEffect(() => {
    const sectionIds = JSON.parse(idsKey);

    if (sectionIds.length === 0) {
      setActive("");
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setActive(sectionIds[0]);
      return;
    }

    let observer;

    // Pequena espera: a página nova precisa terminar de montar
    const timer = setTimeout(() => {
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (sections.length === 0) {
        setActive(sectionIds[0]);
        return;
      }

      let currentActive = sections[0].id;
      setActive(currentActive);

      observer = new IntersectionObserver(
        (entries) => {
          const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visibleSections.length === 0) return;

          const nextActive = visibleSections[0].target.id;

          if (nextActive && nextActive !== currentActive) {
            currentActive = nextActive;
            setActive(nextActive);
          }
        },
        {
          root: null,
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0,
        }
      );

      sections.forEach((section) => observer.observe(section));
    }, 150);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [idsKey, pathname]);

  return active;
}