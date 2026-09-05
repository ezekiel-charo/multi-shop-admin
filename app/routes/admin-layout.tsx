import { Navigate, Outlet, useLocation } from "react-router";
import { useUser } from "~/user-context";

export default function AdminLayout() {
  const { user, isAdmin } = useUser();
  const location = useLocation();

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}