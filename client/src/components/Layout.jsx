import Sidebar from "./Sidebar";
import GlobalSearch from "./GlobalSearch";
import useAuthStore from "../store/authStore";
import { modes } from "../theme";

const Layout = ({ children }) => {
  const mode = useAuthStore((s) => s.mode);
  const m = modes[mode];

  return (
    <div
      style={{
        display: "flex",
        minHeight: 0,
        height: "100vh",
        maxHeight: "100dvh",
        overflow: "hidden",
        background: m.bg,
        color: m.text,
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.3s ease",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxSizing: "border-box",
      }}
    >
      <GlobalSearch />
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        height: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;