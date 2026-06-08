/* Lucent v2 — agency-style layout, German copy */
const { useState, useEffect, useRef, useMemo } = React;

function useInView(ref, opts = { rootMargin: "-10% 0px" }) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return seen;
}

function Reveal({ children, delay = 0, as: As = "div", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <As ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`}
       style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </As>
  );
}

function Scramble({ text, className = "" }) {
  const [val, setVal] = useState(text);
  const running = useRef(false);
  const chars = "!<>-_\\/[]{}—=+*^?#01";
  const trigger = () => {
    if (running.current) return;
    running.current = true;
    let frame = 0;
    const total = 10;
    const id = setInterval(() => {
      const out = text.split("").map((c, i) => {
        if (c === " ") return " ";
        if (frame / total > i / text.length) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      setVal(out);
      frame++;
      if (frame > total + text.length) { clearInterval(id); setVal(text); running.current = false; }
    }, 26);
  };
  return <span className={`scramble ${className}`} onMouseEnter={trigger}>{val}</span>;
}

function Magnetic({ children, strength = 14, className = "", ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <span ref={ref} className={`mag ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </span>
  );
}

function TypedTerminal({ lines, speed = 18, startDelay = 200, loop = true }) {
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
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

/* -------- Nav -------- */
function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#" className="brand">
          <span className="mark">L</span>
          <b>Lucent</b>
          <span className="tag">Software Studio</span>
        </a>
        <nav className="nav-links">
          <a href="#leistungen"><Scramble text="Leistungen" /></a>
          <a href="#warum"><Scramble text="Warum wir" /></a>
          <a href="#fuer-wen"><Scramble text="Für wen" /></a>
          <a href="#cases"><Scramble text="Cases" /></a>
          <a href="#prozess"><Scramble text="Prozess" /></a>
          <span className="status"><span className="dot" /> verfügbar Q2/26</span>
          <a href="#kontakt" className="nav-cta">
            Projekt starten <span className="arrow">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* -------- Hero -------- */
function Hero() {
  const lines = useMemo(() => [
    {
      text: "$ lucent init --client neue-kunde",
      render: (t) => <><span className="term-prompt">$</span>{t.replace("$","")}</>,
      pause: 260,
    },
    {
      text: "→ Architektur wird geplant.......... ok",
      render: (t) => {
        const ok = t.endsWith("ok");
        return <><span className="term-arrow">→</span>{t.replace("→","").replace(/ok$/,"")}{ok && <span className="term-ok">ok</span>}</>;
      },
      pause: 180,
    },
    {
      text: "→ Prototyp wird gebaut.............. ok",
      render: (t) => {
        const ok = t.endsWith("ok");
        return <><span className="term-arrow">→</span>{t.replace("→","").replace(/ok$/,"")}{ok && <span className="term-ok">ok</span>}</>;
      },
      pause: 200,
    },
    {
      text: "→ Tests laufen (412/412)............ ok",
      render: (t) => {
        const ok = t.endsWith("ok");
        return <><span className="term-arrow">→</span>{t.replace("→","").replace(/ok$/,"")}{ok && <span className="term-ok">ok</span>}</>;
      },
      pause: 220,
    },
    { text: "", pause: 200 },
    {
      text: "// von der Idee zum Produkt — in Tagen.",
      render: (t) => <span className="term-comment">{t}</span>,
      pause: 600,
    },
    {
      text: "$ lucent deploy --to production",
      render: (t) => <><span className="term-prompt">$</span>{t.replace("$","")}</>,
      pause: 240,
    },
    {
      text: "✔ build  ✔ sign  ✔ rollout 100%",
      render: (t) => <span className="term-ok">{t}</span>,
      pause: 1400,
    },
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
              Systeme, die <span className="underline-gold">liefern.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Wir sind ein Software Studio aus Ulm. Wir entwickeln Tools, Plattformen
              und individuelle Software für Unternehmen, die schnell, sauber und messbar
              ausliefern wollen — vom Prototyp bis zur produktiven Plattform.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="hero-ctas">
              <Magnetic>
                <a href="#kontakt" className="btn btn-primary">
                  Unverbindliches Gespräch <span className="arrow">→</span>
                </a>
              </Magnetic>
              <Magnetic strength={8}>
                <a href="#leistungen" className="btn btn-ghost btn-mono">
                  $ alle leistungen
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-trust">
              <div>
                <div className="label">Vertraut von</div>
                <div className="clients">
                  <span>Helios&nbsp;GmbH</span>
                  <span>Nord-Werk</span>
                  <span>Vault.io</span>
                  <span>+ 12 weitere</span>
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

/* -------- Tech marquee -------- */
function StackMarquee() {
  const items = [
    "TypeScript", "Rust", "Go", "Python", "Postgres", "Kafka", "Kubernetes",
    "Terraform", "ClickHouse", "Redis", "GraphQL", "Next.js", "Svelte",
    "WebAssembly", "Bun", "DuckDB", "OpenTelemetry", "AWS", "Docker"
  ];
  return (
    <div className="stack">
      <div className="stack-track">
        {[...items, ...items].map((it, i) => <span className="item" key={i}>{it}</span>)}
      </div>
    </div>
  );
}

/* -------- Leistungen (Services) -------- */
function LeistungViz({ kind }) {
  if (kind === "engineering") {
    return (
      <div className="mini-code-box">
        <div><span className="token-c">// build.ts</span></div>
        <div><span className="token-k">export</span> <span className="token-f">ship</span>(<span className="token-s">"v4.2"</span>)</div>
      </div>
    );
  }
  if (kind === "platform") {
    return (
      <div style={{ display: "flex", gap: 6, height: "100%", alignItems: "flex-end" }}>
        {[40, 65, 30, 80, 55, 70, 38].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, background: "var(--navy)", borderRadius: 3, opacity: 0.4 + (i % 3) * 0.2 }} />
        ))}
      </div>
    );
  }
  if (kind === "ai") {
    return (
      <svg viewBox="0 0 200 80" style={{ width: "100%", height: "100%" }}>
        {[0,1,2,3,4].map(col =>
          [0,1,2].map(row => (
            <circle key={`${col}-${row}`} cx={20 + col * 40} cy={15 + row * 25} r="3" fill="#1E2646" opacity={0.3 + Math.random() * 0.5}>
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1.5 + row * 0.3 + col * 0.1}s`} repeatCount="indefinite" />
            </circle>
          ))
        )}
        {[0,1,2,3].map(col =>
          [0,1].map(row => (
            <line key={`l${col}-${row}`} x1={20 + col * 40} y1={15 + row * 25} x2={20 + (col + 1) * 40} y2={15 + (row + 1) * 25}
                  stroke="#D4A857" strokeWidth="0.5" opacity="0.3" />
          ))
        )}
      </svg>
    );
  }
  if (kind === "data") {
    return (
      <svg viewBox="0 0 200 80" style={{ width: "100%", height: "100%" }}>
        <polyline points="0,60 30,45 60,52 90,30 120,38 150,20 180,28 200,12"
                  fill="none" stroke="#1E2646" strokeWidth="2" />
        <polyline points="0,60 30,45 60,52 90,30 120,38 150,20 180,28 200,12"
                  fill="none" stroke="#D4A857" strokeWidth="2" strokeDasharray="200 200">
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite" />
        </polyline>
      </svg>
    );
  }
  if (kind === "design") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, height: "100%" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{
            background: i % 5 === 0 ? "var(--gold)" : "var(--navy)",
            opacity: i % 5 === 0 ? 0.9 : (0.15 + Math.random() * 0.3),
            borderRadius: 2
          }} />
        ))}
      </div>
    );
  }
  // integration
  return (
    <svg viewBox="0 0 200 80" style={{ width: "100%", height: "100%" }}>
      <g stroke="#1E2646" strokeWidth="1" fill="none">
        <rect x="10" y="20" width="40" height="40" rx="6" />
        <rect x="80" y="20" width="40" height="40" rx="6" />
        <rect x="150" y="20" width="40" height="40" rx="6" />
        <line x1="50" y1="40" x2="80" y2="40" strokeDasharray="2 3" />
        <line x1="120" y1="40" x2="150" y2="40" strokeDasharray="2 3" />
      </g>
      <circle cx="65" cy="40" r="2" fill="#D4A857">
        <animate attributeName="cx" values="50;80;50" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="135" cy="40" r="2" fill="#D4A857">
        <animate attributeName="cx" values="120;150;120" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Leistungen() {
  const items = [
    { n: "01", title: "Custom Software", desc: "Maßgeschneiderte Anwendungen, Web-Apps und interne Tools. Vom Konzept zur Produktivversion.", tags: ["Web-Apps", "SaaS", "Backend"], kind: "engineering" },
    { n: "02", title: "Plattform & DevOps", desc: "Internal Developer Platforms, CI/CD und Observability — die Infrastruktur, die euer Team schneller macht.", tags: ["K8s", "CI/CD", "Cloud"], kind: "platform" },
    { n: "03", title: "Applied AI", desc: "KI-Integration, RAG-Pipelines, Agenten und Evaluierung. KI im Produktiveinsatz statt auf Folien.", tags: ["LLMs", "RAG", "Eval"], kind: "ai" },
    { n: "04", title: "Daten & Analytics", desc: "Data-Pipelines, Data-Warehouses und Dashboards. Aus Rohdaten messbare Entscheidungen.", tags: ["ETL", "BI", "Warehouse"], kind: "data" },
    { n: "05", title: "API & Integrationen", desc: "Sauber dokumentierte APIs und Integrationen zwischen euren Systemen — ohne Kabelsalat.", tags: ["REST", "GraphQL", "Webhooks"], kind: "integration" },
    { n: "06", title: "Design Systems", desc: "Token-basierte Design-Systeme und Component Libraries. Pixelgenau, skalierbar, langlebig.", tags: ["Figma", "Tokens", "Storybook"], kind: "design" },
  ];
  return (
    <section id="leistungen">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">LEISTUNGEN · 06</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Unsere Leistungen als <em>Software Studio.</em></h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Vom Prototyp bis zur produktiven Plattform: wir bauen Software, die euer Team weiterbringt — und Code, den nachfolgende Teams gerne übernehmen.</p></Reveal>
        </div>
        <Reveal>
          <div className="leistungen">
            {items.map((s) => (
              <div className="leistung" key={s.n}>
                <div className="num">{s.n} / 06</div>
                <div className="corner">→</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="viz"><LeistungViz kind={s.kind} /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------- Warum (Why us, dark section) -------- */
function ConsoleLive() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
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

function Warum() {
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

/* -------- Für wen (Industries) -------- */
function FuerWen() {
  const items = [
    { i: "{ }", t: "SaaS & Startups", d: "Von der Pre-Seed-MVP bis zur Series-B-Skalierung.", l: "Startup · Scale-up" },
    { i: "$", t: "Fintech", d: "Compliance-fähige Plattformen, Zahlungsabwicklung, Reporting.", l: "BaFin · PSD2 · ISO 27001" },
    { i: "▣", t: "E-Commerce", d: "Headless-Setups, Custom Storefronts, B2B-Portale.", l: "Headless · D2C · B2B" },
    { i: "⚙", t: "Industrie & B2B", d: "MES, IIoT, interne Tools für Produktion und Vertrieb.", l: "Mittelstand · Industrie 4.0" },
    { i: "♡", t: "Health & MedTech", d: "Datenschutzkonforme Lösungen für Versorger und Anbieter.", l: "DSGVO · HL7 · MDR" },
    { i: "⬢", t: "Logistik", d: "Tracking, Routing, ERP-Anbindungen mit echter Time-on-Floor-Wirkung." , l: "TMS · WMS · OMS" },
    { i: "✦", t: "Bildung & Public", d: "Plattformen für Schulen, Behörden, gemeinnützige Träger." , l: "Public · NGO" },
    { i: "+", t: "Andere?", d: "Jede Branche, in der Software ein Hebel ist. Erzählt uns davon.", l: "Erstgespräch · 30 min" },
  ];
  return (
    <section id="fuer-wen">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">FÜR WEN</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Für wen wir bauen.</h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Wir arbeiten branchenübergreifend mit Unternehmen aus Ulm, Neu-Ulm und ganz Deutschland — vom Startup über den Mittelstand bis zur etablierten Marke.</p></Reveal>
        </div>
        <Reveal>
          <div className="fuer-wen">
            {items.map((it, i) => (
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
  );
}

/* -------- Cases -------- */
function CaseViz({ kind }) {
  if (kind === "code") {
    return (
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--navy)", lineHeight: 1.65 }}>
        <div><span style={{ color: "#c2410c" }}>const</span> <span style={{ color: "#1d4ed8" }}>order</span> = <span style={{ color: "#1d4ed8" }}>await</span> checkout(cart)</div>
        <div><span style={{ color: "#c2410c" }}>const</span> ship = <span style={{ color: "#1d4ed8" }}>await</span> fulfill(order)</div>
        <div><span style={{ color: "var(--muted)", fontStyle: "italic" }}>// avg. → 184ms · 14 ms p99 ↓</span></div>
        <div style={{ marginTop: 10, height: 6, background: "rgba(30,38,70,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg, var(--navy), var(--gold))", borderRadius: 3 }} />
        </div>
      </div>
    );
  }
  if (kind === "chart") {
    return (
      <svg viewBox="0 0 320 110" style={{ width: "100%", height: "100%" }}>
        <line x1="0" y1="100" x2="320" y2="100" stroke="rgba(30,38,70,0.2)" />
        <polyline points="0,85 40,80 80,72 120,60 160,52 200,38 240,30 280,20 320,12"
                  fill="none" stroke="var(--navy)" strokeWidth="2" />
        <polyline points="0,85 40,80 80,72 120,60 160,52 200,38 240,30 280,20 320,12"
                  fill="none" stroke="var(--gold)" strokeWidth="2"
                  strokeDasharray="400" strokeDashoffset="400">
          <animate attributeName="stroke-dashoffset" from="400" to="0" dur="2.4s" fill="freeze" />
        </polyline>
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((x, i) => {
          const ys = [85, 80, 72, 60, 52, 38, 30, 20, 12];
          return <circle key={i} cx={x} cy={ys[i]} r="3" fill="var(--navy)" />;
        })}
      </svg>
    );
  }
  // logs
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.7, color: "var(--navy)" }}>
      <div><span style={{ color: "var(--muted)" }}>[09:14] </span><span style={{ color: "#1d4ed8" }}>INFO</span> Audit: 412 Transaktionen verarbeitet</div>
      <div><span style={{ color: "var(--muted)" }}>[09:15] </span><span style={{ color: "#047857" }}>OK</span>   alle compliance checks bestanden</div>
      <div><span style={{ color: "var(--muted)" }}>[09:16] </span><span style={{ color: "#047857" }}>OK</span>   Reporting an BaFin übermittelt</div>
      <div><span style={{ color: "var(--muted)" }}>[09:17] </span><span style={{ color: "#1d4ed8" }}>INFO</span> Anomalie-Detektion: 0 Auffälligkeiten</div>
    </div>
  );
}

function Cases() {
  const cases = [
    { tag: "FINTECH · 2025", title: "Compliance-Plattform für eine Direktbank", desc: "Audit-Trail und automatisiertes BaFin-Reporting in einer Plattform — von 14 Tagen Reporting-Zyklus auf 2 Stunden.", metrics: [["−96%", "Reporting-Zeit"], ["100%", "Audit-Coverage"]], kind: "logs" },
    { tag: "E-COMMERCE · 2025", title: "Headless-Shop für eine Lifestyle-Marke", desc: "Custom Storefront, Headless-CMS und Search. Conversion und Performance gleichzeitig nach oben.", metrics: [["+42%", "Conversion-Rate"], ["1.2s", "LCP, mobil"]], kind: "chart" },
    { tag: "B2B / INDUSTRIE · 2024", title: "Interne Tools für einen Mittelständler", desc: "Drei Excel-Tabellen wurden eine Plattform. Vier Teams arbeiten heute auf denselben Daten.", metrics: [["+18h", "pro Woche/Team"], ["0", "Excel-Tabellen"]], kind: "code" },
    { tag: "AI · 2026", title: "RAG-Assistent für ein Beratungshaus", desc: "150.000 Mandate durchsuchbar in Sekunden. Mit Quellenangaben, ohne Halluzination.", metrics: [["3.2s", "ø Antwortzeit"], ["98%", "Antwort-Genauigkeit"]], kind: "chart" },
  ];
  return (
    <section id="cases" style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">CASES · AUSGEWÄHLTE PROJEKTE</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Software, die <em>geliefert hat.</em></h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Eine kleine Auswahl aus den letzten Jahren. NDAs verbieten Namen — Zahlen dürfen wir zeigen.</p></Reveal>
        </div>
        <Reveal>
          <div className="cases">
            {cases.map((c, i) => (
              <div className="case" key={i}>
                <div className="case-head">
                  <span className="industry-tag">{c.tag}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)" }}>→</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="case-viz"><CaseViz kind={c.kind} /></div>
                <div className="metrics">
                  {c.metrics.map((m, j) => (
                    <div className="metric" key={j}>
                      <div className="val">{m[0]}</div>
                      <div className="lab">{m[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------- Prozess -------- */
function ProzessDeploy() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
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

function Prozess() {
  const steps = [
    { n: "01", t: "Discover", d: "Tief in eure Codebasis, eure Nutzer:innen, eure Daten. Endet mit einer These, über die man streiten kann.", time: "~2 Wochen" },
    { n: "02", t: "Prototype", d: "Das Kleinste, das die Wette beweist. Echte Daten, echte Nutzer:innen — keine Design-Fiktion.", time: "~3 Wochen" },
    { n: "03", t: "Build", d: "Wöchentliche Demos, Trunk-based, Feature-Flags von Tag eins. Was wir zeigen, liefern wir.", time: "8–16 Wochen" },
    { n: "04", t: "Operate", d: "Übergabe mit Runbooks, Dashboards, Pager-Rotation — oder wir betreiben weiter. Eure Wahl.", time: "ongoing" },
  ];
  return (
    <section id="prozess">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">PROZESS · 04 PHASEN</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Vier Phasen. <em>Kein Theater.</em></h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Unsere Arbeitsweise ist transparent und vorhersehbar. Was wir versprechen, halten wir — und was wir nicht halten können, sagen wir vorher.</p></Reveal>
        </div>
        <div className="prozess-grid">
          <Reveal>
            <div className="prozess-list">
              {steps.map((s) => (
                <div className="prozess-step" key={s.n}>
                  <span className="n">{s.n}</span>
                  <div>
                    <h4>{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                  <span className="time">{s.time}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ProzessDeploy />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------- Kontakt -------- */
function Kontakt() {
  return (
    <section id="kontakt">
      <div className="wrap">
        <Reveal>
          <div className="kontakt">
            <div className="kontakt-grid">
              <div>
                <span className="section-eyebrow" style={{ color: "var(--gold)" }}>KONTAKT · /lass_uns_bauen</span>
                <h2 style={{ marginTop: 16 }}>
                  Bereit für Software,<br />
                  die <em>wirkt?</em>
                </h2>
                <p>
                  Schreib uns kurz, woran ihr arbeitet. Innerhalb eines Werktags
                  bekommt ihr eine Antwort — mit einer These, wie wir die Sache angehen
                  würden. Oder ob ihr uns wirklich braucht.
                </p>
                <div className="kontakt-row">
                  <Magnetic>
                    <a href="mailto:hallo@lucent.example" className="btn btn-primary">
                      hallo@lucent.example <span className="arrow">→</span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={8}>
                    <a href="#" className="btn btn-ghost btn-mono">
                      $ termin buchen
                    </a>
                  </Magnetic>
                </div>
              </div>
              <div className="contact-card">
                <div className="head">
                  <span>kontakt.json</span>
                  <span>● online</span>
                </div>
                <div className="field"><span className="k">studio</span><span className="v">Lucent GmbH</span></div>
                <div className="field"><span className="k">stadt</span><span className="v">Ulm · Remote</span></div>
                <div className="field"><span className="k">email</span><a href="mailto:hallo@lucent.example" className="v link">hallo@lucent.example</a></div>
                <div className="field"><span className="k">tel</span><span className="v">+49 731 000-000</span></div>
                <div className="field"><span className="k">stunden</span><span className="v">Mo–Fr · 09–18 Uhr</span></div>
                <div className="field"><span className="k">status</span><span className="v" style={{ color: "#6ee7a7" }}>● nimmt Q2/26 Projekte</span></div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------- Footer -------- */
function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="row">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <span className="mark">L</span><b style={{ color: "var(--cream)" }}>Lucent</b>
            </div>
            <p style={{ maxWidth: 320, lineHeight: 1.6 }}>
              Ein Software Studio aus Ulm. Wir bauen Tools, Plattformen und
              individuelle Software für Teams, die schneller liefern wollen.
            </p>
          </div>
          <div>
            <h5>Leistungen</h5>
            <ul>
              <li><a href="#leistungen">Custom Software</a></li>
              <li><a href="#leistungen">Plattform & DevOps</a></li>
              <li><a href="#leistungen">Applied AI</a></li>
              <li><a href="#leistungen">Daten & Analytics</a></li>
              <li><a href="#leistungen">Design Systems</a></li>
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li><a href="#warum">Warum wir</a></li>
              <li><a href="#prozess">Prozess</a></li>
              <li><a href="#cases">Cases</a></li>
              <li><a href="#">Writing</a></li>
            </ul>
          </div>
          <div>
            <h5>Kontakt</h5>
            <ul>
              <li><a href="#">hallo@lucent.example</a></li>
              <li><a href="#">+49 731 000-000</a></li>
              <li><a href="#">Ulm · Neu-Ulm</a></li>
              <li><a href="#">Impressum · Datenschutz</a></li>
            </ul>
          </div>
        </div>
        <div className="bottom-bar">
          <span>© 2026 Lucent Software GmbH</span>
          <span>build · {new Date().toISOString().slice(0, 10)} · commit a1b2c3d</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StackMarquee />
        <Leistungen />
        <Warum />
        <FuerWen />
        <Cases />
        <Prozess />
        <Kontakt />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
