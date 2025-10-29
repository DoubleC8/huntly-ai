import { getCurrentUserEmail } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListFilter, Plus } from "lucide-react";

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
    <>
      <div className="page">
        <div className="pageTitleContainer">
          <h1 className="pageTitle">Settings</h1>
        </div>

        <div className="mobileAppPageNav">
          <div
            className="
          w-9/10 flex gap-2"
          >
            <Input
              type="url"
              placeholder="Add External Job Link"
              className="bg-[var(--background)] h-9 w-8/10"
            />
            <Button>
              <Plus />
            </Button>
          </div>
          <Button>
            <ListFilter />
          </Button>
        </div>

        {/**This code below will hold the drag and drop feature for resumes jobs */}
        <div className="pageContainer"></div>
      </div>
    </>
  );
}
