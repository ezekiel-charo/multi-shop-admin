import type { ReactNode } from "react";
import { NavLink, type To } from "react-router";

interface SideBarNavItemProps {
  to: To;
  children: ReactNode;
}

export default function SideBarNavItem({ to, children }: SideBarNavItemProps) {
  return (
    <>
      <NavLink
        to={to}
        className={({ isActive }) =>
          (isActive ? "bg-[#dde8eb] border-[#d9e4e7]!" : "") +
          " " +
          "p-4 rounded-lg font-medium flex items-center gap-2 border border-transparent"
        }
      >
        {children}
      </NavLink>
    </>
  );
}
