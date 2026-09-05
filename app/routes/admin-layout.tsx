import { Navigate, Outlet } from "react-router";
import { useUser } from "~/user-context";

export default function AdminLayout() {
  const { user, isAdmin } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}