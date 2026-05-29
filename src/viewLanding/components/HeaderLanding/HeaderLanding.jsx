import "./HeaderLanding.css";
import Image from "../../../assets/LandingImage.jpg";

function HeaderLanding({subtitle, title, description}) {
  return (
    <section className="hero-banner">
      <img className="hero-banner__image" src={Image} alt="Temporada de otono" />
      <div className="hero-banner__overlay">
        <div className="hero-banner__copy">
          <p className="hero-banner__eyebrow">{subtitle}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default HeaderLanding;
