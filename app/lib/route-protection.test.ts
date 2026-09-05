import { describe, expect, it } from "vitest";
import {
  getLoginRedirectDestination,
  getProtectedRouteRedirect,
} from "./route-protection";

const location = {
  pathname: "/products/edit/42",
  search: "?tab=details",
  hash: "#pricing",
};

const administrator = {
  email: "admin@example.com",
  name: "Jane Doe",
  role: "ADMIN" as const,
  roleName: "Administrator" as const,
};

const viewer = {
  email: "viewer@example.com",
  name: "John Smith",
  role: "VIEWER" as const,
  roleName: "Viewer" as const,
};

describe("protected route redirects", () => {
  it("redirects unauthenticated users to login with the attempted URL", () => {
    const redirect = getProtectedRouteRedirect(null, location);

    expect(redirect).toBe(
      "/login?redirect=%2Fproducts%2Fedit%2F42%3Ftab%3Ddetails%23pricing",
    );
  });

  it("restores the attempted URL from an encoded login redirect", () => {
    const redirect = getProtectedRouteRedirect(null, location, true);
    expect(getLoginRedirectDestination(redirect.split("?")[1])).toBe(
      "/products/edit/42?tab=details#pricing",
    );
  });

  it("redirects viewers away from admin-only routes", () => {
    expect(getProtectedRouteRedirect(viewer, location, true)).toBe(
      "/dashboard",
    );
  });

  it("allows administrators to access admin-only routes", () => {
    expect(getProtectedRouteRedirect(administrator, location, true)).toBeNull();
  });

  it("falls back to the dashboard for missing or unsafe redirects", () => {
    expect(getLoginRedirectDestination("")).toBe("/dashboard");
    expect(getLoginRedirectDestination("redirect=https%3A%2F%2Fevil.example")).toBe(
      "/dashboard",
    );
    expect(getLoginRedirectDestination("redirect=%2F%2Fevil.example")).toBe(
      "/dashboard",
    );
  });
});
