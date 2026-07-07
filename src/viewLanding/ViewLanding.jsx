import "./ViewLanding.css";
import { useEffect } from "react";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import HeroLanding from "./components/HeroLanding/HeroLanding";
import CategorySection from "./components/CategorySection/CategorySection";
import FeaturedStoresSection from "./components/FeaturedStoresSection/FeaturedStoresSection";
import OffersSection from "./components/OffersSection/OffersSection";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import SubscribeSection from "./components/SubscribeSection/SubscribeSection";
import ShopTheLook from "./components/ShopTheLook/ShopTheLook";
import ComunidadPilchix from "./components/ComunidadPilchix/ComunidadPilchix";
import { LANDING_SECTION_TITLES } from "./constants";
import { useLandingData } from "../hooks/useLandingData";
import ViewLandingSkeleton from "../components/skeletons/ViewLandingSkeleton";

function ViewLanding({ id_usuario, idUsuario: idUsuarioProp, local, setLocal }) {
  const idUsuario = idUsuarioProp ?? id_usuario;

  const { landingData, loading, error: dataError } = useLandingData(idUsuario);

  const recomendaciones = landingData.productosPopulares.slice(0, 8);

  // si se llega con un hash (ej. #recomendados o #locales), scrollea ahí al cargar
  useEffect(() => {
    if (loading || !window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [loading]);

  return (
    <div className="landing-page">
      <Header idUsuario={idUsuario} setLocal={setLocal} teal />

      {loading ? (
        <ViewLandingSkeleton />
      ) : (
      <>
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
          id="recomendados"
          productos={recomendaciones}
          cargando={loading}
          titulo={LANDING_SECTION_TITLES.recommendations}
          eyebrow="Pensado para vos"
          alt
        />

        <ShopTheLook productos={landingData.productosPopulares} cargando={loading} />

        <SubscribeSection />

        <ComunidadPilchix />
      </main>
      </>
      )}

      <Footer />
    </div>
  );
}

export default ViewLanding;
