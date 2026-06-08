/* Lucent — Cases index page. Lists all real-world projects with detail links. */

function CaseGridCard({ c }) {
  return (
    <a className="case" href={`cases-${c.slug}.html`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div className="case-head">
        <span className="industry-tag">{c.tag}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)" }}>→</span>
      </div>
      <h3>{c.title}</h3>
      <p>{c.short}</p>
      <div className="case-viz" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CaseHeroMockup kind={c.vizKind} />
      </div>
      <div className="metrics">
        {c.metrics.slice(0, 2).map((m, j) => (
          <div className="metric" key={j}>
            <div className="val">{m.val}</div>
            <div className="lab">{m.lab}</div>
          </div>
        ))}
      </div>
    </a>
  );
}

function CasesApp() {
  return (
    <PageShell current="cases">
      <PageHeader
        crumbs={[{ label: "Home", href: "index.html" }, { label: "Cases" }]}
        eyebrow="CASES · AUSGEWÄHLTE PROJEKTE"
        title="Software, die"
        titleEm="geliefert hat."
        lede="Eine Auswahl aus den letzten zwei Jahren. NDAs verbieten Klar-Namen, aber Zahlen, Workflows und Ergebnisse dürfen wir zeigen — alle hier gezeigten Metriken stammen aus echten Projekten und sind illustrativ aufbereitet."
        meta={[
          { k: "PROJEKTE GEZEIGT", v: "05" },
          { k: "ZEITRAUM", v: "2024–2025" },
          { k: "BRANCHEN", v: "SaaS · B2B · Fintech · Logistik" },
          { k: "FORMAT", v: "Detail pro Case" },
        ]}
      />
      <section style={{ paddingTop: 80 }}>
        <div className="wrap">
          <Reveal>
            <div className="cases">
              {LUCENT_CASES.map((c) => <CaseGridCard key={c.slug} c={c} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Industries we work with */}
      <section id="fuer-wen" style={{ background: "var(--cream-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">FÜR WEN</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Für wen wir <em>bauen.</em></h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Branchenübergreifend, mit Schwerpunkt auf Mittelstand und Scale-ups. Wenn euer Geschäftsmodell auf Software steht oder gerade darauf wechselt — passt es.</p></Reveal>
          </div>
          <Reveal>
            <div className="fuer-wen">
              {LUCENT_INDUSTRIES.map((it, i) => (
                <div className="industry" key={i}>
                  <div>
                    <div className="icon">{it.i}</div>
                    <h4>{it.t}</h4>
                    <p>{it.d}</p>
                  </div>
                  <div className="label">{it.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="KONTAKT · /ihr_case"
        title="Habt ihr"
        titleLine2="einen ähnlichen"
        titleEm="Fall?"
        body="Schreibt uns kurz, was bei euch ansteht. Wir antworten innerhalb eines Werktags mit einer ehrlichen Einschätzung und schicken bei Bedarf passende Referenzen mit."
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CasesApp />);
