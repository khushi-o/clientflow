import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

const StatCard = ({ label, value, sub, icon }) => {
  const accent = useAuthStore((s) => s.accent);
  const mode   = useAuthStore((s) => s.mode);
  const a = accents[accent];
  const m = modes[mode];

  return (
    <div
      style={{
        background: m.statBg, borderRadius: 14,
        padding: "16px 18px", border: `1px solid ${m.cardBorder}`,
        boxShadow: m.shadow, position: "relative", overflow: "hidden",
        transition: "all 0.2s ease", cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${a.color}20`;
        e.currentTarget.style.borderColor = `${a.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = m.shadow;
        e.currentTarget.style.borderColor = m.cardBorder;
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: a.color, opacity: 0.7,
      }}></div>
      {icon && <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>}
      <div style={{
        fontSize: 10, color: m.textMuted, marginBottom: 6,
        textTransform: "uppercase", letterSpacing: "0.4px",
      }}>{label}</div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 24,
        fontWeight: 700, color: m.text, marginBottom: 4,
      }}>{value}</div>
      <div style={{ fontSize: 10, color: a.color }}>{sub}</div>
    </div>
  );
};

export default StatCard;