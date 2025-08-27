import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AppTrackerDesktopNavbar() {
  return (
    <div className="desktopAppPageNav">
      <div className="w-full flex gap-2">
        <Input
          type="url"
          placeholder="Add External Job Link"
          className="bg-[var(--background)]  h-9"
        />
        <Button>
          Add Job
          <Plus />
        </Button>
      </div>
    </div>
  );
}
