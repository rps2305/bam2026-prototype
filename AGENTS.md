# Project Agents & Workflow

Deze repository wordt vaker door verschillende AI- en menselijke agents aangeraakt. Dit document borgt wie waarvoor verantwoordelijk is en hoe we overdrachten voorspelbaar houden.

## 1. Agent-profielen

### Front-end Build Agent

- Bouwt of wijzigt HTML, Tailwind classes en utilities in `src/styles/main.css`.
- Zorgt dat design tokens (zie README) consistent blijven en dat aria-/focusregels niet worden aangetast.
- Maakt gebruik van `npm run lint` vóór elke commit en `npm run test` als regressiecheck.

### Content & SEO Agent

- Actualiseert teksten, metadata, structured data en sitemap/robots waar nodig.
- Bewaakt heading-capitalization en tone-of-voice; volgt SEO-checklist uit `TODO.md`.
- Valideert OG/Twitter images en aangepaste routes (vrijwilligers, enquête, plattegrond).

### QA & Tooling Agent

- Onderhoudt CI-taken, lintconfiguratie en lokale scripts (`watch:css`, `build`, `lint`, `test`).
- Controleert Lighthouse/performance acties die in `TODO.md` openstaan.
- Documenteert nieuwe workflows of testresultaten in `README.md` of hier in `AGENTS.md`.

### Ops & Deployment Agent

- Richt hosting pipelines in (Drupal build, caching, CSP).
- Houdt security/privacy checklist bij en plant audits na deployment.
- Zorgt voor back-ups van `assets/`, `vendor/` en toekomstige Drupal-twig templates.

## 2. Shared workflow

1. **Context sync** – Lees `README.md`, `TODO.md` en open issues; noteer aannames in PR/commit.
2. **Task plan** – Splits werkzaamheden in kleine stappen; stem af als wijzigingen design tokens raken.
3. **Implementation** – Werk in feature branch, gebruik Tailwind CLI (`npm run watch:css`) voor live feedback.
4. **Quality gate** – Run `npm run lint` (Prettier check voor `AGENTS.md`, CSS en configbestanden) en `npm run test` (lint + build) lokaal.
5. **Review package** – Lever korte change log, highlight risico’s en eventuele vervolgacties.

## 3. Definition of done

- Toegankelijkheid: focus states, aria-labels en skiplinks ongewijzigd of verbeterd.
- SEO/Metadata: canonical/hreflang/JSON-LD blijven valide; nieuwe pagina’s opgenomen in sitemap.
- Performance: assets blijven lokaal en lazy geladen; build output (`assets/css/main.css`) up-to-date via `npm run build`.
- Tooling: lint/test scripts groen; nieuwe tools gedocumenteerd in dit bestand of README.

## 4. Command referentie

- `npm install --cache .npm-cache` – eerste setup met lokale cache.
- `npm run watch:css` – Tailwind development watch.
- `npm run build` – productie build van `assets/css/main.css`.
- `npm run lint` – Prettier check over `AGENTS.md`, `src/styles/**/*.css`, `tailwind.config.js` en `postcss.config.js`.
- `npm run test` – lint + build, minimale regressiecheck vóór merge/deploy.

## 5. Communicatie & Handoff

- Noteer blocking issues of resterende TODO’s in `TODO.md` (zelfde sectie als bestaand item).
- Verstrek links naar relevante pagina’s of DOM-secties wanneer meerdere agents in dezelfde sprint werken.
- Houd commit-/PR-beschrijvingen kort maar met duidelijke “Waarom” en “Hoe”.
