import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const icons = {
  dashboard: "▦",
  directory: "☰",
  profile: "◉",
  admin: "⚙",
};

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">S</div>
          <h2>
            SkillSphere <span className="brand-tag">Enterprise</span>
          </h2>
        </div>

        <nav className="nav-group">
          <p className="nav-heading">Main</p>
          <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
            <span className="nav-icon">{icons.dashboard}</span> Dashboard
          </NavLink>
          <NavLink to="/directory" className={linkClass} onClick={onClose}>
            <span className="nav-icon">{icons.directory}</span> Employee Directory
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={onClose}>
            <span className="nav-icon">{icons.profile}</span> My Profile
          </NavLink>

          {isAdmin && (
            <>
              <p className="nav-heading">Administration</p>
              <NavLink to="/admin/employees" className={linkClass} onClick={onClose}>
                <span className="nav-icon">{icons.admin}</span> Manage Employees
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <p>SkillSphere Enterprise Portal</p>
          <p className="version-tag">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
