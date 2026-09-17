import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DirectoryPage from "./pages/DirectoryPage.jsx";
import EmployeeProfilePage from "./pages/EmployeeProfilePage.jsx";
import MyProfilePage from "./pages/MyProfilePage.jsx";
import AdminEmployeesPage from "./pages/AdminEmployeesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Public / auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Authenticated app shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/employees/:id" element={<EmployeeProfilePage />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute adminOnly>
              <AdminEmployeesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
