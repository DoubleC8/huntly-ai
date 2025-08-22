import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Plus } from "lucide-react";

export default function AppTrackerMobileNavbar() {
  return (
    <div className="mobileAppPageNav">
      <div className="flex gap-1">
        <Input
          type="url"
          placeholder="Search for Job"
          className="bg-[var(--background)] h-9"
        />
        <Button>
          <Plus />
        </Button>
      </div>
      <div className="flex gap-1">
        <Button>
          <ListFilter />
        </Button>
      </div>
    </div>
  );
}
