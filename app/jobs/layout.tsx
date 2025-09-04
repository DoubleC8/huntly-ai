import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/navbars/AppNavbar";

export default async function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login"); // or homepage with callback
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
