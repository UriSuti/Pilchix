import React from 'react';
import './ViewLanding.css';
import Header from '../header_footer/Header/Index';
import EncabezadoLanding from './EncabezadoLanding/Index';
import SeccionCategoria from './SeccionCategoria/Index';
import CarruselLocales from './CarruselLocales/Index';
import CarruselPrendas from './CarruselPrendas/Index';
import Footer from '../header_footer/Footer/Index';

function App() {
  return (
    <div className="App">
      <Header />
      <EncabezadoLanding />
      <SeccionCategoria />
      <CarruselLocales />
      <CarruselPrendas />
      <Footer />
    </div>
  );
}
export default App;