import { Breadcrumbs } from "./breadcrumbs";
import UserProfile from "./user-profile";

export default function TopBar() {
  return (
    <>
      <div
        aria-label="Topbar"
        className="flex items-center justify-between px-4 w-full border-b border-b-[#dde2e0]"
      >
        <Breadcrumbs />
        <UserProfile />
      </div>
    </>
  );
}
