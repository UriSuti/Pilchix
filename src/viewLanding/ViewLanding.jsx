import "./ViewLanding.css";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import HeaderLanding from "./components/HeaderLanding/HeaderLanding";
import CategorySection from "./components/CategorySection/CategorySection";
import FeaturedStoresSection from "./components/FeaturedStoresSection/FeaturedStoresSection";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import OffersSection from "./components/OffersSection/OffersSection";
import { LANDING_SECTION_TITLES } from "./constants";
import { buildLandingResumen } from "./helpers/formatters";
import { useLandingData } from "../hooks/useLandingData";

function ViewLanding({ id_usuario, idUsuario: idUsuarioProp, local, setLocal }) {
  const idUsuario = idUsuarioProp ?? id_usuario;

  const { landingData, loading, error: dataError } = useLandingData(idUsuario);

  const resumen = buildLandingResumen({
    categorias: landingData.categorias,
    marcas: landingData.marcas,
    descuentos: landingData.descuentos,
  });

  const recomendaciones = landingData.productosPopulares.slice(0, 6);
  const masElegidos = [...landingData.productosPopulares]
    .sort((a, b) => b.visualizaciones - a.visualizaciones)
    .slice(0, 6);

  const errorGeneral = dataError;

  return (
    <div className="landing-page">
      <Header
        idUsuario={idUsuario}
        setLocal={setLocal}
      />

      <HeaderLanding
              subtitle="Nueva temporada"
        title="LAS MEJORES OFERTAS PARA EL OTOÑO"
        description="Descubri prendas, locales y descuentos elegidos para una experiencia de compra mucho mas visual"
      />

      <main className="landing-content">
        <CategorySection categorias={landingData.categorias} cargando={loading} />

        {errorGeneral ? <div className="landing-alert">{errorGeneral}</div> : null}

        <FeaturedStoresSection
          local={local}
          setLocal={setLocal}
          marcas={landingData.marcas}
          marcasPopulares={landingData.marcasPopulares}
          cargando={loading}
        />

        <OffersSection
          descuentos={landingData.descuentos}
          cargando={loading}
          titulo={LANDING_SECTION_TITLES.offers}
        />

        <HeroCarousel
          productos={recomendaciones}
          cargando={loading}
          titulo={LANDING_SECTION_TITLES.recommendations}
        />

        <HeroCarousel
          productos={masElegidos}
          cargando={loading}
          titulo={LANDING_SECTION_TITLES.mostChosen}
        />
      </main>

      <Footer />
    </div>
  );
}

export default ViewLanding;
