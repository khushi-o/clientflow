import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useAuthStore from "../store/authStore";

const C = {
  bg:        "#F9F7F2",
  green:     "#1B4332",
  terracotta:"#D08C60",
  charcoal:  "#2D2D2D",
  muted:     "#7A7670",
  border:    "#E8E4DC",
};

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

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
    <div style={s.page}>
      {/* Left panel */}
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.brandLogo}>H</div>
          <div style={s.brandName}>Hestia</div>
        </div>

        <div style={s.tagline}>
          <div style={s.taglineTitle}>
            Manage clients,<br />projects & invoices
          </div>
          <div style={s.taglineSub}>
            All in one beautiful workspace built for freelancers and agencies.
          </div>
        </div>

        <div style={s.steps}>
          {[
            { num: "01", text: "Create your account"          },
            { num: "02", text: "Add your first project"       },
            { num: "03", text: "Invite clients & collaborate" },
          ].map((step) => (
            <div key={step.num} style={s.step}>
              <div style={s.stepNum}>{step.num}</div>
              <div style={s.stepText}>{step.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.logoRow}>
              <div style={s.logoBox}>H</div>
            </div>
            <div style={s.title}>Welcome back</div>
            <div style={s.subtitle}>Sign in to your workspace</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email</label>
              <input
                {...register("email")}
                type="email" required
                placeholder="you@example.com"
                style={s.input}
                onFocus={(e) => e.currentTarget.style.borderColor = C.green}
                onBlur={(e)  => e.currentTarget.style.borderColor = C.border}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <input
                {...register("password")}
                type="password" required
                placeholder="••••••••"
                style={s.input}
                onFocus={(e) => e.currentTarget.style.borderColor = C.green}
                onBlur={(e)  => e.currentTarget.style.borderColor = C.border}
              />
            </div>
            <button
              type="submit" style={s.btn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform  = "translateY(-2px)";
                e.currentTarget.style.boxShadow  = `0 8px 24px ${C.green}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform  = "translateY(0)";
                e.currentTarget.style.boxShadow  = `0 4px 16px ${C.green}30`;
              }}
            >
              Sign In →
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.dividerLine}></div>
            <span style={s.dividerText}>or</span>
            <div style={s.dividerLine}></div>
          </div>

          <div style={s.footer}>
            Don't have an account?{" "}
            <Link to="/register" style={s.link}>Create one free</Link>
          </div>

          <div style={s.backHome}>
            <Link to="/" style={s.backLink}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    display: "flex", minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    background: C.bg,
  },
  left: {
    flex: 1, padding: "60px 52px",
    display: "flex", flexDirection: "column",
    justifyContent: "space-between",
    background: C.green,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  brandLogo: {
    width: 40, height: 40, borderRadius: 10,
    background: C.terracotta,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 800, color: "#fff",
    boxShadow: "0 4px 12px rgba(208,140,96,0.4)",
  },
  brandName: {
    fontFamily: "'Syne', sans-serif", fontSize: 20,
    fontWeight: 700, color: "#fff",
  },
  tagline: {
    flex: 1, display: "flex", flexDirection: "column",
    justifyContent: "center", padding: "48px 0",
  },
  taglineTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 44,
    fontWeight: 700, color: "#fff", lineHeight: 1.15,
    marginBottom: 18, letterSpacing: "-1.5px",
  },
  taglineSub: {
    fontSize: 16, color: "rgba(255,255,255,0.55)",
    lineHeight: 1.7, maxWidth: 360,
  },
  steps: { display: "flex", flexDirection: "column", gap: 14 },
  step: { display: "flex", alignItems: "center", gap: 16 },
  stepNum: {
    width: 38, height: 38, borderRadius: 10,
    background: "rgba(208,140,96,0.2)",
    border: "1px solid rgba(208,140,96,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, color: C.terracotta, flexShrink: 0,
    letterSpacing: "0.5px",
  },
  stepText: {
    fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 400,
  },
  right: {
    width: 500, display: "flex", alignItems: "center",
    justifyContent: "center", padding: "48px 52px",
    background: C.bg,
  },
  card: { width: "100%", maxWidth: 390 },
  cardHeader: { marginBottom: 32, textAlign: "center" },
  logoRow: { display: "flex", justifyContent: "center", marginBottom: 20 },
  logoBox: {
    width: 48, height: 48, borderRadius: 14,
    background: C.green,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 800, color: "#fff",
    boxShadow: `0 4px 16px ${C.green}40`,
  },
  title: {
    fontFamily: "'Syne', sans-serif", fontSize: 26,
    fontWeight: 700, color: C.charcoal, marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: C.muted },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 12, fontWeight: 600,
    color: C.charcoal, letterSpacing: "0.3px",
  },
  input: {
    padding: "12px 16px", borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: "#fff", color: C.charcoal,
    fontSize: 14, outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  },
  btn: {
    padding: "13px", borderRadius: 10, border: "none",
    background: C.green, color: "#fff",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    marginTop: 4,
    boxShadow: `0 4px 16px ${C.green}30`,
    transition: "all 0.2s",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 12,
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1, height: 1, background: C.border,
  },
  dividerText: {
    fontSize: 12, color: C.muted, fontWeight: 500,
  },
  footer: {
    textAlign: "center", fontSize: 14, color: C.muted,
    marginBottom: 12,
  },
  link: {
    color: C.terracotta, textDecoration: "none",
    fontWeight: 600,
  },
  backHome: { textAlign: "center" },
  backLink: {
    fontSize: 13, color: C.muted,
    textDecoration: "none", transition: "color 0.2s",
  },
};

export default Login;