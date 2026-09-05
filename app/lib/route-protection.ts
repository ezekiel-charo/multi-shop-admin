import type { User } from "~/types/user";

interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
}

export function getProtectedRouteRedirect(
  user: User | null,
  location: RouteLocation,
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
