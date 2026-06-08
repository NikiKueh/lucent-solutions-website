# designsystem.md

Design-Referenz für `lucent-solutions.tech`, abgeleitet aus der aktuell deployten Lucent-Studio-Website.

## Zweck

Dieses Dokument beschreibt die visuelle Sprache von **Lucent Studio** so, dass **Lucent Solutions** denselben Look, dieselbe Dramaturgie und denselben Seitenaufbau übernehmen kann — nur mit anderem Inhaltsschwerpunkt.

- **Lucent Studio** = Social Media Marketing, Content, Recruiting, Branding
- **Lucent Solutions** = Software, Automatisierung, interne Tools, Dashboards, Portale, SaaS

Wichtig: Ziel ist **keine neue Designsprache**, sondern **dieselbe Marke in einem anderen Themenfeld**.

---

## Quellenbasis

Die Beobachtungen in diesem Dokument basieren auf:

- Live-Deploy unter `/var/www/lucent-studio`
- `index.html` mit Critical CSS und Font-Preloads
- deployten Assets und Komponentennamen unter `/var/www/lucent-studio/assets`
- visueller Prüfung der Live-Seite `https://lucent-studio.de`

Besonders relevante Hinweise aus der Codebasis:

- Body-Hintergrund im Critical CSS: `#060A3C`
- Initial-Preloader-Hintergrund: `#040A1C`
- Theme-Farbe: `#1E2646`
- Foreground-Variable: `hsl(40 20% 97%)`
- Schrift-Preloads: `Montserrat`, `Playfair Display`
- weitere geladene Display-Schrift: `mixta-didone-light.otf`
- Motion-/UI-Hinweise über Assets wie:
  - `use-reveal-animation-*.js`
  - `StickyMobileCTA-*.js`
  - `ComparisonSection-*.js`
  - `GrowthChart-*.js`
  - `ClientShowcase-*.js`
  - `Testimonials-*.js`
  - `text-effect-*.js`
  - `shaders-hero-section-*.js`

---

## 1. Markencharakter

Lucent Studio wirkt wie eine **hochwertige, moderne, dunkle Premium-Brand**.

Die visuelle Identität kombiniert:

- **dunkle, tiefe Bühnenflächen**
- **warme helle Typografie statt reinem Weiß**
- **editorial wirkende Headlines** mit Kontrast zwischen sachlich und elegant
- **gläserne Oberflächen / Cards / Overlays**
- **kontrollierte Motion** statt aggressiver Animation
- **hochwertige Foto- und Showcase-Bildsprache**
- **klare Conversion-Architektur**

Die Seite fühlt sich nicht nach „bunter Agentur“ an, sondern nach:

- ruhig
- präzise
- luxuriös
- modern
- technisch sauber
- vertrauenswürdig

Für Lucent Solutions bedeutet das:

> Nicht nerdig-roh, nicht SaaS-0815, nicht bunt-techy.
> Sondern: dieselbe ruhige Premium-Ästhetik — nur für Software.

---

## 2. Farbwelt

### Primäre Farblogik

Lucent Studio arbeitet klar mit einem **dunklen inversen Theme**.

### Kernfarben

- **Hero / Hauptbühne / erste Paint-Farbe:** `#060A3C`
  - tiefes Royal-/Marineblau
- **Preloader / sehr dunkle Overlay-Fläche:** `#040A1C`
  - fast schwarzes Blau
- **Theme-/Brand-Navy:** `#1E2646`
  - verwendbar für Sektionen, Karten, Akzentflächen
- **Helle Textfarbe / Cream-Foreground:** `hsl(40 20% 97%)`
  - ungefähr ein warmes Off-White / Creme

### Farbprinzip

Nicht hartes Schwarz-Weiß, sondern:

- Blau-Schwarz für Tiefe
- Creme statt reinem Weiß für Wärme
- halbtransparente helle Linien und Overlays für Glas-/Premium-Effekt

### Praktische Designregeln

Für Lucent Solutions übernehmen:

- dunkle Hauptfläche als Standardbühne
- Text nie in reinem `#ffffff`, sondern leicht warm getönt
- Borders und Divider als helle Transparenzen statt massiver Linien
- Akzente nur sehr sparsam

### Empfohlene Token für Lucent Solutions

```css
--ls-bg-hero: #060A3C;
--ls-bg-deep: #040A1C;
--ls-bg-section: #1E2646;
--ls-text-primary: hsl(40 20% 97%);
--ls-text-secondary: rgba(248, 247, 243, 0.72);
--ls-text-muted: rgba(248, 247, 243, 0.55);
--ls-border-soft: rgba(248, 247, 243, 0.10);
--ls-border-medium: rgba(248, 247, 243, 0.16);
--ls-glass: rgba(255, 255, 255, 0.06);
--ls-glass-strong: rgba(255, 255, 255, 0.10);
```

---

## 3. Typografie

### Beobachtete Schriftfamilien

Aus den deployten Fonts ableitbar:

- **Montserrat Regular / Bold**
- **Playfair Display Bold / Bold Italic**
- **Mixta Didone Light**

### Rollenverteilung

#### 1. Sans-Serif für System, Klarheit, Lesbarkeit
Montserrat trägt:

- Navigation
- Fließtext
- Labels
- Buttons
- Zahlen / Stats
- Service-Texte

Wirkung:

- clean
- modern
- sachlich
- gut lesbar

#### 2. Serif / Italic für Eleganz und Spannungsmoment
Playfair Display bzw. Mixta-artige Display-Ästhetik trägt:

- hervorhebende Wortteile in Headlines
- luxuriöse, editorial wirkende Akzente
- emotionale / markenbildende Betonungen

Wirkung:

- hochwertig
- stilistisch
- leicht luxuriös
- differenzierend

### Typografische Logik

Lucent Studio lebt von einem **Spannungsverhältnis**:

- sachliches Sans für Klarheit
- elegante Serif-Kursiv für Marke und Emotion

### Headline-Prinzip

Headlines wirken groß, knapp, selbstbewusst und meist so, als würden sie in 2–3 visuelle Zeilen brechen.

Muster:

1. starke Hauptzeile
2. eventuell zweite Zeile mit stärkerem Spannungswort
3. kontrastierende Betonung durch Italic/Serif möglich

### Regeln für Lucent Solutions

Für Software-Inhalte gilt:

- dieselbe Typologik beibehalten
- aber die inhaltlichen Wörter austauschen

Beispiele:

- statt „Wir machen dich sichtbar.“
  - „Wir machen Prozesse nutzbar.“
- statt „Content done right.“
  - „Software done right.“
- statt „Dein Growth-Partner.“
  - „Dein System-Partner.“ oder „Dein Software-Partner.“

Wichtig:

- Headline-Satzbau kurz halten
- nicht wie eine klassische IT-Agentur klingen
- mehr Marke, weniger Buzzword-Liste

---

## 4. Seitenbühne und allgemeines Layout

### Grundstruktur

Die Seite ist als **dramatische vertikale Story** aufgebaut.

Nicht:

- klassisches SaaS-Landingpage-Template
- sterile Card-Grid-Seite

Sondern:

- Bühne
- Rhythmus
- Showcase
- Services
- Trust
- Conversion

### Layoutmerkmale

- große vertikale Abstände
- klare Max-Width-Container
- luftige Sektionen
- dunkle Section-Wechsel eher tonal als hart kontrastierend
- mobile-first gut lesbar
- einzelne Komponenten dürfen inszeniert wirken

### Header

Beobachtet:

- Header sitzt oben über der dunklen Bühne
- sehr leicht / transparent wirkend
- Logo links
- zentrale oder mittige Nav-Anmutung
- CTA rechts als pillenförmiger Button

Designprinzip:

- der Header soll sich *leicht* anfühlen
- nicht wie ein schwerer App-Navbar-Balken
- eher Premium-Editorial als Dashboard

### Lucent-Solutions-Übertragung

Beibehalten:

- Logo links
- 5–6 primäre Nav-Punkte
- CTA rechts
- dunkler, transparenter Header

Neue Navigationslogik für Solutions z. B.:

- Leistungen
- Showcase
- Prozess
- Branchen / Use Cases
- Über uns
- FAQ
- CTA: `Projekt anfragen`

---

## 5. Hero-Prinzip

### Beobachtete Hero-Struktur bei Lucent Studio

Die Hero-Bühne kombiniert:

- starke Positionierungszeile
- große Headline
- kurze Nutzenbotschaft
- Primär-CTA
- Sekundär-CTA
- Vertrauens-/Stat-Elemente
- visuelles Showcase-Element rechts/unten (z. B. Social/Story/Preview-artige Inszenierung)

Aus Snapshot sichtbar:

- Headline: „Wir machen dich sichtbar.“
- zwei CTAs
- Kennzahlen wie `300+` und `100%`
- zusätzliche visuelle Device-/Story-/Social-Anmutung

### Hero-Wirkung

Der Hero verkauft nicht nur Inhalt, sondern gleich den **ästhetischen Qualitätsanspruch**.

Er soll sagen:

- wir sind professionell
- wir verstehen Inszenierung
- wir bauen keine billige Template-Seite

### Übertragung auf Lucent Solutions

Hero-Struktur beibehalten, Inhalt austauschen.

#### Empfohlene Hero-Bausteine

- Eyebrow:
  - `Software Studio aus Ulm`
  - `Interne Tools · Automatisierung · Plattformen`
- H1:
  - markant, 2–3 Zeilen
- Lede:
  - konkrete Wirkung für Unternehmen
- CTA 1:
  - `Projekt anfragen`
- CTA 2:
  - `Showcase ansehen`
- Trust-Stats:
  - z. B. `Tools im täglichen Einsatz`, `Automatisierte Workflows`, `Live-Dashboards`
- Hero-Visual:
  - kein Social-Story-Mockup
  - stattdessen Software-Inszenierung

#### Geeignete Hero-Visuals für Solutions

- Dashboard-Panel
- Workflow-Board
- CRM-/Ops-Screen
- API-/Sync-Diagramm als pseudo-UI
- Ticket-/Status-Ansicht
- Kundenportal-Vorschau

Wichtig:

- nicht zu technisch-raw
- nicht wie Figma-Wireframe
- immer markeninszeniert und „client-facing premium“

---

## 6. Komponentenstil

### Buttons

Beobachtung:

- primäre CTA wirkt pillenförmig / weich gerundet
- starke Lesbarkeit
- kontrastreich, aber nicht grell
- elegant statt verspielt

Regeln:

- Radius eher groß (`rounded-full` oder ähnlich)
- keine harten Standard-Buttons
- Padding großzügig
- klare visuelle Hierarchie zwischen primary und secondary CTA

### Pills / Chips / Labels

Auf der Seite häufig als Kategorisierungsmittel geeignet:

- Services
- Tags
- Kategorien
- kleine Hinweise

Stil:

- leichte Border
- leichte transparente Füllung
- Uppercase oder mikrotypografisch präzise gesetzt

### Cards / Glass-Flächen

Aus Komponentennamen und visueller Anmutung ableitbar:

- `glass-card`
- halbtransparente Oberflächen
- helle Border auf dunklem Grund
- weiche Tiefenwirkung

Card-Prinzip:

- eher Glas / Frosted Layer
- nicht Material-UI-Kartenlook
- nicht flach-weiß
- nicht brutalistisch

### Accordions / Service-Module

Im Snapshot klar sichtbar:

- nummerierte Services (`01`, `02`, `03` ...)
- jeweils Titel + Beschreibung + thematische Unterpunkte / Tags
- strukturierte, lineare Liste statt wilder Kachelteppich

Für Lucent Solutions übernehmen als:

- `01 Interne Tools`
- `02 Automatisierung`
- `03 Dashboards`
- `04 Kundenportale`
- `05 Integrationen`
- `06 SaaS / Plattformen`

Mit Untertags wie:

- `ERP`
- `CRM`
- `Lead Routing`
- `Self-Service`
- `Status Tracking`
- `Angebotslogik`
- `Sync`
- `Admin Panel`

### Comparison / Proof-Komponenten

Assets wie `ComparisonSection` und `GrowthChart` zeigen:

- Vorher/Nachher- bzw. Leistungsbeweis-Komponenten
- datenbasierte Visualisierung
- strukturierter Vertrauensaufbau

Für Lucent Solutions adaptieren als:

- vorher manuell / nachher automatisiert
- vorher Excel + WhatsApp / nachher internes Tool
- vorher Datensilos / nachher Live-Sync
- vorher Supportlast / nachher Self-Service-Portal

---

## 7. Motion und Interaktion

### Beobachtete Motion-Sprache

Aus Asset-Namen und visueller Prüfung:

- Reveal-Animationen beim Scrollen
- Sticky Mobile CTA
- text effect
- Shader-Hero
- animierte Vergleichs-/Wachstumssektionen

### Charakter der Motion

Die Motion ist:

- weich
- kontrolliert
- hochwertig
- unaufdringlich

Nicht:

- hektisch
- verspielt
- gimmicky
- gaming-artig

### Regeln für Lucent Solutions

Erlaubt:

- weiche Reveal-ins
- subtile Parallax-/Layer-Tiefe
- Shader-/Glow-Hintergründe
- elegante Hover-Stati
- dezente Count-up- oder Status-Motion in Mockups

Vermeiden:

- aggressive Neon-Effekte
- hektische Logofahrten
- übertriebene Tech-Cyberpunk-Animation
- laute „developer demo“-Ästhetik

---

## 8. Bildsprache

### Lucent-Studio-Bildwelt

Aus Asset-Dateien und Snapshot ableitbar:

- echte Kunden / echte Projekte
- hochwertige Foto-/Video-Frames
- Automotive / Businesses / regionale Marken
- Story-/Social-inszenierte Formate
- emotional, aber sauber kuratiert

Die Bildsprache ist nicht beliebig stockig, sondern wirkt:

- real
- hochwertig
- markennah
- kuratiert

### Übertragung auf Lucent Solutions

Lucent Solutions sollte dieselbe Qualitätsebene haben, aber andere Motive:

#### Statt Social-/Content-Motive:

- Dashboard-Ansichten
- CRM-/Ops-Screens
- Prozessstatus
- Kundenportale
- Kalender-/Buchungssysteme
- Integrations- und Automatisierungsvisuals
- reale Projekt-UI-Screenshots oder stark kuratierte Mockups

#### Anforderungen an Software-Visuals

- immer gebrandet
- immer ästhetisch aufbereitet
- keine rohen Entwickler-Screenshots
- keine random Admin-Template-Optik
- eher „case-study mockup“ als „backoffice screenshot“

---

## 9. Inhaltsrhythmus / Seitenaufbau

### Beobachteter Aufbau bei Lucent Studio

Die Seite folgt in etwa diesem Rhythmus:

1. Header / Navigation
2. Hero mit klarer Positionierung + CTA + Stats
3. Showcase-/Inszenierungssektion
4. Leistungssektion mit strukturierten Service-Modulen
5. Beweis-/Vergleichs-/Wirkungssektionen
6. Client-/Referenzbereich
7. Testimonials / Trust
8. Content-/Blog-/Themenkompetenz
9. About / Team / Vertrauen
10. Kontaktabschluss / CTA

### Wichtiges Prinzip

Die Seite ist **nicht einfach informativ**, sondern **dramatisch kuratiert**.

Jede Sektion hat eine klare Aufgabe:

- Aufmerksamkeit
- Positionierung
- Kompetenz
- Vertrauen
- Beweis
- Conversion

### Exakte Übertragung für Lucent Solutions

Empfohlene Reihenfolge:

1. **Hero**
   - Positionierung als Software-Studio
2. **Software-Showcase**
   - 2–4 inszenierte Use-Case-Mockups
3. **Leistungen**
   - nummerierte Module
4. **Was wir bauen**
   - konkrete Kategorien mit Anwendungsbeispielen
5. **Vorher/Nachher / Wirkung**
   - operative Verbesserung, Zeitersparnis, Klarheit
6. **Referenzen / Cases**
   - echte Branchenbeispiele
7. **Arbeitsweise / Prozess**
   - vom Problem zur produktiven Lösung
8. **FAQ**
   - typische Einwände / Zusammenarbeit / Kosten / Technik
9. **Abschluss-CTA**
   - Projektanfrage

---

## 10. Tonalität im Design

Lucent Studio ist visuell:

- präzise
- ruhig
- hochwertig
- ambitioniert
- nicht laut
- nicht verspielt
- nicht billig-agenturig

Lucent Solutions muss genauso wirken.

### Für Text + Design gemeinsam bedeutet das:

- kurze, klare Headlines
- wenig Füllwörter
- starke Nutzenformulierung
- keine übertriebene Enterprise-Sprache
- keine aufgeblasene IT-Berater-Sprache
- keine „Wir digitalisieren Ihr Unternehmen ganzheitlich“-Plattitüden

Besser:

- konkret
- wirksam
- operativ
- nutzerbezogen
- nachvollziehbar

---

## 11. Was Lucent Solutions NICHT tun sollte

Um die Markenähnlichkeit zu halten, sollte Lucent Solutions visuell **nicht** in typische Software-Agentur-Fallen kippen:

### Nicht machen

- helle Standard-SaaS-Landingpage als Hauptstil
- reine Blau/Weiß-B2B-Optik
- sterile Tabellen-/UI-Wüste
- zu viele Tech-Buzzwords direkt im Hero
- Neon/Cyberpunk/Matrix-Look
- Developer-Tooling-Optik als Primärästhetik
- generische isometrische Illustrationen
- billige Stock-3D-Grafiken

### Stattdessen

- dunkle Premium-Bühne
- kuratierte Software-Mockups
- editorial Typografie
- gläserne Layer
- weiche Motion
- klare Conversion-Architektur

---

## 12. Konkrete Übertragung auf Lucent Solutions

### A. Was 1:1 übernommen werden soll

- dunkle Gesamtbühne
- cremefarbener Text auf Navy/Deep Blue
- Premium-Header mit CTA rechts
- große editorial Hero-Typografie
- glasartige Cards / Panels
- stark inszenierte Section-Wechsel
- nummerierte Leistungsblöcke
- Trust-/Proof-Elemente
- subtile Motion
- hochwertiger Showcase-Charakter

### B. Was inhaltlich ersetzt werden soll

**Lucent Studio → Lucent Solutions**

- Social Media Content → interne Tools
- Reels / Creatives → Dashboards / Workflows / Portale
- Reichweite / Anfragen → Effizienz / Übersicht / Automatisierung / Conversion in Prozessen
- Recruiting Funnels → Lead Routing / Self-Service / Statussysteme / Admin-Flows
- Performance Marketing → operative Performance / Team-Produktivität / Datenfluss

### C. Welche neuen Visuals Solutions braucht

- Dashboard-Mockups
- Pipeline-/Status-Boards
- CRM-/Lead-Ansichten
- Self-Service-Portal-Ansichten
- Integrationsflüsse
- White-Label-/Admin-Interfaces
- Mobile + Desktop Screens in Markenrahmung

### D. Beispiel für Service-Übersetzung

#### Studio-Stil
`01 Content Creation`

#### Solutions-Stil
`01 Interne Tools`

Tags:
- Angebotslogik
- Disposition
- Statusübersicht
- Backoffice
- Admin-Flows

---

## 13. Umsetzungsregel für alle zukünftigen Seiten von Lucent Solutions

Jede neue Section auf `lucent-solutions.tech` sollte vor Veröffentlichung gegen diese Frage geprüft werden:

> Würde diese Section auch auf Lucent Studio wie dieselbe Markenfamilie wirken — nur mit Software-Inhalt?

Wenn **nein**, ist sie wahrscheinlich:

- zu technisch roh
- zu generisch SaaS
- zu hell
- zu utilitaristisch
- zu wenig kuratiert

Dann zurück auf die Lucent-Studio-Prinzipien:

- Bühne
- Eleganz
- Tiefe
- Rhythmus
- Proof
- Premium-Ausführung

---

## 14. Kurzfassung für die praktische Umsetzung

### Behalte bei

- dunkles Navy/Cream-Farbsystem
- Montserrat + Serif-Display-Kontrast
- Premium-Spacing
- Glas-/Overlay-Komponenten
- inszenierte Hero-Bühne
- strukturierte Service-Dramaturgie
- hochwertige Motion

### Ersetze

- Social-/Marketing-Motive → Software-/Operations-/Portal-Motive
- Reichweiten-Sprache → Prozess-/System-/Wirkungs-Sprache
- Content-Beispiele → Tool-/Dashboard-/Workflow-Beispiele

### Zielbild

**Lucent Solutions soll aussehen wie die Schwester von Lucent Studio.**

Nicht dieselbe Kopie im Inhalt — aber klar dieselbe Designfamilie:

- visuell verwandt
- tonal verwandt
- strukturell verwandt
- inhaltlich unterschiedlich

---

## 15. Nächster Schritt für die Website-Implementierung

Wenn dieses Dokument als Implementierungsgrundlage genutzt wird, dann gilt für kommende UI-Arbeiten an `lucent-solutions.tech`:

1. zuerst visuelle Angleichenung an Lucent Studio
2. dann inhaltliche Anpassung auf Software-Fokus
3. keine neuen Stilwelten parallel aufmachen
4. jede neue Komponente gegen dieses Designsystem prüfen

Empfohlene Priorität:

1. Header
2. Hero
3. Service-Sektion
4. Showcase / Cases
5. CTA / Abschlusssektionen
6. FAQ / About / Vertrauenselemente
