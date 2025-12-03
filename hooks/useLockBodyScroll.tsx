// lib/hooks/useLockBodyScroll.ts
import { useEffect } from "react";

export function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    if (lock) html.classList.add("overflow-hidden");
    else html.classList.remove("overflow-hidden");
    return () => html.classList.remove("overflow-hidden");
  }, [lock]);
}
