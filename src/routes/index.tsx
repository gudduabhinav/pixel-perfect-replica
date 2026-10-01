import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Download, Eye, RotateCcw, SplitSquareHorizontal, Loader2 } from "lucide-react";
import { ColorPickerPalette } from "@/components/ui/ColorPickerPalette";
import { RoomSwitcher } from "@/components/ui/RoomSwitcher";
import { SurfaceLegend } from "@/components/ui/SurfaceLegend";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { ROOMS, SURFACES, BLEND_MODES, type BlendMode } from "@/data/rooms";
import type { Paint } from "@/data/paints";
import { cn } from "@/lib/utils";

const RoomViewer360 = lazy(() => import("@/components/canvas/RoomViewer360"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hue360 — 360° Room Paint Visualizer" },
      {
        name: "description",
        content:
          "Step inside a 360° room, tap any wall and repaint it instantly. Realistic shadows and texture preserved, right in your browser.",
      },
      { property: "og:title", content: "Hue360 — 360° Room Paint Visualizer" },
      {
        property: "og:description",
        content:
          "Step inside a 360° room, tap any wall and repaint it instantly with photoreal paint shades.",
      },
    ],
  }),
  component: Index,
});

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function Index() {
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [surface, setSurface] = useState(0);
  const [colors, setColors] = useState<(string | null)[]>([null, null, null, null]);
  const [blend, setBlend] = useState<BlendMode>("softlight");
  const [paintOn, setPaintOn] = useState(true);
  const [splitMode, setSplitMode] = useState(false);
  const [reveal, setReveal] = useState(0.5);
  const [selectedHex, setSelectedHex] = useState<string | null>(null);

  const apiRef = useRef<{ capture: () => string | null } | null>(null);
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
  const blendValue = BLEND_MODES.find((b) => b.id === blend)?.value ?? 2;

  const applyPaint = (paint: Paint) => {
    setSelectedHex(paint.hex);
    setColors((prev) => prev.map((c, i) => (i === surface ? paint.hex : c)));
  };

  const reset = () => {
    setColors([null, null, null, null]);
    setSelectedHex(null);
  };

  const onReady = useCallback((api: { capture: () => string | null }) => {
    apiRef.current = api;
  }, []);

  const exportImage = () => {
    const url = apiRef.current?.capture();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${room.id}-paint-preview.png`;
    a.click();
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        <ClientOnly fallback={<ViewerFallback />}>
          <Suspense fallback={<ViewerFallback />}>
            <RoomViewer360
              pano={room.pano}
              mask={room.mask}
              paint={{ colors }}
              blendMode={blendValue}
              reveal={splitMode ? reveal : 1}
              paintOn={paintOn}
              highlight={surface}
              onPickSurface={(i) => i !== null && setSurface(i)}
              onReady={onReady}
            />
          </Suspense>
        </ClientOnly>
      </div>

      {splitMode && <CompareSlider value={reveal} onChange={setReveal} />}

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="pointer-events-auto flex flex-col gap-3">
          <div className="glass-panel px-4 py-2">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">Hue360</h1>
            <p className="text-[11px] text-muted-foreground">
              Drag to look around · click a wall to select it
            </p>
          </div>
          <RoomSwitcher activeId={roomId} onChange={setRoomId} />
        </div>

        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={() => setPaintOn((v) => !v)}
            className={cn("control-btn", !paintOn && "control-btn-active")}
            title="Toggle original / painted"
          >
            <Eye className="h-4 w-4" />
            {paintOn ? "Painted" : "Original"}
          </button>
          <button
            onClick={() => setSplitMode((v) => !v)}
            className={cn("control-btn", splitMode && "control-btn-active")}
            title="Before / after split"
          >
            <SplitSquareHorizontal className="h-4 w-4" />
            Compare
          </button>
          <button onClick={reset} className="control-btn" title="Reset colours">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button onClick={exportImage} className="control-btn" title="Download current view">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Left surface list */}
      <div className="pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2">
        <SurfaceLegend active={surface} colors={colors} onSelect={setSurface} />
      </div>

      {/* Bottom palette */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-4">
        <div className="glass-panel flex items-center gap-1 p-1 text-xs">
          <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Finish
          </span>
          {BLEND_MODES.map((b) => (
            <button
              key={b.id}
              onClick={() => setBlend(b.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 font-medium transition-colors",
                blend === b.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {b.label}
            </button>
          ))}
          <span className="ml-2 pr-2 text-[11px] text-muted-foreground">
            Painting: {SURFACES[surface].name}
          </span>
        </div>
        <div className="w-full max-w-3xl">
          <ColorPickerPalette selected={selectedHex} onSelect={applyPaint} />
        </div>
      </div>
    </main>
  );
}
