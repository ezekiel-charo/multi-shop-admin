import { Navigate, Outlet, useLocation } from "react-router";
import { getProtectedRouteRedirect } from "~/lib/route-protection";
import { useUser } from "~/user-context";

export default function AdminLayout() {
  const { user } = useUser();
  const location = useLocation();
  const redirectTo = getProtectedRouteRedirect(user, location, true);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}