import { Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";

const AdminOnly = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  if (!isAdmin) return <Navigate to="/app/dashboard" replace />;

  return children;
};

export default AdminOnly;
