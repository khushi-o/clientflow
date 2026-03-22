import useAuthStore from "../store/authStore";
import { accents, modes, APP_THEMES } from "../theme";
import { useThemeChange } from "../contexts/ThemeChangeContext.jsx";

/**
 * Single source for theme UI: matches Dashboard pills (header) or Profile grid.
 */
const ThemePicker = ({ variant = "header" }) => {
  const accent = useAuthStore((s) => s.accent);
  const mode = useAuthStore((s) => s.mode);
  const { requestThemeChange } = useThemeChange();

  const a = accents[accent] || accents.earthy;
  const m = modes[mode] || modes.earthy;

  if (variant === "header") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {APP_THEMES.map(({ key, accentKey, label, dot }) => (
          <button
            key={key}
            type="button"
            title={label}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              border: `1px solid ${mode === key ? a.color : m.cardBorder}`,
              background: mode === key ? a.color : m.card,
              color: mode === key ? "#fff" : m.textMuted,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'DM Sans', sans-serif",
            }}
            onClick={() => requestThemeChange(key, accentKey)}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: dot,
                flexShrink: 0,
                boxShadow: mode === key ? `0 0 6px ${dot}` : "none",
              }}
            />
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {APP_THEMES.map(({ key, accentKey, label, dot }) => {
        const active = mode === key && accent === accentKey;
        return (
          <button
            key={key}
            type="button"
            onClick={() => requestThemeChange(key, accentKey)}
            title={label}
            style={{
              padding: 14,
              borderRadius: 12,
              border: `1px solid ${active ? a.color : m.cardBorder}`,
              background: active ? a.glow : m.bg,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: active ? `0 0 0 2px ${a.color}22` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: dot,
                  boxShadow: active ? `0 0 8px ${dot}` : "none",
                }}
              />
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: m.text,
                }}
              >
                {label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemePicker;
