import { LayoutDashboard, Package, Store } from "lucide-react";
import BottomMenuNavItem from "./bottom-menu-nav-item";

export default function BottomMenu() {
  return (
    <nav className="bg-[#f6f7f8] grid grid-cols-3 fixed bottom-0 left-0 right-0 lg:hidden z-10">
      <BottomMenuNavItem to="/dashboard">
        <LayoutDashboard /> Dashboard
      </BottomMenuNavItem>
      <BottomMenuNavItem to="/shops">
        <Store /> Shops
      </BottomMenuNavItem>
      <BottomMenuNavItem to="/products">
        <Package />
        Products
      </BottomMenuNavItem>
    </nav>
  );
}
