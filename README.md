# Lucent Solutions — Website

One-Pager für Lucent Solutions (Software, Automatisierung, KI). Vite + Three.js + GSAP + Lenis, kein Framework.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statischer Output in dist/ (z. B. für Hostinger-Webspace)
npm test         # Scroll- und Kontaktformular-Tests (kein echter Mailversand)
npm run dev:api  # lokale Kontakt-API auf 127.0.0.1:8787, zweites Terminal
npm run media    # Higgsfield-Renders aus media-src/ neu für das Web aufbereiten
npm run media:contact # Kontakt-Szenen aus media-src/video/contact/ aufbereiten
```

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Alle Sektionen und Texte |
| `src/styles/main.css` | Design-Tokens (`:root`), Layout, Responsive, Reduced Motion |
| `src/webgl/particles.js` | Partikelfeld (22k Punkte), morpht je Sektion: Staub → Planet → Galaxie → Wellenfeld |
| `src/sections/warp.js` | Scroll-gesteuerter Flug durchs Portal (WebP-Frame-Sequenz auf Canvas) |
| `src/sections/scroll.js` | Reveals, Manifest-Highlight, Marquee, Karten-Stack, Timeline, Counter |
| `src/sections/intro.js` | Preloader und Hero-Intro |
| `src/sections/snap.js` | Direkter Smooth-Scroll mit sanftem Einrasten, Schutz vor übersprungenen Elementen; natives Touch- und Tastaturverhalten |
| `src/sections/contact.js` | Mehrfachauswahl, Formularvalidierung, Versand und Rückmeldungen |
| `src/sections/contact-motion.js` | Higgsfield-Szenen bei Auswahl, große Vorschau, Kartenneigung und Raketenstart |
| `src/contact/inquiry.js` | Gemeinsame Kategorien, Validierung und E-Mail-Inhalt |
| `server/contact.mjs` | Kontakt-API mit SMTP-Versand, Anfragelimit und Schutz vor doppeltem Versand |
| `src/fx/` | Cursor, Magnet-Buttons, Spotlight, Text-Scramble, Lazy-Videos |

Jede Sektion steuert das Partikelfeld über `data-particles="dust|sphere|ring|wave|dust2|hidden"`.

## Medien

Die Sektionsvideos wurden mit Higgsfield erzeugt (Nano Banana Pro → Keyframe, Kling 3.0 Pro → Animation).
Rohdateien liegen in `media-src/` (`img/` Keyframes, `video/` Renders), die Web-Versionen in `public/media/`.
Neues Video: Datei in `media-src/video/` ablegen, in `scripts/process-media.mjs` eintragen, `npm run media`.

Die fünf Kontakt-Effekte wurden mit Higgsfield Seedance 2.0 erzeugt. Die Rohdateien liegen in
`media-src/video/contact/`, die komprimierten MP4s und Standbilder in `public/media/contact/`.
`npm run media:contact` erzeugt daraus die Web-Dateien erneut. Die vier Bereichsszenen spielen bei
Auswahl einmal ab, die Rakete beim gültigen Absenden. Clips werden erst in der Nähe des Formulars
geladen und außerhalb des sichtbaren Bereichs pausiert. Bei reduzierter Bewegung bleiben Standbilder.

## Deploy

Jeder Push auf `main` startet `.github/workflows/deploy.yml`: GitHub Actions baut die Seite (`npm run build`),
synchronisiert das Repo samt `dist/` per rsync auf den VPS und führt dort `scripts/deploy-live.sh` aus, das
`dist/` in den Webroot von lucent-solutions.tech spiegelt.

Benötigte Repository-Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_APP_DIR`, `VPS_DEPLOY_DIR`.
Diese unter **Settings → Secrets and variables → Actions → Repository secrets** hinterlegen;
`VPS_SSH_KEY` enthält den vollständigen privaten SSH-Schlüssel eines auf dem VPS zugelassenen Deploy-Zugangs.
Für CI einen eigenen Benutzer ohne Root-Rechte verwenden, der nur sein App-Verzeichnis und den
Lucent-Webroot besitzt. Für einen bereits aktiven Kontakt-Dienst benötigt dieser Benutzer zusätzlich
die gezielte Berechtigung `sudo -n systemctl restart lucent-contact.service`.
Die Pipeline prüft fehlende Secrets vor dem Build und gleicht nach der Auslieferung den öffentlich
erreichbaren Commit in `BUILD_INFO.txt` mit dem ausgelieferten Commit ab. Einen fehlgeschlagenen Lauf
nach Korrektur der Secrets über **Re-run failed jobs** erneut starten.

Manuell auf dem VPS: `npm ci && npm run build && ./scripts/deploy-live.sh` (optional `TARGET_DIR=/var/www/lucent`).

## Noch zu ersetzen

- **Kennzahlen** in der Sektion „Zahlen“ (`index.html`, als `PLATZHALTER` markiert)
- **E-Mail-Adresse** `kontakt@lucent-solutions.de` (CTA, Impressum)
- **Impressum** und **Datenschutz** (`impressum.html`, `datenschutz.html`) — nur Platzhalter, rechtlich prüfen lassen
- **Technologie-Marquee** an den tatsächlichen Stack anpassen
- Die Terminal-Demo im KI-Abschnitt ist als „demo“ gekennzeichnet; Zahlen dort sind illustrativ

Schriften (Geist / Geist Mono) werden lokal ausgeliefert, keine Google-Fonts-Verbindung (DSGVO).

## Kontaktformular einrichten

Das Formular unterstützt Website, Automatisierung, KI-Projekte und Software als Mehrfachauswahl. Budget, Zeitpunkt und Unternehmen sind optional. Ohne SMTP-Konfiguration antwortet die API mit HTTP 503; die Oberfläche zeigt einen Fehler und erhält alle Eingaben. Es gibt keine simulierte Versandbestätigung.

Lokal `npm run dev` und in einem zweiten Terminal `npm run dev:api` starten. Vite leitet `/api/contact` an den lokalen Node-Prozess weiter. Die API kann ohne Konfiguration gestartet werden. Für echten Versand `.env.example` nach `.env` kopieren und diese Werte ergänzen:

| Variable | Bedeutung |
| --- | --- |
| `CONTACT_TO` | Empfängeradresse für Projektanfragen |
| `CONTACT_FROM` | Vom Mailanbieter erlaubte Absenderadresse |
| `SMTP_HOST`, `SMTP_PORT` | SMTP-Server, üblicherweise Port 587 (STARTTLS) oder 465 (TLS) |
| `SMTP_USER`, `SMTP_PASS` | Zugangsdaten, ausschließlich auf dem Server speichern |
| `PUBLIC_ORIGIN` | In Produktion die exakte Website-Origin, z. B. `https://lucent-solutions.tech`; lokal leer lassen |
| `TRUST_PROXY` | `1` hinter dem mitgelieferten lokalen Nginx-Proxy, sonst `0` |

In Produktion zusätzlich zur statischen Website die API betreiben (Node ab 20.12):

1. Im bestehenden Repository auf dem VPS `npm ci --omit=dev --ignore-scripts` ausführen.
2. `deploy/lucent-contact.service.example` als `lucent-contact.service` übernehmen; `WorkingDirectory` auf den tatsächlichen `VPS_APP_DIR` und `ExecStart` auf den installierten Node-Pfad setzen. Das Repository liegt außerhalb des öffentlichen Webroots.
3. Die Konfiguration als `/etc/lucent-contact.env` anlegen (nur für root lesbar). `PUBLIC_ORIGIN` und die SMTP-Werte setzen. `TRUST_PROXY=1` verwenden, wenn Nginx nach der Vorlage eingerichtet wird.
4. Den Block aus `deploy/contact.nginx.conf.example` in den vorhandenen HTTPS-Virtual-Host aufnehmen, Konfiguration prüfen und Nginx neu laden. Die API bleibt an `127.0.0.1:8787` gebunden.
5. Den Dienst mit `systemctl daemon-reload` und `systemctl enable --now lucent-contact.service` starten. Bei späteren Deployments aktualisiert das Deploy-Skript die Laufzeit-Abhängigkeiten und startet einen bereits aktiven Kontakt-Dienst neu.

`.env` und lokale Caches werden weder eingecheckt noch per CI synchronisiert. Mailadressen aus dem Formular dienen nur als `Reply-To`; Absender und Empfänger kommen aus der Serverkonfiguration. Tests verwenden eine lokale Versandattrappe und verschicken keine E-Mails.
