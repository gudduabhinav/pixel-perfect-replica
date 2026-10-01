import panoLiving from "@/assets/pano-living-room.jpg";
import panoBedroom from "@/assets/pano-bedroom.jpg";
import panoKitchen from "@/assets/pano-kitchen.jpg";
import maskLiving from "@/assets/mask-living-room.png";
import maskBedroom from "@/assets/mask-bedroom.png";
import maskKitchen from "@/assets/mask-kitchen.png";

export type Room = {
  id: string;
  name: string;
  pano: string;
  mask: string;
};

export const ROOMS: Room[] = [
  { id: "living", name: "Living Room", pano: panoLiving, mask: maskLiving },
  { id: "bedroom", name: "Modern Bedroom", pano: panoBedroom, mask: maskBedroom },
  { id: "kitchen", name: "Minimalist Kitchen", pano: panoKitchen, mask: maskKitchen },
];

/** Mask channel index -> paintable surface. */
export const SURFACES = [
  { index: 0, name: "Wall A" },
  { index: 1, name: "Wall B" },
  { index: 2, name: "Accent Wall" },
  { index: 3, name: "Ceiling" },
] as const;

export type BlendMode = "multiply" | "overlay" | "softlight";

export const BLEND_MODES: { id: BlendMode; label: string; value: number }[] = [
  { id: "multiply", label: "Multiply", value: 0 },
  { id: "overlay", label: "Overlay", value: 1 },
  { id: "softlight", label: "Soft Light", value: 2 },
];
