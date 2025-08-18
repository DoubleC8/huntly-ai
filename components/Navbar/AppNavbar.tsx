import { Session } from "next-auth";
import AppMobileNavar from "./Mobile Navbar/AppMobileNavbar";
import AppSidebarNavbar from "./Desktop Navbar/AppSideNavbar";

export function AppNavbar({ session }: { session: Session | null }) {
  return (
    <>
      {/* Mobile navbar: burger topbar */}
      <div className="md:hidden">
        <AppMobileNavar session={session} />
      </div>
      <aside className="hidden md:block">
        <AppSidebarNavbar session={session} />
      </aside>
    </>
  );
}
