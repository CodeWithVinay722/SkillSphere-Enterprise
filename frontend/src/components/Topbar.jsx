import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        ☰
      </button>

      <div className="topbar-spacer" />

      <div className="topbar-user" onClick={() => setMenuOpen((v) => !v)}>
        <Avatar name={user?.name} color={user?.avatarColor} size={36} />
        <div className="topbar-user-info">
          <strong>{user?.name}</strong>
          <span>{user?.designation}</span>
        </div>
        <span className="chevron">▾</span>

        {menuOpen && (
          <div className="user-menu" onMouseLeave={() => setMenuOpen(false)}>
            <button onClick={() => navigate("/profile")}>My Profile</button>
            <button onClick={handleLogout} className="danger">
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
