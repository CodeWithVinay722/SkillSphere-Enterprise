import { useEffect, useState } from "react";

const DEPARTMENTS = ["IT", "Cloud", "Engineering", "HR", "Finance", "Sales", "Management"];

const emptyForm = {
  employeeId: "",
  name: "",
  email: "",
  department: "",
  designation: "",
  phone: "",
};

export default function EmployeeForm({ onSubmit, editingEmployee, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        employeeId: editingEmployee.employeeId || "",
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        department: editingEmployee.department || "",
        designation: editingEmployee.designation || "",
        phone: editingEmployee.phone || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingEmployee]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="employee-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">{editingEmployee ? "EMPLOYEE MANAGEMENT" : "NEW RECORD"}</span>
            <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>
            <p>{editingEmployee ? "Update employee information" : "Create a new employee profile (default password: Welcome@123)"}</p>
          </div>
          <button className="close-btn" onClick={onCancel} type="button">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Employee ID</label>
              <input name="employeeId" placeholder="EMP005" value={form.employeeId} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Full Name</label>
              <input name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="employee@example.com" value={form.email} onChange={handleChange} required />
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
            <div className="input-group full-width">
              <label>Designation</label>
              <input name="designation" placeholder="e.g. Cloud Intern" value={form.designation} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="primary-btn">{editingEmployee ? "Save Changes" : "Add Employee"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
