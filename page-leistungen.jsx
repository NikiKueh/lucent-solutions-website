/* Lucent — Leistungen index page.
   Lists all 6 services as detailed cards; each links to its own detail page. */

function ServiceCard({ s }) {
  return (
    <a className="leistung" href={`leistungen-${s.slug}.html`}
       style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div className="num">{s.n} / 06 · {s.short.toUpperCase()}</div>
      <div className="corner">→</div>
      <h3>{s.title}</h3>
      <p>{s.tagline}</p>
      <div className="tags">{s.tags.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</div>
      <div className="viz" style={{ height: 100 }}><ServiceMockup kind={s.vizKind} /></div>
    </a>
  );
}

function HowWeDeliver() {
  const points = [
    { t: "Senior-only", d: "Architektur, Code-Reviews und Demos werden von Senior-Entwickler:innen verantwortet — nicht delegiert." },
    { t: "Wöchentliche Demos", d: "Live auf eurer Staging-Umgebung. Was wir zeigen, läuft. Was nicht läuft, sagen wir vorher." },
    { t: "Trunk-based + Feature-Flags", d: "Wir liefern oft und klein. Releases sind Knöpfe, nicht Events. Rollback in Sekunden." },
    { t: "Übergabe ab Tag eins", d: "Dokumentation entsteht laufend. Eure Entwickler:innen können von Tag eins mitarbeiten oder später übernehmen." },
  ];
  return (
    <section style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">WIE WIR LIEFERN</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Vier <em>Grundregeln</em>, die in jedem Projekt gelten.</h2></Reveal>
        </div>
        <Reveal>
          <div className="leistungen">
            {points.map((p, i) => (
              <div className="leistung" key={i} style={{ cursor: "default" }}>
                <div className="num">{String(i + 1).padStart(2, "0")} / 04</div>
                <h3 style={{ marginTop: 60 }}>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
            {/* fill grid to 6 slots so layout stays clean */}
            <div className="leistung" style={{ cursor: "default", background: "var(--navy)", color: "var(--cream)" }}>
              <div className="num" style={{ color: "rgba(245,242,236,0.5)" }}>EXTRA · 05</div>
              <h3 style={{ marginTop: 60, color: "var(--cream)" }}>Kein Lock-in</h3>
              <p style={{ color: "rgba(245,242,236,0.7)" }}>Repository in eurer Org, Standard-Stack, vollständige Dokumentation. Wenn ihr uns rausschmeißt, läuft alles weiter.</p>
            </div>
            <div className="leistung" style={{ cursor: "default" }}>
              <div className="num">EXTRA · 06</div>
              <h3 style={{ marginTop: 60 }}>Messbar oder nichts</h3>
              <p>Jedes Projekt bekommt eine handvoll KPIs, an denen es sich messen lassen muss. Performance, Conversion, Time-to-Ship — eure Wahl.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LeistungenApp() {
  return (
    <PageShell current="leistungen">
      <PageHeader
        crumbs={[{ label: "Home", href: "index.html" }, { label: "Leistungen" }]}
        eyebrow="LEISTUNGEN · 06 BEREICHE"
        title="Was wir bauen,"
        titleEm="und wie."
        lede="Sechs Bereiche, in denen wir täglich Software liefern — von individuellen Anwendungen bis zur KI-Integration in eure Workflows. Jeder Bereich mit konkreten Beispielen, Lieferumfang und Kosten-Indikation."
        meta={[
          { k: "BEREICHE", v: "06" },
          { k: "TEAMGRÖSSE", v: "1–4 Senior" },
          { k: "TYPISCHE DAUER", v: "4–20 Wochen" },
          { k: "BUDGET", v: "ab 18k €" },
        ]}
      />
      <section style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="leistungen">
            {LUCENT_SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
        </div>
      </section>
      <HowWeDeliver />
      <CTASection
        eyebrow="KONTAKT · /kein_passendes_paket"
        title="Nicht sicher,"
        titleLine2="welcher Bereich"
        titleEm="zu euch passt?"
        body="Schreibt uns kurz, was bei euch gerade ansteht. Wir antworten innerhalb eines Werktags mit einer ehrlichen Einschätzung — auch, wenn die Antwort 'das machen wir nicht' lautet."
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<LeistungenApp />);
