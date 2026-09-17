import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees } from "../services/employeeService";
import Avatar from "../components/Avatar.jsx";

export default function DirectoryPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => ["All", ...new Set(employees.map((e) => e.department))],
    [employees]
  );

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "All" || e.department === department;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">DIRECTORY</span>
          <h1>Employee Directory</h1>
          <p>Browse profiles and skills across the organization.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading employees...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <h3>No employees found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="directory-grid">
          {filtered.map((emp) => (
            <Link to={`/employees/${emp.id}`} key={emp.id} className="directory-card">
              <Avatar name={emp.name} color={emp.avatarColor} size={48} />
              <div className="directory-card-info">
                <strong>{emp.name}</strong>
                <span>{emp.designation}</span>
                <span className="department-tag">{emp.department}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
