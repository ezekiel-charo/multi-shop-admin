import { TOKEN_KEY } from "~/types/constants";
import type { LoginCredentials } from "~/types/login-credentials";
import type { LoginResponse } from "~/types/login-response";
import type { User } from "~/types/user";

// const authApi = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

const demoUsers: Record<string, User> = {
  "admin@gmail.com+pass1234": {
    email: "admin@gmail.com",
    name: "Jane Doe",
    role: "ADMIN",
    roleName: "Administrator",
  },
  "viewer@gmail.com+12345678": {
    email: "viewer@gmail.com",
    name: "John Smith",
    role: "VIEWER",
    roleName: "Viewer",
  },
};

export async function login({
  email,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  // NOTE: Dummy authentication. Not for production
  const key = `${email}+${password}`;
  const user = demoUsers[key];

  if (user) {
    return { token: key };
  }

  throw new Error("Invalid email or password");
  // const response = await authApi.post("/login", credentials);
  // return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const user = getCurrentUserFromToken();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export function getCurrentUserFromToken(): User | null {
  const token = getToken();
  return token ? (demoUsers[token] ?? null) : null;
}

export async function logout() {
  removeToken();
}

export function getToken() {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
