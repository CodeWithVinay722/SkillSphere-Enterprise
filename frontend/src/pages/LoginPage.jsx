import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">S</div>
          <h1>SkillSphere</h1>
          <p>Enterprise Employee &amp; Skills Portal</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <span className="auth-eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="auth-subtitle">Access your employee dashboard, profile, and skills.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Work Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@skillsphere.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-row">
              <Link to="/forgot-password" className="link-muted">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="primary-btn full-width" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>

          <div className="demo-hint">
            <strong>Demo logins</strong>
            <span>Admin: admin@skillsphere.com / Admin@123</span>
            <span>Employee: rahul.verma@skillsphere.com / Employee@123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
