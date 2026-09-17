import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getEmployees } from "../services/employeeService";
import { getMySkills } from "../services/skillService";
import Avatar from "../components/Avatar.jsx";
import StarRating from "../components/StarRating.jsx";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, skillsRes] = await Promise.all([getEmployees(), getMySkills()]);
        setEmployees(empRes.data);
        setMySkills(skillsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const departments = new Set(employees.map((e) => e.department)).size;
  const avgSkillRating = mySkills.length
    ? (mySkills.reduce((sum, s) => sum + s.rating, 0) / mySkills.length).toFixed(1)
    : "—";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">DASHBOARD</span>
          <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p>Here's a snapshot of {isAdmin ? "your organization" : "your profile"} today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Employees</span>
          <strong>{loading ? "—" : employees.length}</strong>
        </div>
        <div className="stat-card">
          <span>Departments</span>
          <strong>{loading ? "—" : departments}</strong>
        </div>
        <div className="stat-card">
          <span>My Skills Logged</span>
          <strong>{loading ? "—" : mySkills.length}</strong>
        </div>
        <div className="stat-card">
          <span>My Avg. Skill Rating</span>
          <strong>{loading ? "—" : avgSkillRating}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2>My Top Skills</h2>
              <p>Self-rated proficiency</p>
            </div>
            <Link to="/profile" className="secondary-btn small">
              Manage Skills
            </Link>
          </div>

          {mySkills.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◎</div>
              <h3>No skills added yet</h3>
              <p>Head to your profile to add your first skill.</p>
            </div>
          ) : (
            <div className="skill-list">
              {[...mySkills]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 6)
                .map((s) => (
                  <div key={s.id} className="skill-row">
                    <div>
                      <strong>{s.skillName}</strong>
                      <span className="skill-category">{s.category}</span>
                    </div>
                    <StarRating value={s.rating} readOnly size={16} />
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="table-card">
          <div className="table-header">
            <div>
              <h2>Recently Joined</h2>
              <p>Newest members of the team</p>
            </div>
            <Link to="/directory" className="secondary-btn small">
              View Directory
            </Link>
          </div>

          <div className="mini-employee-list">
            {employees
              .slice()
              .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
              .slice(0, 5)
              .map((emp) => (
                <Link to={`/employees/${emp.id}`} key={emp.id} className="mini-employee-row">
                  <Avatar name={emp.name} color={emp.avatarColor} size={34} />
                  <div>
                    <strong>{emp.name}</strong>
                    <span>{emp.designation}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
