import AppMobileNavar from "./mobile-navbar/AppMobileNavbar";
import AppSidebarNavbar from "./desktop-navbar/AppSideNavbar";

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
