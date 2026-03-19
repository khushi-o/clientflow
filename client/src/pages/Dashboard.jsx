import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
  const user      = useAuthStore((s) => s.user);
  const accent    = useAuthStore((s) => s.accent);
  const mode      = useAuthStore((s) => s.mode);
  const setAccent = useAuthStore((s) => s.setAccent);
  const setMode   = useAuthStore((s) => s.setMode);
  const navigate  = useNavigate();
  const [stats, setStats]     = useState(null);
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

  const statusColor = (status) => ({
    Active:    { background: "rgba(52,211,153,0.12)",  color: "#34d399" },
    Review:    { background: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
    Completed: { background: "rgba(129,140,248,0.12)", color: "#818cf8" },
    "On Hold": { background: "rgba(248,113,113,0.12)", color: "#f87171" },
  }[status] || {});

  const s = {
    controls: { display: "flex", alignItems: "center", gap: 10 },
    modeBtn: (active) => ({
      padding: "5px 12px", borderRadius: 20, fontSize: 11,
      fontWeight: 500, cursor: "pointer", border: "none",
      background: active ? a.color : m.card,
      color: active ? "#fff" : m.textMuted,
      boxShadow: active ? `0 0 12px ${a.color}60` : "none",
      transition: "all 0.2s",
    }),
    accentDot: (key) => ({
      width: 16, height: 16, borderRadius: "50%",
      background: accents[key].color, cursor: "pointer",
      border: accent === key ? `2px solid ${m.text}` : "2px solid transparent",
      boxShadow: accent === key ? `0 0 10px ${accents[key].color}` : "none",
      transition: "all 0.2s", flexShrink: 0,
    }),
    avatar: {
      width: 32, height: 32, borderRadius: "50%",
      background: a.color, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 12, fontWeight: 600,
      color: "#fff", boxShadow: `0 0 12px ${a.color}80`,
    },
    content: { padding: "24px 28px", flex: 1 },
    statsGrid: {
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: 14, marginBottom: 24,
    },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    card: {
      background: m.card, borderRadius: 14,
      border: `1px solid ${m.cardBorder}`,
      padding: 20, boxShadow: m.shadow,
      transition: "all 0.3s ease",
    },
    cardTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 600,
      color: m.textMuted, letterSpacing: "0.8px",
      textTransform: "uppercase", marginBottom: 16,
    },
    pItem: {
      padding: "10px 12px", borderRadius: 8,
      border: `1px solid ${m.cardBorder}`,
      marginBottom: 8, transition: "all 0.2s",
      cursor: "pointer", background: m.bg,
    },
    pTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    pName: { fontSize: 13, fontWeight: 500, color: m.text },
    barBg: { height: 3, background: m.cardBorder, borderRadius: 2, overflow: "hidden" },
    barFill: (pct) => ({
      height: "100%", borderRadius: 2, width: `${pct}%`,
      background: `linear-gradient(90deg, ${a.color}, ${a.color}99)`,
      boxShadow: `0 0 6px ${a.color}60`, transition: "width 0.8s ease",
    }),
    actionItem: {
      padding: "12px 16px", borderRadius: 10,
      border: `1px solid ${m.cardBorder}`,
      marginBottom: 8, cursor: "pointer",
      fontSize: 13, color: m.text,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.2s", background: m.bg,
    },
    arrow: { color: a.color, fontSize: 16, transition: "transform 0.2s" },
  };

  const statCards = stats ? [
    { label: "Projects",         value: stats.projects,        sub: "total",        icon: "📁" },
    { label: "Clients",          value: stats.clients,         sub: "total",        icon: "👥" },
    { label: "Pending Invoices", value: stats.pendingInvoices, sub: "unpaid",       icon: "📄" },
    { label: "Revenue",          value: `₹${stats.totalRevenue.toLocaleString()}`, sub: "from paid invoices", icon: "💰" },
  ] : [
    { label: "Projects",         value: "—", sub: "loading", icon: "📁" },
    { label: "Clients",          value: "—", sub: "loading", icon: "👥" },
    { label: "Pending Invoices", value: "—", sub: "loading", icon: "📄" },
    { label: "Revenue",          value: "—", sub: "loading", icon: "💰" },
  ];

  const quickActions = [
    { label: "➕ New Project", path: "/projects" },
    { label: "👤 Add Client",  path: "/clients"  },
    { label: "📄 New Invoice", path: "/invoices" },
    { label: "💬 Messages",    path: "/messages" },
    { label: "📎 Files",       path: "/files"    },
  ];

  return (
    <Layout>
      <PageHeader title={`Good morning, ${user?.name} 👋`}>
        <div style={s.controls}>
          {["light","dark","night"].map(md => (
            <button key={md} onClick={() => setMode(md)} style={s.modeBtn(mode === md)}>
              {md === "light" ? "☀️" : md === "dark" ? "🌙" : "🌑"}
            </button>
          ))}
          <div style={{ display: "flex", gap: 5 }}>
            {Object.keys(accents).map(key => (
              <div key={key} onClick={() => setAccent(key)} style={s.accentDot(key)} />
            ))}
          </div>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        </div>
      </PageHeader>

      <div style={s.content}>
        <div style={s.statsGrid}>
          {statCards.map((st) => (
            <StatCard key={st.label} {...st} />
          ))}
        </div>

        <div style={s.row}>
          <div style={s.card}>
            <div style={s.cardTitle}>Recent Projects</div>
            {loading ? (
              <EmptyState icon="⏳" title="Loading..." subtitle="" />
            ) : !stats?.recentProjects?.length ? (
              <EmptyState
                icon="📁" title="No projects yet"
                subtitle="Create your first project to get started"
                action="Create Project"
                onAction={() => navigate("/projects")}
              />
            ) : (
              stats.recentProjects.map((p) => (
                <div
                  key={p._id} style={s.pItem}
                  onClick={() => navigate("/projects")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${a.color}40`;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = m.cardBorder;
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
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

          <div style={s.card}>
            <div style={s.cardTitle}>Quick Actions</div>
            {quickActions.map((action) => (
              <div
                key={action.label}
                style={s.actionItem}
                onClick={() => navigate(action.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${a.color}40`;
                  e.currentTarget.style.background = a.glow;
                  e.currentTarget.querySelector(".arrow").style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = m.cardBorder;
                  e.currentTarget.style.background = m.bg;
                  e.currentTarget.querySelector(".arrow").style.transform = "translateX(0)";
                }}
              >
                {action.label}
                <span className="arrow" style={s.arrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;