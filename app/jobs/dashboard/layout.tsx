import { auth } from "@/auth";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

      {/**This code below will hold the recommended jobs */}
      <div className="pageContainer">
        {/**desktop navbar for dashboard page */}
        {children}
      </div>
    </div>
  );
}
