import './FranjaBeneficios.css'

const IconEnvio = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const IconCuotas = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const IconOriginal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3 7.2 17l.9-5.4L4.2 7.7l5.4-.8z" />
  </svg>
)

const IconCambios = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15" />
  </svg>
)

function FranjaBeneficios() {
  return (
    <section className="franja-beneficios">
      <div className="franja-beneficios__item">
        <span className="franja-beneficios__icono"><IconEnvio /></span>
        <div className="franja-beneficios__texto">
          <p className="franja-beneficios__titulo">Envíos a todo el país</p>
          <p className="franja-beneficios__detalle">Rápidos y seguros</p>
        </div>
      </div>

      <div className="franja-beneficios__item">
        <span className="franja-beneficios__icono"><IconCuotas /></span>
        <div className="franja-beneficios__texto">
          <p className="franja-beneficios__titulo">Hasta 6 cuotas sin interés</p>
          <p className="franja-beneficios__detalle">Con tarjetas seleccionadas</p>
        </div>
      </div>

      <div className="franja-beneficios__item">
        <span className="franja-beneficios__icono"><IconOriginal /></span>
        <div className="franja-beneficios__texto">
          <p className="franja-beneficios__titulo">Productos originales</p>
          <p className="franja-beneficios__detalle">Garantía oficial</p>
        </div>
      </div>

      <div className="franja-beneficios__item">
        <span className="franja-beneficios__icono"><IconCambios /></span>
        <div className="franja-beneficios__texto">
          <p className="franja-beneficios__titulo">Cambios y devoluciones</p>
          <p className="franja-beneficios__detalle">Fáciles y sin complicaciones</p>
        </div>
      </div>
    </section>
  )
}

export default FranjaBeneficios
