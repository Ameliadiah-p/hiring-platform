import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check if user is authenticated and has admin role
  if (!token || role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
