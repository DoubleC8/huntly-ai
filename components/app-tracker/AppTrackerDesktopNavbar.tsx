import { ListFilter, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AppTrackerDesktopNavbar() {
  return (
    <div
      className="md:flex 
          w-full justify-between gap-3 hidden"
    >
      <div className="w-[75%] flex gap-2">
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
      <div className="flex gap-2">
        <Button>
          Filter
          <ListFilter />
        </Button>
        <Button variant="destructive">
          Trash
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
