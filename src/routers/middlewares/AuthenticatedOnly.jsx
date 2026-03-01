import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Redirects to /sign-in if not authenticated, otherwise renders the component
const AuthenticatedOnly = ({ component: Component }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/sign-in" replace />;

  return <Component />;
};

export default AuthenticatedOnly;
