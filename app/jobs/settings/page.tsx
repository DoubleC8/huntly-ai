import UserNotificationForm from "@/components/settings/forms/UserNotificationForm";
import DarkModeForm from "@/components/settings/forms/DarkModeForm";
import { getCurrentUserEmail } from "@/lib/auth-helpers";

export default async function SettingsPage() {
  const email = await getCurrentUserEmail();

  //extra security, we have middleware but this is just incase it doesnt work for some reason
  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        {" "}
        Please Sign In.
      </div>
    );
  }
  return (
    <div className="page">
      <div className="pageTitleContainer">
        <h1 className="pageTitle">Settings</h1>
      </div>

      {/**This code below will hold the drag and drop feature for resumes jobs */}
      <div className="pageContainer">
        <div className="h-fit flex flex-col gap-3">
          <div className="bg-[var(--background)] h-fit rounded-3xl shadow-md p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-bold text-xl">Notifcation Settings </h2>
            </div>
            <UserNotificationForm />
            <div className="flex items-center justify-between w-full">
              <h2 className="font-bold text-xl">Appearance</h2>
            </div>
            <DarkModeForm />
          </div>
        </div>
      </div>
    </div>
  );
}
