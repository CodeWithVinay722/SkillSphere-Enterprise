import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="primary-btn">Back to Dashboard</Link>
    </div>
  );
}
