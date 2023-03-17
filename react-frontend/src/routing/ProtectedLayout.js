import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export const ProtectedLayout = () => {
  const { authed, user } = useUser();
  console.log(user)

  if (!authed) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  )
};