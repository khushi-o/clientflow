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

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const login    = useAuthStore((s) => s.login);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/register", data);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={s.page}>
      {/* Left panel */}
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.brandLogo}>CF</div>
          <div style={s.brandName}>ClientFlow</div>
        </div>
        <div style={s.tagline}>
          <div style={s.taglineTitle}>
            Start managing<br />your business today
          </div>
          <div style={s.taglineSub}>
            Join thousands of freelancers and agencies who use ClientFlow to run their business.
          </div>
        </div>
        <div style={s.steps}>
          {[
            { num: "01", text: "Create your account" },
            { num: "02", text: "Add your first project" },
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
            <div style={s.title}>Create account</div>
            <div style={s.subtitle}>Get started for free — no credit card needed</div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Full Name</label>
              <input
                {...register("name")}
                type="text" required
                placeholder="Khushi Kumari"
                style={s.input}
                onFocus={(e) => e.currentTarget.style.borderColor = C.green}
                onBlur={(e) => e.currentTarget.style.borderColor = C.border}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email</label>
              <input
                {...register("email")}
                type="email" required
                placeholder="you@example.com"
                style={s.input}
                onFocus={(e) => e.currentTarget.style.borderColor = C.green}
                onBlur={(e) => e.currentTarget.style.borderColor = C.border}
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
                onBlur={(e) => e.currentTarget.style.borderColor = C.border}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>I am a</label>
              <select
                {...register("role")}
                style={{ ...s.input, cursor: "pointer" }}
              >
                <option value="agency">Agency / Freelancer</option>
                <option value="client">Client</option>
              </select>
            </div>
            <button
              type="submit" style={s.btn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${C.green}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${C.green}30`;
              }}
            >
              Create Account →
            </button>
          </form>
          <div style={s.footer}>
            Already have an account?{" "}
            <Link to="/login" style={s.link}>Sign in</Link>
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
    flex: 1, padding: "60px 48px",
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
  },
  brandName: {
    fontFamily: "'Syne', sans-serif", fontSize: 20,
    fontWeight: 700, color: "#fff",
  },
  tagline: {
    flex: 1, display: "flex", flexDirection: "column",
    justifyContent: "center", padding: "40px 0",
  },
  taglineTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 42,
    fontWeight: 700, color: "#fff", lineHeight: 1.2,
    marginBottom: 16, letterSpacing: "-1px",
  },
  taglineSub: {
    fontSize: 16, color: "rgba(255,255,255,0.6)",
    lineHeight: 1.6, maxWidth: 340,
  },
  steps: { display: "flex", flexDirection: "column", gap: 16 },
  step: { display: "flex", alignItems: "center", gap: 16 },
  stepNum: {
    width: 36, height: 36, borderRadius: 8,
    background: "rgba(208,140,96,0.25)",
    border: "1px solid rgba(208,140,96,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, color: C.terracotta, flexShrink: 0,
  },
  stepText: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  right: {
    width: 480, display: "flex", alignItems: "center",
    justifyContent: "center", padding: "40px 48px",
    background: C.bg,
  },
  card: { width: "100%", maxWidth: 380 },
  cardHeader: { marginBottom: 28 },
  title: {
    fontFamily: "'Syne', sans-serif", fontSize: 28,
    fontWeight: 700, color: C.charcoal, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: C.muted },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 12, fontWeight: 600,
    color: C.charcoal, letterSpacing: "0.3px",
  },
  input: {
    padding: "12px 16px", borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: "#fff",
    color: C.charcoal, fontSize: 14, outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  },
  btn: {
    padding: "13px", borderRadius: 10, border: "none",
    background: C.green,
    color: "#fff", fontSize: 15, fontWeight: 600,
    cursor: "pointer", marginTop: 6,
    boxShadow: `0 4px 16px ${C.green}30`,
    transition: "all 0.2s",
  },
  footer: {
    marginTop: 24, textAlign: "center",
    fontSize: 13, color: C.muted,
  },
  link: { color: C.terracotta, textDecoration: "none", fontWeight: 600 },
};

export default Register;