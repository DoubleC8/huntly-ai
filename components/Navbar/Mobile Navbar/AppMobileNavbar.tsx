import NavbarBurgerButton from "./NavbarBurgerButton";

export default function AppMobileNavar() {
  return (
    <nav className="flex sticky top-0 z-50 h-14 items-center px-4 border-b border-gray-200 shadow-md">
      <NavbarBurgerButton />
    </nav>
  );
}
