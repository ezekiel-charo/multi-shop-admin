import { afterEach, describe, expect, it } from "vitest";
import { getCurrentUserFromToken, isAuthenticated } from "./auth-service";
import { TOKEN_KEY } from "~/types/constants";

const storage = new Map<string, string>();

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  },
});

afterEach(() => {
  storage.clear();
});

describe("getCurrentUserFromToken", () => {
  it("removes an invalid stored token", () => {
    storage.set(TOKEN_KEY, "invalid-token");

    expect(getCurrentUserFromToken()).toBeNull();
    expect(storage.has(TOKEN_KEY)).toBe(false);
  });

  it("does not authenticate an invalid stored token", () => {
    storage.set(TOKEN_KEY, "invalid-token");

    expect(isAuthenticated()).toBe(false);
    expect(storage.has(TOKEN_KEY)).toBe(false);
  });
});