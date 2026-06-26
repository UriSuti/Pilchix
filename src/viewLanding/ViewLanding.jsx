import "./ViewLanding.css";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import HeroLanding from "./components/HeroLanding/HeroLanding";
import CategorySection from "./components/CategorySection/CategorySection";
import FeaturedStoresSection from "./components/FeaturedStoresSection/FeaturedStoresSection";
import OffersSection from "./components/OffersSection/OffersSection";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import SubscribeSection from "./components/SubscribeSection/SubscribeSection";
import LookbookDrift from "./components/LookbookDrift/LookbookDrift";
import { LANDING_SECTION_TITLES } from "./constants";
import { useLandingData } from "../hooks/useLandingData";
import { usePaginaCargando } from "../context/NavLoadingContext";

function ViewLanding({ id_usuario, idUsuario: idUsuarioProp, local, setLocal }) {
  const idUsuario = idUsuarioProp ?? id_usuario;

  const { landingData, loading, error: dataError } = useLandingData(idUsuario);

  const recomendaciones = landingData.productosPopulares.slice(0, 8);

  usePaginaCargando(loading);

  return (
    <div className="landing-page">
      <Header idUsuario={idUsuario} setLocal={setLocal} teal />

      <HeroLanding
        subtitle="Nueva temporada · Otoño 2026"
        title={
          <>
            Toda la moda<br />de tu ciudad,<br />
            <em>en un solo lugar.</em>
          </>
        }
        description="Explorá marcas, descubrí locales y cazá las mejores ofertas — una experiencia de compra mucho más visual."
      />

      <main className="landing-content">
        {dataError ? <div className="lp-alert">{dataError}</div> : null}

        <CategorySection categorias={landingData.categorias} cargando={loading} />

        <FeaturedStoresSection
          local={local}
          setLocal={setLocal}
          marcas={landingData.marcas}
          marcasPopulares={landingData.marcasPopulares}
          productos={landingData.productosPopulares}
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
          eyebrow="Pensado para vos"
          alt
        />

        <SubscribeSection />
      </main>

      <LookbookDrift productos={landingData.productosPopulares} />

      <Footer />
    </div>
  );
}

export default ViewLanding;
