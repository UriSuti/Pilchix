import { useEffect, useRef } from "react";
import "./HeaderLanding.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1920&q=80";

function HeaderLanding({ subtitle, title, description }) {
  const bgRef = useRef(null);
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

  return (
    <section className="hero">
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

export default HeaderLanding;
