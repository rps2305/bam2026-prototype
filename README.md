# BAM! Festival 2027 – Front-end Prototype

Deze repository bevat de goedgekeurde front-end van het BAM! Festival 2027. De HTML en Tailwind CSS worden later omgezet naar een custom Drupal 11 thema. Alle pagina’s, componenten en assets zijn geoptimaliseerd voor toegankelijkheid, SEO, performance en mobile-first gebruik.

## Belangrijkste verbeteringen
- Eén consistente design language met lokaal gebouwde Tailwind CSS en gedeelde tokens.
- Volledige keyboard-navigatie, zichtbare focus states, aria-labels en e-mailobfuscatie.
- Uitgebreide structured data (MusicEvent, Organization, LocalBusiness, FAQPage) en social previews (OG/Twitter).
- Responsive afbeeldingen (WebP varianten, `srcset`, `loading="lazy"`) en lokale assets in plaats van CDN’s.
- Dark-mode met toegankelijke toggle (`aria-pressed`) en een privacy-proof cookiebanner.
- Nieuwe contentroutes: enquêtepagina (Microsoft Form), vrijwilligersformulier, sponsorgrid, onderhouds- en 404-pagina in huisstijl.

## Design System

### Kleurpalet (WCAG 2.1 AA)
| Rol | Kleur | Hex |
| --- | --- | --- |
| Primary text | Slate 900 | `#1F2937` |
| Secondary text | Gray 500 | `#6B7280` |
| Accent | Teal 500 | `#14B8A6` |
| CTA | Amber 400 | `#FACC15` |
| Gradient start | Pink 500 | `#EC4899` |
| Gradient mid | Violet 500 | `#8B5CF6` |
| Gradient end | Cyan 500 | `#06B6D4` |
| Background overlay | Transparent black | `rgba(0,0,0,0.4)` |

### Typografie
- Fonts: `Interstate` (display) + `Merriweather Sans` (body).
- Body tekst: 16px (mobile) – 17px (desktop), `leading-relaxed`.
- Navigatie en metadata gebruiken uppercase of tracking voor leesbaarheid.

### Heading Capitalization
- `<h1>`, `<h2>`, `<h3>`: tekst in toegankelijke titel-/zinvorm; visueel uppercase via CSS.
- `<h4>`, `<h5>`, `<h6>`: Capitalize (initiële hoofdletter).

## Develop & Build
```bash
npm install --cache .npm-cache    # lokale cache voorkomt root-permissies
npm run build                     # tailwindcss -i src/styles/main.css -o assets/css/main.css --minify
npm run watch:css                 # development watch (optioneel)
```

### Bestanden & structuur
- `index.html` bevat alle templates (home, line-up, enquête, enz.).
- `assets/images/` bevat geoptimaliseerde WebP assets (hero, OG-image, posters).
- `assets/css/main.css` is het gepurge-de output van Tailwind.
- `404.html` en `maintenance.html` gebruiken dezelfde tokens en hebben inline script voor e-mail-obfuscatie.
- `sitemap.xml` en `robots.txt` sluiten aan op Drupal 11 conventies.

## Accessibility
- `lang="nl"`, één `<h1>` per pagina/template, semantische `<header>`, `<nav>`, `<main>`, `<footer>`.
- Focus states met contrasterende outline + `focus-visible`.
- Skiplink & toetsenbordvriendelijk navigatiemenu (Escape sluit mobiele nav).
- Alt-teksten voor contentafbeeldingen, `alt=""` voor decoratief materiaal.
- Cookiebanner met dialoog-rollen, Esc ondersteuning en `aria-pressed` toggles.
- E-mailadressen worden pas via JavaScript omgezet naar `mailto:` om harvesters te blokkeren.

## Mobile-first & UX
- Sticky header met compacte hoogtes, grotere tap targets voor knoppen.
- CTA’s (`btn-primary`, `btn-secondary`) hebben hover/focus-states en schaduwen.
- Hero, timetable, sponsors en footer bevatten aanvullende subkoppen voor scanbaarheid.
- Microsoft Forms embeds (vrijwilligers + enquête) laden lazy en hebben fallbacklinks.

## SEO & Structured Data
- Titel: “BAM! Festival 2027 – Gratis muziekfestival Hengelo” (53 chars).
- Meta description: 180 karakters, call-to-action gericht op weekend 21/22 mei 2027.
- Canonical + hreflang (`nl`, `x-default`), `OG`/`Twitter` met lokale WebP.
- JSON-LD (`@graph`) voor MusicEvent + organizer, LocalBusiness, FAQPage.
- Sitemap verwijst naar toekomstige Drupal-routes (plattegrond, programma, vrijwilligers, enquête).

## Performance & Assets
- Tailwind CLI build met purge en minificatie (`npm run build`).
- Alle BAM-assets lokaal gedownload en geconverteerd naar WebP (hero, OG, posters, privacy bg).
- `loading="lazy"` en `decoding="async"` op alle afbeeldingen en iframes.
- CSS gradient (`bg-bam-gradient`) vervangt bitmap background op 404/maintenance.
- Documentatie benoemt caching headers + Brotli/Gzip als deployment taak.

## Security & Privacy
- Content Security Policy met beperkte domeinen (`script-src` alleen eigen + unpkg voor Leaflet).
- Cookie consent dialoog slaat keuze in `localStorage` op en blokkeert niet-functionele cookies bij weigering.
- E-mailadressen via `data-user`/`data-domain` en JS hydratatie, geen raw `mailto:` in bron.
- `robots.txt` blokkeert admin/search routes zodra thema in Drupal draait.

## Verdere documentatie
- Zie `TODO.md` voor checklists per domein (accessibility, SEO, performance, mobile, security, design consistency).
- Gebruik `npm run watch:css` tijdens theming in Drupal om Tailwind classes te monitoren.

> Bij migratie naar Drupal: koppel deze HTML-templates stuk voor stuk aan Twig views, behoud de `data-` hooks voor JSON:API en voeg caching headers toe via het Drupal config systeem.
