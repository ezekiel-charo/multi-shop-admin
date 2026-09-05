import { createContext, use, useState } from "react";
import {
  getCurrentUserFromToken,
  logout as logoutUser,
} from "~/services/auth-service";
import type { User } from "~/types/user";

interface UserContextValue {
  user: User | null;
  isAdmin: boolean;
  refreshUser: () => void;
  clearUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    getCurrentUserFromToken(),
  );

  function refreshUser() {
    setUser(getCurrentUserFromToken());
  }

  async function clearUser() {
    await logoutUser();
    setUser(null);
  }

  return (
    <UserContext
      value={{ user, isAdmin: user?.role === "ADMIN", refreshUser, clearUser }}
    >
      {children}
    </UserContext>
  );
}

export function useUser() {
  const context = use(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a User provider");
  }
  return context;
}
