import { auth } from "@/auth";

export default async function ApplicationTrackerPage() {
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
    <div className="p-3 h-screen bg-[var(--card)] md:bg-[var(--background)]">
      <div className="hidden md:flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold tracking-wider">
          Application Tracker
        </h1>
      </div>
    </div>
  );
}
