import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

const EmptyState = ({ icon, title, subtitle, action, onAction }) => {
  const accent = useAuthStore((s) => s.accent);
  const mode   = useAuthStore((s) => s.mode);
  const a = accents[accent];
  const m = modes[mode];

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "80px 20px", textAlign: "center",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: a.glow, border: `1px solid ${a.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36, marginBottom: 20,
      }}>{icon}</div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 18,
        fontWeight: 700, color: m.text, marginBottom: 8,
      }}>{title}</div>
      <div style={{
        fontSize: 13, color: m.textMuted, marginBottom: 24,
        maxWidth: 280, lineHeight: 1.6,
      }}>{subtitle}</div>
      {action && (
        <button
          onClick={onAction}
          style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: a.color, color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
            boxShadow: `0 0 20px ${a.color}50`,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;