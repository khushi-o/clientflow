import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

const StatCard = ({ label, value, sub, icon, onClick }) => {
  const accent = useAuthStore((s) => s.accent);
  const mode   = useAuthStore((s) => s.mode);
  const a = accents[accent];
  const m = modes[mode];
  const interactive = typeof onClick === "function";

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      style={{
        background: m.statBg, borderRadius: 14,
        padding: "22px 22px", border: `1px solid ${m.cardBorder}`,
        boxShadow: m.shadow, position: "relative", overflow: "hidden",
        transition: "all 0.2s ease", cursor: interactive ? "pointer" : "default",
        minHeight: 148,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 10px 28px ${a.color}22`;
        e.currentTarget.style.borderColor = `${a.color}45`;
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
      {icon && (
        <div style={{ fontSize: 24, marginBottom: 10, userSelect: "none", lineHeight: 1 }} aria-hidden>
          {icon}
        </div>
      )}
      <div style={{
        fontSize: 10, color: m.textMuted, marginBottom: 8,
        textTransform: "uppercase", letterSpacing: "0.4px",
      }}>{label}</div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 28,
        fontWeight: 700, color: m.text, marginBottom: 0, lineHeight: 1.15,
      }}>{value}</div>
      {sub ? (
        <div style={{ fontSize: 10, color: a.color, marginTop: 8 }}>{sub}</div>
      ) : null}
    </div>
  );
};

export default StatCard;
