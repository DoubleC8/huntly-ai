import { auth } from "@/auth";

export default async function SettingsPage() {
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
    <>
      <div className="flex flex-col">
        <div className="hidden md:flex flex-col w-full p-3 justify-center h-[5%]">
          <h1 className="text-3xl font-extrabold tracking-wider">Settings</h1>
        </div>
      </div>
    </>
  );
}
