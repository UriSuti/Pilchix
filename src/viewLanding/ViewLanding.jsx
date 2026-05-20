import React from 'react';
import './ViewLanding.css';
import Header from '../header_footer/Header/Index';
import EncabezadoLanding from './EncabezadoLanding/Index';
import CategorySection from './CategorySection/Index';
import CarruselLocales from './FeaturedStoresSection/Index';
import CarruselPrendas from './CarruselPrendas/Index';
import Footer from '../header_footer/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <EncabezadoLanding />
      <CategorySection />
      <CarruselLocales />
      <CarruselPrendas />
      <Footer />
    </div>
  );
}
export default App;