import { Session } from "next-auth";
import NavbarBurgerButton from "./NavbarBurgerButton";

export function AppNavbar({ session }: { session: Session | null }) {
  return (
    <nav className="flex sticky z-60 top-0 lg:hidden items-center h-14 px-3">
      <NavbarBurgerButton />
    </nav>
  );
}
