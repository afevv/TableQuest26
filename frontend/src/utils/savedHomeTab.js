// Remembers which Home tab ("exercise" or "social") was open last.
const KEY = "tablequest-home-mode";

export function getSavedHomeTab() {
  try {
    return localStorage.getItem(KEY) === "social" ? "social" : "exercise";
  } catch {
    return "exercise";
  }
}

export function saveHomeTab(mode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // Storage is unavailable, so the tab is not remembered.
  }
}
