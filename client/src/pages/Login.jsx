import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to ClientFlow</p>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            style={styles.input}
            required
          />
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.anchor}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    margin: "0 0 24px 0",
    color: "#666",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
  link: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },
  anchor: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;