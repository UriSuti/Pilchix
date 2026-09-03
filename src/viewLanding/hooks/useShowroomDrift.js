import { useEffect, useRef } from "react";

/**
 * Mueve una fila (marquee) de forma continua y la acelera según la velocidad
 * del scroll, desacelerando suave hasta volver al ritmo de reposo.
 * El track debe contener el contenido DUPLICADO para un loop sin saltos.
 *
 * También se puede arrastrar con el mouse/touch (pointer events): mientras se
 * arrastra, el offset lo maneja el puntero directamente; al soltar, sigue con
 * inercia (momentum) que decae hasta volver al drift de reposo.
 */
export function useShowroomDrift({ direccion = "izquierda", cantidad = 0 } = {}) {
  const trackRef = useRef(null);

  // `cantidad` reinicia el efecto cuando los productos llegan (la landing se
  // renderiza antes de cargar los datos, así que el track aparece después).
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
    // conversión de "px arrastrados en pantalla" a "delta de offset": ver onPointerMove
    const screenToOffset = dir === "izquierda" ? -1 : 1;

    let dragging = false;
    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let dragDistance = 0; // distancia total recorrida, para distinguir drag de click
    let lastDragX = 0;
    let lastDragT = 0;
    let velocity = 0; // delta de offset por segundo, con signo
    let momentum = 0;

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    const onScroll = () => {
      if (dragging) return;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      boost = Math.min(boost + Math.abs(dy) * 5, 1400); // el scroll inyecta velocidad
    };

    const wrap = () => {
      if (!half) return;
      offset = ((offset % half) + half) % half;
    };

    const frame = (t) => {
      if (lastT === null) lastT = t;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;

      if (dragging) {
        // el offset ya lo actualiza el puntero en onPointerMove; acá no se toca
      } else if (momentum !== 0) {
        offset += momentum * dt;
        momentum *= Math.pow(0.92, dt * 60);
        if (Math.abs(momentum) < 4) momentum = 0;
      } else {
        const base = 45; // px/s de reposo
        offset += (base + boost) * dt;
        boost *= Math.pow(0.9, dt * 60); // el extra decae suave
        if (boost < 0.4) boost = 0;
      }
      wrap();

      const x = dir === "izquierda" ? -offset : offset - half;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(frame);
    };

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return; // solo click primario
      if (e.target.closest(".sh-card__fav")) return; // no robarle el gesto al botón de favorito
      dragging = true;
      dragDistance = 0;
      momentum = 0;
      boost = 0;
      dragPointerId = e.pointerId;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      lastDragX = e.clientX;
      lastDragT = performance.now();
      velocity = 0;
      track.setPointerCapture?.(dragPointerId);
      track.classList.add("is-dragging");
    };

    const onPointerMove = (e) => {
      if (!dragging || e.pointerId !== dragPointerId) return;
      const dxScreen = e.clientX - dragStartX;
      dragDistance = Math.max(dragDistance, Math.abs(dxScreen));
      offset = dragStartOffset + screenToOffset * dxScreen;
      wrap();

      const now = performance.now();
      const dt = now - lastDragT;
      if (dt > 8) {
        velocity = ((e.clientX - lastDragX) / dt) * 1000 * screenToOffset;
        lastDragX = e.clientX;
        lastDragT = now;
      }
    };

    const endDrag = (e) => {
      if (!dragging || (e && e.pointerId !== dragPointerId)) return;
      dragging = false;
      track.classList.remove("is-dragging");
      track.releasePointerCapture?.(dragPointerId);
      momentum = Math.max(Math.min(velocity, 2200), -2200);
    };

    // si se arrastró más que unos px, se suprime el click que dispararía la
    // navegación al producto justo debajo del puntero
    const onClickCapture = (e) => {
      if (dragDistance > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", onClickCapture, true);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("click", onClickCapture, true);
    };
  }, [direccion, cantidad]);

  return trackRef;
}
