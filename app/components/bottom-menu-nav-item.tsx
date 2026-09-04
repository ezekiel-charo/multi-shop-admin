import type { ReactNode } from "react";
import { NavLink, type To } from "react-router";

interface BottomMenuNavItemProps {
  to: To;
  children: ReactNode;
}

export default function BottomMenuNavItem({
  to,
  children,
}: BottomMenuNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        (isActive ? "text-[#058911]!" : "") +
        " " +
        "py-3 flex flex-col items-center justify-center gap-2 text-xs font-bold text-gray-600"
      }
    >
      {children}
    </NavLink>
  );
}
