import "./ReelLocales.css";

// cinta con los nombres de todas las marcas en loop; el segundo grupo es la
// copia que permite el corte sin salto (translateX -50%)
function CintaMarcas({ locales }) {
  if (locales.length === 0) return null;
  const nombres = locales.map((l) => l.nombre);
  // con pocas marcas se repiten para que cada grupo ocupe más que la pantalla
  const grupo = Array.from({ length: Math.ceil(12 / nombres.length) }, () => nombres).flat();

  return (
    <div className="cinta" style={{ "--cinta-s": `${Math.max(24, grupo.length * 3.5)}s` }}>
      <div className="cinta__track">
        <ul className="cinta__grupo" aria-label="Marcas de Pilchix">
          {grupo.map((n, i) => (
            <li key={i} aria-hidden={i >= nombres.length || undefined}>{n}</li>
          ))}
        </ul>
        <ul className="cinta__grupo" aria-hidden="true">
          {grupo.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CintaMarcas;
