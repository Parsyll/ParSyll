import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export const ProtectedLayout = () => {
  const { authed, user } = useUser();

  if (!authed) {
    console.log(user)
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  )
};