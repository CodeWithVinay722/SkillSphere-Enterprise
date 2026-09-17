import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2>Employees</h2>
          <p>{employees.length} employee records</p>
        </div>
        <span className="record-badge">LIVE DATA</span>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <h3>No employees found</h3>
          <p>Try changing your search or add a new employee.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <Link to={`/employees/${employee.id}`} className="table-employee-cell">
                      <Avatar name={employee.name} color={employee.avatarColor} size={30} />
                      <strong>{employee.name}</strong>
                    </Link>
                  </td>
                  <td><span className="employee-id">{employee.employeeId}</span></td>
                  <td>{employee.email}</td>
                  <td><span className="department">{employee.department}</span></td>
                  <td>{employee.designation}</td>
                  <td><span className={`role-badge ${employee.role === "ADMIN" ? "admin" : ""}`}>{employee.role}</span></td>
                  <td>
                    <div className="actions">
                      <button className="edit-btn" onClick={() => onEdit(employee)}>Edit</button>
                      <button className="delete-btn" onClick={() => onDelete(employee.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
