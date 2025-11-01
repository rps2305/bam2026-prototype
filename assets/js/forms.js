/**
 * BAM! Festival – Form loader
 * Ensures Microsoft Forms embeds initialise consistently on Vrijwilligers & Enquête pages.
 */

(function () {
  "use strict";

  const diagnostics = (window.__bamDiagnostics = window.__bamDiagnostics || {
    menuReady: false,
    themeReady: false,
    formsReady: false,
    photoswipeReady: false
  });

  try {
    const targets = document.querySelectorAll("[data-form-embed]");
    if (!targets.length) {
      diagnostics.formsReady = true;
      return;
    }

    const createLoader = () => {
      const loader = document.createElement("div");
      loader.className = "status-banner";
      loader.setAttribute("role", "status");
      loader.innerHTML = `<span aria-hidden="true">⏳</span><span>Formulier wordt geladen…</span>`;
      return loader;
    };

    const loadForm = (element) => {
      if (element.dataset.state === "loaded") return;
      const src = element.dataset.formSrc;
      const title = element.dataset.formTitle || "Aanmeldformulier";

      if (!src) {
        console.warn("Geen bron voor formulier gevonden", element);
        element.dataset.state = "error";
        return;
      }

      const loader = createLoader();
      element.appendChild(loader);

      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.setAttribute("referrerpolicy", "no-referrer");
      iframe.setAttribute("aria-label", title);

      iframe.addEventListener("load", () => {
        loader.remove();
        element.dataset.state = "loaded";
      });

      iframe.addEventListener("error", () => {
        loader.classList.add("status-banner--danger");
        loader.innerHTML = `<span aria-hidden="true">⚠️</span><span>Formulier kan niet geladen worden. Probeer het later opnieuw.</span>`;
        element.dataset.state = "error";
      });

      element.appendChild(iframe);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadForm(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "120px" }
      );

      targets.forEach((target) => observer.observe(target));
    } else {
      targets.forEach(loadForm);
    }

    diagnostics.formsReady = true;
  } catch (error) {
    console.warn("Fout bij initialiseren formulieren:", error);
  }
})();
