import Sidebar from "./Sidebar";
import useAuthStore from "../store/authStore";
import { modes } from "../theme";

const Layout = ({ children }) => {
  const mode = useAuthStore((s) => s.mode);
  const m = modes[mode];

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: m.bg, color: m.text,
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.3s ease",
    }}>
      <Sidebar />
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        minWidth: 0, height: "100vh", overflowY: "auto",
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;