import AppMobileNavar from "./Mobile Navbar/AppMobileNavbar";
import AppSidebarNavbar from "./Desktop Navbar/AppSideNavbar";

export function AppNavbar() {
  return (
    <>
      {/* Mobile navbar: burger topbar */}
      <div className="md:hidden">
        <AppMobileNavar />
      </div>
      <aside className="hidden md:block">
        <AppSidebarNavbar />
      </aside>
    </>
  );
}
