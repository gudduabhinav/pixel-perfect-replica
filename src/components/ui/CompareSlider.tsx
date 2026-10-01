import { useCallback, useEffect, useRef } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
};

/** Draggable vertical divider for the before/after split view. */
export function CompareSlider({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      onChange(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
    },
    [onChange],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (dragging.current) update(e.clientX);
    };
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [update]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      <div
        className="pointer-events-auto absolute inset-y-0 w-10 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${value * 100}%` }}
        onPointerDown={(e) => {
          dragging.current = true;
          update(e.clientX);
        }}
      >
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-foreground/70" />
        <div className="glass-panel absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[10px] font-semibold tracking-widest text-foreground">
          ⇆
        </div>
      </div>
      <div className="absolute top-4 left-4 rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">
        After
      </div>
      <div className="absolute top-4 right-4 rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">
        Before
      </div>
    </div>
  );
}
