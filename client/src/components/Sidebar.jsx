import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

const NAV = [
  ["Dashboard",     "🏠", "/dashboard"],
  ["Projects",      "📁", "/projects"],
  ["Clients",       "👥", "/clients"],
  ["Invoices",      "📄", "/invoices"],
  ["Messages",      "💬", "/messages"],
  ["Files",         "📎", "/files"],
  ["Notifications", "🔔", "/notifications"],
  ["Settings",      "⚙️", "/profile"],
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout   = useAuthStore((s) => s.logout);
  const accent   = useAuthStore((s) => s.accent);
  const mode     = useAuthStore((s) => s.mode);
  const [unread, setUnread] = useState(0);

  const a = accents[accent] || accents["earthy"];
  const m = modes[mode]     || modes["earthy"];

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await API.get("/notifications");
      setUnread(res.data.filter((n) => !n.read).length);
    } catch (err) {}
  };

  const s = {
    sidebar: {
      width: 220, background: m.sidebar, display: "flex",
      flexDirection: "column", padding: "24px 0",
      borderRight: `1px solid ${m.cardBorder}`,
      flexShrink: 0, height: "100vh", position: "sticky",
      top: 0, transition: "all 0.3s ease", overflowY: "auto",
    },
    logo: {
      fontFamily: "'Syne', sans-serif", fontSize: 18,
      fontWeight: 700, padding: "0 20px 32px", letterSpacing: "-0.3px",
      cursor: "pointer",
    },
    navLabel: {
      fontSize: 9, color: m.textMuted, letterSpacing: "1.5px",
      textTransform: "uppercase", padding: "0 12px 8px 20px",
    },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", margin: "1px 10px", borderRadius: 8,
      fontSize: 13, cursor: "pointer",
      color: active ? m.text : m.textMuted,
      background: active ? a.glow : "transparent",
      transition: "all 0.2s ease",
      fontWeight: active ? 500 : 400,
    }),
    navDot: (active) => ({
      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
      background: active ? a.color : m.textMuted,
      boxShadow: active ? `0 0 8px ${a.color}` : "none",
      transition: "all 0.2s ease",
    }),
    badge: {
      marginLeft: "auto", background: a.color, color: "#fff",
      fontSize: 9, fontWeight: 700, padding: "1px 6px",
      borderRadius: 20, minWidth: 16, textAlign: "center",
    },
    divider: {
      height: 1, background: m.cardBorder, margin: "12px 20px",
    },
    logoutBtn: {
      margin: "8px 10px 0", padding: "10px 14px", borderRadius: 8,
      fontSize: 13, color: "#f87171", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 8,
      transition: "all 0.2s", border: "1px solid transparent",
      background: "transparent", width: "calc(100% - 20px)",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    },
  };

  return (
    <div style={s.sidebar}>
      <div style={s.logo} onClick={() => navigate("/dashboard")}>
      <span style={{ color: a.color }}>Client</span>
      <span style={{ color: m.text }}>Flow</span>
      </div>
      <div style={s.navLabel}>Menu</div>
      {NAV.map(([label, icon, path]) => {
        const active = location.pathname === path;
        return (
          <div
            key={label}
            style={s.navItem(active)}
            onClick={() => navigate(path)}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.color = m.text;
                e.currentTarget.style.background = m.cardBorder;
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.color = m.textMuted;
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <div style={s.navDot(active)}></div>
            {icon} {label}
            {label === "Notifications" && unread > 0 && (
              <span style={s.badge}>{unread}</span>
            )}
          </div>
        );
      })}
      <div style={s.divider}></div>
      <button
        style={s.logoutBtn}
        onClick={() => { logout(); navigate("/login"); }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(248,113,113,0.08)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;