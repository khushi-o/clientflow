/**
 * App-wide presets: each sets both `mode` (surfaces) and `accent` (primary UI color).
 * Used by Dashboard, Profile, and keyboard shortcuts — keep in sync.
 */
export const APP_THEMES = [
  { key: "earthy", accentKey: "earthy", label: "Earthy", dot: "#1B4332" },
  { key: "dark", accentKey: "cyber", label: "Night", dot: "#F59E0B" },
  { key: "night", accentKey: "sunset", label: "Dusk", dot: "#B45309" },
  { key: "light", accentKey: "violet", label: "Day", dot: "#3F6B4F" },
];

export const accents = {
  // Earthy (default) — forest + terracotta
  earthy: {
    name: "Earthy",
    color:  "#1B4332",
    accent: "#D08C60",
    glow:   "rgba(27,67,50,0.1)",
  },
  // Night — amber + teal (dark UI, no purple)
  cyber: {
    name: "Amber",
    color:  "#F59E0B",
    accent: "#2DD4BF",
    glow:   "rgba(245,158,11,0.14)",
  },
  // Dusk — copper + peach
  sunset: {
    name: "Copper",
    color:  "#B45309",
    accent: "#FDBA74",
    glow:   "rgba(180,83,9,0.12)",
  },
  // Day — sage (saved key kept `violet` for existing preferences)
  violet: {
    name: "Sage",
    color:  "#3F6B4F",
    accent: "#8FAE91",
    glow:   "rgba(63,107,79,0.12)",
  },
  pink: {
    name: "Pink",
    color:  "#f472b6",
    accent: "#ec4899",
    glow:   "rgba(244,114,182,0.12)",
  },
};

export const modes = {
  // Earthy Light
  earthy: {
    bg:        "#F9F7F2",
    sidebar:   "#F0EDE6",
    card:      "#FFFFFF",
    cardBorder:"#E8E4DC",
    topbar:    "#F9F7F2",
    text:      "#2D2D2D",
    textMuted: "#7A7670",
    statBg:    "#FFFFFF",
    shadow:    "0 2px 12px rgba(0,0,0,0.06)",
  },
  // Night — charcoal + warm amber accents (no purple chrome)
  dark: {
    bg:        "#1A1C2C",
    sidebar:   "#14151F",
    card:      "#1F2235",
    cardBorder:"rgba(245,158,11,0.12)",
    topbar:    "#14151F",
    text:      "#E2E8F0",
    textMuted: "rgba(226,232,240,0.45)",
    statBg:    "#1F2235",
    shadow:    "0 2px 16px rgba(0,0,0,0.3)",
  },
  // Dusk / sunset phase — warmer, slightly darker than before
  night: {
    bg:        "#EDE0E0",
    sidebar:   "#E4D4D4",
    card:      "#F7F0F0",
    cardBorder:"#D1B8B8",
    topbar:    "#EDE0E0",
    text:      "#2D1816",
    textMuted: "#7A5C58",
    statBg:    "#F7F0F0",
    shadow:    "0 2px 14px rgba(45,24,22,0.1)",
  },
  // Bright daylight — airier than the dusk (night) preset above
  light: {
    bg:        "#FAFCFF",
    sidebar:   "#F4F8FF",
    card:      "#FFFFFF",
    cardBorder:"rgba(148,163,184,0.22)",
    topbar:    "#FAFCFF",
    text:      "#0f172a",
    textMuted: "rgba(15,23,42,0.48)",
    statBg:    "#FFFFFF",
    shadow:    "0 2px 14px rgba(15,23,42,0.05)",
  },
};
