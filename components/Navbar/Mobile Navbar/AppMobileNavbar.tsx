import type { Session } from "next-auth";
import NavbarBurgerButton from "./NavbarBurgerButton";

export default function AppMobileNavar({
  session,
}: {
  session: Session | null;
}) {
  return (
    <nav className="flex sticky top-0 z-50 h-14 items-center px-4 border-b border-gray-200 shadow-md bg-[var(--card)]">
      <NavbarBurgerButton />
    </nav>
  );
}
