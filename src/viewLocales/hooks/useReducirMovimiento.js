import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// true si el usuario activó "reducir movimiento" en su sistema (se actualiza en vivo)
export function useReducirMovimiento() {
  const [reducir, setReducir] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return;
    const onChange = (e) => setReducir(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reducir;
}
