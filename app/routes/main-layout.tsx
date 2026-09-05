import { Navigate, Outlet, useLocation } from "react-router";
import BottomMenu from "~/components/bottom-menu";
import SideBar from "~/components/side-bar";
import TopBar from "~/components/top-bar";
import { useUser } from "~/user-context";

export default function MainLayout() {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  return (
    <>
      <div className="lg:flex lg:h-dvh">
        <SideBar />
        <div className="lg:flex flex-col grow ">
          <TopBar />
          <main className="grow overflow-y-auto px-4 lg:px-12 pt-24 lg:pt-8 pb-24">
            <Outlet />
          </main>
        </div>
        <BottomMenu />
      </div>
    </>
  );
}
