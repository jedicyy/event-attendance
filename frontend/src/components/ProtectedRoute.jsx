import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  requireAdmin = false
}) {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !adminToken) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default ProtectedRoute;