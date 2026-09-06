import type { Location } from "react-router";
import type { User } from "~/types/user";

export function getProtectedRouteRedirect(
  user: User | null,
  location: Location,
  adminOnly = false,
) {
  if (!user) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return `/login?redirect=${encodeURIComponent(redirectTo)}`;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return "/dashboard";
  }

  return null;
}

export function getLoginRedirectDestination(search: string) {
  const redirectTo = new URLSearchParams(search).get("redirect");
  return redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
    ? redirectTo
    : "/dashboard";
}
