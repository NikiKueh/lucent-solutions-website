/* Lucent — Case detail template.
   Reads slug from document.body.dataset.slug and renders the matching case. */

function CaseDetailApp() {
  const slug = document.body.dataset.slug;
  const c = LUCENT_CASES.find((x) => x.slug === slug);
  if (!c) {
    return (
      <PageShell current="cases">
        <PageHeader
          crumbs={[{ label: "Home", href: "index.html" }, { label: "Cases", href: "cases.html" }, { label: "Nicht gefunden" }]}
          eyebrow="404"
          title="Case nicht gefunden."
          lede="Diese Seite existiert noch nicht. Schau in die Übersicht oder schreib uns direkt."
        />
        <CTASection />
      </PageShell>
    );
  }
  const related = LUCENT_CASES.filter((x) => x.slug !== c.slug).slice(0, 3);
  const relatedService = LUCENT_SERVICES.find((s) => s.slug === c.relatedService);

  return (
    <PageShell current="cases">
      <PageHeader
        crumbs={[
          { label: "Home", href: "index.html" },
          { label: "Cases", href: "cases.html" },
          { label: c.industry },
        ]}
        eyebrow={c.tag}
        title={c.title}
        lede={c.short}
        meta={[
          { k: "BRANCHE", v: c.industry },
          { k: "DAUER", v: c.duration },
          { k: "ROLLE", v: c.role },
          { k: "ZEITRAUM", v: c.tag.split("·")[1]?.trim() || "—" },
        ]}
      />

      {/* Metrics row */}
      <section style={{ paddingTop: 60, paddingBottom: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="case-stats">
              {c.metrics.map((m, i) => (
                <div className="stat" key={i}>
                  <div className="val">{m.val}</div>
                  <div className="lab">{m.lab}</div>
                  {m.note && <div className="note">{m.note}</div>}
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
              ▸ Werte stammen aus dem konkreten Projekt, anonymisiert dargestellt. NDAs verbieten Klar-Namen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Problem + Solution narrative */}
      <section>
        <div className="wrap">
          <div className="split-aside">
            <div className="case-narrative">
              <Reveal>
                <h3>Problem.</h3>
                <p>{c.problem}</p>
              </Reveal>
              <Reveal>
                <h3>Lösung.</h3>
                <p>{c.solution}</p>
              </Reveal>
              <Reveal>
                <h3>Ergebnis.</h3>
                <p>{c.result}</p>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <aside className="detail-aside">
                <h4>STACK</h4>
                <div className="tag-list" style={{ marginBottom: 24 }}>
                  {c.stack.map((t) => <span key={t}>{t}</span>)}
                </div>
                <h4>ECKDATEN</h4>
                <ul>
                  <li><span className="k">Branche</span><span className="v">{c.industry}</span></li>
                  <li><span className="k">Dauer</span><span className="v">{c.duration}</span></li>
                  <li><span className="k">Rolle</span><span className="v">{c.role}</span></li>
                </ul>
                {relatedService && (
                  <>
                    <h4 style={{ marginTop: 18 }}>LEISTUNG</h4>
                    <a href={`leistungen-${relatedService.slug}.html`}
                       style={{ display: "block", padding: "10px 14px", borderRadius: 8, background: "var(--cream)", color: "var(--navy)", fontSize: 13.5, border: "1px solid var(--line)" }}>
                      {relatedService.short} →
                    </a>
                  </>
                )}
                <a href="contact.html" className="cta" style={{ marginTop: 18 }}>
                  Ähnliches Projekt? <span className="arrow">→</span>
                </a>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section style={{ background: "var(--cream-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">WORKFLOW</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Wie die <em>Software</em> arbeitet.</h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Fünf Schritte vom Eingang bis zum Ergebnis — automatisiert wo möglich, mit menschlicher Freigabe wo nötig.</p></Reveal>
          </div>
          <Reveal>
            <div className="workflow">
              <div className="workflow-grid">
                {c.workflow.map((step, i, arr) => (
                  <React.Fragment key={i}>
                    <div className="wf-node">
                      <div className="icon">{step.icon}</div>
                      <h5>{step.t}</h5>
                      <p>{step.d}</p>
                    </div>
                    {i < arr.length - 1 && <div className="wf-arrow">→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Software components */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">SOFTWARE-KOMPONENTEN</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Was wir <em>gebaut</em> haben.</h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Die wichtigsten Bausteine der Lösung — von Eingangs-Listener bis zum Audit-Trail.</p></Reveal>
          </div>
          <Reveal>
            <div className="deliverables">
              {c.components.map((comp, i) => (
                <div className="deliverable" key={i}>
                  <span className="check">✓</span>
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related cases */}
      <section style={{ background: "var(--cream-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">ANDERE CASES</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Weitere <em>Projekte.</em></h2></Reveal>
          </div>
          <Reveal>
            <div className="related-grid">
              {related.map((r) => (
                <a className="related-card" key={r.slug} href={`cases-${r.slug}.html`}>
                  <span className="kind">{r.tag}</span>
                  <h4>{r.title}</h4>
                  <div className="arr">Case ansehen <span>→</span></div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="KONTAKT · /ähnliches_problem"
        title="Habt ihr ein"
        titleLine2="ähnliches"
        titleEm="Problem?"
        body={`Wenn das hier nach eurer Situation klingt, schreibt uns. Wir antworten innerhalb eines Werktags mit einer Einschätzung — ehrlich auch, wenn wir glauben, dass ihr uns nicht braucht.`}
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CaseDetailApp />);
