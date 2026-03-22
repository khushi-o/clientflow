import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const C = {
  bg:        "#F9F7F2",
  green:     "#1B4332",
  terracotta:"#D08C60",
  charcoal:  "#2D2D2D",
  greenLight:"#2D6A4F",
  greenBg:   "#D8F3DC",
  terraBg:   "#FAE8D8",
  border:    "#E8E4DC",
  muted:     "#7A7670",
};

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});
  const [activeNav, setActiveNav] = useState("Dashboard");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setVisible((v) => ({ ...v, [e.target.id]: true }));
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-observe]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const navItems = ["Dashboard", "Projects", "Clients", "Invoices", "Messages", "Files"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % navItems.length;
      setActiveNav(navItems[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "📁", title: "Project tracking",
      desc: "Track progress, deadlines, and status across all your projects with beautiful cards and progress bars.",
      color: C.green,
    },
    {
      icon: "👥", title: "Client management",
      desc: "Add clients, track their status (Active, Lead, Inactive), search, and view full contact details in one place.",
      color: C.terracotta,
    },
    {
      icon: "📄", title: "Invoice generation",
      desc: "Create line-item invoices with auto tax calculation, status tracking, and one-click PDF download.",
      color: C.green,
    },
    {
      icon: "💬", title: "Real-time chat",
      desc: "Per-project chat rooms powered by Socket.io — messages delivered instantly with full history.",
      color: C.terracotta,
    },
    {
      icon: "📎", title: "File sharing",
      desc: "Upload, download, and manage files per project. Supports images, PDFs, Word, Excel, ZIP and more.",
      color: C.green,
    },
    {
      icon: "🔔", title: "Notifications",
      desc: "Stay on top of activity — new messages, file uploads, and invoice updates all in one feed.",
      color: C.terracotta,
    },
  ];

  const navItems = ["Dashboard", "Projects", "Clients", "Invoices", "Messages", "Files"];

  const stats = [
    { label: "Projects", value: "12", sub: "↑ 2 this month", color: C.green },
    { label: "Clients",  value: "8",  sub: "↑ 1 this week",  color: C.terracotta },
    { label: "Revenue",  value: "₹2.4L", sub: "↑ 18%",       color: C.green },
    { label: "Messages", value: "7",  sub: "unread",          color: C.terracotta },
  ];

  const projects = [
    { name: "Brand Redesign", progress: 72, status: "Active",   color: C.green },
    { name: "E-commerce App", progress: 45, status: "Review",   color: C.terracotta },
    { name: "Mobile App UI",  progress: 88, status: "Active",   color: C.green },
  ];

  const activity = [
    { text: "Invoice sent to Acme Corp",  time: "2m" },
    { text: "New message from Zeta Labs", time: "1h" },
    { text: "File uploaded to Brand",     time: "3h" },
    { text: "Project approved by Nova",   time: "1d" },
  ];

  const s = {
    page: {
      fontFamily: "'DM Sans', sans-serif",
      background: C.bg, color: C.charcoal, overflowX: "hidden",
    },
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 48px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(249,247,242,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
    },
    navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    navLogoBox: {
      width: 36, height: 36, borderRadius: 10,
      background: C.green,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 800, color: "#fff",
    },
    navLogoText: {
      fontFamily: "'Syne', sans-serif", fontSize: 18,
      fontWeight: 700, color: C.charcoal,
    },
    navLinks: { display: "flex", alignItems: "center", gap: 16 },
    navSignIn: {
      padding: "8px 20px", borderRadius: 8, border: "none",
      background: "transparent", color: C.muted, fontSize: 14, cursor: "pointer",
    },
    navCta: {
      padding: "8px 20px", borderRadius: 8, border: "none",
      background: C.green, color: "#fff", fontSize: 14,
      fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
    },
    hero: {
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "100px 48px 80px",
      background: C.bg, position: "relative", overflow: "hidden",
    },
    heroBlob1: {
      position: "absolute", top: "5%", left: "-5%",
      width: 500, height: 500, borderRadius: "50%",
      background: `radial-gradient(circle, ${C.greenBg} 0%, transparent 70%)`,
      animation: "blob1 15s ease-in-out infinite",
    },
    heroBlob2: {
      position: "absolute", bottom: "0%", right: "-5%",
      width: 500, height: 500, borderRadius: "50%",
      background: `radial-gradient(circle, ${C.terraBg} 0%, transparent 70%)`,
      animation: "blob2 12s ease-in-out infinite",
    },
    heroInner: {
      maxWidth: 1280, margin: "0 auto", width: "100%",
      display: "grid", gridTemplateColumns: "1fr 1.2fr",
      gap: 64, alignItems: "center", position: "relative", zIndex: 1,
    },
    heroBadge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 16px", borderRadius: 20,
      background: C.greenBg, border: `1px solid ${C.green}30`,
      fontSize: 13, color: C.green, marginBottom: 24,
    },
    heroBadgeDot: {
      width: 6, height: 6, borderRadius: "50%",
      background: C.green, animation: "pulse 2s infinite",
    },
    heroTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 58,
      fontWeight: 700, lineHeight: 1.1, letterSpacing: "-2px",
      color: C.charcoal, marginBottom: 20,
    },
    heroAccent: { color: C.green },
    heroSub: {
      fontSize: 17, color: C.muted, lineHeight: 1.7,
      marginBottom: 36, maxWidth: 460,
    },
    heroBtns: { display: "flex", gap: 12 },
    heroPrimaryBtn: {
      padding: "14px 28px", borderRadius: 12, border: "none",
      background: C.green, color: "#fff", fontSize: 15,
      fontWeight: 600, cursor: "pointer",
      boxShadow: `0 8px 24px ${C.green}40`,
      transition: "all 0.2s",
    },
    heroSecondaryBtn: {
      padding: "14px 28px", borderRadius: 12,
      border: `2px solid ${C.border}`, background: "#fff",
      color: C.charcoal, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
    },

    // Dashboard preview
    preview: {
      background: "#1a1a24",
      borderRadius: 20,
      boxShadow: `0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)`,
      overflow: "hidden",
      animation: "float 5s ease-in-out infinite",
    },
    previewBar: {
      background: "#111118", padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 8,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    dot: (color) => ({ width: 10, height: 10, borderRadius: "50%", background: color }),
    previewUrl: {
      flex: 1, background: "rgba(255,255,255,0.05)",
      borderRadius: 6, padding: "4px 10px",
      fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center",
    },
    previewBody: { display: "flex", height: 380 },
    previewSidebar: {
      width: 130, background: "#111118",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      padding: "14px 0", flexShrink: 0,
    },
    previewLogo: {
      fontFamily: "'Syne', sans-serif", fontSize: 11,
      fontWeight: 700, padding: "0 12px 18px", color: C.terracotta,
    },
    previewNavItem: (active) => ({
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 8px", margin: "1px 5px", borderRadius: 5,
      fontSize: 10, color: active ? "#fff" : "rgba(255,255,255,0.3)",
      background: active ? `${C.green}25` : "transparent",
      borderLeft: active ? `2px solid ${C.green}` : "2px solid transparent",
      transition: "all 0.4s ease",
    }),
    previewMain: { flex: 1, padding: 12, overflowY: "hidden" },
    previewStatsGrid: {
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: 7, marginBottom: 10,
    },
    previewStat: (color) => ({
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderTop: `2px solid ${color}`,
      borderRadius: 7, padding: "8px 8px",
    }),
    previewStatLabel: { fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 3, textTransform: "uppercase" },
    previewStatValue: { fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" },
    previewStatSub: { fontSize: 7, marginTop: 2 },
    previewRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
    previewCard: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8, padding: 10,
    },
    previewCardTitle: {
      fontSize: 7, color: "rgba(255,255,255,0.3)",
      textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8,
    },
    previewProject: { marginBottom: 8 },
    previewProjectTop: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
    previewProjectName: { fontSize: 9, color: "#e2e0ff", fontWeight: 500 },
    previewProjectBadge: (color) => ({
      fontSize: 6, padding: "1px 4px", borderRadius: 8,
      background: color + "20", color,
    }),
    previewBarBg: { height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, overflow: "hidden" },
    previewBarFill: (pct, color) => ({
      height: "100%", borderRadius: 1, width: `${pct}%`,
      background: color, transition: "width 0.8s ease",
    }),
    previewActivity: { display: "flex", alignItems: "center", gap: 5, marginBottom: 7 },
    previewActivityDot: (color) => ({
      width: 4, height: 4, borderRadius: "50%",
      background: color, flexShrink: 0,
    }),
    previewActivityText: { fontSize: 8, color: "rgba(255,255,255,0.35)", flex: 1 },
    previewActivityTime: { fontSize: 7, color: "rgba(255,255,255,0.2)" },

    // Features
    features: { padding: "100px 48px", background: "#fff" },
    featuresInner: { maxWidth: 1200, margin: "0 auto" },
    sectionBadge: {
      display: "inline-block", padding: "4px 14px", borderRadius: 20,
      background: C.greenBg, color: C.green,
      fontSize: 12, fontWeight: 600, textTransform: "uppercase",
      letterSpacing: "0.5px", marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 44,
      fontWeight: 700, color: C.charcoal, marginBottom: 16, letterSpacing: "-1px",
    },
    sectionSub: { fontSize: 17, color: C.muted, marginBottom: 60, maxWidth: 600 },
    featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
    featureCard: {
      padding: 28, borderRadius: 16, background: C.bg,
      border: `1px solid ${C.border}`, transition: "all 0.3s ease", cursor: "pointer",
    },
    featureIconBox: (color) => ({
      width: 48, height: 48, borderRadius: 12,
      background: color === C.green ? C.greenBg : C.terraBg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, marginBottom: 16,
    }),
    featureTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 17,
      fontWeight: 600, color: C.charcoal, marginBottom: 8,
    },
    featureDesc: { fontSize: 14, color: C.muted, lineHeight: 1.7 },

    // CTA
    cta: {
      padding: "100px 48px", background: C.green, textAlign: "center",
    },
    ctaTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 48,
      fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "-1px",
    },
    ctaSub: { fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 40 },
    ctaBtn: {
      padding: "14px 36px", borderRadius: 12, border: "none",
      background: C.terracotta, color: "#fff", fontSize: 15,
      fontWeight: 700, cursor: "pointer",
      boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
      transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8,
    },

    // Footer
    footer: {
      padding: "32px 48px", borderTop: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: C.bg,
    },
    footerLogo: { display: "flex", alignItems: "center", gap: 10 },
    footerLogoBox: {
      width: 28, height: 28, borderRadius: 8, background: C.green,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, color: "#fff",
    },
  };

  const anim = (id) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? "translateY(0)" : "translateY(30px)",
    transition: "all 0.6s ease",
  });

  return (
    <div style={s.page}>
      <style>{`
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,20px) scale(1.1)}66%{transform:translate(-10px,10px) scale(0.95)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-30px,-20px) scale(1.1)}66%{transform:translate(10px,-10px) scale(0.95)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .feature-card:hover{transform:translateY(-6px)!important;box-shadow:0 20px 40px rgba(0,0,0,0.06)!important;border-color:${C.terracotta}60!important}
        .nav-cta:hover{background:${C.greenLight}!important}
        .hero-primary:hover{transform:translateY(-2px)!important;box-shadow:0 12px 32px ${C.green}50!important}
        .hero-secondary:hover{border-color:${C.terracotta}!important}
        .cta-btn:hover{transform:scale(1.05)!important;opacity:0.9}
      `}</style>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navLogo} onClick={() => navigate("/")}>
          <div style={s.navLogoBox}>CF</div>
          <span style={s.navLogoText}>ClientFlow</span>
        </div>
        <div style={s.navLinks}>
          <button style={s.navSignIn} onClick={() => navigate("/login")}>Sign In</button>
          <button className="nav-cta" style={s.navCta} onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBlob1}></div>
        <div style={s.heroBlob2}></div>
        <div style={s.heroInner}>
          <div>
            <div style={s.heroBadge}>
              <div style={s.heroBadgeDot}></div>
              Built for freelancers and agencies
            </div>
            <h1 style={s.heroTitle}>
              Manage clients,<br />
              <span style={s.heroAccent}>projects & invoices</span>
            </h1>
            <p style={s.heroSub}>
              All in one beautiful workspace. Stop juggling between multiple tools and streamline your entire workflow from one place.
            </p>
            <div style={s.heroBtns}>
              <button className="hero-primary" style={s.heroPrimaryBtn} onClick={() => navigate("/register")}>
                Get Started Free →
              </button>
              <button className="hero-secondary" style={s.heroSecondaryBtn} onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
          </div>

          {/* Animated Dashboard Preview */}
          <div style={s.preview}>
            <div style={s.previewBar}>
              <div style={s.dot("#ff5f57")}></div>
              <div style={s.dot("#ffbd2e")}></div>
              <div style={s.dot("#28c840")}></div>
              <div style={s.previewUrl}>clientflow.app/dashboard</div>
            </div>
            <div style={s.previewBody}>
              <div style={s.previewSidebar}>
                <div style={s.previewLogo}>ClientFlow</div>
                {navItems.map((item) => (
                  <div key={item} style={s.previewNavItem(activeNav === item)}>
                    {item}
                  </div>
                ))}
              </div>
              <div style={s.previewMain}>
                <div style={s.previewStatsGrid}>
                  {stats.map((st) => (
                    <div key={st.label} style={s.previewStat(st.color)}>
                      <div style={s.previewStatLabel}>{st.label}</div>
                      <div style={s.previewStatValue}>{st.value}</div>
                      <div style={{ ...s.previewStatSub, color: st.color }}>{st.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={s.previewRow}>
                  <div style={s.previewCard}>
                    <div style={s.previewCardTitle}>Active Projects</div>
                    {projects.map((p) => (
                      <div key={p.name} style={s.previewProject}>
                        <div style={s.previewProjectTop}>
                          <span style={s.previewProjectName}>{p.name}</span>
                          <span style={s.previewProjectBadge(p.color)}>{p.status}</span>
                        </div>
                        <div style={s.previewBarBg}>
                          <div style={s.previewBarFill(p.progress, p.color)}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={s.previewCard}>
                    <div style={s.previewCardTitle}>Recent Activity</div>
                    {activity.map((a, i) => (
                      <div key={i} style={s.previewActivity}>
                        <div style={s.previewActivityDot(i % 2 === 0 ? C.green : C.terracotta)}></div>
                        <div style={s.previewActivityText}>{a.text}</div>
                        <div style={s.previewActivityTime}>{a.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={s.features}>
        <div style={s.featuresInner}>
          <div id="fh" data-observe style={{ textAlign: "center", ...anim("fh") }}>
            <div style={s.sectionBadge}>Features</div>
            <h2 style={s.sectionTitle}>Everything you need to succeed</h2>
            <p style={s.sectionSub}>
              Powerful features designed to help you manage your entire business workflow efficiently
            </p>
          </div>
          <div style={s.featuresGrid}>
            {features.map((f, i) => (
              <div
                key={i} id={`f${i}`} data-observe
                className="feature-card"
                style={{ ...s.featureCard, ...anim(`f${i}`), transitionDelay: `${i * 0.08}s` }}
              >
                <div style={s.featureIconBox(f.color)}>{f.icon}</div>
                <div style={s.featureTitle}>{f.title}</div>
                <div style={s.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div id="cta" data-observe style={{ ...anim("cta") }}>
          <h2 style={s.ctaTitle}>Ready to streamline your workflow?</h2>
          <p style={s.ctaSub}>Join thousands of freelancers and agencies who trust ClientFlow</p>
          <button className="cta-btn" style={s.ctaBtn} onClick={() => navigate("/register")}>
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>
          <div style={s.footerLogoBox}>CF</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: C.charcoal }}>
            ClientFlow
          </span>
        </div>
        <span style={{ fontSize: 13, color: C.muted }}>© 2026 ClientFlow. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Landing;