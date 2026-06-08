/* Lucent — About page. Studio philosophy, values, how we work, impressum stub. */

function AboutApp() {
  return (
    <PageShell current="about">
      <PageHeader
        crumbs={[{ label: "Home", href: "index.html" }, { label: "Über uns" }]}
        eyebrow="ÜBER UNS · STUDIO"
        title="Ein kleines"
        titleEm="Senior-Team."
        lede="Wir sind ein Software Studio aus Ulm. Gegründet 2021 von Entwickler:innen, die genug von 18-Monats-Wasserfällen, Body-Leasing-Kontrakten und 80-Folien-Statusberichten hatten."
        meta={[
          { k: "STANDORT", v: "Ulm · Remote" },
          { k: "GEGRÜNDET", v: "2021" },
          { k: "TEAM", v: "4 Senior, 1 PM" },
          { k: "RECHTSFORM", v: "GmbH" },
        ]}
      />

      {/* Story */}
      <section>
        <div className="wrap">
          <div className="about-grid">
            <Reveal>
              <div>
                <span className="section-eyebrow">WARUM ES UNS GIBT</span>
                <h2 style={{ marginTop: 16 }}>Software, die <em>jemand</em> verantwortet.</h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div>
                <p>In zu vielen Projekten verschwindet die Verantwortung in einer Mischung aus Pflichtenheft, Festpreis und Body-Leasing. Am Ende läuft die Software irgendwie, niemand fühlt sich zuständig, das Team, das es übernimmt, fängt nach 12 Monaten wieder von vorn an.</p>
                <p>Wir bauen Software anders: Senior-Entwickler:innen, die Architektur-Entscheidungen verantworten. Wöchentliche Demos statt PowerPoint-Reviews. Ein klares Übergabe-Konzept ab Tag eins. Code, der nicht stirbt, wenn wir gehen.</p>
                <p>Wir sind klein und wollen klein bleiben. Lieber vier Projekte pro Jahr richtig gut, als zwanzig halb. Lieber ein Kunde, der drei Jahre später noch zufrieden ist, als zehn, die nach sechs Monaten ein neues Team brauchen.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--cream-2)" }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">UNSERE WERTE</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Sechs Dinge, an die wir <em>glauben.</em></h2></Reveal>
          </div>
          <Reveal>
            <div className="values">
              {[
                { n: "01", t: "Senior-only", d: "Architektur, Code-Review, Demo — von Senior-Entwickler:innen. Keine Praktikanten, die in eurem Code lernen." },
                { n: "02", t: "Klein bleiben", d: "Wir wachsen nur, wenn wir die Qualität halten können. Lieber abgesagt als kompromittiert ausgeliefert." },
                { n: "03", t: "Standard, wo es geht", d: "TypeScript, Postgres, ein Framework, das in 5 Jahren noch da ist. Exotik-Stack nur, wo wirklich nötig." },
                { n: "04", t: "Übergabe ab Tag eins", d: "Dokumentation entsteht laufend. Wir bauen so, dass das nachfolgende Team unseren Code gerne übernimmt." },
                { n: "05", t: "Messbar oder gar nicht", d: "Jedes Projekt hat eine handvoll KPIs, an denen es sich messen lassen muss. Bauchgefühl reicht nicht." },
                { n: "06", t: "Ehrlich auch beim 'Nein'", d: "Wenn wir glauben, dass ihr keine Software, sondern einen Prozess-Change braucht, sagen wir das. Auch wenn es den Auftrag kostet." },
              ].map((v) => (
                <div className="value-row" key={v.n}>
                  <span className="n">{v.n}</span>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <StackMarquee />

      {/* Team */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">TEAM</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Wer <em>liefert.</em></h2></Reveal>
            <Reveal delay={160}><p className="section-sub">Vier Senior-Entwickler:innen, eine Projekt-Verantwortliche. Alle mit 8+ Jahren Erfahrung, alle aktiv im Code, alle erreichbar.</p></Reveal>
          </div>
          <Reveal>
            <div className="related-grid">
              {[
                { initials: "MR", name: "Mara Reichert", role: "Co-Founder · Backend & Architektur", focus: "TypeScript · Postgres · Distributed Systems" },
                { initials: "JK", name: "Jonas Klemm", role: "Co-Founder · Frontend & UX", focus: "React · Design Systems · Performance" },
                { initials: "SA", name: "Sara Achterberg", role: "Senior · Applied AI", focus: "LLM-Workflows · RAG · Eval-Frameworks" },
                { initials: "TB", name: "Tobias Brand", role: "Senior · Platform & DevOps", focus: "Kubernetes · CI/CD · Observability" },
                { initials: "LH", name: "Lea Hoppe", role: "Project Lead", focus: "Discovery · Stakeholder · Delivery" },
              ].map((m) => (
                <div className="related-card" key={m.initials} style={{ cursor: "default" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 500 }}>{m.initials}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 500, color: "var(--navy)", letterSpacing: "-0.01em" }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{m.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--navy-2)", lineHeight: 1.5, opacity: 0.85 }}>{m.focus}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Impressum stub */}
      <section id="impressum" style={{ background: "var(--cream-2)" }}>
        <div className="wrap section-narrow">
          <div className="section-head">
            <Reveal><span className="section-eyebrow">RECHTLICHES</span></Reveal>
            <Reveal delay={80}><h2 className="section-title">Impressum & <em>Datenschutz.</em></h2></Reveal>
          </div>
          <Reveal>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 32, fontSize: 14.5, lineHeight: 1.65, color: "var(--navy)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Anbieter</h3>
              <p>Lucent Software GmbH<br />Musterstraße 12<br />89073 Ulm<br />Deutschland</p>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginTop: 20, marginBottom: 12 }}>Kontakt</h3>
              <p>E-Mail: <a href="mailto:hallo@lucent.example" style={{ color: "var(--navy)", textDecoration: "underline" }}>hallo@lucent.example</a><br />Telefon: +49 731 000-000</p>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginTop: 20, marginBottom: 12 }}>Geschäftsführung</h3>
              <p>Mara Reichert, Jonas Klemm</p>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginTop: 20, marginBottom: 12 }}>Handelsregister</h3>
              <p>Amtsgericht Ulm, HRB 000000<br />USt-IdNr.: DE000000000</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--muted)", marginTop: 28 }}>
                ▸ Dies ist ein Platzhalter. In einer produktiven Site stehen hier vollständige Pflicht-Angaben nach § 5 TMG sowie eine eigenständige Datenschutz-Erklärung nach DSGVO.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="KONTAKT · /lust_uns_kennenzulernen"
        title="Lust, uns"
        titleLine2="kennenzu-"
        titleEm="lernen?"
        body="30 Minuten Erstgespräch, ohne Verkaufs-Folien. Wir hören euch zu, sagen, ob es passt, und schicken bei Bedarf passende Referenzen mit."
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AboutApp />);
