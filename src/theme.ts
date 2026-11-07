// K19: tema sistemi takip eder. Elle Koyu / Açık seçimi ayarlar ekranıyla gelecek.

export type Mode = "light" | "dark";

const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set<(m: Mode) => void>();

export function currentMode(): Mode {
  return media.matches ? "dark" : "light";
}

function apply() {
  const mode = currentMode();
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.dataset.theme = mode;
  listeners.forEach((fn) => fn(mode));
}

export function followSystemTheme() {
  apply();
  media.addEventListener("change", apply);
}

export function onModeChange(fn: (m: Mode) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// xterm renkleri: HeroUI'nin nötr zeminiyle uyumlu, sade.
export const terminalThemes = {
  dark: {
    background: "#0e0e10",
    foreground: "#e4e4e7",
    cursor: "#e4e4e7",
    cursorAccent: "#0e0e10",
    selectionBackground: "#3f3f4680",
    black: "#27272a",
    red: "#f87171",
    green: "#4ade80",
    yellow: "#facc15",
    blue: "#60a5fa",
    magenta: "#c084fc",
    cyan: "#22d3ee",
    white: "#e4e4e7",
    brightBlack: "#71717a",
    brightRed: "#fca5a5",
    brightGreen: "#86efac",
    brightYellow: "#fde047",
    brightBlue: "#93c5fd",
    brightMagenta: "#d8b4fe",
    brightCyan: "#67e8f9",
    brightWhite: "#fafafa",
  },
  light: {
    background: "#fafafa",
    foreground: "#18181b",
    cursor: "#18181b",
    cursorAccent: "#fafafa",
    selectionBackground: "#bfdbfe99",
    black: "#18181b",
    red: "#dc2626",
    green: "#16a34a",
    yellow: "#a16207",
    blue: "#2563eb",
    magenta: "#9333ea",
    cyan: "#0891b2",
    white: "#d4d4d8",
    brightBlack: "#71717a",
    brightRed: "#ef4444",
    brightGreen: "#22c55e",
    brightYellow: "#ca8a04",
    brightBlue: "#3b82f6",
    brightMagenta: "#a855f7",
    brightCyan: "#06b6d4",
    brightWhite: "#fafafa",
  },
} as const;
