import { LayoutDashboard, Package, Store } from "lucide-react";
import Logo from "./logo";
import SideBarNavItem from "./side-bar-nav-item";

export default function SideBar() {
  return (
    <>
      <div className="h-screen bg-[#f4f8fb] w-60 border-r border-r-[#dde2e0]">
        <div className="my-4 p-6">
          <div className="w-fit">
            <Logo />
            <div className="text-gray-400 text-xs text-end -mt-2">
              Admin Panel
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <SideBarNavItem to="/dashboard">
            <LayoutDashboard /> Dashboard
          </SideBarNavItem>
          <SideBarNavItem to="/shops">
            <Store /> Shops
          </SideBarNavItem>
          <SideBarNavItem to="/products">
            <Package />
            Products
          </SideBarNavItem>
        </nav>
      </div>
    </>
  );
}
