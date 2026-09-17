import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getEmployee } from "../services/employeeService";
import Avatar from "../components/Avatar.jsx";
import StarRating from "../components/StarRating.jsx";

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getEmployee(id)
      .then((res) => setEmployee(res.data))
      .catch(() => setError("This employee could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (employee && String(employee.id) === String(user?.id)) {
      navigate("/profile", { replace: true });
    }
  }, [employee, user, navigate]);

  if (loading) return <p className="muted">Loading profile...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!employee) return null;

  return (
    <div className="page">
      <div className="profile-header-card">
        <Avatar name={employee.name} color={employee.avatarColor} size={84} />
        <div>
          <h1>{employee.name}</h1>
          <p className="profile-role">{employee.designation} · {employee.department}</p>
          <p className="profile-meta">{employee.email}{employee.phone ? ` · ${employee.phone}` : ""}</p>
        </div>
        <span className="employee-id-badge">{employee.employeeId}</span>
      </div>

      {employee.bio && (
        <div className="table-card">
          <h2>About</h2>
          <p className="bio-text">{employee.bio}</p>
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Skills &amp; Ratings</h2>
            <p>{employee.skills?.length || 0} skills logged</p>
          </div>
        </div>

        {!employee.skills || employee.skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <h3>No skills logged yet</h3>
          </div>
        ) : (
          <div className="skill-list">
            {employee.skills.map((s) => (
              <div key={s.id} className="skill-row">
                <div>
                  <strong>{s.skillName}</strong>
                  <span className="skill-category">{s.category} · {s.yearsOfExperience} yrs</span>
                </div>
                <StarRating value={s.rating} readOnly size={16} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
