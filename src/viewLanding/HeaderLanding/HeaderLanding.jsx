import "./HeaderLanding.css";
import heroImage from "../../assets/hero.png";

function HeaderLanding({ resumen }) {
  return (
    <section className="hero-banner">
      <img className="hero-banner__image" src={heroImage} alt="Temporada de otono" />
      <div className="hero-banner__overlay">
        <div className="hero-banner__copy">
          <p className="hero-banner__eyebrow">Nueva temporada</p>
          <h1>LAS MEJORES OFERTAS PARA EL OTONO</h1>
          <p>
            Descubri prendas, locales y descuentos elegidos para una experiencia
            de compra mucho mas visual.
          </p>
        </div>

        <div className="hero-banner__stats">
          <article>
            <strong>{resumen.categorias}</strong>
            <span>Categorias</span>
          </article>
          <article>
            <strong>{resumen.marcas}</strong>
            <span>Locales</span>
          </article>
          <article>
            <strong>{resumen.descuentos}</strong>
            <span>Ofertas</span>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HeaderLanding;
