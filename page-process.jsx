/* Lucent — Process page. Full 7-phase timeline with deliverables, decisions, examples. */

function ProcessTimeline() {
  return (
    <div className="timeline">
      {LUCENT_PROCESS.map((s, i) => (
        <Reveal key={s.slug} delay={i * 40}>
          <article className={`tl-step ${i === 0 ? "active" : ""}`} id={s.slug}>
            <span className="dot" />
            <div className="head">
              <span className="n">PHASE {s.n}</span>
              <h3>{s.t}</h3>
              <span className="time">{s.time}</span>
            </div>
            <p className="desc">{s.desc}</p>
            <div className="meta">
              <div className="box">
                <div className="label">LIEFERUMFANG</div>
                <ul>
                  {s.deliverables.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
              </div>
              <div className="box" style={{ background: "var(--cream-2)" }}>
                <div className="label">EURE ENTSCHEIDUNG</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--navy)", marginBottom: 16 }}>
                  {s.decision}
                </p>
                <div className="label" style={{ marginTop: 12 }}>BEISPIEL</div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--navy-2)", opacity: 0.85, fontStyle: "italic" }}>
                  {s.example}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

function ProcessVisual() {
  return (
    <aside className="process-side">
      <h4>GESAMTDAUER · TYPISCH</h4>
      <div className="total">12–22 Wochen</div>
      <p className="note">Von Discovery bis Launch. Support und Skalierung danach laufend — als On-Call-Pauschale, Sprint-Pakete oder volle Übergabe an euer Team.</p>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 0.05, marginBottom: 12 }}>PRINZIPIEN</div>
        <div style={{ display: "grid", gap: 10, fontSize: 13.5, color: "var(--navy)" }}>
          <div>▸ Wöchentliche Demos</div>
          <div>▸ Feature-Flags von Tag eins</div>
          <div>▸ Trunk-based Development</div>
          <div>▸ Tests vor Code-Review</div>
          <div>▸ Übergabe ab Tag eins</div>
        </div>
      </div>
      <a href="contact.html" className="cta" style={{ marginTop: 20 }}>
        Discovery starten <span className="arrow">→</span>
      </a>
    </aside>
  );
}

function ProcessApp() {
  return (
    <PageShell current="process">
      <PageHeader
        crumbs={[{ label: "Home", href: "index.html" }, { label: "Prozess" }]}
        eyebrow="PROZESS · 07 PHASEN"
        title="Vom ersten Gespräch"
        titleEm="bis zum Betrieb."
        lede="Unser Entwicklungs-Prozess ist transparent, vorhersehbar und auf Wirkung optimiert. Sieben Phasen, klare Lieferumfänge, eure Entscheidungen an den richtigen Stellen — keine Black Box, keine Theatervorstellungen."
        meta={[
          { k: "PHASEN", v: "07" },
          { k: "TYPISCHE DAUER", v: "12–22 Wochen" },
          { k: "DEMOS", v: "wöchentlich" },
          { k: "FORMAT", v: "Discovery → Build → Support" },
        ]}
      />

      <section style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="split-aside">
            <ProcessTimeline />
            <ProcessVisual />
          </div>
        </div>
      </section>

      {/* What we expect from clients */}
      <section style={{ background: "var(--cream-2)" }}>
        <div className="wrap section-narrow">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">WAS WIR VON EUCH BRAUCHEN</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Damit das <em>klappt.</em></h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Wir sind kein Auftrags-Schreiber. Damit ein Projekt erfolgreich wird, brauchen wir ein paar Dinge von eurer Seite:</p></Reveal>
          </div>
          <Reveal>
            <div className="feature-list" style={{ background: "var(--paper)", borderRadius: 14, padding: "0 28px" }}>
              {[
                { n: "01", t: "Eine:n Ansprechpartner:in mit Entscheidungsbefugnis", d: "Jemand, mit dem wir über Architektur, Scope und Trade-offs reden — und der oder die Entscheidungen treffen kann, ohne dass es eine Steuerungs-Sitzung braucht." },
                { n: "02", t: "Zugang zu echten Nutzer:innen", d: "Auch wenn nur drei Personen für 30 Minuten verfügbar sind — wir wollen die wirkliche Arbeitswelt sehen, nicht eine Beschreibung davon." },
                { n: "03", t: "Daten und Systeme — so wie sie sind", d: "Wir arbeiten lieber mit echtem, unsauberem Datenbestand als mit aufpolierten Test-Sets. Das findet Probleme früh." },
                { n: "04", t: "Ehrliche Antworten zu Budget und Zeit", d: "Wenn ihr 8 Wochen habt und sagt 'wir haben 6 Monate Zeit', verlieren wir alle. Lieber früh klar als später überrascht." },
              ].map((p) => (
                <div className="row" key={p.n}>
                  <span className="n">{p.n}</span>
                  <div>
                    <h4>{p.t}</h4>
                    <p>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="KONTAKT · /discovery_starten"
        title="Bereit für"
        titleLine2="Phase 01:"
        titleEm="Discovery?"
        body="Discovery dauert 1–2 Wochen und endet mit einer These, die ihr testen wollt — oder einer Empfehlung, dass ihr besser nichts baut. Beide Antworten sind okay."
        primaryLabel="Discovery anfragen"
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProcessApp />);
