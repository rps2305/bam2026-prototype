# TODO / Backlog

## Content & Copy
- [ ] Vervang placeholder-teksten (ANBI, privacy, doneer) door definitieve content vanuit redactie.  
- [ ] Controleer NL spellings- en stijlgids (Tone of Voice BAM!) voor alle CTA’s en headings.  
- [ ] Schrijf engelstalige variant (optioneel) en bepaal of meertaligheid nodig is.

## Design & UX
- [ ] Fine-tune layout spacing op ultra-wide schermen (≥1920px) voor hero, footer en CTA-strips.  
- [ ] Voeg hero-illustratie en fotografie toe zodra nieuwe campagnebeelden beschikbaar zijn.  
- [ ] Uitwerken sticky subnavigatie voor programmapagina (scrollspy).  
- [ ] Test dark-mode contrasten opnieuw met toekomstige imagery.

## Accessibility
- [ ] Axe/Pa11y audit draaien en resterende issues oplossen (met name aria-labels bij carrousels).  
- [ ] Toetsenbord-navigatie testen in Safari/VoiceOver en NVDA.  
- [ ] Overwegen skip-links naar hoofdsecties (#programma, #nieuws, #vrijwilligers).  
- [ ] Alternatieve tekst toevoegen voor alle hero- en galerieafbeeldingen vanuit content team.

## Performance
- [ ] Tailwind uit CDN halen en pre-build CSS toevoegen (postcss/cli).  
- [ ] Lazy-load YouTube iframes (lite-embed) en Spotify embeds conditioneel laden.  
- [ ] Afbeeldingen opslaan als webp/avif varianten met responsive bronnen (nu mock via helper).  
- [ ] Service worker overwegen voor caching (indien relevant voor uiteindelijke stack).

## Integratie & Data
- [ ] Mockdata vervangen door Drupal JSON:API calls (Line-up, Nieuws, Media).  
- [ ] 404 en onderhoudspagina integreren in CMS templates.  
- [ ] Vrijwilligersformulier koppelen aan bestaande CRM / formulier back-end.  
- [ ] Sitemap.xml laten genereren vanuit Drupal en robots.txt paden valideren.

## Testing & Tooling
- [ ] Lighthouse audits (perf / SEO / a11y / best practices) automatiseren via CI.  
- [ ] Visuele regressietests (bijv. Percy of Storybook) toevoegen voor kritische componenten.  
- [ ] ESLint/Prettier configureren voor toekomstige componentversies.  
- [ ] Handmatige QA checklist opstellen voor festival-week (social share, trackingscripts, etc.).

