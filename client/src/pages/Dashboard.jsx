import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>ClientFlow</div>
        <nav style={styles.nav}>
          <div style={styles.navItem}>🏠 Dashboard</div>
          <div style={styles.navItem}>📁 Projects</div>
          <div style={styles.navItem}>👥 Clients</div>
          <div style={styles.navItem}>📄 Invoices</div>
          <div style={styles.navItem}>💬 Messages</div>
        </nav>
        <div style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>
            Welcome back, {user?.name} 👋
          </h1>
          <span style={styles.role}>{user?.role}</span>
        </div>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Projects</h3>
            <p style={styles.cardValue}>0</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Active Clients</h3>
            <p style={styles.cardValue}>0</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Pending Invoices</h3>
            <p style={styles.cardValue}>0</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Messages</h3>
            <p style={styles.cardValue}>0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#111",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: "40px",
    paddingLeft: "12px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#ccc",
  },
  logoutBtn: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#ff6b6b",
  },
  main: {
    flex: 1,
    padding: "32px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  welcome: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
    margin: 0,
  },
  role: {
    backgroundColor: "#6366f1",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: "13px",
    color: "#888",
    margin: "0 0 8px 0",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111",
    margin: 0,
  },
};

export default Dashboard;