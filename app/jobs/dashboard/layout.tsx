import { auth } from "@/auth";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }

  return (
    <div className="page">
      {/**mobile navbar for dashboard page */}
      <DashboardTitle />
      {children}
    </div>
  );
}
