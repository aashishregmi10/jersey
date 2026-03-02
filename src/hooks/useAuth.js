import { useSelector, useDispatch } from "react-redux";
import { logout } from "store/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const handleLogout = () => dispatch(logout());

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isCustomer,
    loggedInUser: user,
    handleLogout,
  };
};

export default useAuth;
