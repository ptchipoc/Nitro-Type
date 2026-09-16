import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterActionsProps {
  filtersLabel: string;
  createEventLabel: string;
  onCreateEvent?: () => void;
}

export function FilterActions({
  filtersLabel,
  createEventLabel,
  onCreateEvent,
}: FilterActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className="h-9 px-3 font-mono text-xs gap-2 cursor-pointer"
        onClick={onCreateEvent}
      >
        <Plus className="h-3.5 w-3.5" />
        {createEventLabel}
      </Button>
    </div>
  );
}
