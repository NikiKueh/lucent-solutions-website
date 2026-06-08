/* Lucent — shared chrome (Nav, Footer, helpers, CTASection, FAQSection, PageHeader, Breadcrumbs)
   Exported to window so any page script can pick what it needs.
   Reads current page from document.body.dataset.page to highlight the right nav link. */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------- helpers ---------- */
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

/* ---------- Nav (route-aware) ---------- */
function Nav({ current }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">

        {/* ── Brand ── */}
        <a href="index.html" className="brand" aria-label="Lucent — zur Startseite">
          <span className="mark">L</span>
          <b>Lucent</b>
          <span className="tag">Software Studio</span>
        </a>

        {/* ── Center nav ── */}
        <nav className="nav-center">
          {LUCENT_NAV.map((n) => (
            <a key={n.key} href={n.href}
               className={current === n.key ? "current" : ""}>
              <Scramble text={n.label} />
            </a>
          ))}
        </nav>

        {/* ── Right: status + CTA ── */}
        <div className="nav-actions">
          <span className="status">
            <span className="dot" />
            verfügbar Q2/26
          </span>
          <a href="contact.html" className="nav-cta">
            Projekt anfragen <span className="arrow">→</span>
          </a>
        </div>

      </div>
    </header>
  );
}

/* ---------- Page header (used on every sub-page) ---------- */
function PageHeader({ crumbs = [], eyebrow, title, titleEm, lede, meta = [] }) {
  return (
    <section className="page-header">
      <div className="wrap">
        {crumbs.length > 0 && (
          <div className="crumbs">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="sep">/</span>}
                {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
              </span>
            )).reduce((acc, el, i) => {
              if (i === 0) return [el];
              return [...acc, <span key={`s${i}`} className="sep">/</span>, el];
            }, [])}
          </div>
        )}
        {eyebrow && <Reveal><span className="section-eyebrow">{eyebrow}</span></Reveal>}
        <Reveal delay={60}>
          <h1>
            {title}{titleEm && <> <em>{titleEm}</em></>}
          </h1>
        </Reveal>
        {lede && <Reveal delay={140}><p className="lede">{lede}</p></Reveal>}
        {meta.length > 0 && (
          <Reveal delay={220}>
            <div className="header-meta">
              {meta.map((m, i) => (
                <div key={i}>
                  <span className="k">{m.k}</span>
                  <span className="v">{m.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------- CTA section (re-usable footer block) ---------- */
function CTASection({
  eyebrow = "KONTAKT · /lass_uns_bauen",
  title = "Bereit für Software,",
  titleLine2 = "die",
  titleEm = "wirkt?",
  body = "Schreib uns kurz, woran ihr arbeitet. Innerhalb eines Werktags bekommt ihr eine ehrliche Einschätzung — kostenlos, unverbindlich, konkret.",
  primaryLabel = "Projekt anfragen",
  primaryHref = "contact.html",
  ghostLabel = "$ termin buchen",
  ghostHref = "contact.html#termin",
}) {
  return (
    <section id="kontakt">
      <div className="wrap">
        <Reveal>
          <div className="kontakt">
            <div className="kontakt-glow-orb" />
            <div className="kontakt-grid">

              {/* LEFT — copy + trust + CTAs */}
              <div className="kontakt-copy">
                <span className="section-eyebrow cta-eyebrow">{eyebrow}</span>
                <h2 className="cta-h2">
                  {title}<br />{titleLine2} <em>{titleEm}</em>
                </h2>
                <p className="cta-body">{body}</p>

                <div className="cta-trust">
                  <div className="cta-trust-item">
                    <span className="cta-trust-num">24h</span>
                    <span className="cta-trust-lab">Erste Rückmeldung</span>
                  </div>
                  <div className="cta-trust-div" />
                  <div className="cta-trust-item">
                    <span className="cta-trust-num">15+</span>
                    <span className="cta-trust-lab">Projekte gebaut</span>
                  </div>
                  <div className="cta-trust-div" />
                  <div className="cta-trust-item">
                    <span className="cta-trust-num">0 €</span>
                    <span className="cta-trust-lab">Ersteinschätzung</span>
                  </div>
                </div>

                <div className="kontakt-row">
                  <Magnetic>
                    <a href={primaryHref} className="btn btn-primary">
                      {primaryLabel} <span className="arrow">→</span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={8}>
                    <a href={ghostHref} className="btn btn-ghost btn-mono">
                      {ghostLabel}
                    </a>
                  </Magnetic>
                </div>
              </div>

              {/* RIGHT — premium contact stage */}
              <div className="contact-stage">
                <div className="cs-header">
                  <div>
                    <div className="cs-studio-name">Lucent Solutions</div>
                    <div className="cs-studio-sub">Software Studio · Ulm</div>
                  </div>
                  <div className="cs-status">
                    <span className="cs-status-dot" />
                    Q2 / 26 offen
                  </div>
                </div>

                <div className="cs-fields">
                  <div className="cs-field">
                    <span className="cs-k">E-Mail</span>
                    <a href="mailto:hallo@lucent.example" className="cs-v cs-link">hallo@lucent.example</a>
                  </div>
                  <div className="cs-field">
                    <span className="cs-k">Telefon</span>
                    <span className="cs-v">+49 731 000-000</span>
                  </div>
                  <div className="cs-field">
                    <span className="cs-k">Standort</span>
                    <span className="cs-v">Ulm · Remote-first</span>
                  </div>
                  <div className="cs-field">
                    <span className="cs-k">Erreichbar</span>
                    <span className="cs-v">Mo – Fr · 09–18 Uhr</span>
                  </div>
                </div>

                <div className="cs-next">
                  <span className="cs-next-label">Wie es weitergeht</span>
                  <div className="cs-steps">
                    <div className="cs-step">
                      <span className="cs-step-n">01</span>
                      <span className="cs-step-t">Brief schicken — 5 Minuten</span>
                    </div>
                    <div className="cs-step">
                      <span className="cs-step-n">02</span>
                      <span className="cs-step-t">Discovery-Call · 30 min</span>
                    </div>
                    <div className="cs-step">
                      <span className="cs-step-n">03</span>
                      <span className="cs-step-t">Konzept & Angebot</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ section ---------- */
function FAQSection({
  eyebrow = "FAQ · HÄUFIGE FRAGEN",
  title = "Häufig gefragt.",
  titleEm = "",
  subtitle = "Was Stakeholder vor dem ersten Gespräch wissen wollen.",
  items = LUCENT_FAQS,
  guide = false,
  guideHref = "contact.html",
}) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section id="faq" className="faq-section dark-section">
      <div className="wrap section-narrow">
        <div className="section-head">
          <Reveal><span className="section-eyebrow">{eyebrow}</span></Reveal>
          <Reveal delay={80}>
            <h2 className="section-title">
              {title}{titleEm && <> <em>{titleEm}</em></>}
            </h2>
          </Reveal>
          {subtitle && <Reveal delay={160}><p className="section-sub">{subtitle}</p></Reveal>}
        </div>
        <div className="faq-list">
          {items.map((f, i) => {
            const isOpen = openIdx === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={i} delay={i * 45}>
                <div className={`faq-item${isOpen ? " faq-item--open" : ""}`}>
                  <button
                    className="faq-summary"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-num">{num}</span>
                    <span className="faq-q">{f.q}</span>
                    <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div className="faq-body">
                    <div className="faq-body-inner">
                      <p className="faq-answer">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        {guide && (
          <Reveal delay={200}>
            <div className="faq-guide">
              <p className="faq-guide-text">Offene Fragen beantwortet ein Erstgespräch in 30 Minuten.</p>
              <a href={guideHref} className="faq-guide-link">
                Termin anfragen <span className="arrow">→</span>
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------- Tech marquee (re-used on home + about) ---------- */
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

/* ---------- Footer ---------- */
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
              {LUCENT_SERVICES.map((s) => (
                <li key={s.slug}><a href={`leistungen-${s.slug}.html`}>{s.short}</a></li>
              ))}
              <li><a href="leistungen.html">Alle Leistungen →</a></li>
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li><a href="about.html">Über uns</a></li>
              <li><a href="process.html">Prozess</a></li>
              <li><a href="cases.html">Cases</a></li>
              <li><a href="contact.html">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <h5>Kontakt</h5>
            <ul>
              <li><a href="mailto:hallo@lucent.example">hallo@lucent.example</a></li>
              <li><a href="tel:+49731000000">+49 731 000-000</a></li>
              <li><a href="contact.html">Ulm · Neu-Ulm · Remote</a></li>
              <li><a href="about.html#impressum">Impressum · Datenschutz</a></li>
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

/* ---------- Tweaks (accent color only — kept minimal) ---------- */
function LucentTweaks() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState("#D4A857");
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (!d || !d.type) return;
      if (d.type === "__activate_edit_mode") setOpen(true);
      if (d.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--gold", accent);
  }, [accent]);
  if (!open) return null;
  const swatches = ["#D4A857", "#E67E22", "#1cba6e", "#4F46E5", "#E11D48"];
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 100,
      background: "var(--paper)", border: "1px solid var(--line-strong)", borderRadius: 12,
      padding: 16, width: 260, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      fontFamily: "var(--font-sans)", fontSize: 13,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <strong style={{ fontSize: 13, letterSpacing: 0.05, textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Tweaks</strong>
        <button onClick={() => { setOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }}
                style={{ color: "var(--muted)", padding: 4 }} aria-label="Schließen">✕</button>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginBottom: 8, letterSpacing: 0.05 }}>Akzentfarbe</div>
      <div style={{ display: "flex", gap: 8 }}>
        {swatches.map((s) => (
          <button key={s} onClick={() => setAccent(s)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: s,
                           border: accent === s ? "2px solid var(--navy)" : "1px solid var(--line-strong)",
                           cursor: "pointer" }}
                  aria-label={`Akzent ${s}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Page shell ---------- */
function PageShell({ current, children }) {
  return (
    <>
      <Nav current={current} />
      <main>{children}</main>
      <Footer />
      <LucentTweaks />
    </>
  );
}

Object.assign(window, {
  useInView, Reveal, Scramble, Magnetic,
  Nav, Footer, PageHeader, CTASection, FAQSection, StackMarquee, PageShell, LucentTweaks,
});
