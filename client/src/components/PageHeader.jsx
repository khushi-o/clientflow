import useAuthStore from "../store/authStore";
import { modes } from "../theme";

const PageHeader = ({ title, children }) => {
  const mode = useAuthStore((s) => s.mode);
  const m = modes[mode];

  return (
    <div
      style={{
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${m.cardBorder}`,
        background: m.topbar,
        transition: "all 0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: m.text,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{children}</div>
    </div>
  );
};

export default PageHeader;

