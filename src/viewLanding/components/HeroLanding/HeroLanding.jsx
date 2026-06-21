import { useEffect, useRef } from "react";
import "./HeroLanding.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1920&q=80";

function HeroLanding({ subtitle, title, description }) {
  const bgRef = useRef(null);
  const sectionRef = useRef(null);
  const fondo = HERO_IMG;

  // Parallax suave del fondo mientras se está sobre el hero
  useEffect(() => {
    function onScroll() {
      const bg = bgRef.current;
      if (!bg) return;
      const y = window.scrollY;
      if (y < window.innerHeight) {
        bg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El hero ocupa exactamente la pantalla menos el header (sticky), así el
  // "Seguí bajando" queda justo en el borde inferior, como en el mockup.
  useEffect(() => {
    function ajustarAlto() {
      const header = document.querySelector(".site-header");
      const h = header ? header.offsetHeight : 0;
      if (sectionRef.current) {
        sectionRef.current.style.minHeight = `calc(100svh - ${h}px)`;
      }
    }
    ajustarAlto();
    window.addEventListener("resize", ajustarAlto, { passive: true });
    return () => window.removeEventListener("resize", ajustarAlto);
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div
        className="hero__bg"
        ref={bgRef}
        style={{ backgroundImage: `url(${fondo})` }}
      />

      <div className="lp-wrap hero__inner">
        <p className="hero__eyebrow">{subtitle}</p>
        <h1 className="hero__title">{title}</h1>
        <p className="hero__desc">{description}</p>
        <div className="hero__cta">
          <a className="lp-btn lp-btn--primary" href="#locales">
            Explorar locales →
          </a>
          <a className="lp-btn lp-btn--ghost" href="#ofertas">
            Ver ofertas
          </a>
        </div>
      </div>

      <div className="hero__scrollcue" aria-hidden="true">
        Seguí bajando<span />
      </div>
    </section>
  );
}

export default HeroLanding;
