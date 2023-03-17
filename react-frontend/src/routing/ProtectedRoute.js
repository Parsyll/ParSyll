import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export const ProtectedRoute = ({ children }) => {

  const { authed } = useUser()
  if (!authed) {
    return <Navigate to="/login" />;
  }
  return children;
};