import { Navigate, Outlet } from "react-router";
import BottomMenu from "~/components/bottom-menu";
import SideBar from "~/components/side-bar";
import TopBar from "~/components/top-bar";
import { getToken } from "~/services/auth-service";

export default function MainLayout() {
  const token = getToken();

  if (!token) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="flex h-dvh">
        <SideBar />
        <div className="flex flex-col grow">
          <TopBar />
          <main className="inline-block p-4 overflow-y-auto grow pb-24">
            <Outlet />
          </main>
        </div>
        <BottomMenu />
      </div>
    </>
  );
}
