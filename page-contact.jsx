/* Lucent — Contact page with working form (client-side validation, mailto fallback). */

const { useState: __cUseState } = React;

function ContactForm() {
  const [form, setForm] = __cUseState({
    name: "", company: "", email: "", phone: "", message: "", topics: [],
  });
  const [submitted, setSubmitted] = __cUseState(false);
  const topics = ["Custom Software", "AI & Automation", "Integrationen", "Dashboards", "UX/UI", "Web-Plattform", "Ich weiß noch nicht"];

  const toggleTopic = (t) => {
    setForm((f) => ({ ...f, topics: f.topics.includes(t) ? f.topics.filter((x) => x !== t) : [...f.topics, t] }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    const subject = `Projekt-Anfrage von ${form.company || form.name || "?"}`;
    const lines = [
      `Name: ${form.name}`,
      `Firma: ${form.company}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone}`,
      `Themen: ${form.topics.join(", ")}`,
      "",
      "Nachricht:",
      form.message,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:hallo@lucent.example?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-form" style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--gold)", color: "var(--navy)", margin: "0 auto 18px", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 22 }}>✓</div>
        <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 10 }}>Dein E-Mail-Programm sollte offen sein.</h3>
        <p style={{ color: "var(--navy-2)", fontSize: 14.5, lineHeight: 1.55, maxWidth: 380, margin: "0 auto" }}>
          Falls nicht, schick uns die Anfrage einfach direkt an <a href="mailto:hallo@lucent.example" style={{ color: "var(--navy)", textDecoration: "underline" }}>hallo@lucent.example</a>. Wir melden uns innerhalb eines Werktags.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-ghost btn-mono" style={{ marginTop: 24 }}>
          $ neue anfrage
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="field-grp">
        <label>
          NAME
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Vorname Nachname" />
        </label>
        <label>
          FIRMA
          <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Optional" />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <label>
            E-MAIL
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="dich@firma.de" />
          </label>
          <label>
            TELEFON
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
          </label>
        </div>
        <label>
          THEMEN · MEHRFACH MÖGLICH
          <div className="opts">
            {topics.map((t) => (
              <button type="button" key={t} className={`opt ${form.topics.includes(t) ? "on" : ""}`} onClick={() => toggleTopic(t)}>
                {t}
              </button>
            ))}
          </div>
        </label>
        <label>
          WORUM GEHT'S?
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Ein paar Sätze reichen — was wollt ihr lösen, wer nutzt es, welche Frist habt ihr?" />
        </label>
        <div className="submit-row">
          <p className="note">Wir antworten innerhalb eines Werktags. Keine Newsletter, kein Tracking.</p>
          <button type="submit" className="btn btn-primary">
            Anfrage senden <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function DirectChannels() {
  return (
    <aside>
      <div className="contact-card" style={{ background: "var(--navy)", color: "var(--cream)", padding: 28 }}>
        <div className="head" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <span>direct.contact</span>
          <span style={{ color: "#6ee7a7" }}>● online</span>
        </div>
        <div className="field"><span className="k">e-mail</span><a href="mailto:hallo@lucent.example" className="v link">hallo@lucent.example</a></div>
        <div className="field"><span className="k">telefon</span><a href="tel:+49731000000" className="v link">+49 731 000-000</a></div>
        <div className="field"><span className="k">termin</span><a id="termin" href="https://cal.com/lucent/30min" className="v link">cal.com/lucent/30min</a></div>
        <div className="field"><span className="k">stunden</span><span className="v">Mo–Fr · 09–18 Uhr</span></div>
        <div className="field"><span className="k">status</span><span className="v" style={{ color: "#6ee7a7" }}>● nimmt Q2/26 Projekte</span></div>
      </div>
      <div style={{ marginTop: 24, padding: 24, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 0.05, marginBottom: 12 }}>BÜRO</div>
        <p style={{ fontSize: 14.5, color: "var(--navy)", lineHeight: 1.55 }}>
          Lucent Software GmbH<br />
          Musterstraße 12<br />
          89073 Ulm
        </p>
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14, lineHeight: 1.5 }}>
          Discovery-Workshops finden gerne vor Ort statt — bei euch oder bei uns. Das tägliche Bauen läuft remote über Slack, Linear und Git.
        </p>
      </div>
    </aside>
  );
}

function ContactApp() {
  return (
    <PageShell current="contact">
      <PageHeader
        crumbs={[{ label: "Home", href: "index.html" }, { label: "Kontakt" }]}
        eyebrow="KONTAKT · /lass_uns_bauen"
        title="Lasst uns"
        titleEm="kurz reden."
        lede="Schreibt uns kurz, woran ihr arbeitet. Innerhalb eines Werktags bekommt ihr eine ehrliche Antwort — mit einer ersten These oder einer Empfehlung, wer besser passt."
        meta={[
          { k: "ANTWORTZEIT", v: "< 1 Werktag" },
          { k: "ERSTGESPRÄCH", v: "30 min · kostenlos" },
          { k: "STANDORT", v: "Ulm · Remote" },
          { k: "KAPAZITÄT", v: "Q2/26 verfügbar" },
        ]}
      />

      <section style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="contact-grid">
            <ContactForm />
            <DirectChannels />
          </div>
        </div>
      </section>

      {/* FAQ — full list, the contact page is the natural home for it */}
      <FAQSection
        eyebrow="FAQ · HÄUFIGE FRAGEN"
        title="Bevor ihr schreibt."
        subtitle="Acht Fragen, die wir am häufigsten am Telefon hören — vorab beantwortet, damit das Erstgespräch produktiver wird."
      />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ContactApp />);
