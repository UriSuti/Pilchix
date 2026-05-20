import React from 'react';
import './ViewLanding.css';
import Header from '../header_footer/Header/Header';
import HeaderLanding from './HeaderLanding/HeaderLanding';
import CategorySection from './CategorySection/CategorySection';
import FeaturedStoresSection from './FeaturedStoresSection/FeaturedStoresSection';
import HeroCarousel from './HeroCarousel/HeroCarousel';
import OffersSection from './OffersSection/OffersSection';
import Footer from '../header_footer/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <HeaderLanding />
      <CategorySection />
      <FeaturedStoresSection />
      <HeroCarousel />
      <OffersSection />
      <Footer />
    </div>
  );
}
export default App;