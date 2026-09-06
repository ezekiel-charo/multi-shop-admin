"use client";

import { CircleUserRound } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useUser } from "~/user-context";

export default function UserProfile() {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    await clearUser();
    navigate("/login", { replace: true });
  }

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
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label="Open user menu"
                  size="icon-lg"
                  variant="ghost"
                >
                  <CircleUserRound className="size-10 text-gray-700" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden lg:block">
          <CircleUserRound className="size-10 text-gray-700" />
        </div>
      </div>
    </>
  );
}
