import useAuthStore from "../store/authStore";
import { modes } from "../theme";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const mode = useAuthStore((s) => s.mode);
  const m = modes[mode];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: m.bg,
        color: m.text,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
};

export default Layout;