import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { pushRecent } from "../utils/recentItems";

const Clients = () => {
  const accent = useAuthStore((s) => s.accent);
  const mode   = useAuthStore((s) => s.mode);
  const user   = useAuthStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showModal, setShowModal]         = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch]               = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", status: "Active", notes: "" });

  const a = accents[accent];
  const m = modes[mode];

  useEffect(() => { fetchClients(); }, []);

  useEffect(() => {
    const id = searchParams.get("clientId");
    if (!id || !clients.length) return;
    const c = clients.find((x) => x._id === id);
    if (c) setSelectedClient(c);
  }, [searchParams, clients]);

  const fetchClients = async () => {
    try {
      const res = await API.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.email) return alert("Name and email are required");
    try {
      const res = await API.post("/clients", form);
      setClients([res.data, ...clients]);
      setShowModal(false);
      setForm({ name: "", email: "", phone: "", company: "", status: "Active", notes: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create client");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await API.delete(`/clients/${id}`);
      setClients(clients.filter((c) => c._id !== id));
      setSelectedClient(null);
    } catch {
      alert("Failed to delete client");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await API.put(`/clients/${id}`, { status });
      setClients(clients.map((c) => c._id === id ? res.data : c));
      setSelectedClient(res.data);
    } catch {
      alert("Failed to update status");
    }
  };

  const statusColor = (status) => ({
    Active:   { background: "rgba(52,211,153,0.12)",  color: "#34d399" },
    Inactive: { background: "rgba(248,113,113,0.12)", color: "#f87171" },
    Lead:     { background: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
  }[status] || {});

  const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || "").toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    searchInput: {
      padding: "8px 14px", borderRadius: 8,
      border: `1px solid ${m.cardBorder}`, background: m.card,
      color: m.text, fontSize: 13, outline: "none",
      width: 200, fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s",
    },
    addBtn: {
      padding: "8px 18px", borderRadius: 8, border: "none",
      background: a.color, color: "#fff", fontSize: 13,
      fontWeight: 600, cursor: "pointer",
      boxShadow: `0 0 14px ${a.color}60`, transition: "all 0.2s",
    },
    content: { padding: "24px 28px", flex: 1, display: "flex", gap: 20 },
    grid: {
      flex: 1, display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: 16, alignContent: "start",
    },
    card: (selected) => ({
      background: selected ? a.glow : m.card, borderRadius: 14,
      border: `1px solid ${selected ? a.color : m.cardBorder}`,
      padding: 18, boxShadow: m.shadow, cursor: "pointer",
      transition: "all 0.2s ease", position: "relative", overflow: "hidden",
    }),
    cardAccent: {
      position: "absolute", top: 0, left: 0, right: 0, height: 2,
      background: a.color, opacity: 0.6,
    },
    cardTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
    avatar: {
      width: 44, height: 44, borderRadius: "50%",
      background: a.color + "25", border: `1px solid ${a.color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, fontWeight: 700, color: a.color, flexShrink: 0,
      transition: "all 0.2s",
    },
    clientName: { fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: m.text },
    clientCompany: { fontSize: 11, color: m.textMuted, marginTop: 2 },
    clientInfo: { fontSize: 12, color: m.textMuted, display: "flex", alignItems: "center", gap: 6, marginBottom: 4 },
    cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
    detail: {
      width: 290, background: m.card, borderRadius: 14,
      border: `1px solid ${m.cardBorder}`, padding: 20,
      boxShadow: m.shadow, flexShrink: 0, height: "fit-content",
      position: "sticky", top: 80,
    },
    detailAvatar: {
      width: 60, height: 60, borderRadius: "50%",
      background: a.color + "25", border: `2px solid ${a.color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, fontWeight: 700, color: a.color,
      margin: "0 auto 12px", boxShadow: `0 0 20px ${a.color}30`,
    },
    detailName: { fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: m.text, textAlign: "center", marginBottom: 4 },
    detailCompany: { fontSize: 12, color: m.textMuted, textAlign: "center", marginBottom: 16 },
    divider: { height: 1, background: m.cardBorder, margin: "12px 0" },
    infoRow: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 12 },
    infoLabel: { color: m.textMuted, width: 55, flexShrink: 0 },
    infoValue: { color: m.text, fontWeight: 500, wordBreak: "break-all" },
    actionBtns: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
    actionBtn: (color) => ({
      padding: "6px 12px", borderRadius: 6, border: "none",
      background: color + "20", color: color, fontSize: 11,
      fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
    }),
    overlay: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(4px)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    },
    modal: {
      background: m.card, borderRadius: 16,
      border: `1px solid ${m.cardBorder}`, padding: 28,
      width: "90%", maxWidth: 460,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)", boxSizing: "border-box",
    },
    modalTitle: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: m.text, marginBottom: 20 },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    input: {
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: `1px solid ${m.cardBorder}`, background: m.bg,
      color: m.text, fontSize: 13, marginBottom: 10, outline: "none",
      fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", minWidth: 0,
    },
    select: {
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: `1px solid ${m.cardBorder}`, background: m.bg,
      color: m.text, fontSize: 13, marginBottom: 10, outline: "none",
      fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", minWidth: 0,
    },
    modalBtns: { display: "flex", gap: 10, marginTop: 8 },
    cancelBtn: { flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${m.cardBorder}`, background: "transparent", color: m.textMuted, fontSize: 13, cursor: "pointer" },
    saveBtn: { flex: 1, padding: "10px", borderRadius: 8, border: "none", background: a.color, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 0 14px ${a.color}60` },
  };

  return (
    <Layout>
      <PageHeader title="Clients">
        <input
          style={s.searchInput}
          placeholder="🔍 Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={(e) => e.currentTarget.style.borderColor = a.color}
          onBlur={(e) => e.currentTarget.style.borderColor = m.cardBorder}
        />
        <button
          style={s.addBtn}
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          + Add Client
        </button>
      </PageHeader>

      <div style={s.content}>
        <div style={s.grid}>
          {loading ? (
            <EmptyState icon="⏳" title="Loading clients..." subtitle="" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="🤝"
              title={search ? "No clients found" : "No clients yet"}
              subtitle={search ? "Try a different search term" : "Add your first client to get started"}
              action={search ? null : "+ Add Client"}
              onAction={() => setShowModal(true)}
            />
          ) : (
            filtered.map((c) => (
              <div
                key={c._id}
                style={s.card(selectedClient?._id === c._id)}
                onClick={() => {
                  setSelectedClient(c);
                  setSearchParams({ clientId: c._id });
                  pushRecent(user?._id, {
                    type: "client",
                    id: c._id,
                    title: c.name,
                    subtitle: c.email,
                    path: `/clients?clientId=${c._id}`,
                  });
                }}
                onMouseEnter={(e) => {
                  if (selectedClient?._id !== c._id) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${a.color}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = m.shadow;
                }}
              >
                <div style={s.cardAccent}></div>
                <div style={s.cardTop}>
                  <div style={s.avatar}>{initials(c.name)}</div>
                  <div>
                    <div style={s.clientName}>{c.name}</div>
                    <div style={s.clientCompany}>{c.company || "No company"}</div>
                  </div>
                </div>
                <div style={s.clientInfo}>📧 {c.email}</div>
                {c.phone && <div style={s.clientInfo}>📞 {c.phone}</div>}
                <div style={s.cardFooter}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, ...statusColor(c.status) }}>{c.status}</span>
                  <span style={{ fontSize: 11, color: m.textMuted }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedClient && (
          <div style={s.detail}>
            <div style={s.detailAvatar}>{initials(selectedClient.name)}</div>
            <div style={s.detailName}>{selectedClient.name}</div>
            <div style={s.detailCompany}>{selectedClient.company || "No company"}</div>
            <div style={s.divider}></div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Email</span>
              <span style={{ ...s.infoValue, color: a.color }}>{selectedClient.email}</span>
            </div>
            {selectedClient.phone && (
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Phone</span>
                <span style={s.infoValue}>{selectedClient.phone}</span>
              </div>
            )}
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Status</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, ...statusColor(selectedClient.status) }}>{selectedClient.status}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Added</span>
              <span style={s.infoValue}>{new Date(selectedClient.createdAt).toLocaleDateString()}</span>
            </div>
            {selectedClient.notes && (
              <>
                <div style={s.divider}></div>
                <div style={{ fontSize: 12, color: m.textMuted, lineHeight: 1.6 }}>{selectedClient.notes}</div>
              </>
            )}
            <div style={s.divider}></div>
            <div style={{ fontSize: 11, color: m.textMuted, marginBottom: 8 }}>Change Status</div>
            <div style={s.actionBtns}>
              {["Active","Inactive","Lead"].map((status) => (
                <button
                  key={status}
                  style={s.actionBtn(status === "Active" ? "#34d399" : status === "Lead" ? "#fbbf24" : "#f87171")}
                  onClick={() => handleStatusChange(selectedClient._id, status)}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              style={{ ...s.actionBtn("#f87171"), marginTop: 10, width: "100%" }}
              onClick={() => handleDelete(selectedClient._id)}
            >
              🗑 Delete Client
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>Add Client</div>
            <div style={s.row2}>
              <input style={s.input} placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input style={s.input} placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={s.row2}>
              <input style={s.input} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input style={s.input} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <select style={s.select} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Lead">Lead</option>
            </select>
            <textarea style={{ ...s.input, height: 80, resize: "vertical" }} placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.saveBtn} onClick={handleCreate}>Add Client</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Clients;