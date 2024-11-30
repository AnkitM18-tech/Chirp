import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chirp-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("chirp-theme", theme);
    set({ theme });
  },
}));
