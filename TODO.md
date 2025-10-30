# TODO / Checklists

## Accessibility
- [x] `lang="nl"` ingesteld en één `<h1>` per template.
- [x] Volledige keyboard-navigatie + zichtbare focus states.
- [x] Skiplink, aria-labels voor icon-buttons en dialog voor cookie-consent.
- [x] Afbeeldingen voorzien van relevante alt-teksten of `alt=""` bij decoratie.
- [ ] Screenreader regressietest (VoiceOver/NVDA) plannen na Drupal-integratie.

## SEO & Structured Data
- [x] Titel & meta description geoptimaliseerd voor 2026 editie.
- [x] Canonical, hreflang (`nl`, `x-default`) en social previews (OG/Twitter).
- [x] JSON-LD (`MusicEvent`, `Organization`, `LocalBusiness`, `FAQPage`).
- [x] Sitemap vernieuwd met routes (incl. enquête) + robots verwijst ernaar.
- [ ] Wanneer URL-structuur in Drupal vastligt: sitemap automatisch genereren.

## Performance
- [x] Tailwind lokaal gebouwd (`npm run build`) en onnodige CDN’s verwijderd.
- [x] WebP assets + `srcset`/`sizes` + `loading="lazy"`/`decoding="async"`.
- [x] Asset-cachelimiter via CSP + documentatie voor Brotli/Gzip deployment.
- [ ] Lighthouse run automatiseren in CI + rapporteren binnen Drupal-pipeline.

## Typography & Heading Rules
- [x] Visueel uppercase voor H1–H3, maar tekst semantisch in titel-/zinvorm.
- [x] Body copy: 16–17px, `leading-relaxed`, consistente letterspatiëring.
- [x] Buttons en metadata gebruiken uppercase met duidelijke tracking.
- [ ] Styleguide opnemen in Drupal theme (Twig + component library).

## Mobile UX
- [x] Compacte sticky header, grote tap targets en mobiele CTA-buttons.
- [x] Microsoft Forms embeds laden lazy en vullen 100% breedte.
- [x] Sponsors, timetable en FAQ gestructureerd met card grids.
- [ ] Scrollspy/subnav herbekijken na Drupal implementatie.

## Security & Privacy
- [x] Content Security Policy beperkt externe domeinen.
- [x] Cookie-consent dialoog met voorkeuren + lokale opslag van keuze.
- [x] E-mail obfuscatie via data-attributes / hydratie scripts.
- [ ] Na Drupal launch: audit third-party scripts (analytics, pixels).

## Design Consistency
- [x] `page-shell`, gradients, button-styling en spacing gedeeld over alle pagina’s.
- [x] 404 en onderhoudspagina gebruiken dezelfde tokens + borden onderhoud expliciet.
- [x] Stage-namen en type-pills (Muziek, Theater, DJ, Film) overal consistent.
- [ ] Zodra Drupal thema staat: Storybook of Pattern Lab opzetten voor regressietests.
