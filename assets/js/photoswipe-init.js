/**
 * BAM! Festival – Photoswipe bootstrap
 * Loads the lightbox only when galleries are present.
 */

(async function () {
  const diagnostics = (window.__bamDiagnostics = window.__bamDiagnostics || {
    menuReady: false,
    themeReady: false,
    formsReady: false,
    photoswipeReady: false
  });

  const galleries = document.querySelectorAll("[data-photoswipe-gallery]");
  if (!galleries.length) {
    diagnostics.photoswipeReady = true;
    return;
  }

  try {
    const { default: PhotoSwipeLightbox } = await import("/vendor/photoswipe/photoswipe-lightbox.esm.js");
    const loadModule = () => import("/vendor/photoswipe/photoswipe.esm.js");

    galleries.forEach((gallery) => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: gallery,
        children: "a[data-pswp-src]",
        pswpModule: loadModule,
        showHideAnimationType: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "none" : "zoom",
        paddingFn: () => ({ top: 40, bottom: 40, left: 20, right: 20 })
      });
      lightbox.init();
    });

    diagnostics.photoswipeReady = true;
  } catch (error) {
    diagnostics.photoswipeReady = false;
    console.warn("Photoswipe kon niet worden geladen:", error);
  }
})();
