# BAM! Festival 2026 Prototype

Een statische prototype-homepage voor het gratis BAM! Festival in Hengelo (Ov.). De pagina is opgebouwd met Tailwind CSS (Play CDN) en vanilla JavaScript en bevat mockdata voor artiesten, nieuws en sponsors.

## Snel starten

- Open `bam_prototype_html_css_js_tailwind.html` rechtstreeks in je browser.
- De layout compileert Tailwind in de browser; er is geen build-stap of dependency-installatie nodig.

## Navigatie & routes

Alle secties worden client-side gerenderd op basis van de hash in de URL:

- `#home` – Hero, Nu & Straks, highlights.
- `#plattegrond` – Terreinindeling met hoogtepunten.
- `#programma` – Line-up met filters per dag/podium.
- `#artist:<id>` – Detailkaart voor een artiest.
- `#nieuws` / `#nieuws:<id>` – Nieuws overzicht en detail.
- `#media` – Galerij met sfeerbeelden.
- `#faq` – Veelgestelde vragen.
- `#sponsors` – Sponsoroverzicht per tier.
- `#contact` – Contactformulier (mock).
- `#doneer` – Donatie-info en pledge-formulier (mock).
- `#privacy` – Privacyverklaring, disclaimer en cookies.
- `#zoek:<term>` – Zoekresultaten over artiesten en nieuws.

## Merkrichtlijnen

De typografie en kleuren volgen de huidige website (https://bamfestival.nl):

- **Fonts:** Headlines met `Interstate` (light/regular/bold via remote @font-face), body met `Merriweather Sans`.
- **Kleuren:** Primair paars `#8B1C66`, accent roze `#E31362`, geel `#FFD829`, ondersteunend blauw `#009DE0`, lichte achtergrond `#FDF8ED`, donkere tekst `#111827`.
- **Gradient & accenten:** Hero en body gebruiken de multicolor parkgradient van de officiële site; badges en knoppen volgen de uppercase stijl met gele en roze highlightcaps.
- **Tone of voice:** Intro-, doneer- en highlightteksten zijn overgenomen/ingekort uit de huidige content op bamfestival.nl voor een herkenbare BAM!-toon.

## Aanpassen

- Pas de Tailwind configuratie bovenin het HTML-bestand aan voor extra kleur- of fonttokens.
- Mockdata voor artiesten, nieuws en sponsors staat onderaan in het script (`ARTISTS`, `NEWS`, `SPONSORS`).
- De nieuwe secties (`plattegrond`, `doneer`, `zoek`) hebben kleine JS-hooks (`renderPlattegrond`, `renderDoneer`, `renderSearch`) die makkelijk uit te breiden zijn met echte content of API-calls.
