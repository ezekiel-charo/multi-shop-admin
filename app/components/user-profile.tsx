import { CircleUserRound } from "lucide-react";
import type { User } from "~/types/user";

export default function UserProfile() {
  const user: User = {
    email: "admin@gmail.com",
    name: "Shop Admin",
    roleName: "Administrator",
  };
  return (
    <>
      <div className="flex items-center gap-2 py-4 px-6">
        <CircleUserRound className="size-10 text-gray-700" />
        <div>
          <div aria-label="User name" className="font-bold text-sm">
            {user.name}
          </div>
          <div aria-label="User role" className=" text-xs text-gray-500">
            {user.roleName}
          </div>
        </div>
      </div>
    </>
  );
}
