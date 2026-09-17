import { useEffect, useState } from "react";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (employee) => {
    setError("");
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employee);
      } else {
        await createEmployee(employee);
      }
      await loadEmployees();
      setShowForm(false);
      setEditingEmployee(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      await loadEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete employee");
    }
  };

  const filtered = employees.filter((employee) => {
    const s = search.toLowerCase();
    return (
      employee.employeeId?.toLowerCase().includes(s) ||
      employee.name?.toLowerCase().includes(s) ||
      employee.email?.toLowerCase().includes(s) ||
      employee.department?.toLowerCase().includes(s) ||
      employee.designation?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">ADMINISTRATION</span>
          <h1>Manage Employees</h1>
          <p>Create, update, and remove employee records.</p>
        </div>
        <button className="primary-btn" onClick={() => { setEditingEmployee(null); setShowForm(true); }}>
          + Add Employee
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <EmployeeForm
          onSubmit={handleSubmit}
          editingEmployee={editingEmployee}
          onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
        />
      )}

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <EmployeeTable
          employees={filtered}
          onEdit={(emp) => { setEditingEmployee(emp); setShowForm(true); }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
