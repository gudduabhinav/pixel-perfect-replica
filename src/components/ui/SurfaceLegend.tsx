import { SURFACES } from "@/data/rooms";
import { cn } from "@/lib/utils";

type Props = {
  active: number;
  colors: (string | null)[];
  onSelect: (index: number) => void;
};

export function SurfaceLegend({ active, colors, onSelect }: Props) {
  return (
    <div className="glass-panel flex flex-col gap-1 p-1.5">
      <span className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Surface
      </span>
      {SURFACES.map((s) => (
        <button
          key={s.index}
          onClick={() => onSelect(s.index)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
            active === s.index
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-border"
            style={{ backgroundColor: colors[s.index] ?? "transparent" }}
          />
          {s.name}
        </button>
      ))}
    </div>
  );
}
