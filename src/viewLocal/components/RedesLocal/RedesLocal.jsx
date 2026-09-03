import "./RedesLocal.css";

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
const IconTikTok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);
const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20" />
  </svg>
);

// convierte "@handle", "handle" o un link completo en una URL válida
function normalizar(tipo, valor) {
  if (!valor) return null;
  const v = valor.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  if (tipo === "instagram") return `https://instagram.com/${handle}`;
  if (tipo === "tiktok") return `https://tiktok.com/@${handle}`;
  return `https://${v}`; // sitio web
}

function RedesLocal({ marca }) {
  const ig = normalizar("instagram", marca?.instagram);
  const tt = normalizar("tiktok", marca?.tiktok);
  const web = normalizar("web", marca?.sitio_web);

  // si el local no tiene ninguna red, no mostramos la sección
  if (!ig && !tt && !web) return null;

  return (
    <section className="redeslocal">
      <div className="redeslocal__wrap">
        <p className="redeslocal__eyebrow">Comunidad</p>
        <h2 className="redeslocal__titulo">Seguí a {marca.nombre}</h2>
        <p className="redeslocal__sub">
          Enterate de sus lanzamientos, promos y novedades antes que nadie.
        </p>
        <div className="redeslocal__links">
          {ig && (
            <a className="redeslocal__btn redeslocal__btn--ig" href={ig} target="_blank" rel="noreferrer">
              <IconInstagram /> Instagram
            </a>
          )}
          {tt && (
            <a className="redeslocal__btn" href={tt} target="_blank" rel="noreferrer">
              <IconTikTok /> TikTok
            </a>
          )}
          {web && (
            <a className="redeslocal__btn" href={web} target="_blank" rel="noreferrer">
              <IconGlobe /> Sitio web
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default RedesLocal;
