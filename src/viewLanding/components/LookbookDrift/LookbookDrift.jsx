import "./LookbookDrift.css";

const SIZES = ["s1", "s2", "s3", "s4"];

function LookbookDrift({ productos = [] }) {
  const imagenes = productos.filter((p) => p.imagen).map((p) => p.imagen);
  if (imagenes.length === 0) return null;

  // repetir hasta tener al menos 8 para que la fila se vea llena
  const base = [];
  while (base.length < 8) base.push(...imagenes);
  const items = base.slice(0, 8);

  // duplicar para el loop continuo
  const fila = [...items, ...items];

  return (
    <section className="drift" aria-label="Lookbook">
      <div className="drift__track">
        {fila.map((src, i) => (
          <figure key={i} className={`drift__item ${SIZES[i % SIZES.length]}`}>
            <img src={src} alt="" loading="lazy" />
          </figure>
        ))}
      </div>

      <div className="drift__overlay">
        <h2>Seguinos en Instagram</h2>
        <p>Inspirate con los looks de la comunidad Pilchix.</p>
        <a href="https://www.instagram.com/pilchix/" target="_blank" rel="noopener noreferrer">
          @pilchix →
        </a>
      </div>
    </section>
  );
}

export default LookbookDrift;
