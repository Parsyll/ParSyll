import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout = () => {
  const { authed } = useAuth();

  if (!authed) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  )
};