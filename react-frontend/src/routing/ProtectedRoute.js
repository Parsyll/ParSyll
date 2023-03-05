import { Navigate } from "react-router-dom";
import { useAuth} from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {

  const { authed } = useAuth()
  if (!authed) {
    return <Navigate to="/login" />;
  }
  return children;
};