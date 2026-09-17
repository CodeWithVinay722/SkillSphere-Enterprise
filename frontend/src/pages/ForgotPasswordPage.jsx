import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setResetLink(response.data.resetLink);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process your request.");
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
          <p>Account recovery</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <span className="auth-eyebrow">FORGOT PASSWORD</span>
          <h2>Reset your password</h2>
          <p className="auth-subtitle">
            Enter the email tied to your account and we'll generate a reset link.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          {resetLink ? (
            <div className="alert alert-success">
              <p>Your reset link has been generated.</p>
              <p className="demo-note">
                No email server is configured for this demo, so the link is shown here
                directly instead of being emailed.
              </p>
              <button
                className="primary-btn full-width"
                style={{ marginTop: 12 }}
                onClick={() => navigate(resetLink)}
              >
                Continue to Reset Password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Work Email</label>
                <input
                  type="email"
                  placeholder="you@skillsphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="primary-btn full-width" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="auth-footer">
            Remembered your password? <Link to="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
