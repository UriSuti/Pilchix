import { useEffect, useRef } from "react";
import "./NuestraHistoria.css";

// capítulos de la historia (imágenes decorativas, front)
const CAPITULOS = [
  {
    paso: "Cómo empezó",
    titulo: "Cuatro pibes, una ambición enorme",
    desc: "Pilchix nació de la idea de cuatro amigos que querían cambiar la forma de descubrir moda. Sin vueltas, se pusieron a construir la vidriera que a ellos les hubiese gustado tener.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1100&q=80",
  },
  {
    paso: "La misión",
    titulo: "Darle su lugar a las marcas chicas",
    desc: "Las grandes ya tienen dónde brillar; las pequeñas marcas, no siempre. Por eso decidimos ayudarlas: darles una vidriera propia, con su URL y su identidad, para que cualquiera pueda descubrirlas. Así nació Pilchix.",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=80",
  },
];

function NuestraHistoria() {
  const ref = useRef(null);

  // parallax suave: la imagen se desplaza dentro de su marco (clipeada) y el
  // número gigante detrás se mueve un poco más, dando profundidad sin desacomodar.
  useEffect(() => {
    const contenedor = ref.current;
    if (!contenedor) return;
    const els = Array.from(contenedor.querySelectorAll("[data-pspeed]"));
    let raf = 0;

    function actualizar() {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        // progreso -1..1 según qué tan centrado está el elemento en la pantalla
        const progreso = (r.top + r.height / 2 - vh / 2) / vh;
        const limite = parseFloat(el.dataset.pspeed);
        const y = Math.max(-1, Math.min(1, progreso)) * limite;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
      raf = 0;
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(actualizar);
    }

    actualizar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="lp-section lp-section--alt hist" id="historia" ref={ref}>
      <div className="lp-wrap">
        <div className="lp-head">
          <div>
            <p className="lp-eyebrow">Nuestra historia</p>
            <h2>Así nació Pilchix</h2>
          </div>
        </div>

        {CAPITULOS.map((cap, i) => (
          <div className={`hist__row ${i % 2 === 1 ? "is-rev" : ""}`} key={cap.titulo}>
            <div className="hist__media">
              <div className="hist__frame">
                <img className="hist__img" src={cap.img} alt="" loading="lazy" data-pspeed="22" />
              </div>
            </div>
            <div className="hist__text">
              <span className="hist__num">0{i + 1}</span>
              <p className="hist__step">{cap.paso}</p>
              <h3>{cap.titulo}</h3>
              <p className="hist__desc">{cap.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NuestraHistoria;
