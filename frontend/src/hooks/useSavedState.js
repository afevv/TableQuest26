import { useEffect, useState } from "react";

// Works like useState, but keeps the value in the browser between visits.
// "clean" can fix a saved value before it is used.
export function useSavedState(key, initialValue, clean = (value) => value) {
  const [value, setValue] = useState(() => {
    const getInitial = () =>
      typeof initialValue === "function" ? initialValue() : initialValue;

    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved === null ? getInitial() : clean(saved);
    } catch {
      return getInitial();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage is unavailable, so the value only lasts until the page closes.
    }
  }, [key, value]);

  return [value, setValue];
}

// The same for a number that must stay between min and max when it is loaded.
export function useSavedNumber(key, initialValue, min, max) {
  return useSavedState(key, initialValue, (value) =>
    Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : initialValue
  );
}
