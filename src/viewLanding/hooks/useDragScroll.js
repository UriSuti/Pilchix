import { useEffect, useRef } from "react";

/**
 * Convierte un contenedor con overflow-x en un slider arrastrable con
 * mouse/touch (pointer events), usando el scroll nativo (scrollLeft) del
 * contenedor: no hace falta loop infinito ni calcular límites a mano.
 * Los elementos con [data-no-drag] (ej. un botón de favorito) no inician el
 * arrastre, para no robarles el click.
 */
export function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let dragDistance = 0;

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return; // solo click primario
      if (e.target.closest("[data-no-drag]")) return;
      dragging = true;
      dragDistance = 0;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture?.(pointerId);
      el.classList.add("is-dragging");
    };

    const onPointerMove = (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      dragDistance = Math.max(dragDistance, Math.abs(dx));
      el.scrollLeft = startScroll - dx;
    };

    const endDrag = (e) => {
      if (!dragging || (e && e.pointerId !== pointerId)) return;
      dragging = false;
      el.classList.remove("is-dragging");
      el.releasePointerCapture?.(pointerId);
    };

    // si se arrastró más que unos px, se suprime el click que dispararía la
    // navegación al link justo debajo del puntero
    const onClickCapture = (e) => {
      if (dragDistance > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return ref;
}
