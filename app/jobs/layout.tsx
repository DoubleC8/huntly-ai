import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/Navbar/AppNavbar";

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
    <div className="min-h-screen w-full">
      <AppNavbar session={session} />
      <main>{children}</main>
    </div>
  );
}
