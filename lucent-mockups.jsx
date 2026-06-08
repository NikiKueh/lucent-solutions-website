/* Lucent — reusable software mockups & SVG visuals.
   These render the "software UI" feel without any external assets — pure CSS/SVG. */

const { useEffect: __mUseEffect, useState: __mUseState } = React;

/* ---------- Generic dashboard mockup ---------- */
function MockupDashboard() {
  return (
    <div className="mockup" style={{ width: "100%" }}>
      <div className="topbar">
        <div className="lights"><span /><span /><span /></div>
        <span>app.lucent.io / ops</span>
      </div>
      <div className="body" style={{ display: "grid", gap: 12 }}>
        <div className="kpi-grid">
          <div className="kpi"><div className="lab">UMSATZ HEUTE</div><div className="val">38.4k</div><div className="delta up">+12%</div></div>
          <div className="kpi"><div className="lab">OFFENE TICKETS</div><div className="val">14</div><div className="delta down">−4</div></div>
          <div className="kpi"><div className="lab">PIPELINE</div><div className="val">182k</div><div className="delta up">+8%</div></div>
        </div>
        <svg viewBox="0 0 320 80" style={{ width: "100%", height: 80 }}>
          <line x1="0" y1="68" x2="320" y2="68" stroke="rgba(30,38,70,0.15)" />
          <polyline points="0,60 40,52 80,55 120,42 160,38 200,28 240,22 280,18 320,10"
                    fill="none" stroke="var(--navy)" strokeWidth="2" />
          <polyline points="0,60 40,52 80,55 120,42 160,38 200,28 240,22 280,18 320,10"
                    fill="none" stroke="var(--gold)" strokeWidth="2"
                    strokeDasharray="320" strokeDashoffset="320">
            <animate attributeName="stroke-dashoffset" from="320" to="0" dur="2.4s" fill="freeze" />
          </polyline>
        </svg>
      </div>
    </div>
  );
}

/* ---------- AI / RAG flow ---------- */
function MockupAIFlow() {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }} className="wf-pulse">
      <defs>
        <linearGradient id="ai-line" x1="0" x2="1">
          <stop offset="0" stopColor="#1E2646" />
          <stop offset="1" stopColor="#D4A857" />
        </linearGradient>
      </defs>
      {/* nodes */}
      <g fontFamily="var(--font-mono)" fontSize="9.5" fill="#1E2646">
        <rect x="10" y="20" width="60" height="30" rx="6" fill="none" stroke="#1E2646" />
        <text x="40" y="38" textAnchor="middle">Eingang</text>
        <rect x="100" y="20" width="60" height="30" rx="6" fill="none" stroke="#1E2646" />
        <text x="130" y="38" textAnchor="middle">LLM</text>
        <rect x="190" y="20" width="60" height="30" rx="6" fill="none" stroke="#1E2646" />
        <text x="220" y="38" textAnchor="middle">Anreich.</text>
        <rect x="100" y="80" width="60" height="30" rx="6" fill="#1E2646" stroke="#1E2646" />
        <text x="130" y="98" textAnchor="middle" fill="#D4A857">Score</text>
        <rect x="190" y="140" width="60" height="30" rx="6" fill="none" stroke="#1E2646" />
        <text x="220" y="158" textAnchor="middle">CRM</text>
        <rect x="100" y="140" width="60" height="30" rx="6" fill="none" stroke="#1E2646" />
        <text x="130" y="158" textAnchor="middle">Nurture</text>
      </g>
      {/* lines */}
      <g stroke="url(#ai-line)" strokeWidth="1.2" fill="none">
        <path d="M 70 35 L 100 35" />
        <path d="M 160 35 L 190 35" />
        <path d="M 220 50 Q 220 65 130 80" />
        <path d="M 130 110 Q 130 125 130 140" />
        <path d="M 160 95 Q 220 110 220 140" />
      </g>
      {/* pulsing dots */}
      <circle cx="40" cy="35" r="2.5" fill="#1cba6e" />
      <circle cx="130" cy="35" r="2.5" fill="#D4A857" />
      <circle cx="220" cy="35" r="2.5" fill="#D4A857" />
      <circle cx="130" cy="95" r="2.5" fill="#D4A857" />
      <circle cx="220" cy="155" r="2.5" fill="#1cba6e" />
    </svg>
  );
}

/* ---------- Integration / system map ---------- */
function MockupIntegration() {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
      <g stroke="#1E2646" strokeWidth="1" fill="#FFFFFF">
        <rect x="10" y="20" width="80" height="50" rx="8" />
        <rect x="10" y="90" width="80" height="50" rx="8" />
        <rect x="10" y="150" width="80" height="50" rx="8" />
        <rect x="220" y="60" width="80" height="50" rx="8" />
        <rect x="220" y="130" width="80" height="50" rx="8" />
      </g>
      <g fontFamily="var(--font-mono)" fontSize="9.5" fill="#1E2646" textAnchor="middle">
        <text x="50" y="50">CRM</text>
        <text x="50" y="120">Shop</text>
        <text x="50" y="180">DATEV</text>
        <text x="260" y="90">Bus</text>
        <text x="260" y="160">Logs</text>
      </g>
      <g stroke="#D4A857" strokeWidth="1" strokeDasharray="3 3" fill="none">
        <path d="M 90 45 L 220 85" />
        <path d="M 90 115 L 220 85" />
        <path d="M 90 175 L 220 155" />
        <path d="M 300 85 L 320 85" />
      </g>
      {[{ p: "90,45 220,85" }, { p: "90,115 220,85" }, { p: "90,175 220,155" }].map((l, i) => (
        <circle key={i} r="3" fill="#1cba6e">
          <animateMotion dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" path={`M ${l.p.replace(",", " ").replace(" ", " L ")}`} />
        </circle>
      ))}
    </svg>
  );
}

/* ---------- Wireframe → UI transformation ---------- */
function MockupWireframeToUI() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 12, alignItems: "center", width: "100%" }}>
      {/* wireframe */}
      <div style={{ background: "var(--paper)", border: "1px dashed var(--line-strong)", borderRadius: 10, padding: 12, height: 200, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 8, background: "var(--line)", borderRadius: 2, width: "60%" }} />
        <div style={{ height: 18, background: "var(--line)", borderRadius: 2 }} />
        <div style={{ height: 18, background: "var(--line)", borderRadius: 2, width: "80%" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
          <div style={{ height: 50, background: "var(--line)", borderRadius: 4 }} />
          <div style={{ height: 50, background: "var(--line)", borderRadius: 4 }} />
        </div>
        <div style={{ height: 30, background: "var(--line)", borderRadius: 4, marginTop: "auto" }} />
      </div>
      <div style={{ textAlign: "center", color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: 16 }}>→</div>
      {/* finished UI */}
      <div className="mockup" style={{ width: "100%", height: 200 }}>
        <div className="topbar" style={{ padding: "8px 12px" }}><div className="lights"><span /><span /><span /></div></div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 9.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>DASHBOARD</div>
          <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--navy)", marginTop: 2 }}>Übersicht</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            <div style={{ background: "var(--cream)", borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: 9, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>UMSATZ</div>
              <div style={{ fontSize: 18, color: "var(--navy)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>38.4k</div>
            </div>
            <div style={{ background: "var(--cream)", borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: 9, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>OFFEN</div>
              <div style={{ fontSize: 18, color: "var(--navy)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>14</div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 22, background: "var(--navy)", color: "var(--cream)", borderRadius: 4, display: "grid", placeItems: "center", fontSize: 10, fontFamily: "var(--font-mono)" }}>Tour starten →</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- OCR document → structured data ---------- */
function MockupOCR() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 12, alignItems: "stretch", width: "100%", height: "100%" }}>
      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8, padding: 14, fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "var(--navy)", fontWeight: 600, fontSize: 11 }}>Rechnung 2025-042</div>
        <div>Müller GmbH</div>
        <div>Datum 14.05.2026</div>
        <div style={{ marginTop: 6, height: 6, background: "var(--line)", borderRadius: 2 }} />
        <div style={{ height: 6, background: "var(--line)", borderRadius: 2, width: "80%" }} />
        <div style={{ height: 6, background: "var(--line)", borderRadius: 2, width: "60%" }} />
        <div style={{ marginTop: "auto", color: "var(--navy)" }}>Summe 4.382,50 €</div>
      </div>
      <div style={{ textAlign: "center", color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: 16, alignSelf: "center" }}>→</div>
      <div style={{ background: "var(--navy)", color: "var(--cream)", borderRadius: 8, padding: 14, fontFamily: "var(--font-mono)", fontSize: 9.5 }}>
        <div style={{ color: "var(--gold)", fontSize: 10 }}>// structured</div>
        <div style={{ marginTop: 6 }}>{`{`}</div>
        <div>&nbsp;&nbsp;invoice: "2025-042",</div>
        <div>&nbsp;&nbsp;vendor: "Müller GmbH",</div>
        <div>&nbsp;&nbsp;date: "2026-05-14",</div>
        <div>&nbsp;&nbsp;net: 3682.77,</div>
        <div>&nbsp;&nbsp;vat: 699.73,</div>
        <div>&nbsp;&nbsp;account: "3400"</div>
        <div>{`}`}</div>
      </div>
    </div>
  );
}

/* ---------- SaaS / multi-tenant ---------- */
function MockupSaaS() {
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
      <g fontFamily="var(--font-mono)" fontSize="9.5" fill="#1E2646">
        <rect x="120" y="80" width="80" height="40" rx="8" fill="#1E2646" stroke="#1E2646" />
        <text x="160" y="105" textAnchor="middle" fill="#D4A857">Lucent Core</text>
      </g>
      {[
        { x: 30, y: 30, t: "Tenant A" },
        { x: 130, y: 20, t: "Tenant B" },
        { x: 230, y: 30, t: "Tenant C" },
        { x: 30, y: 150, t: "Tenant D" },
        { x: 230, y: 150, t: "Tenant E" },
      ].map((t, i) => (
        <g key={i} fontFamily="var(--font-mono)" fontSize="9" fill="#1E2646">
          <rect x={t.x} y={t.y} width="60" height="28" rx="6" fill="white" stroke="#1E2646" />
          <text x={t.x + 30} y={t.y + 18} textAnchor="middle">{t.t}</text>
          <line x1={t.x + 30} y1={t.y + 28} x2="160" y2={t.y > 100 ? 120 : 80} stroke="#D4A857" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- Logistics / dashboard ---------- */
function MockupOpsDashboard() {
  return (
    <div className="mockup" style={{ width: "100%" }}>
      <div className="topbar">
        <div className="lights"><span /><span /><span /></div>
        <span>ops.lucent.io / live</span>
      </div>
      <div className="body" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        {/* mini map */}
        <div style={{ position: "relative", height: 160, background: "var(--cream-2)", borderRadius: 8, overflow: "hidden" }}>
          <svg viewBox="0 0 200 160" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d="M0,80 Q40,30 100,60 T200,40" stroke="rgba(30,38,70,0.3)" strokeWidth="1" fill="none" />
            <path d="M0,120 Q60,140 120,110 T200,130" stroke="rgba(30,38,70,0.3)" strokeWidth="1" fill="none" />
            <path d="M40,0 Q60,60 100,80 T180,160" stroke="rgba(30,38,70,0.2)" strokeWidth="1" fill="none" />
          </svg>
          {[
            { x: "20%", y: "30%", c: "#1cba6e" },
            { x: "50%", y: "55%", c: "#D4A857" },
            { x: "70%", y: "40%", c: "#1cba6e" },
            { x: "30%", y: "75%", c: "#c0392b" },
            { x: "80%", y: "75%", c: "#1cba6e" },
          ].map((p, i) => (
            <span key={i} style={{
              position: "absolute", left: p.x, top: p.y,
              width: 10, height: 10, borderRadius: "50%",
              background: p.c, boxShadow: `0 0 0 4px ${p.c}33`,
              transform: "translate(-50%,-50%)",
            }} />
          ))}
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {[
            ["TOUR-141", "underway", "#1cba6e"],
            ["TOUR-142", "delayed", "#c0392b"],
            ["TOUR-143", "loading", "#D4A857"],
            ["TOUR-144", "done", "#6b6f80"],
          ].map(([id, status, c]) => (
            <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--cream)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 10 }}>
              <span style={{ color: "var(--navy)" }}>{id}</span>
              <span style={{ color: c }}>● {status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Portal mockup ---------- */
function MockupPortal() {
  return (
    <div className="mockup" style={{ width: "100%" }}>
      <div className="topbar"><div className="lights"><span /><span /><span /></div><span>portal.versicherer.de</span></div>
      <div className="body">
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>SCHADEN-NR · 2026-0142</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, color: "var(--navy)", marginTop: 4 }}>Wasserschaden — Küche</div>
        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {[
            ["Eingang gemeldet", "Mo 14:02", true],
            ["Sachbearbeiter zugewiesen", "Mo 16:30", true],
            ["Gutachter beauftragt", "Di 09:15", true],
            ["Gutachten ausstehend", "—", false],
            ["Auszahlung", "—", false],
          ].map(([t, time, done], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 10, alignItems: "center", fontSize: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: done ? "var(--gold)" : "transparent", border: done ? "0" : "1px solid var(--line-strong)" }} />
              <span style={{ color: done ? "var(--navy)" : "var(--muted)" }}>{t}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Booking SaaS mockup ---------- */
function MockupBooking() {
  return (
    <div className="mockup" style={{ width: "100%" }}>
      <div className="topbar"><div className="lights"><span /><span /><span /></div><span>book.lucent.io</span></div>
      <div className="body">
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "var(--navy)" }}>Termin buchen</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 14 }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const isToday = i === 12;
            const isSelected = i === 18;
            const isAvailable = !isSelected && !isToday && [0,3,4,8,15,18,21,22,25].includes(i % 28);
            return (
              <div key={i} style={{
                aspectRatio: "1", display: "grid", placeItems: "center",
                borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 10,
                background: isSelected ? "var(--navy)" : isToday ? "var(--gold)" : isAvailable ? "var(--cream)" : "transparent",
                color: isSelected ? "var(--cream)" : isToday ? "var(--navy)" : "var(--navy)",
                opacity: isAvailable || isSelected || isToday ? 1 : 0.4,
              }}>{((i % 28) + 1)}</div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 10, fontFamily: "var(--font-mono)" }}>
          {["09:00", "10:30", "14:00"].map((t, i) => (
            <div key={t} style={{ padding: "8px 0", background: i === 1 ? "var(--navy)" : "var(--cream)", color: i === 1 ? "var(--cream)" : "var(--navy)", borderRadius: 4, textAlign: "center" }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Engineering / code mockup ---------- */
function MockupEngineering() {
  return (
    <div className="mockup" style={{ width: "100%", background: "var(--navy)", color: "var(--cream)", borderColor: "var(--navy-3)" }}>
      <div className="topbar" style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.06)", color: "rgba(245,242,236,0.5)" }}>
        <div className="lights"><span style={{ background: "#ff5f57" }} /><span style={{ background: "#febc2e" }} /><span style={{ background: "#28c840" }} /></div>
        <span>api/orders.ts</span>
      </div>
      <div className="body" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.7 }}>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>1</span><span style={{ color: "var(--code-pink)" }}>import</span> <span style={{ color: "var(--cream)" }}>{`{ z }`}</span> <span style={{ color: "var(--code-pink)" }}>from</span> <span style={{ color: "var(--gold-soft)" }}>"zod"</span></div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>2</span></div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>3</span><span style={{ color: "var(--code-pink)" }}>export const</span> <span style={{ color: "var(--code-mint)" }}>OrderSchema</span> = z.object({`{`}</div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>4</span>&nbsp;&nbsp;id: z.string().uuid(),</div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>5</span>&nbsp;&nbsp;total: z.number().positive(),</div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>6</span>&nbsp;&nbsp;items: z.array(LineItem),</div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>7</span>{`})`}</div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>8</span></div>
        <div><span style={{ color: "rgba(245,242,236,0.4)", marginRight: 8 }}>9</span><span style={{ color: "rgba(245,242,236,0.4)", fontStyle: "italic" }}>{"// ✓ 412 tests · coverage 94%"}</span></div>
      </div>
    </div>
  );
}

/* ---------- Platform / web ---------- */
function MockupWeb() {
  return (
    <div className="mockup" style={{ width: "100%" }}>
      <div className="topbar"><div className="lights"><span /><span /><span /></div><span>shop.example.com</span></div>
      <div className="body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: "var(--cream-2)", borderRadius: 6, padding: 10, height: 100, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ height: 40, background: "var(--line)", borderRadius: 4 }} />
              <div>
                <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>SKU-00{i}</div>
                <div style={{ fontSize: 11, color: "var(--navy)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>49,90 €</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
          <span>● LCP 1.1s</span>
          <span>● INP 84ms</span>
          <span>● CLS 0.04</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mapper from kind → mockup ---------- */
function ServiceMockup({ kind }) {
  const map = {
    engineering: <MockupEngineering />,
    ai: <MockupAIFlow />,
    integration: <MockupIntegration />,
    data: <MockupDashboard />,
    design: <MockupWireframeToUI />,
    platform: <MockupWeb />,
  };
  return map[kind] || <MockupDashboard />;
}

function CaseHeroMockup({ kind }) {
  const map = {
    ai: <MockupAIFlow />,
    dashboard: <MockupOpsDashboard />,
    portal: <MockupPortal />,
    ocr: <MockupOCR />,
    saas: <MockupBooking />,
  };
  return map[kind] || <MockupDashboard />;
}

Object.assign(window, {
  MockupDashboard, MockupAIFlow, MockupIntegration, MockupWireframeToUI,
  MockupOCR, MockupSaaS, MockupOpsDashboard, MockupPortal, MockupBooking,
  MockupEngineering, MockupWeb, ServiceMockup, CaseHeroMockup,
});
