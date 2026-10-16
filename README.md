# Lucent Solutions — Website

One-Pager für Lucent Solutions (Software, Automatisierung, KI). Vite + Three.js + GSAP + Lenis, kein Framework.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statischer Output in dist/ (z. B. für Hostinger-Webspace)
npm run media    # Higgsfield-Renders aus media-src/ neu für das Web aufbereiten
```

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Alle Sektionen und Texte |
| `src/styles/main.css` | Design-Tokens (`:root`), Layout, Responsive, Reduced Motion |
| `src/webgl/particles.js` | Partikelfeld (22k Punkte), morpht je Sektion: Staub → Planet → Galaxie → Wellenfeld |
| `src/sections/warp.js` | Scroll-gesteuerter Flug durchs Portal (WebP-Frame-Sequenz auf Canvas) |
| `src/sections/scroll.js` | Reveals, Manifest-Highlight, Marquee, Karten-Stack, Timeline, Counter |
| `src/sections/intro.js` | Preloader, Hero-Intro, schwebende Chips |
| `src/fx/` | Cursor, Magnet-Buttons, Spotlight, Text-Scramble, Lazy-Videos |

Jede Sektion steuert das Partikelfeld über `data-particles="dust|sphere|ring|wave|dust2|hidden"`.

## Medien

Alle Videos wurden mit Higgsfield erzeugt (Nano Banana Pro → Keyframe, Kling 3.0 Pro → Animation).
Rohdateien liegen in `media-src/` (`img/` Keyframes, `video/` Renders), die Web-Versionen in `public/media/`.
Neues Video: Datei in `media-src/video/` ablegen, in `scripts/process-media.mjs` eintragen, `npm run media`.

## Deploy

Jeder Push auf `main` startet `.github/workflows/deploy.yml`: GitHub Actions baut die Seite (`npm run build`),
synchronisiert das Repo samt `dist/` per rsync auf den VPS und führt dort `scripts/deploy-live.sh` aus, das
`dist/` in den Webroot von lucent-solutions.tech spiegelt.

Benötigte Repository-Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_APP_DIR`, `VPS_DEPLOY_DIR`.

Manuell auf dem VPS: `npm ci && npm run build && ./scripts/deploy-live.sh` (optional `TARGET_DIR=/var/www/lucent`).

## Noch zu ersetzen

- **Kennzahlen** in der Sektion „Zahlen“ (`index.html`, als `PLATZHALTER` markiert)
- **E-Mail-Adresse** `kontakt@lucent-solutions.de` (CTA, Impressum)
- **Impressum** und **Datenschutz** (`impressum.html`, `datenschutz.html`) — nur Platzhalter, rechtlich prüfen lassen
- **Technologie-Marquee** an den tatsächlichen Stack anpassen
- Die Terminal-Demo im KI-Abschnitt ist als „demo“ gekennzeichnet; Zahlen dort sind illustrativ

Schriften (Geist / Geist Mono) werden lokal ausgeliefert, keine Google-Fonts-Verbindung (DSGVO).
