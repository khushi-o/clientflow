import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const accent = useAuthStore((state) => state.accent);
  const mode = useAuthStore((state) => state.mode);
  const setAccent = useAuthStore((state) => state.setAccent);
  const setMode = useAuthStore((state) => state.setMode);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const a = accents[accent];
  const m = modes[mode];

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/auth/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const statCards = stats ? [
    { label: "Projects",         value: stats.projects,        sub: "total" },
    { label: "Clients",          value: stats.clients,         sub: "total" },
    { label: "Pending Invoices", value: stats.pendingInvoices, sub: "unpaid" },
    { label: "Revenue",          value: `₹${stats.totalRevenue.toLocaleString()}`, sub: "paid invoices" },
  ] : [
    { label: "Projects",         value: "—", sub: "loading" },
    { label: "Clients",          value: "—", sub: "loading" },
    { label: "Pending Invoices", value: "—", sub: "loading" },
    { label: "Revenue",          value: "—", sub: "loading" },
  ];

  const s = {
    app: { display: "flex", minHeight: "100vh", background: m.bg, color: m.text, fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease" },
    sidebar: { width: 220, background: m.sidebar, display: "flex", flexDirection: "column", padding: "24px 0", borderRight: `1px solid ${m.cardBorder}`, transition: "all 0.3s ease", flexShrink: 0 },
    logo: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, padding: "0 20px 32px", letterSpacing: "-0.3px" },
    navLabel: { fontSize: 9, color: m.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 12px 6px 20px" },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", margin: "1px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: active ? m.text : m.textMuted, background: active ? a.glow : "transparent", transition: "all 0.2s" }),
    navDot: (active) => ({ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: active ? a.color : m.textMuted, boxShadow: active ? `0 0 8px ${a.color}` : "none", transition: "all 0.2s" }),
    main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
    topbar: { padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${m.cardBorder}`, background: m.topbar, transition: "all 0.3s ease" },
    pageTitle: { fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: m.text },
    controls: { display: "flex", alignItems: "center", gap: 14 },
    modeBtn: (active) => ({ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer", border: "none", background: active ? a.color : m.card, color: active ? "#fff" : m.textMuted, boxShadow: active ? `0 0 12px ${a.color}60` : "none", transition: "all 0.2s" }),
    accentDot: (key) => ({ width: 16, height: 16, borderRadius: "50%", background: accents[key].color, cursor: "pointer", border: accent === key ? `2px solid ${m.text}` : "2px solid transparent", boxShadow: accent === key ? `0 0 10px ${accents[key].color}` : "none", transition: "all 0.2s", flexShrink: 0 }),
    avatar: { width: 32, height: 32, borderRadius: "50%", background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", boxShadow: `0 0 12px ${a.color}80` },
    content: { padding: "24px 28px", flex: 1 },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 },
    stat: { background: m.statBg, borderRadius: 14, padding: "14px 16px", border: `1px solid ${m.cardBorder}`, boxShadow: m.shadow, position: "relative", overflow: "hidden", transition: "all 0.3s ease" },
    statAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: a.color, opacity: 0.7 },
    statLabel: { fontSize: 10, color: m.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.4px" },
    statValue: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: m.text },
    statSub: { fontSize: 10, color: a.color, marginTop: 3 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    card: { background: m.card, borderRadius: 14, border: `1px solid ${m.cardBorder}`, padding: 18, boxShadow: m.shadow, transition: "all 0.3s ease" },
    cardTitle: { fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 600, color: m.textMuted, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 14 },
    pItem: { marginBottom: 14 },
    pTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    pName: { fontSize: 13, fontWeight: 500, color: m.text },
    pClient: { fontSize: 11, color: m.textMuted, marginBottom: 6 },
    badge: (status) => ({ fontSize: 9, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: status === "Active" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)", color: status === "Active" ? "#34d399" : "#fbbf24" }),
    barBg: { height: 3, background: m.cardBorder, borderRadius: 2, overflow: "hidden" },
    barFill: (pct) => ({ height: "100%", borderRadius: 2, width: `${pct}%`, background: `linear-gradient(90deg, ${a.color}, ${a.color}99)`, boxShadow: `0 0 6px ${a.color}60`, transition: "all 0.3s" }),
    actItem: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
    actDot: { width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0, boxShadow: `0 0 6px ${a.color}` },
    actText: { fontSize: 12, color: m.textMuted, flex: 1 },
    actTime: { fontSize: 10, color: m.textMuted, opacity: 0.6, whiteSpace: "nowrap" },
    emptyState: { fontSize: 12, color: m.textMuted, textAlign: "center", padding: "20px 0" },
    logoutBtn: { margin: "auto 10px 0", padding: "9px 12px", borderRadius: 8, fontSize: 13, color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 },
  };

  const statusColor = (status) => ({
    Active:    { background: "rgba(52,211,153,0.12)",  color: "#34d399" },
    Review:    { background: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
    Completed: { background: "rgba(129,140,248,0.12)", color: "#818cf8" },
    "On Hold": { background: "rgba(248,113,113,0.12)", color: "#f87171" },
  }[status] || {});

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>
          <span style={{ color: m.text }}>Client</span>
          <span style={{ color: a.color }}>Flow</span>
        </div>
        <div style={s.navLabel}>Menu</div>
        {[["Dashboard","🏠","/dashboard"],["Projects","📁","/projects"],["Clients","👥","/clients"],["Invoices","📄","/invoices"],["Messages","💬","/messages"],["Files","📎","/files"]].map(([label, icon, path], i) => (
          <div key={label} style={s.navItem(i === 0)} onClick={() => navigate(path)}>
            <div style={s.navDot(i === 0)}></div>
            {icon} {label}
          </div>
        ))}
        <div style={s.logoutBtn} onClick={handleLogout}>🚪 Logout</div>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.pageTitle}>Good morning, {user?.name} 👋</div>
          <div style={s.controls}>
            {["light","dark","night"].map(md => (
              <button key={md} onClick={() => setMode(md)} style={s.modeBtn(mode === md)}>
                {md === "light" ? "☀️ Light" : md === "dark" ? "🌙 Dark" : "🌑 Night"}
              </button>
            ))}
            <div style={{ display: "flex", gap: 5 }}>
              {Object.keys(accents).map(key => (
                <div key={key} onClick={() => setAccent(key)} style={s.accentDot(key)} />
              ))}
            </div>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </div>

        {/* Content */}
        <div style={s.content}>
          {/* Live Stats */}
          <div style={s.statsGrid}>
            {statCards.map((st) => (
              <div key={st.label} style={s.stat}>
                <div style={s.statAccent}></div>
                <div style={s.statLabel}>{st.label}</div>
                <div style={s.statValue}>{st.value}</div>
                <div style={s.statSub}>{st.sub}</div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div style={s.row}>
            {/* Live Projects */}
            <div style={s.card}>
              <div style={s.cardTitle}>Recent Projects</div>
              {loading ? (
                <div style={s.emptyState}>Loading...</div>
              ) : stats?.recentProjects?.length === 0 ? (
                <div style={s.emptyState}>No projects yet — <span style={{ color: a.color, cursor: "pointer" }} onClick={() => navigate("/projects")}>create one</span></div>
              ) : (
                stats?.recentProjects?.map((p) => (
                  <div key={p._id} style={s.pItem}>
                    <div style={s.pTop}>
                      <span style={s.pName}>{p.name}</span>
                      <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, fontWeight: 600, ...statusColor(p.status) }}>{p.status}</span>
                    </div>
                    <div style={s.barBg}>
                      <div style={s.barFill(p.progress)}></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div style={s.card}>
              <div style={s.cardTitle}>Quick Actions</div>
              {[
                { label: "➕ New Project", path: "/projects", color: a.color },
                { label: "👤 Add Client",  path: "/clients",  color: a.color },
                { label: "📄 New Invoice", path: "/invoices", color: a.color },
                { label: "💬 Messages",   path: "/messages", color: a.color },
                { label: "📎 Files", path: "/files", color: a.color },
              ].map((action) => (
                <div
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${m.cardBorder}`, marginBottom: 8, cursor: "pointer", fontSize: 13, color: m.text, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s", background: m.bg }}
                >
                  {action.label}
                  <span style={{ color: a.color, fontSize: 16 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;