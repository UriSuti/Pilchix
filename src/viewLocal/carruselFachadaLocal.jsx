import { useState } from "react";
import "./carruselFachadaLocal.css";

const slides = [
  {
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    alt: "Nike Store",
  },
  {
    imagen: "https://images.unsplash.com/photo-1556906781-9a412961a28b?w=800&q=80",
    alt: "Nike Store 2",
  },
  {
    imagen: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
    alt: "Nike Store 3",
  },
];

export default function CarruselFachadaLocal() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="carrusel-wrapper">
      <div className="carrusel-container">
        <div
          className="carrusel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="carrusel-slide" key={i}>
              <img src={slide.imagen} alt={slide.alt} />
            </div>
          ))}
        </div>

        <button className="carrusel-btn-back" onClick={handlePrev} aria-label="Anterior">
          ‹
        </button>

        <div className="carrusel-logo-overlay">
          <svg viewBox="0 0 100 35" fill="white" xmlns="http://www.w3.org/2000/svg" className="nike-swoosh">
            <path d="M0 35L60 0C60 0 75 -3 85 8C95 19 80 30 60 25L20 35H0Z" />
          </svg>
        </div>

        <div className="carrusel-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      <div className="local-info">
        <div className="local-nombre">
          <h1>Nike</h1>
          <span className="badge-abierto" />
        </div>
        <div className="local-detalle">
          <span className="local-icono">📍</span>
          <span>Yatay 240, Almagro</span>
        </div>
        <div className="local-detalle">
          <span className="local-icono">🕐</span>
          <span className="abierto">Abierto</span>
          <span className="horario"> • 08:00hs - 20:00hs</span>
        </div>
        <div className="local-detalle">
          <span className="estrellas">★ 4.5</span>
          <span className="reviews">(145K)</span>
        </div>
      </div>
    </div>
  );
}