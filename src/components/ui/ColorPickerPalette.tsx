import { useState } from "react";
import { Check } from "lucide-react";
import { PAINTS, PAINT_FAMILIES, type Paint } from "@/data/paints";
import { cn } from "@/lib/utils";

type Props = {
  selected: string | null;
  onSelect: (paint: Paint) => void;
};

export function ColorPickerPalette({ selected, onSelect }: Props) {
  const [family, setFamily] = useState<string>(PAINT_FAMILIES[0]);
  const shades = PAINTS.filter((p) => p.family === family);

  return (
    <div className="glass-panel w-full p-3">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PAINT_FAMILIES.map((f) => (
          <button
            key={f}
            onClick={() => setFamily(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
              family === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {shades.map((p) => {
          const active = selected === p.hex;
          return (
            <button
              key={p.code}
              onClick={() => onSelect(p)}
              title={`${p.name} · ${p.code} · ${p.hex}`}
              className={cn(
                "group relative shrink-0 rounded-xl border p-1.5 text-left transition-all",
                active
                  ? "border-ring bg-secondary"
                  : "border-transparent hover:bg-secondary/60",
              )}
            >
              <span
                className="flex h-12 w-16 items-center justify-center rounded-lg shadow-inner"
                style={{ backgroundColor: p.hex }}
              >
                {active && <Check className="h-5 w-5 text-foreground mix-blend-difference" />}
              </span>
              <span className="mt-1.5 block w-16 truncate text-[11px] font-medium text-foreground">
                {p.name}
              </span>
              <span className="block text-[10px] text-muted-foreground">{p.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
