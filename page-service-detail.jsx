/* Lucent — Service detail template.
   Reads slug from document.body.dataset.slug and renders the matching service from data. */

function ServiceDetailApp() {
  const slug = document.body.dataset.slug;
  const s = LUCENT_SERVICES.find((x) => x.slug === slug);
  if (!s) {
    return (
      <PageShell current="leistungen">
        <PageHeader
          crumbs={[{ label: "Home", href: "index.html" }, { label: "Leistungen", href: "leistungen.html" }, { label: "Nicht gefunden" }]}
          eyebrow="404"
          title="Leistung nicht gefunden."
          lede="Diese Seite existiert noch nicht. Schau in die Übersicht oder schreib uns direkt."
        />
        <CTASection />
      </PageShell>
    );
  }
  const related = LUCENT_SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  const cases = LUCENT_CASES.filter((c) => c.relatedService === s.slug).slice(0, 2);
  return (
    <PageShell current="leistungen">
      <PageHeader
        crumbs={[
          { label: "Home", href: "index.html" },
          { label: "Leistungen", href: "leistungen.html" },
          { label: s.short },
        ]}
        eyebrow={`${s.eyebrow} · ${s.n} / 06`}
        title={s.title}
        titleEm={s.titleEm}
        lede={s.tagline}
        meta={[
          { k: "DAUER", v: s.meta.duration },
          { k: "TEAM", v: s.meta.team },
          { k: "BUDGET", v: s.meta.budget },
          { k: "PHASEN", v: s.meta.phase },
        ]}
      />

      {/* Problem + What we build + Visual */}
      <section className="detail-hero">
        <div className="wrap">
          <div className="grid">
            <div>
              <Reveal>
                <span className="section-eyebrow">PROBLEM · 01</span>
                <h2 className="section-title" style={{ fontSize: "clamp(28px, 3vw, 40px)", marginTop: 16 }}>Was wir lösen.</h2>
                <p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 16, color: "var(--navy-2)", opacity: 0.85 }}>{s.problem}</p>
              </Reveal>
              <Reveal delay={120}>
                <div style={{ marginTop: 56 }}>
                  <span className="section-eyebrow">WAS WIR BAUEN · 02</span>
                  <h2 className="section-title" style={{ fontSize: "clamp(28px, 3vw, 40px)", marginTop: 16 }}>Konkret heißt das:</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 16, color: "var(--navy-2)", opacity: 0.85 }}>{s.builds}</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <div className="visual" style={{ position: "sticky", top: 100 }}>
                <ServiceMockup kind={s.vizKind} />
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--muted)" }}>
                  <div><div style={{ letterSpacing: 0.05, marginBottom: 4 }}>STACK</div><div style={{ color: "var(--navy)", fontSize: 13 }}>{s.tags.slice(0, 3).join(" · ")}</div></div>
                  <div><div style={{ letterSpacing: 0.05, marginBottom: 4 }}>FORMAT</div><div style={{ color: "var(--navy)", fontSize: 13 }}>{s.meta.phase}</div></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Example use cases */}
      <section style={{ background: "var(--cream-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">BEISPIELE · ANWENDUNGSFÄLLE</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Drei <em>konkrete</em> Beispiele.</h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Statt allgemeiner Versprechen — drei reale Use Cases, die wir in diesem Bereich regelmäßig liefern.</p></Reveal>
          </div>
          <Reveal>
            <div className="use-cases">
              {s.examples.map((ex, i) => (
                <div className="uc" key={i}>
                  <span className="label">{ex.label}</span>
                  <h4>{ex.title}</h4>
                  <p>{ex.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">UNSER ANSATZ</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Vier <em>Prinzipien</em>, an denen wir uns messen lassen.</h2></Reveal>
          </div>
          <Reveal>
            <div className="split-aside">
              <div className="feature-list">
                {s.features.map((f) => (
                  <div className="row" key={f.n}>
                    <span className="n">{f.n}</span>
                    <div>
                      <h4>{f.t}</h4>
                      <p>{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <aside className="detail-aside">
                <h4>PROJEKT-METRIKEN</h4>
                <ul>
                  <li><span className="k">Dauer</span><span className="v">{s.meta.duration}</span></li>
                  <li><span className="k">Team</span><span className="v">{s.meta.team}</span></li>
                  <li><span className="k">Budget</span><span className="v">{s.meta.budget}</span></li>
                  <li><span className="k">Phasen</span><span className="v">{s.meta.phase}</span></li>
                </ul>
                <a href="contact.html" className="cta">
                  {s.cta} <span className="arrow">→</span>
                </a>
              </aside>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Deliverables */}
      <section style={{ background: "var(--cream-2)", paddingTop: 80, paddingBottom: 100 }}>
        <div className="wrap section-narrow">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">LIEFERUMFANG</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Was ihr <em>am Ende</em> bekommt.</h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Ein typisches Projekt in diesem Bereich endet mit folgenden Artefakten — alles in eurer Organisation, alles dokumentiert.</p></Reveal>
          </div>
          <Reveal>
            <div className="deliverables">
              {s.deliverables.map((d, i) => (
                <div className="deliverable" key={i}>
                  <span className="check">✓</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ marginTop: 40 }}>
              <div className="tag-list">
                {s.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related cases */}
      {cases.length > 0 && (
        <section>
          <div className="wrap">
            <div className="section-head">
              <Reveal><span className="section-eyebrow">CASES · {s.short.toUpperCase()}</span></Reveal>
              <Reveal delay={80}><h2 className="section-title">So sieht das in <em>echt</em> aus.</h2></Reveal>
            </div>
            <Reveal>
              <div className="cases">
                {cases.map((c) => (
                  <a className="case" key={c.slug} href={`cases-${c.slug}.html`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div className="case-head">
                      <span className="industry-tag">{c.tag}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)" }}>→</span>
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.short}</p>
                    <div className="case-viz" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><CaseHeroMockup kind={c.vizKind} /></div>
                    <div className="metrics">
                      {c.metrics.slice(0, 2).map((m, j) => (
                        <div className="metric" key={j}>
                          <div className="val">{m.val}</div>
                          <div className="lab">{m.lab}</div>
                        </div>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related services */}
      <section style={{ background: "var(--cream-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">ANDERE LEISTUNGEN</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Was wir noch <em>bauen.</em></h2></Reveal>
          </div>
          <Reveal>
            <div className="related-grid">
              {related.map((r) => (
                <a className="related-card" key={r.slug} href={`leistungen-${r.slug}.html`}>
                  <span className="kind">{r.eyebrow}</span>
                  <h4>{r.title}</h4>
                  <div className="arr">Mehr erfahren <span>→</span></div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        primaryLabel={s.cta}
        body={`Konkrete Frage zu ${s.short}? Schreib uns kurz, worum es geht. Innerhalb eines Werktags bekommt ihr eine ehrliche Ersteinschätzung — kostenlos und unverbindlich.`}
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ServiceDetailApp />);
