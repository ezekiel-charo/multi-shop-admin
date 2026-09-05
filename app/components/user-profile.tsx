"use client";

import { CircleUserRound } from "lucide-react";
import { useUser } from "~/user-context";

export default function UserProfile() {
  const { user } = useUser();

  return (
    <>
      <div className="flex items-center gap-2 py-4 lg:px-6">
        <div>
          <div aria-label="User name" className="font-bold text-sm">
            {user?.name}
          </div>
          <div aria-label="User role" className=" text-xs text-gray-500">
            {user?.roleName}
          </div>
        </div>
        <CircleUserRound className="size-10 text-gray-700" />
      </div>
    </>
  );
}
