import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";


export const ProtectedRoute = () => {

  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export const PublicRoute = () => {
  const { token } = useSelector((state) => state.auth);
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};