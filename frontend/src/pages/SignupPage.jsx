import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DEPARTMENTS = ["IT", "Cloud", "Engineering", "HR", "Finance", "Sales", "Management"];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    designation: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = form;
      await signup(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account.");
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
          <p>Join your organization's employee portal</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card auth-card-wide">
          <span className="auth-eyebrow">GET STARTED</span>
          <h2>Create your employee account</h2>
          <p className="auth-subtitle">Set up your profile and start tracking your skills.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Employee ID</label>
                <input name="employeeId" placeholder="EMP004" value={form.employeeId} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <input name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Work Email</label>
                <input type="email" name="email" placeholder="jane.doe@skillsphere.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input name="phone" placeholder="+1 555 0123" value={form.phone} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Department</label>
                <select name="department" value={form.department} onChange={handleChange} required>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Designation</label>
                <input name="designation" placeholder="e.g. Software Engineer" value={form.designation} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="primary-btn full-width" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
