
import { useEffect, useState } from "react";

/**
 * Identifica a seção atualmente visível para destacar
 * o item correspondente no menu de navegação.
 *
 * @param {string[]} ids - IDs das seções monitoradas.
 * @returns {string} ID da seção ativa.
 */
export function useActiveSection(ids = []) {
  const [active, setActive] = useState(() => ids[0] ?? "");

  // Mantém uma dependência estável quando os IDs não mudam.
  const idsKey = JSON.stringify(ids);

  useEffect(() => {
    const sectionIds = JSON.parse(idsKey);

    if (sectionIds.length === 0) {
      setActive("");
      return;
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) {
      setActive(sectionIds[0]);
      return;
    }

    // Compatibilidade com ambientes sem IntersectionObserver.
    if (typeof IntersectionObserver === "undefined") {
      setActive(sections[0].id);
      return;
    }

    let currentActive = "";

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

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

    // Define um valor inicial válido.
    const initialActive = sections[0].id;
    currentActive = initialActive;
    setActive(initialActive);

    return () => observer.disconnect();
  }, [idsKey]);

  return active;
}
