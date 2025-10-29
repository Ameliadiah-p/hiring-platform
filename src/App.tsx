import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import JobListPage from "./pages/JoblistPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ApplyFormPage from "./pages/ApplyFormPage";
import SuccessPage from "./pages/SuccessPage";
import AdminJobListPage from "./pages/AdminJobListPage";
import AdminManageJobPage from "./pages/AdminManageJobPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect ke login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute>
              <ApplyFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/jobs"
          element={
            <ProtectedAdminRoute>
              <AdminJobListPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/manage-job/:jobId"
          element={
            <ProtectedAdminRoute>
              <AdminManageJobPage />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback 404 */}
        <Route
          path="*"
          element={<div className="p-10 text-center">404 - Not Found</div>}
        />
      </Routes>
    </Router>
  );
}
