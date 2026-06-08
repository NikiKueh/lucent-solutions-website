/* Lucent — main app */
const { useState, useEffect, useRef, useMemo } = React;

/* -------------------- Hooks & helpers -------------------- */

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

/* Scramble text on hover */
function Scramble({ text, className = "" }) {
  const [val, setVal] = useState(text);
  const ref = useRef(null);
  const running = useRef(false);
  const chars = "!<>-_\\/[]{}—=+*^?#01";
  const trigger = () => {
    if (running.current) return;
    running.current = true;
    let frame = 0;
    const total = 12;
    const id = setInterval(() => {
      const out = text.split("").map((c, i) => {
        if (c === " ") return " ";
        if (frame / total > i / text.length) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      setVal(out);
      frame++;
      if (frame > total + text.length) { clearInterval(id); setVal(text); running.current = false; }
    }, 28);
  };
  return <span ref={ref} className={`scramble ${className}`} onMouseEnter={trigger}>{val}</span>;
}

/* Magnetic button */
function Magnetic({ children, strength = 18, className = "", ...rest }) {
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

/* Typed code block (renders sequential lines, char-by-char) */
function TypedTerminal({ lines, speed = 18, startDelay = 200, loop = true }) {
  const [idx, setIdx] = useState(0); // which line
  const [pos, setPos] = useState(0); // chars typed in current line
  const [done, setDone] = useState(false);
  useEffect(() => {
    let to;
    const start = setTimeout(function tick() {
      if (idx >= lines.length) {
        if (loop) {
          to = setTimeout(() => { setIdx(0); setPos(0); setDone(false); }, 2400);
          return;
        }
        setDone(true); return;
      }
      const text = lines[idx].text || "";
      if (pos < text.length) {
        setPos((p) => p + 1);
        to = setTimeout(tick, lines[idx].instant ? 0 : speed + Math.random() * 30);
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

/* -------------------- Page sections -------------------- */

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#" className="brand">
          <span className="mark">L</span>
          <b>Lucent</b>
          <span className="tag">v4.2.1</span>
        </a>
        <nav className="nav-links">
          <a href="#products"><Scramble text="Products" /></a>
          <a href="#services"><Scramble text="Services" /></a>
          <a href="#process"><Scramble text="Process" /></a>
          <a href="#stack"><Scramble text="Stack" /></a>
          <span style={{ width: 8 }} />
          <span className="status"><span className="dot" /> All systems operational</span>
          <span style={{ width: 8 }} />
          <a href="#contact" className="nav-cta">
            Book a call
            <span className="arrow">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const heroLines = useMemo(() => [
    {
      text: "$ lucent init --workspace acme-corp",
      render: (t) => (<><span className="term-prompt">$</span>{t.replace("$","")}</>),
      pause: 280,
    },
    {
      text: "→ provisioning environment...   ok",
      render: (t) => {
        const ok = t.endsWith("ok");
        return (<><span className="term-arrow">→</span>{t.replace("→","").replace(/ok$/, "")}{ok && <span className="term-ok">ok</span>}</>);
      },
      pause: 180,
    },
    {
      text: "→ linking 14 services, 312 endpoints... ok",
      render: (t) => {
        const ok = t.endsWith("ok");
        return (<><span className="term-arrow">→</span>{t.replace("→","").replace(/ok$/, "")}{ok && <span className="term-ok">ok</span>}</>);
      },
      pause: 200,
    },
    {
      text: "→ deploying lucent.workflow.engine     ok",
      render: (t) => {
        const ok = t.endsWith("ok");
        return (<><span className="term-arrow">→</span>{t.replace("→","").replace(/ok$/, "")}{ok && <span className="term-ok">ok</span>}</>);
      },
      pause: 320,
    },
    { text: "", pause: 200 },
    {
      text: "// shipped in 11 minutes. zero downtime.",
      render: (t) => <span className="term-comment">{t}</span>,
      pause: 600,
    },
    {
      text: "$ lucent ship --to production",
      render: (t) => (<><span className="term-prompt">$</span>{t.replace("$","")}</>),
      pause: 280,
    },
    {
      text: "✔ build  ✔ test  ✔ sign  ✔ rollout",
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
              <span className="pill">NEW</span>
              <span>Lucent 4.2 — workflow engine, now self-hosted</span>
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display">
              Software that <em>thinks</em>.<br />
              Systems that <span className="underline-handwritten">ship themselves.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              We build the developer tools and bespoke software platforms behind
              fast-moving product teams. Less ceremony, more shipping —
              from prototype to production in days, not quarters.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="hero-ctas">
              <Magnetic>
                <a href="#contact" className="btn btn-primary">
                  Start a project <span className="arrow">→</span>
                </a>
              </Magnetic>
              <Magnetic strength={10}>
                <a href="#products" className="btn btn-ghost">
                  <span>$</span> explore products
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-meta">
              <div className="row"><b>140+</b><span>products shipped</span></div>
              <div className="row"><b>11 min</b><span>median deploy time</span></div>
              <div className="row"><b>99.99%</b><span>uptime SLO</span></div>
              <div className="row"><b>$2.4B</b><span>in transactions handled</span></div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div style={{ position: "relative" }}>
            <div className="float-chip" style={{ top: -18, left: -22, transform: "rotate(-3deg)" }}>
              <span style={{ color: "var(--mint)" }}>●</span> deploy.yaml
            </div>
            <div className="float-chip" style={{ bottom: -16, right: -10, transform: "rotate(2deg)" }}>
              <span style={{ color: "var(--violet)" }}>{`{ }`}</span> 312 endpoints linked
            </div>
            <div className="terminal">
              <div className="term-bar">
                <div className="lights"><span /><span /><span /></div>
                <div className="title">~/lucent/acme-corp — zsh</div>
                <div className="tabs">
                  <span className="active">main</span>
                  <span>logs</span>
                  <span>graph</span>
                </div>
              </div>
              <div className="term-body">
                <TypedTerminal lines={heroLines} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Tech stack scrolling row */
function StackMarquee() {
  const items = [
    "TypeScript", "Rust", "Go", "Python", "Postgres", "Kafka", "Kubernetes",
    "Terraform", "ClickHouse", "Redis", "GraphQL", "gRPC", "Temporal",
    "Next.js", "Svelte", "WebAssembly", "Bun", "DuckDB", "OpenTelemetry"
  ];
  const doubled = [...items, ...items];
  return (
    <div className="stack" id="stack">
      <div className="stack-track">
        {doubled.map((it, i) => (
          <span className="item" key={i}>
            <span className="dot" style={{ width: 6, height: 6, animation: "none", boxShadow: "none" }} />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Services */
function ServiceViz({ kind }) {
  if (kind === "engineering") {
    return (
      <div className="mini-code">
        <div><span className="ln">01</span><span className="token-c">// component.tsx</span></div>
        <div><span className="ln">02</span><span className="token-k">export const</span> <span className="token-f">Button</span> = ({"{ "}<span className="token-v">children</span>{" }"}) {"=>"} (</div>
        <div><span className="ln">03</span>  {"<"}<span className="token-p">button</span> <span className="token-v">className</span>=<span className="token-s">"btn"</span>{">"}</div>
        <div><span className="ln">04</span>    {"{children}"}</div>
        <div><span className="ln">05</span>  {"</"}<span className="token-p">button</span>{">"}</div>
        <div><span className="ln">06</span>)</div>
      </div>
    );
  }
  if (kind === "platform") {
    return (
      <div className="pipeline">
        <div className="pipe-row"><span className="label">api / auth</span><div className="bar"><div style={{ animationDelay: "0s" }} /></div><span className="stat">312ms</span></div>
        <div className="pipe-row"><span className="label">workers</span><div className="bar"><div style={{ animationDelay: ".4s" }} /></div><span className="stat">1.2k/s</span></div>
        <div className="pipe-row"><span className="label">storage</span><div className="bar"><div style={{ animationDelay: ".8s" }} /></div><span className="stat">ok</span></div>
      </div>
    );
  }
  if (kind === "design") {
    return (
      <div style={{ display: "flex", gap: 10, height: "100%", alignItems: "flex-end" }}>
        {[44, 70, 30, 92, 58, 80, 36, 64].map((h, i) => (
          <div key={i} style={{
            flex: 1, height: `${h}%`,
            background: i % 2 ? "var(--violet)" : "var(--mint)",
            borderRadius: 3, opacity: 0.85,
            animation: `pulse 2.4s ${i * 0.18}s ease-in-out infinite alternate`
          }} />
        ))}
      </div>
    );
  }
  // ai
  return (
    <svg viewBox="0 0 280 120" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="ln1" x1="0" x2="1">
          <stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#5eead4" />
        </linearGradient>
      </defs>
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 20 + i * 40;
        return <g key={i}>
          <circle cx={x} cy={20} r="3" fill="#a78bfa"><animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" /></circle>
          <circle cx={x} cy={60} r="3" fill="#5eead4"><animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.7 + i * 0.18}s`} repeatCount="indefinite" /></circle>
          <circle cx={x} cy={100} r="3" fill="#a78bfa"><animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.3 + i * 0.22}s`} repeatCount="indefinite" /></circle>
        </g>;
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const x1 = 20 + i * 40, x2 = 20 + (i + 1) * 40;
        return <g key={`l${i}`} stroke="url(#ln1)" strokeOpacity="0.25" strokeWidth="1">
          <line x1={x1} y1="20" x2={x2} y2="60" />
          <line x1={x1} y1="60" x2={x2} y2="20" />
          <line x1={x1} y1="60" x2={x2} y2="100" />
          <line x1={x1} y1="100" x2={x2} y2="60" />
        </g>;
      })}
    </svg>
  );
}

function Services() {
  const items = [
    { n: "01", title: "Product engineering", desc: "Full-stack squads that own outcomes — from kickoff to production. Built like a senior product team.", tags: ["TypeScript", "React", "Rust", "Postgres"], kind: "engineering" },
    { n: "02", title: "Platform & infrastructure", desc: "Internal developer platforms, CI/CD, observability and the boring-by-design infra that lets you move fast.", tags: ["Kubernetes", "Terraform", "OpenTelemetry"], kind: "platform" },
    { n: "03", title: "Applied AI", desc: "RAG pipelines, agent orchestration, evaluation harnesses. Models in production, not in slides.", tags: ["LLMs", "Vector DBs", "Eval"], kind: "ai" },
    { n: "04", title: "Design systems", desc: "Token-driven systems, component libraries and the design-engineering loop that ships pixel-perfect.", tags: ["Figma", "Tokens", "Storybook"], kind: "design" },
  ];
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">SERVICES · /capabilities</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">A studio with the discipline of a product team.</h2></Reveal>
          <Reveal delay={160}><p className="section-sub">We embed with your team or run as an external squad. Either way, we ship on a real cadence with metrics that hold up under scrutiny.</p></Reveal>
        </div>
        <Reveal>
          <div className="services">
            {items.map((s) => (
              <div className="service" key={s.n}>
                <div className="num"><span>{s.n} / 04</span><span style={{ color: "var(--muted)" }}>./{s.kind}</span></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="viz"><ServiceViz kind={s.kind} /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Products */
function ProductEditor() {
  return (
    <div className="pv">
      <div className="editor">
        <div className="tabs">
          <span className="tab active">workflow.ts</span>
          <span className="tab">queue.rs</span>
          <span className="tab">README.md</span>
        </div>
        <div className="lines">
          <div className="lnum">
            {Array.from({ length: 11 }).map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <div className="lcode">
            <div><span className="token-c">// auto-generated. edit lucent.flow</span></div>
            <div><span className="token-k">import</span> {"{"} <span className="token-f">defineWorkflow</span> {"}"} <span className="token-k">from</span> <span className="token-s">"@lucent/core"</span></div>
            <div> </div>
            <div><span className="token-k">export default</span> <span className="token-f">defineWorkflow</span>({"{"}</div>
            <div>  <span className="token-v">id</span>: <span className="token-s">"acme.onboarding"</span>,</div>
            <div>  <span className="token-v">trigger</span>: <span className="token-s">"signup.completed"</span>,</div>
            <div>  <span className="token-v">steps</span>: [</div>
            <div>    <span className="token-f">step</span>(<span className="token-s">"verify_email"</span>, {"{"} <span className="token-v">timeout</span>: <span className="token-n">3000</span> {"}"}),</div>
            <div>    <span className="token-f">step</span>(<span className="token-s">"provision"</span>).<span className="token-f">retry</span>(<span className="token-n">3</span>),</div>
            <div>    <span className="token-f">step</span>(<span className="token-s">"notify_slack"</span>),</div>
            <div>  ],</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPipeline() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);
  const rows = [
    { l: "ingest.kafka", v: "1.2M/s" },
    { l: "transform", v: "queued" },
    { l: "enrich.geo", v: "ok" },
    { l: "warehouse", v: "12 GB" },
    { l: "dashboard", v: "live" },
  ];
  return (
    <div className="pv">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, color: "var(--muted)" }}>
        <span>pipeline · production</span>
        <span style={{ color: "var(--mint)" }}>● streaming</span>
      </div>
      <div className="pipeline">
        {rows.map((r, i) => (
          <div className="pipe-row" key={r.l}>
            <span className="label">{r.l}</span>
            <div className="bar"><div key={tick + i} style={{ animationDelay: `${i * 0.18}s` }} /></div>
            <span className="stat">{r.v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { k: "p50", v: "12ms" }, { k: "p99", v: "84ms" }, { k: "err", v: "0.001%" }
        ].map((m) => (
          <div key={m.k} style={{ padding: 10, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6 }}>
            <div style={{ color: "var(--muted)", fontSize: 11 }}>{m.k}</div>
            <div style={{ color: "var(--mint)", fontSize: 16, marginTop: 4 }}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductGraph() {
  const nodes = useMemo(() => {
    return Array.from({ length: 16 }).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100,
      r: 2 + Math.random() * 3
    }));
  }, []);
  return (
    <div className="pv">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--muted)" }}>
        <span>graph · service mesh</span>
        <span style={{ color: "var(--violet)" }}>14 services</span>
      </div>
      <div className="graph">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {nodes.map((a, i) => nodes.map((b, j) => {
            if (j <= i) return null;
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > 28) return null;
            return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={d < 18 ? "#a78bfa" : "#5eead4"} strokeOpacity={Math.max(0, 0.5 - d / 60)} strokeWidth="0.2" />;
          }))}
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r * 0.4} fill={i % 3 ? "#a78bfa" : "#5eead4"}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
        <div>ingress → checkout → fulfillment</div>
        <div style={{ textAlign: "right", color: "var(--mint)" }}>healthy · 312 RPS</div>
      </div>
    </div>
  );
}

function Products() {
  const list = [
    {
      meta: ["PRODUCT 01", "/workflow"],
      title: "Flow — the workflow engine for builders",
      desc: "Define long-running workflows in code, run them anywhere. Durable steps, typed retries, automatic observability. The orchestration layer your services were missing.",
      bullets: [
        "Durable execution across restarts",
        "TypeScript-first DSL with full type safety",
        "Self-hostable, runs on your infra",
        "Observability built in — no extra wiring",
      ],
      viz: <ProductEditor />
    },
    {
      meta: ["PRODUCT 02", "/pipe"],
      title: "Pipe — event streaming made boring",
      desc: "A managed streaming runtime that connects your databases, queues and warehouses. Low-code transforms, exactly-once guarantees, p99 you can plan around.",
      bullets: [
        "100+ source & destination connectors",
        "Exactly-once delivery semantics",
        "SQL transforms with live preview",
        "Sub-second p50 end-to-end latency",
      ],
      viz: <ProductPipeline />
    },
    {
      meta: ["PRODUCT 03", "/mesh"],
      title: "Mesh — your services, finally legible",
      desc: "An auto-generated service graph for your stack. Trace requests across teams, spot dependencies before they bite, and ship changes with confidence.",
      bullets: [
        "Zero-config service discovery",
        "Distributed tracing out of the box",
        "Dependency impact analysis on PRs",
        "OpenTelemetry-native — no vendor lock-in",
      ],
      viz: <ProductGraph />
    }
  ];
  return (
    <section id="products">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">PRODUCTS · /tools</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Three tools, one philosophy:<br/>code-first, infra-light, ship-ready.</h2></Reveal>
          <Reveal delay={160}><p className="section-sub">Each one started as a thing we needed at a client and refused to glue together from five SaaS subscriptions.</p></Reveal>
        </div>
        <div className="products">
          {list.map((p, i) => (
            <Reveal key={i}>
              <div className="product">
                <div>
                  <div className="meta">{p.meta.map((m, j) => <span key={j}>{m}</span>)}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <ul>{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  <div className="cta-row">
                    <a className="btn btn-primary" href="#contact">Read docs <span className="arrow">→</span></a>
                    <a className="btn btn-ghost" href="#contact">$ install</a>
                  </div>
                </div>
                <div>{p.viz}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Discover", d: "Two-week dive: read the code, talk to users, draw the system. Ends with a thesis you can argue with.", icon: "?" },
    { n: "02", t: "Prototype", d: "Smallest thing that proves the bet. Real data, real users, no design fiction.", icon: "</>" },
    { n: "03", t: "Build", d: "Weekly demos, trunk-based, feature flags from day one. We ship what we show.", icon: "▶" },
    { n: "04", t: "Operate", d: "Hand-off includes runbooks, dashboards and a paging rotation. Or we keep operating it — your call.", icon: "∞" },
  ];
  return (
    <section id="process">
      <div className="wrap">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">PROCESS · /how_we_work</span></Reveal>
          <Reveal delay={80}><h2 className="section-title">Four phases. No theatre.</h2></Reveal>
        </div>
        <Reveal>
          <div className="process">
            {steps.map((s) => (
              <div className="step" key={s.n}>
                <div>
                  <div className="icon">{s.icon}</div>
                  <div className="stepno">PHASE {s.n}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginTop: 14 }}>
                  ~{["2w", "3w", "8-16w", "ongoing"][parseInt(s.n) - 1]}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ConsoleFeed() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const lines = [
      ["20:14:02", "INFO", "deploy started → production-eu"],
      ["20:14:03", "INFO", "building image lucent/flow:4.2.1"],
      ["20:14:11", "INFO", "running 412 tests..."],
      ["20:14:18", "OK  ", "tests passed (412/412)"],
      ["20:14:22", "INFO", "signing artifact (cosign)"],
      ["20:14:25", "OK  ", "rollout 25% → ok"],
      ["20:14:31", "OK  ", "rollout 100% → ok"],
      ["20:14:32", "OK  ", "deploy complete in 30s"],
    ];
    let i = 0;
    const id = setInterval(() => {
      setLogs((l) => [...l.slice(-5), lines[i % lines.length]]);
      i++;
    }, 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="console-feed">
      <div className="head">
        <span>~/lucent.log</span>
        <span style={{ color: "var(--mint)" }}>● live</span>
      </div>
      {logs.map((l, i) => (
        <div className="line" key={i}>
          <span className="ts">{l[0]}</span>
          <span style={{ color: l[1].trim() === "OK" ? "var(--mint)" : "var(--violet)" }}>{l[1]}</span>
          <span style={{ color: "var(--fg-dim)" }}>{l[2]}</span>
        </div>
      ))}
    </div>
  );
}

function CTA() {
  return (
    <section id="contact">
      <div className="wrap">
        <Reveal>
          <div className="cta">
            <div className="grid-deco" />
            <span className="section-eyebrow">CONTACT · /lets_build</span>
            <h2 style={{ marginTop: 14 }}>
              Got a system that's slowing your team down? <em style={{ fontStyle: "normal", color: "var(--mint)" }}>Let's fix it.</em>
            </h2>
            <p>Tell us what you're shipping. We'll write back within a working day with a thesis on how we'd approach it — or whether you even need us.</p>
            <div className="cta-row">
              <Magnetic>
                <a href="mailto:hello@lucent.example" className="btn btn-primary">
                  hello@lucent.example <span className="arrow">↗</span>
                </a>
              </Magnetic>
              <Magnetic strength={10}>
                <a href="#" className="btn btn-ghost">
                  $ book 30-min slot
                </a>
              </Magnetic>
            </div>
            <ConsoleFeed />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="row">
          <div>
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="mark">L</span><b>Lucent</b>
            </div>
            <p style={{ color: "var(--muted)", maxWidth: 280, lineHeight: 1.6 }}>
              A software studio building developer tools and bespoke platforms for product teams who refuse to be slow.
            </p>
          </div>
          <div>
            <h5>Products</h5>
            <ul>
              <li><a href="#products">Flow</a></li>
              <li><a href="#products">Pipe</a></li>
              <li><a href="#products">Mesh</a></li>
              <li><a href="#products">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#">Work</a></li>
              <li><a href="#">Writing</a></li>
            </ul>
          </div>
          <div>
            <h5>Connect</h5>
            <ul>
              <li><a href="#">hello@lucent.example</a></li>
              <li><a href="#">github.com/lucent</a></li>
              <li><a href="#">@lucent</a></li>
              <li><a href="#">Berlin · Remote</a></li>
            </ul>
          </div>
        </div>
        <div className="bottom-bar">
          <span>© 2026 Lucent Software GmbH. All rights reserved.</span>
          <span>build · {new Date().toISOString().slice(0, 10)} · commit a1b2c3d</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- App root -------------------- */
function App() {
  return (
    <>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="bg-glow" />
      <div className="bg-glow mint" />
      <Nav />
      <main>
        <Hero />
        <StackMarquee />
        <Products />
        <Services />
        <Process />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
