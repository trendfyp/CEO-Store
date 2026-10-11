import { create } from "zustand";

export type Panel = "cart" | "search" | "account" | "menu" | null;

type UiState = {
  panel: Panel;
  quickId: string | null;
  notice: string | null;
  open: (panel: Panel) => void;
  close: () => void;
  setQuick: (id: string | null) => void;
  notify: (message: string) => void;
};

let noticeTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>((set) => ({
  panel: null,
  quickId: null,
  notice: null,
  open: (panel) => set({ panel, quickId: null }),
  close: () => set({ panel: null, quickId: null }),
  setQuick: (quickId) => set({ quickId, panel: null }),
  notify: (message) => {
    set({ notice: message });
    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => set({ notice: null }), 2600);
  },
}));
