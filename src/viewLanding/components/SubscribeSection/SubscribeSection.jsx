import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./SubscribeSection.css";

const IconSparkle = () => (
  <svg className="subscribe__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z" />
  </svg>
);

function SubscribeSection() {
  const { estaLogueado, usuario } = useAuth();

  return (
    <section className="lp-section" id="suscribirse">
      <div className="lp-wrap">
        <div className="subscribe">
          {estaLogueado ? (
            <>
              <p className="subscribe__eyebrow">Ya sos parte</p>
              <h2 className="subscribe__title">
                Hola, {usuario?.nombre || "crack"} <IconSparkle />
                <br />
                seguí explorando Pilchix.
              </h2>
              <p className="subscribe__desc">
                Guardá tus favoritos, seguí a tus marcas y no te pierdas ninguna oferta.
              </p>
              <div className="subscribe__cta">
                <Link className="lp-btn lp-btn--primary" to="/perfil">
                  Ir a mi perfil
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="subscribe__eyebrow">Sumate</p>
              <h2 className="subscribe__title">
                Creá tu cuenta en Pilchix
                <br />
                y hacé tuya la vidriera.
              </h2>
              <p className="subscribe__desc">
                Guardá favoritos, seguí a tus marcas preferidas y comprá más rápido. Es gratis.
              </p>
              <div className="subscribe__cta">
                <Link className="lp-btn lp-btn--primary" to="/registro">
                  Crear cuenta
                </Link>
                <Link className="lp-btn lp-btn--ghost" to="/login">
                  Iniciar sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SubscribeSection;
