import "./SubscribeSection.css";

function SubscribeSection() {
  return (
    <section className="lp-section" id="suscribirse">
      <div className="lp-wrap">
        <div className="subscribe">
          <p className="subscribe__eyebrow">Sumate</p>
          <h2 className="subscribe__title">
            Seguí tus marcas favoritas
            <br />
            y enterate primero.
          </h2>
          <p className="subscribe__desc">
            Suscribite y recibí las ofertas de tus locales preferidos antes que nadie.
          </p>
          <form className="subscribe__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="tu@email.com" aria-label="Email" />
            <button className="lp-btn lp-btn--primary" type="submit">
              Suscribirme
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SubscribeSection;
