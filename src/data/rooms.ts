import panoLiving from "@/assets/pano-living-room-clean.jpg";
import panoBedroom from "@/assets/pano-bedroom-clean.jpg";
import panoDining from "@/assets/pano-dining-clean.jpg";
import maskLiving from "@/assets/mask-living-room-clean.png";
import maskBedroom from "@/assets/mask-bedroom-clean.png";
import maskDining from "@/assets/mask-dining-clean.png";

export type Room = {
  id: string;
  name: string;
  pano: string;
  mask: string;
};

export const ROOMS: Room[] = [
  { id: "living", name: "Living Room", pano: panoLiving, mask: maskLiving },
  { id: "bedroom", name: "Modern Bedroom", pano: panoBedroom, mask: maskBedroom },
  { id: "dining", name: "Dining Room", pano: panoDining, mask: maskDining },
];

/** Mask channel index -> paintable surface. */
export const SURFACES = [
  { index: 0, name: "Left Wall" },
  { index: 1, name: "Front Wall" },
  { index: 2, name: "Right & Back Wall" },
  { index: 3, name: "Ceiling" },
] as const;

export type BlendMode = "multiply" | "overlay" | "softlight";

export const BLEND_MODES: { id: BlendMode; label: string; value: number }[] = [
  { id: "multiply", label: "Multiply", value: 0 },
  { id: "overlay", label: "Overlay", value: 1 },
  { id: "softlight", label: "Soft Light", value: 2 },
];
