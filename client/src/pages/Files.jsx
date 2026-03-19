import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

const Files = () => {
  const logout = useAuthStore((state) => state.logout);
  const accent = useAuthStore((state) => state.accent);
  const mode = useAuthStore((state) => state.mode);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const a = accents[accent];
  const m = modes[mode];

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectProject = async (project) => {
    setSelectedProject(project);
    setLoading(true);
    try {
      const res = await API.get(`/files/${project._id}`);
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProject) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post(`/files/${selectedProject._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([res.data, ...files]);
    } catch (err) {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await API.delete(`/files/${fileId}`);
      setFiles(files.filter((f) => f._id !== fileId));
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  const handleDownload = (fileId, originalName) => {
    window.open(`http://localhost:5000/api/files/download/${fileId}`, "_blank");
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIcon = (mimetype) => {
    if (mimetype?.includes("image")) return "🖼️";
    if (mimetype?.includes("pdf")) return "📄";
    if (mimetype?.includes("word") || mimetype?.includes("document")) return "📝";
    if (mimetype?.includes("sheet") || mimetype?.includes("excel")) return "📊";
    if (mimetype?.includes("zip") || mimetype?.includes("rar")) return "🗜️";
    if (mimetype?.includes("video")) return "🎥";
    if (mimetype?.includes("audio")) return "🎵";
    return "📁";
  };

  const s = {
    app: { display: "flex", minHeight: "100vh", background: m.bg, color: m.text, fontFamily: "'DM Sans', sans-serif" },
    sidebar: { width: 220, background: m.sidebar, display: "flex", flexDirection: "column", padding: "24px 0", borderRight: `1px solid ${m.cardBorder}`, flexShrink: 0 },
    logo: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, padding: "0 20px 32px", letterSpacing: "-0.3px" },
    navLabel: { fontSize: 9, color: m.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 12px 6px 20px" },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", margin: "1px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: active ? m.text : m.textMuted, background: active ? a.glow : "transparent", transition: "all 0.2s" }),
    navDot: (active) => ({ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: active ? a.color : m.textMuted, boxShadow: active ? `0 0 8px ${a.color}` : "none" }),
    main: { flex: 1, display: "flex", minWidth: 0 },
    projectList: { width: 260, borderRight: `1px solid ${m.cardBorder}`, display: "flex", flexDirection: "column", background: m.sidebar },
    projectListHeader: { padding: "16px 20px", borderBottom: `1px solid ${m.cardBorder}`, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: m.text },
    projectItem: (active) => ({ padding: "12px 20px", cursor: "pointer", borderBottom: `1px solid ${m.cardBorder}`, background: active ? a.glow : "transparent", transition: "all 0.2s" }),
    projectItemName: (active) => ({ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? m.text : m.textMuted }),
    projectItemSub: { fontSize: 11, color: m.textMuted, marginTop: 2 },
    fileArea: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
    fileHeader: { padding: "16px 24px", borderBottom: `1px solid ${m.cardBorder}`, background: m.topbar, display: "flex", alignItems: "center", justifyContent: "space-between" },
    fileHeaderTitle: { fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: m.text },
    uploadBtn: { padding: "8px 16px", borderRadius: 8, border: "none", background: a.color, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 0 12px ${a.color}60` },
    fileGrid: { padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, alignContent: "start", flex: 1, overflowY: "auto" },
    fileCard: { background: m.card, borderRadius: 12, border: `1px solid ${m.cardBorder}`, padding: 16, boxShadow: m.shadow, position: "relative", overflow: "hidden" },
    fileCardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: a.color, opacity: 0.6 },
    fileIcon: { fontSize: 32, marginBottom: 10, display: "block" },
    fileName: { fontSize: 12, fontWeight: 600, color: m.text, marginBottom: 4, wordBreak: "break-all", lineHeight: 1.4 },
    fileMeta: { fontSize: 10, color: m.textMuted, marginBottom: 12 },
    fileActions: { display: "flex", gap: 6 },
    fileBtn: (color) => ({ flex: 1, padding: "5px 8px", borderRadius: 6, border: "none", background: color + "20", color: color, fontSize: 10, fontWeight: 600, cursor: "pointer" }),
    empty: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: m.textMuted, fontSize: 14, flexDirection: "column", gap: 8 },
    dropZone: { margin: 24, border: `2px dashed ${m.cardBorder}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: m.textMuted, cursor: "pointer", transition: "all 0.2s" },
    logoutBtn: { margin: "auto 10px 0", padding: "9px 12px", borderRadius: 8, fontSize: 13, color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 },
  };

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={s.logo}>
          <span style={{ color: m.text }}>Client</span>
          <span style={{ color: a.color }}>Flow</span>
        </div>
        <div style={s.navLabel}>Menu</div>
        {[["Dashboard","🏠","/dashboard"],["Projects","📁","/projects"],["Clients","👥","/clients"],["Invoices","📄","/invoices"],["Messages","💬","/messages"],["Files","📎","/files"]].map(([label, icon, path]) => (
          <div key={label} style={s.navItem(label === "Files")} onClick={() => navigate(path)}>
            <div style={s.navDot(label === "Files")}></div>
            {icon} {label}
          </div>
        ))}
        <div style={s.logoutBtn} onClick={() => { logout(); navigate("/login"); }}>
          🚪 Logout
        </div>
      </div>

      <div style={s.main}>
        {/* Project list */}
        <div style={s.projectList}>
          <div style={s.projectListHeader}>📎 Projects</div>
          {projects.length === 0 ? (
            <div style={{ padding: 20, fontSize: 12, color: m.textMuted }}>
              No projects yet. <span style={{ color: a.color, cursor: "pointer" }} onClick={() => navigate("/projects")}>Create one</span>
            </div>
          ) : (
            projects.map((p) => (
              <div key={p._id} style={s.projectItem(selectedProject?._id === p._id)} onClick={() => selectProject(p)}>
                <div style={s.projectItemName(selectedProject?._id === p._id)}>{p.name}</div>
                <div style={s.projectItemSub}>{p.status}</div>
              </div>
            ))
          )}
        </div>

        {/* File area */}
        <div style={s.fileArea}>
          {!selectedProject ? (
            <div style={s.empty}>
              <div style={{ fontSize: 40 }}>📎</div>
              <div>Select a project to view files</div>
            </div>
          ) : (
            <>
              <div style={s.fileHeader}>
                <div style={s.fileHeaderTitle}>{selectedProject.name} — Files</div>
                <button style={s.uploadBtn} onClick={() => fileInputRef.current.click()}>
                  {uploading ? "Uploading..." : "⬆️ Upload File"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleUpload}
                />
              </div>

              {loading ? (
                <div style={s.empty}>Loading files...</div>
              ) : files.length === 0 ? (
                <div
                  style={s.dropZone}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                  <div style={{ fontSize: 14, marginBottom: 6 }}>No files yet</div>
                  <div style={{ fontSize: 12 }}>Click to upload your first file</div>
                </div>
              ) : (
                <div style={s.fileGrid}>
                  {files.map((file) => (
                    <div key={file._id} style={s.fileCard}>
                      <div style={s.fileCardAccent}></div>
                      <span style={s.fileIcon}>{fileIcon(file.mimetype)}</span>
                      <div style={s.fileName}>{file.originalName}</div>
                      <div style={s.fileMeta}>
                        {formatSize(file.size)} · {file.uploadedByName} · {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                      <div style={s.fileActions}>
                        <button style={s.fileBtn(a.color)} onClick={() => handleDownload(file._id, file.originalName)}>
                          ⬇️ Download
                        </button>
                        <button style={s.fileBtn("#f87171")} onClick={() => handleDelete(file._id)}>
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;