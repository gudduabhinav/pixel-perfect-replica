import { ROOMS } from "@/data/rooms";
import { cn } from "@/lib/utils";

type Props = {
  activeId: string;
  onChange: (id: string) => void;
};

export function RoomSwitcher({ activeId, onChange }: Props) {
  return (
    <div className="glass-panel flex gap-1 p-1">
      {ROOMS.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            activeId === r.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {r.name}
        </button>
      ))}
    </div>
  );
}
