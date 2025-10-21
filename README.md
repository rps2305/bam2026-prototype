# BAM! Festival 2026 — Front-end Prototype

Een high-fidelity prototype van de vernieuwde BAM! Festival website.  
De pagina is één HTML-bestand (met inline CSS/JS) dat rechtstreeks in de browser draait en de ervaring van een volwaardige Drupal-implementatie benadert.

## Inhoudsopgave

1. [Belangrijkste features](#belangrijkste-features)  
2. [Technische stack](#technische-stack)  
3. [Aan de slag](#aan-de-slag)  
4. [Projectstructuur](#projectstructuur)  
5. [Mockdata & data‑model](#mockdata--data-model)  
6. [Toegankelijkheid & SEO verbeteringen](#toegankelijkheid--seo-verbeteringen)  
7. [Designsystem & branding](#designsystem--branding)  
8. [Roadmap](#roadmap)  
9. [Contributie](#contributie)  
10. [Licentie](#licentie)

---

## Belangrijkste features

- **Single-page navigatie** via hash-routing (`#home`, `#programma`, `#nieuws:slug`, …).  
- **Hero + CTA’s** afgestemd op 2026 festivalcampagne, inclusief gradient-achtergrond.  
- **Line-up filters** op dag, podium en discipline; ondersteunt meerdere tijdsloten per artiest.  
- **Artiestdetail** met highlights, embedded YouTube-video en Spotify-playlist.  
- **Nieuws-overzicht & detail** met metadata (geplaatst/bijgewerkt), tagchips en share-links.  
- **Zoekfunctionaliteit** voor artiesten en nieuws (client-side).  
- **Media-sectie** (albums en aftermovies) met responsive galerijen.  
- **Vrijwilligerspagina** met timeline, rollen, voordelen en FAQ.  
- **Doneer-CTA’s** en iDEAL-link (mock).  
- **Sponsoroverzicht** per tier.  
- **Contactpagina** met Leaflet-kaart (OpenStreetMap) en relevante e-mails.  
- **Privacy/ANBI/Doneer** basisteksten ter ondersteuning van contentmigratie.

## Technische stack

| Onderdeel            | Beschrijving                                                    |
|----------------------|------------------------------------------------------------------|
| HTML                 | Handmatig opgebouwd, geen templating-engine                      |
| CSS                  | Tailwind Play CDN (runtime compile) + custom CSS in `<style>`    |
| JavaScript           | Vanilla ES6 modules, geen bundler                                |
| Icons                | Inline SVG’s (social, Spotify, etc.)                             |
| Map                  | [Leaflet 1.9.x](https://leafletjs.com) met OpenStreetMap tiles   |
| Fonts                | Interstate (remote) + Merriweather Sans via Google Fonts         |
| Data                 | Mockobjecten in `ARTISTS`, `NEWS`, `PHOTO_ALBUMS`, …             |

> Tip: bij productie-integratie moet Tailwind via build pipeline draaien i.p.v. Play CDN.

## Aan de slag

1. Clone of download de repository.  
2. Open `index.html` in een moderne browser (Chrome, Firefox, Safari, Edge).  
3. Geen build- of install-stappen nodig.  
4. Gebruik hash-links in de adresbalk of het navigatiemenu om tussen secties te wisselen.

### Optioneel

- **Live reload**: start een statische server (`npx serve`, `python -m http.server`) zodat Leaflet tiles en fonts consistent laden.  
- **Linting**: run `npm run lint:html` (indien tooling is toegevoegd).

## Projectstructuur

```
.
├── index.html            # Kernbestand met markup, CSS en JavaScript
├── robots.txt            # Crawlrichtlijnen voor Drupal 11 implementatie
├── TODO.md               # Actuele werkpunten / backlog
└── (assets)              # Afbeeldingen / logo's (inline of via CDN)
```

Belangrijke codeblokken binnen `index.html`:

| Sectie                  | Doel                                                       |
|-------------------------|-------------------------------------------------------------|
| `<style>`               | Tailwind config + custom helpers (buttons, focus states)   |
| JSON-LD scripts         | Festival + LocalBusiness schema                            |
| Hash-routing functies   | `render(...)` helpers, `navigate()`                        |
| Mockdata                | `ARTISTS`, `NEWS`, `PHOTO_ALBUMS`, `AFTERMOVIES`, …        |
| UI renderers            | `renderHome()`, `renderProgramma()`, `renderNieuws()`, …   |

## Mockdata & data-model

- **Artiesten (`ARTISTS`)**  
  - `type`, `genres`, `links[]`, `extraSlots[]` voor meerdere optredens.  
  - `playlist` embed URL, `video` (YouTube-ID), `highlights[]`.
- **Nieuws (`NEWS`)**  
  - `created`, `updated`, `tags[]`, `links[]`, `body[]` (paragraph/quote/list).  
  - Extra metadata wordt gebruikt voor SEO en zoekresultaten.
- **Albums / Aftermovies**  
  - `gallery[]` met caption/credit en `download` links.  
  - Aftermovies bevatten `videoId`, `runtime`, `highlights`.

Data staat bewust gescheiden van de renderlogica zodat een latere API-koppeling eenvoudiger is.

## Toegankelijkheid & SEO verbeteringen

- Skip link, verbeterde `focus-visible` outlines.  
- Contrastverhoudingen volgens WCAG AA (knoppen, tekst op gradient).  
- Responsive afbeeldingen (`srcset` + `sizes`) voor nieuws/galerijen.  
- JSON-LD (Festival + LocalBusiness) met organizer, keywords, openingHours.  
- Meta title/description verkort tot best practice (±60 tekens / ±180 tekens).  
- Sociale previews (OG/Twitter image).  
- Navigatie heeft `aria-label`s, mobile menu respecteert `aria-expanded`.  
- Kaartmarker gecentreerd op Prins Bernhardplantsoen.

## Designsystem & branding

- **Typografie**: Interstate (headings), Merriweather Sans (body).  
- **Kleurset**:
  - Primair paars `#8B1C66`, magenta `#E31362`, geel `#FFD829`, blauw `#009DE0`, licht `#FDF8ED`, donker `#111827`.  
  - Gradient `315deg` voor hero/achtergrond.  
  - Buttons gestandaardiseerd: `.btn-primary`, `.btn-secondary`, `.btn-ghost`.
- **CTA’s**: Elevated met schaduw, hover en focus states.  
- **Section headings**: Taglines + H1 (per route) voor herkenbare flow.

## Roadmap

- [ ] **Content**: echte teksten (ANBI, privacy) importeren i.p.v. placeholder.  
- [ ] **API-koppeling**: replace mockdata door Drupal JSON:API endpoints.  
- [ ] **Tailwind build**: overstappen naar pre-compiled CSS voor performance.  
- [ ] **Testing**: visuele regressietests + axe-core toegankelijkheidschecks.  
- [ ] **Performance**: lazy-load media (IntersectionObserver), minify assets.  
- [ ] **i18n**: ondersteuning voor Engels / Duits indien gewenst.  
- [ ] **CMS snippets**: componenten vertalen naar Twig/React (afhankelijk van Drupal thema).

Zie ook [TODO.md](TODO.md) voor gedetailleerde taken.

## Contributie

1. Fork of feature branch aanmaken.  
2. Beschrijf wijzigingen in README/TODO waar relevant.  
3. Houd formatting consistent (Tailwind classes, dubbele quotes in JS).  
4. Test in meerdere browsers (focus: Chrome, Firefox, Safari, Edge).  
5. Maak een Pull Request met duidelijke beschrijving / screenshots.

## Licentie

Deze prototype-code is bedoeld voor interne evaluatie van BAM! Festival en valt onder de voorwaarden die door de opdrachtgever zijn vastgesteld. Gebruik buiten dit project alleen na toestemming.

