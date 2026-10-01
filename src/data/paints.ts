export type Paint = {
  code: string;
  name: string;
  hex: string;
  family: string;
};

export const PAINT_FAMILIES = [
  "Neutrals",
  "Warm",
  "Greens",
  "Blues",
  "Bold",
] as const;

export const PAINTS: Paint[] = [
  { code: "AP-7001", name: "Chalk White", hex: "#F3EFE7", family: "Neutrals" },
  { code: "AP-7014", name: "Soft Linen", hex: "#E7DECD", family: "Neutrals" },
  { code: "NP-2200", name: "Warm Grey", hex: "#C9C3BA", family: "Neutrals" },
  { code: "NP-2240", name: "Pebble Stone", hex: "#A9A298", family: "Neutrals" },
  { code: "AP-8120", name: "Graphite", hex: "#55575C", family: "Neutrals" },

  { code: "AP-3101", name: "Desert Sand", hex: "#E3C79F", family: "Warm" },
  { code: "AP-3144", name: "Terracotta Clay", hex: "#C2714F", family: "Warm" },
  { code: "NP-4408", name: "Spiced Honey", hex: "#D99A4E", family: "Warm" },
  { code: "NP-4451", name: "Dusty Rose", hex: "#D1A2A0", family: "Warm" },
  { code: "AP-3190", name: "Burnt Sienna", hex: "#9E4B32", family: "Warm" },

  { code: "AP-5102", name: "Sage Mist", hex: "#BFC9B4", family: "Greens" },
  { code: "AP-5140", name: "Olive Grove", hex: "#8A9470", family: "Greens" },
  { code: "NP-6621", name: "Forest Deep", hex: "#3F5B4A", family: "Greens" },
  { code: "NP-6650", name: "Eucalyptus", hex: "#9CB7A6", family: "Greens" },

  { code: "AP-6210", name: "Powder Blue", hex: "#BCCEDB", family: "Blues" },
  { code: "AP-6248", name: "Denim Haze", hex: "#7D96B0", family: "Blues" },
  { code: "NP-7705", name: "Indigo Night", hex: "#39506E", family: "Blues" },
  { code: "NP-7733", name: "Teal Harbour", hex: "#3E7A7D", family: "Blues" },

  { code: "AP-9301", name: "Saffron Pop", hex: "#E8A426", family: "Bold" },
  { code: "AP-9355", name: "Chilli Red", hex: "#B23A2F", family: "Bold" },
  { code: "NP-9810", name: "Plum Velvet", hex: "#6B4668", family: "Bold" },
  { code: "NP-9844", name: "Midnight Ink", hex: "#2C3038", family: "Bold" },
];
