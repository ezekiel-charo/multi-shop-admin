import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "~/types/constants";
import type { LoginCredentials } from "~/types/login-credentials";
import type { LoginResponse } from "~/types/login-response";

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const demoUsers: Record<string, string> = {
    "admin@gmail.com": "adminpass",
    "viewer@gmail.com": "viewerpass",
  };

  return new Promise((resolve, reject) => {
    // TODO: Implement proper serverside login
    if (!demoUsers[credentials.email]) {
      reject(new Error("Invalid email or password"));
    } else if (demoUsers[credentials.email] === credentials.password) {
      resolve({ token: "eyjf4kjh3423kbkK4KJK" });
    }
    reject(new Error("Invalid email or password"));
  });

  // const response = await authApi.post("/login", credentials);
  // return response.data;
}

export async function logout() {
  // TODO: Send logout request to backend
  removeToken();
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
