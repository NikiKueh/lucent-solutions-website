/* Lucent — Home page (index.html).
   Hero, product examples, services preview, cases preview, process preview, why, FAQ, CTA. */

/* ---------- Hero ---------- */
function HomeHero() {
  const lines = React.useMemo(() => [
    { text: "$ lucent init --client neue-kunde", render: (t) => <><span className="term-prompt">$</span>{t.replace("$", "")}</>, pause: 260 },
    { text: "→ Architektur wird geplant.......... ok", render: (t) => { const ok = t.endsWith("ok"); return <><span className="term-arrow">→</span>{t.replace("→", "").replace(/ok$/, "")}{ok && <span className="term-ok">ok</span>}</>; }, pause: 180 },
    { text: "→ Prototyp wird gebaut.............. ok", render: (t) => { const ok = t.endsWith("ok"); return <><span className="term-arrow">→</span>{t.replace("→", "").replace(/ok$/, "")}{ok && <span className="term-ok">ok</span>}</>; }, pause: 200 },
    { text: "→ Tests laufen (412/412)............ ok", render: (t) => { const ok = t.endsWith("ok"); return <><span className="term-arrow">→</span>{t.replace("→", "").replace(/ok$/, "")}{ok && <span className="term-ok">ok</span>}</>; }, pause: 220 },
    { text: "", pause: 200 },
    { text: "// von der Idee zum Produkt — in Wochen.", render: (t) => <span className="term-comment">{t}</span>, pause: 600 },
    { text: "$ lucent deploy --to production", render: (t) => <><span className="term-prompt">$</span>{t.replace("$", "")}</>, pause: 240 },
    { text: "✔ build  ✔ sign  ✔ rollout 100%", render: (t) => <span className="term-ok">{t}</span>, pause: 1400 },
  ], []);
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="pill">NEU</span>
              <span>Software Studio · Ulm · seit 2021</span>
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display">
              Software, die <em>wirkt.</em><br />
              Tools, die euer Team<br />
              <span className="underline-gold">jeden Tag</span> nutzt.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Wir bauen interne Tools, Dashboards, KI-Automatisierungen und SaaS-Plattformen,
              die manuelle Arbeit ersetzen und eure Systeme verbinden — vom Prototyp
              bis zur produktiven Plattform.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="hero-ctas">
              <Magnetic>
                <a href="contact.html" className="btn btn-primary">
                  Unverbindliches Gespräch <span className="arrow">→</span>
                </a>
              </Magnetic>
              <Magnetic strength={8}>
                <a href="leistungen.html" className="btn btn-ghost btn-mono">
                  $ alle leistungen
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-trust">
              <div>
                <div className="label">Was wir bauen</div>
                <div className="clients">
                  <span>Custom Tools</span>
                  <span>KI-Workflows</span>
                  <span>Dashboards</span>
                  <span>Portale</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div style={{ position: "relative" }}>
            <div className="float-chip" style={{ top: -16, left: -20, transform: "rotate(-3deg)" }}>
              <span style={{ color: "#1cba6e" }}>●</span> deploy.yaml
            </div>
            <div className="float-chip" style={{ bottom: -14, right: -12, transform: "rotate(2deg)" }}>
              <span style={{ color: "var(--gold)" }}>{`{ }`}</span> 312 Endpoints verbunden
            </div>
            <div className="terminal">
              <div className="term-bar">
                <div className="lights"><span /><span /><span /></div>
                <div className="title">~/lucent/projekte/neue-kunde — zsh</div>
                <div className="tabs">
                  <span className="active">main</span>
                  <span>logs</span>
                  <span>graph</span>
                </div>
              </div>
              <div className="term-body">
                <TypedTerminal lines={lines} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* TypedTerminal inline (kept here so hero is self-contained) */
function TypedTerminal({ lines, speed = 18, startDelay = 200, loop = true }) {
  const [idx, setIdx] = React.useState(0);
  const [pos, setPos] = React.useState(0);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    let to;
    const start = setTimeout(function tick() {
      if (idx >= lines.length) {
        if (loop) { to = setTimeout(() => { setIdx(0); setPos(0); setDone(false); }, 2400); return; }
        setDone(true); return;
      }
      const text = lines[idx].text || "";
      if (pos < text.length) {
        setPos((p) => p + 1);
        to = setTimeout(tick, speed + Math.random() * 25);
      } else {
        to = setTimeout(() => { setIdx((i) => i + 1); setPos(0); }, lines[idx].pause || 220);
      }
    }, idx === 0 && pos === 0 ? startDelay : 0);
    return () => { clearTimeout(start); clearTimeout(to); };
  }, [idx, pos, lines.length]);

  return (
    <div>
      {lines.slice(0, idx + 1).map((ln, i) => {
        const txt = i < idx ? ln.text : ln.text.slice(0, pos);
        return (
          <div className="term-line" key={i}>
            {ln.render ? ln.render(txt) : txt}
            {i === idx && !done && <span className="caret" />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Product examples (NEW concrete examples) ---------- */
function ProductExamples() {
  const items = [
    {
      label: "INTERNES TOOL",
      title: "Auftragsverwaltung mit Live-Status",
      desc: "Aufträge, Disposition, Lagerstand — in einer Oberfläche. Statt drei Tabs und einem WhatsApp-Chat.",
      href: "leistungen-custom-software.html",
      mockup: <MockupOpsDashboard />,
    },
    {
      label: "KI-WORKFLOW",
      title: "Lead-Qualifizierung mit LLM",
      desc: "Eingehende Anfragen werden klassifiziert, angereichert, priorisiert — bevor Sales sie sieht.",
      href: "cases-ai-lead-qualification.html",
      mockup: <MockupAIFlow />,
    },
    {
      label: "DASHBOARD",
      title: "Live-Ops-Übersicht für die GL",
      desc: "Umsatz, Pipeline, Tickets, KPIs — auf einem Bildschirm, jeden Morgen aktuell.",
      href: "leistungen-dashboards.html",
      mockup: <MockupDashboard />,
    },
    {
      label: "KUNDEN-PORTAL",
      title: "Self-Service mit Status-Tracking",
      desc: "Kunden sehen Rechnungen, melden Anliegen, laden Belege hoch — euer Support hat 40% weniger Anrufe.",
      href: "cases-customer-portal.html",
      mockup: <MockupPortal />,
    },
    {
      label: "API-INTEGRATION",
      title: "ERP ↔ Shop ↔ Buchhaltung",
      desc: "Bestellungen, Bestände, Buchungen in Echtzeit synchron — ohne CSV-Imports zur Mitternacht.",
      href: "leistungen-system-integrations.html",
      mockup: <MockupIntegration />,
    },
    {
      label: "SAAS-PLATTFORM",
      title: "Multi-Tenant-Buchungsplattform",
      desc: "White-Label-fähig, Stripe-Connect, Kalender-Sync — von 12 auf 240 Kunden in 9 Monaten.",
      href: "cases-saas-booking-platform.html",
      mockup: <MockupBooking />,
    },
  ];
  return (
    <section id="produkte" style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">PRODUKT-BEISPIELE · 06</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Was wir <em>typischerweise</em> bauen.</h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Keine Generalanbieter-Behauptungen — sechs konkrete Software-Typen, die wir regelmäßig liefern. Jede mit einer realen Anwendung dahinter.</p></Reveal>
        </div>
        <Reveal>
          <div className="products">
            {items.map((p, i) => (
              <a href={p.href} className="product-card" key={i}>
                <div className="frame">{p.mockup}</div>
                <div className="body">
                  <span className="kind">{p.label}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="foot">
                    <span>Mehr ansehen</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Services preview ---------- */
function HomeServices() {
  return (
    <section id="leistungen">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">LEISTUNGEN · 06</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Unsere Leistungen als <em>Software Studio.</em></h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Wir bauen Software-Produkte und übernehmen Verantwortung für sie. Sechs Bereiche, in denen wir täglich liefern.</p></Reveal>
        </div>
        <Reveal>
          <div className="leistungen">
            {LUCENT_SERVICES.map((s) => (
              <a className="leistung" key={s.slug} href={`leistungen-${s.slug}.html`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="num">{s.n} / 06</div>
                <div className="corner">→</div>
                <h3>{s.title}</h3>
                <p>{s.tagline}</p>
                <div className="tags">{s.tags.slice(0, 3).map((t) => <span key={t}>{t}</span>)}</div>
                <div className="viz"><ServiceMockup kind={s.vizKind} /></div>
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <a href="leistungen.html" className="btn btn-ghost btn-mono">$ alle leistungen im detail →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Why us (dark) ---------- */
function ConsoleLive() {
  const [logs, setLogs] = React.useState([]);
  React.useEffect(() => {
    const lines = [
      ["09:14:02", "INFO", "Deployment gestartet → produktion-eu"],
      ["09:14:03", "INFO", "Image wird gebaut lucent/flow:4.2"],
      ["09:14:11", "INFO", "412 Tests laufen..."],
      ["09:14:18", "OK", "Tests bestanden (412/412)"],
      ["09:14:22", "INFO", "Artifact wird signiert (cosign)"],
      ["09:14:25", "OK", "Rollout 25% → ok"],
      ["09:14:31", "OK", "Rollout 100% → ok"],
      ["09:14:32", "OK", "Deployment fertig in 30s"],
      ["09:14:48", "INFO", "Healthchecks passen"],
      ["09:15:02", "WARN", "p99 latency: 84ms (Limit 100ms)"],
    ];
    let i = 0;
    const id = setInterval(() => {
      setLogs((l) => [...l.slice(-8), lines[i % lines.length]]);
      i++;
    }, 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="console">
      <div className="head">
        <span>~/lucent/audit.log</span>
        <span style={{ color: "#6ee7a7" }}>● streaming</span>
      </div>
      <div className="body">
        {logs.map((l, i) => (
          <div className="row" key={i}>
            <span className="ts">{l[0]}</span>
            <span className={l[1] === "OK" ? "ok" : l[1] === "WARN" ? "warn" : "info"}>{l[1]}</span>
            <span>{l[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeWarum() {
  const points = [
    { n: "01", t: "Senior bei jedem Schritt", d: "Keine Praktikanten am Steuer. Jede Zeile Code, jeder Architekturentscheid wird von erfahrenen Entwickler:innen verantwortet." },
    { n: "02", t: "Code, den ihr behalten könnt", d: "Saubere Architektur, vollständige Dokumentation, kein Lock-in. Wenn ihr uns rausschmeißt, läuft alles weiter — versprochen." },
    { n: "03", t: "Wöchentliche Demos, keine Theatervorstellungen", d: "Echte Software, echte Daten, echte Nutzer:innen. Statt 80-Folien-Status­berichten zeigen wir, was funktioniert." },
    { n: "04", t: "Messbar oder nichts", d: "Jedes Projekt bekommt eine handvoll KPIs, an denen es sich messen lassen muss. Performance, Conversion, Time-to-Ship — eure Wahl." },
  ];
  return (
    <section id="warum" className="dark-section">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">WARUM LUCENT</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Warum mit uns arbeiten?</h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Wir sind klein, schnell und kompromisslos in der Qualität. Vier Dinge, an denen sich unsere Arbeit unterscheidet:</p></Reveal>
        </div>
        <div className="warum-grid">
          <Reveal>
            <div className="warum-points">
              {points.map((p) => (
                <div className="warum-point" key={p.n}>
                  <span className="n">{p.n}</span>
                  <div>
                    <h4>{p.t}</h4>
                    <p>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ConsoleLive />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cases preview ---------- */
function HomeCases() {
  const featured = LUCENT_CASES.slice(0, 4);
  return (
    <section id="cases" style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">CASES · AUSGEWÄHLTE PROJEKTE</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Software, die <em>geliefert hat.</em></h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Eine kleine Auswahl aus den letzten Jahren. NDAs verbieten Klar-Namen — Zahlen dürfen wir zeigen, illustrativ.</p></Reveal>
        </div>
        <Reveal>
          <div className="cases">
            {featured.map((c) => (
              <a className="case" key={c.slug} href={`cases-${c.slug}.html`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
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
            ))}
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <a href="cases.html" className="btn btn-ghost btn-mono">$ alle cases ansehen →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Process preview ---------- */
function HomeProcess() {
  const steps = LUCENT_PROCESS.slice(0, 4);
  return (
    <section id="prozess">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">PROZESS · 07 PHASEN</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">So <em>arbeiten</em> wir.</h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Unsere Arbeitsweise ist transparent und vorhersehbar. Sieben Phasen, von Discovery bis Skalierung — vier davon hier kurz angerissen.</p></Reveal>
        </div>
        <div className="prozess-grid">
          <Reveal>
            <div className="prozess-list">
              {steps.map((s) => (
                <a key={s.slug} className="prozess-step" href={`process.html#${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <span className="n">{s.n}</span>
                  <div>
                    <h4>{s.t}</h4>
                    <p>{s.desc}</p>
                  </div>
                  <span className="time">{s.time}</span>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ProzessDeploy />
          </Reveal>
        </div>
        <Reveal delay={160}>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <a href="process.html" className="btn btn-ghost btn-mono">$ vollen prozess ansehen →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProzessDeploy() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, []);
  const rows = [
    { l: "discover", v: "2 w" },
    { l: "prototype", v: "3 w" },
    { l: "build", v: "8–16 w" },
    { l: "operate", v: "ongoing" },
  ];
  return (
    <div className="prozess-deploy">
      <div className="head">
        <span style={{ color: "rgba(245,242,236,0.6)" }}>~/lucent/process</span>
        <span style={{ color: "#6ee7a7" }}>● aktiv</span>
      </div>
      <div style={{ paddingTop: 16, color: "rgba(245,242,236,0.5)", fontSize: 11.5 }}>
        $ lucent run --phase=all
      </div>
      <div className="pipeline">
        {rows.map((r, i) => (
          <div className="pipe-row" key={r.l}>
            <span style={{ color: "rgba(245,242,236,0.7)" }}>{r.l}</span>
            <div className="bar"><div key={tick + i} style={{ animationDelay: `${i * 0.25}s` }} /></div>
            <span className="stat">{r.v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 11 }}>
        <div><div style={{ color: "rgba(245,242,236,0.5)" }}>velocity</div><div style={{ color: "var(--gold)", fontSize: 18, marginTop: 4 }}>4.2 ★</div></div>
        <div><div style={{ color: "rgba(245,242,236,0.5)" }}>delivery</div><div style={{ color: "var(--gold)", fontSize: 18, marginTop: 4 }}>100%</div></div>
        <div><div style={{ color: "rgba(245,242,236,0.5)" }}>kpi met</div><div style={{ color: "var(--gold)", fontSize: 18, marginTop: 4 }}>11/12</div></div>
      </div>
    </div>
  );
}

/* ---------- Mount ---------- */
function HomeApp() {
  return (
    <PageShell current="home">
      <HomeHero />
      <StackMarquee />
      <ProductExamples />
      <HomeServices />
      <HomeWarum />
      <HomeCases />
      <HomeProcess />
      <FAQSection items={LUCENT_FAQS.slice(0, 5)} subtitle="Was Stakeholder vor dem ersten Gespräch wissen wollen. Vollständige FAQ auf der Kontakt-Seite." />
      <CTASection />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomeApp />);
