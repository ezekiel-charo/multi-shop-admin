import { Breadcrumbs } from "./breadcrumbs";
import UserProfile from "./user-profile";

export default function TopBar() {
  return (
    <>
      <div
        aria-label="Topbar"
        className="fixed top-0 left-0 right-0 lg:relative flex items-center justify-between px-4 w-full border-b border-b-[#dde2e0] z-10 bg-background"
      >
        <Breadcrumbs />
        <UserProfile />
      </div>
    </>
  );
}
