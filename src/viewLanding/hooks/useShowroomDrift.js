import { useEffect, useRef } from "react";

/**
 * Mueve una fila (marquee) de forma continua y la acelera según la velocidad
 * del scroll, desacelerando suave hasta volver al ritmo de reposo.
 * El track debe contener el contenido DUPLICADO para un loop sin saltos.
 */
export function useShowroomDrift({ direccion = "izquierda" } = {}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    let half = track.scrollWidth / 2;
    let boost = 0;
    let lastY = window.scrollY;
    let lastT = null;
    let raf = 0;
    const dir = direccion === "derecha" ? "derecha" : "izquierda";

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      boost = Math.min(boost + Math.abs(dy) * 5, 1400); // el scroll inyecta velocidad
    };

    const frame = (t) => {
      if (lastT === null) lastT = t;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;

      const base = 45; // px/s de reposo
      offset += (base + boost) * dt;
      boost *= Math.pow(0.9, dt * 60); // el extra decae suave
      if (boost < 0.4) boost = 0;
      if (half && offset >= half) offset -= half; // loop perfecto

      const x = dir === "izquierda" ? -offset : offset - half;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(frame);
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [direccion]);

  return trackRef;
}
