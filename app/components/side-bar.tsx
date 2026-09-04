import { LayoutDashboard, Package, Store } from "lucide-react";
import { useNavigate } from "react-router";
import { logout } from "~/services/auth";
import Logo from "./logo";
import SideBarNavItem from "./side-bar-nav-item";
import { Button } from "./ui/button";

export default function SideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="hidden lg:block h-screen relative bg-[#f4f8fb] min-w-60 border-r border-r-[#dde2e0]">
        <div className="my-4 p-6">
          <div className="w-fit">
            <Logo />
            <div className="text-gray-400 text-xs text-end -mt-2">
              Admin Panel
            </div>
          </div>
        </div>

        <nav aria-label="Side navigation" className="flex flex-col gap-1 px-2">
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

        <div className="absolute bottom-4 right-0 left-0 p-4">
          <Button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            variant="destructive"
            className="w-full h-12"
          >
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
