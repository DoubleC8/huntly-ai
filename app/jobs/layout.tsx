import { getCurrentUserId } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/navbars/AppNavbar";

export default async function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/"); // redirect to homepage for sign in
  }

  return (
    <div
      className="
    min-h-screen w-full"
    >
      <AppNavbar />
      <main className="md:pl-[20%]">{children}</main>
    </div>
  );
}
