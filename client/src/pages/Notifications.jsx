import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const Notifications = () => {
  const accent = useAuthStore((s) => s.accent);
  const mode   = useAuthStore((s) => s.mode);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  const a = accents[accent];
  const m = modes[mode];

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const deleteOne = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all notifications?")) return;
    try {
      await API.delete("/notifications");
      setNotifications([]);
    } catch (err) { console.error(err); }
  };

  const typeIcon = (type) => ({
    message: "💬", invoice: "📄",
    project: "📁", file: "📎", general: "🔔",
  }[type] || "🔔");

  const typeColor = (type) => ({
    message: a.color,
    invoice: "#fbbf24",
    project: "#34d399",
    file:    "#38bdf8",
    general: "#94a3b8",
  }[type] || "#94a3b8");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date) => {
    const now = new Date();
    const d   = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60)   return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const s = {
    content: { padding: "28px", flex: 1 },
    topRow: {
      display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: 20,
    },
    topLeft: { display: "flex", alignItems: "center", gap: 12 },
    heading: {
      fontFamily: "'Syne', sans-serif", fontSize: 16,
      fontWeight: 700, color: m.text,
    },
    badge: {
      padding: "2px 10px", borderRadius: 20,
      background: a.color, color: "#fff",
      fontSize: 11, fontWeight: 700,
    },
    topBtns: { display: "flex", gap: 8 },
    topBtn: (color) => ({
      padding: "6px 14px", borderRadius: 8, border: `1px solid ${m.cardBorder}`,
      background: "transparent", color: color, fontSize: 12,
      fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
    }),
    list: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 700 },
    item: (read) => ({
      background: read ? m.card : m.statBg,
      borderRadius: 12, border: `1px solid ${read ? m.cardBorder : a.color + "30"}`,
      padding: "16px 18px", display: "flex", alignItems: "flex-start",
      gap: 14, boxShadow: m.shadow, transition: "all 0.2s", cursor: "pointer",
      position: "relative", overflow: "hidden",
    }),
    unreadDot: {
      position: "absolute", top: 14, right: 14,
      width: 8, height: 8, borderRadius: "50%",
      background: a.color, boxShadow: `0 0 8px ${a.color}`,
    },
    iconBox: (type) => ({
      width: 40, height: 40, borderRadius: 10,
      background: typeColor(type) + "15",
      border: `1px solid ${typeColor(type)}30`,
      display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 18, flexShrink: 0,
    }),
    itemContent: { flex: 1, minWidth: 0 },
    itemTitle: {
      fontSize: 13, fontWeight: 600, color: m.text,
      marginBottom: 4,
    },
    itemMsg: { fontSize: 12, color: m.textMuted, lineHeight: 1.5, marginBottom: 6 },
    itemTime: { fontSize: 10, color: m.textMuted, opacity: 0.7 },
    itemActions: { display: "flex", gap: 6, flexShrink: 0 },
    actionBtn: (color) => ({
      padding: "4px 10px", borderRadius: 6, border: "none",
      background: color + "15", color: color,
      fontSize: 10, fontWeight: 600, cursor: "pointer",
      transition: "all 0.2s",
    }),
  };

  return (
    <Layout>
      <PageHeader title="Notifications">
        {unreadCount > 0 && (
          <button
            style={s.topBtn(a.color)}
            onClick={markAllRead}
            onMouseEnter={(e) => e.currentTarget.style.background = a.glow}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            ✓ Mark all read
          </button>
        )}
        {notifications.length > 0 && (
          <button
            style={s.topBtn("#f87171")}
            onClick={clearAll}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            🗑 Clear all
          </button>
        )}
      </PageHeader>

      <div style={s.content}>
        <div style={s.topRow}>
          <div style={s.topLeft}>
            <div style={s.heading}>
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </div>
            {unreadCount > 0 && (
              <div style={s.badge}>{unreadCount} unread</div>
            )}
          </div>
        </div>

        {loading ? (
          <EmptyState icon="⏳" title="Loading..." subtitle="" />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications yet"
            subtitle="You'll see notifications here when there's activity on your projects"
          />
        ) : (
          <div style={s.list}>
            {notifications.map((n) => (
              <div
                key={n._id}
                style={s.item(n.read)}
                onClick={() => {
                  if (!n.read) markRead(n._id);
                  if (n.link) navigate(n.link);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.borderColor = `${a.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.borderColor = n.read ? m.cardBorder : `${a.color}30`;
                }}
              >
                {!n.read && <div style={s.unreadDot}></div>}
                <div style={s.iconBox(n.type)}>{typeIcon(n.type)}</div>
                <div style={s.itemContent}>
                  <div style={s.itemTitle}>{n.title}</div>
                  <div style={s.itemMsg}>{n.message}</div>
                  <div style={s.itemTime}>{formatTime(n.createdAt)}</div>
                </div>
                <div style={s.itemActions} onClick={(e) => e.stopPropagation()}>
                  {!n.read && (
                    <button
                      style={s.actionBtn(a.color)}
                      onClick={() => markRead(n._id)}
                    >
                      ✓ Read
                    </button>
                  )}
                  <button
                    style={s.actionBtn("#f87171")}
                    onClick={() => deleteOne(n._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;