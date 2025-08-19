import { auth } from "@/auth";
import { ChevronRight } from "lucide-react";

export default async function DashboardPage() {
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
    <div className="p-3">
      <div>
        <div className="flex">
          <h1>Jobs</h1>
          <ChevronRight />
        </div>
        <h1>Recommended</h1>
      </div>
    </div>
  );
}
