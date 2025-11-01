/**
 * BAM! Festival – Core interactions
 * Handles theme toggling, navigation accessibility, and global diagnostics.
 */

(function () {
  "use strict";

  const FOCUSABLE = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const diagnostics = (window.__bamDiagnostics = window.__bamDiagnostics || {
    menuReady: false,
    themeReady: false,
    formsReady: false,
    photoswipeReady: false
  });

  /* Theme toggling ------------------------------------------------------ */
  try {
    const root = document.documentElement;
    const toggle = document.querySelector("[data-theme-toggle]");
    const STORAGE_KEY = "bam-theme";

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(theme) {
      root.dataset.theme = theme;
      if (toggle) {
        toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
        toggle.setAttribute("aria-label", theme === "dark" ? "Schakel licht thema" : "Schakel donker thema");
      }
    }

    function getStoredTheme() {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch (error) {
        console.warn("Kan thema niet lezen uit opslag:", error);
        return null;
      }
    }

    function storeTheme(theme) {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        console.warn("Kan thema niet bewaren:", error);
      }
    }

    const storedTheme = getStoredTheme();
    if (storedTheme) {
      applyTheme(storedTheme);
    } else if (prefersDark && prefersDark.matches) {
      applyTheme("dark");
    } else {
      applyTheme(root.dataset.theme || "light");
    }

    toggle?.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      storeTheme(nextTheme);
    });

    prefersDark?.addEventListener("change", (event) => {
      if (!getStoredTheme()) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });

    diagnostics.themeReady = true;
  } catch (error) {
    console.warn("Fout bij initialiseren thema:", error);
  }

  /* Navigation ---------------------------------------------------------- */
  try {
    const nav = document.querySelector("[data-primary-nav]");
    const navList = nav?.querySelector(".primary-nav__list");
    const menuToggle = document.querySelector("[data-nav-toggle]");
    const prefersHover = window.matchMedia ? window.matchMedia("(hover: hover)") : { matches: false };

    if (!nav || !navList) {
      diagnostics.menuReady = true;
      return;
    }

    const navItems = Array.from(navList.querySelectorAll(".primary-nav__item"));
    let openItem = null;
    let mobileMenuOpen = false;

    function getFocusableElements(container) {
      return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
      );
    }

    function closeItem(item, { focusTrigger = false } = {}) {
      if (!item) return;
      item.dataset.open = "false";
      const trigger = item.querySelector(".primary-nav__trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
        if (focusTrigger) trigger.focus();
      }
      if (openItem === item) {
        openItem = null;
      }
    }

    function openItemPanel(item, { focusFirst = false } = {}) {
      if (openItem && openItem !== item) {
        closeItem(openItem);
      }
      item.dataset.open = "true";
      const trigger = item.querySelector(".primary-nav__trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "true");
      }
      openItem = item;

      if (focusFirst) {
        const panel = item.querySelector(".mega-panel");
        const focusables = panel ? getFocusableElements(panel) : [];
        if (focusables.length) {
          focusables[0].focus();
        }
      }
    }

    function focusSiblingItem(currentIndex, direction) {
      const nextIndex = (currentIndex + direction + navItems.length) % navItems.length;
      const nextItem = navItems[nextIndex];
      const trigger = nextItem?.querySelector(".primary-nav__trigger") || nextItem?.querySelector("a");
      if (trigger) {
        trigger.focus();
        if (nextItem.querySelector(".mega-panel")) {
          openItemPanel(nextItem);
        } else if (openItem && openItem !== nextItem) {
          closeItem(openItem);
        }
      }
    }

    function handleTriggerClick(event, item) {
      const isOpen = item.dataset.open === "true";
      if (isOpen) {
        closeItem(item, { focusTrigger: false });
      } else {
        openItemPanel(item);
      }
    }

    navItems.forEach((item, index) => {
      const trigger = item.querySelector(".primary-nav__trigger");
      const hasPanel = Boolean(item.querySelector(".mega-panel"));
      item.dataset.open = "false";

      if (hasPanel && trigger) {
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-haspopup", "true");

        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          handleTriggerClick(event, item);
        });

        trigger.addEventListener("keydown", (event) => {
          switch (event.key) {
            case "ArrowDown":
              event.preventDefault();
              openItemPanel(item, { focusFirst: true });
              break;
            case "ArrowUp":
              event.preventDefault();
              openItemPanel(item);
              const panel = item.querySelector(".mega-panel");
              if (panel) {
                const focusables = getFocusableElements(panel);
                const target = focusables[focusables.length - 1];
                target?.focus();
              }
              break;
            case "ArrowRight":
              event.preventDefault();
              focusSiblingItem(index, 1);
              break;
            case "ArrowLeft":
              event.preventDefault();
              focusSiblingItem(index, -1);
              break;
            case "Escape":
              event.preventDefault();
              closeItem(item, { focusTrigger: true });
              break;
            default:
              break;
          }
        });

        if (prefersHover.matches) {
          item.addEventListener("mouseenter", () => {
            openItemPanel(item);
          });
          item.addEventListener("mouseleave", () => {
            if (!mobileMenuOpen) {
              closeItem(item);
            }
          });
        }
      }
    });

    nav.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (openItem) {
          event.preventDefault();
          closeItem(openItem, { focusTrigger: true });
        } else if (mobileMenuOpen) {
          event.preventDefault();
          toggleMobileMenu(false, { returnFocus: true });
        }
      }

      if (event.key === "Tab" && openItem) {
        const trigger = openItem.querySelector(".primary-nav__trigger");
        const panel = openItem.querySelector(".mega-panel");
        if (!panel) return;
        const focusables = [trigger, ...getFocusableElements(panel)];
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }

      if (mobileMenuOpen && event.key === "Tab") {
        const focusables = getFocusableElements(navList);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        if (openItem) {
          closeItem(openItem);
        }
        if (mobileMenuOpen) {
          toggleMobileMenu(false);
        }
      }
    });

    function toggleMobileMenu(forceState, options = {}) {
      const nextState = typeof forceState === "boolean" ? forceState : !mobileMenuOpen;
      mobileMenuOpen = nextState;
      nav.dataset.visible = nextState ? "true" : "false";
      menuToggle?.setAttribute("aria-expanded", nextState ? "true" : "false");

      if (nextState) {
        const focusables = getFocusableElements(navList);
        focusables[0]?.focus();
      } else if (options.returnFocus) {
        menuToggle?.focus();
      }
    }

    menuToggle?.addEventListener("click", () => {
      toggleMobileMenu();
    });

    diagnostics.menuReady = true;
  } catch (error) {
    console.warn("Fout bij initialiseren navigatie:", error);
  }

  /* Footer year --------------------------------------------------------- */
  try {
    const yearTarget = document.getElementById("footer-year");
    if (yearTarget) {
      yearTarget.textContent = String(new Date().getFullYear());
    }
  } catch (error) {
    console.warn("Kon jaartal niet bijwerken:", error);
  }
})();
