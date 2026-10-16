import "./ViewStylist.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header_footer/Header/Header";
import Footer from "../header_footer/Footer/Footer";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getPreferencias, guardarPreferencias, generarOutfits } from "./services/stylist";
import { PREFERENCIAS_INICIALES, OCASIONES, ESTILOS, CALCES, PASOS, PALETA, formatPrecio } from "./constants";
import PreferenciasStylist from "./components/PreferenciasStylist.jsx";
import OutfitCard from "./components/OutfitCard.jsx";
import { IconChispa, IconPercha, IconEscudo, IconHoja, IconFlecha } from "./components/Iconos.jsx";
import fotoHero from "../assets/stylist-hero.jpg";

// las preferencias guardadas pueden venir de una versión anterior del formulario:
// lo que no sea válido hoy vuelve al valor inicial
function normalizar(p) {
  if (!p) return PREFERENCIAS_INICIALES;
  return {
    ocasion: OCASIONES.some((o) => o.valor === p.ocasion) ? p.ocasion : PREFERENCIAS_INICIALES.ocasion,
    estilos: Array.isArray(p.estilos) ? p.estilos.filter((e) => ESTILOS.includes(e)) : PREFERENCIAS_INICIALES.estilos,
    presupuesto: p.presupuesto ?? null,
    colores: Array.isArray(p.colores) ? p.colores : PREFERENCIAS_INICIALES.colores,
    calce: CALCES.includes(p.calce) ? p.calce : PREFERENCIAS_INICIALES.calce,
  };
}

function Stepper({ paso, maxPaso, onIr }) {
  return (
    <ol className="sty-stepper">
      {PASOS.map((nombre, i) => {
        const n = i + 1;
        const estado = n === paso ? "is-activo" : n < paso ? "is-hecho" : "";
        return (
          <li key={nombre} className={`sty-stepper__paso ${estado}`}>
            <button type="button" onClick={() => onIr(n)} disabled={n > maxPaso || n === paso}>
              <span className="sty-stepper__num">{n}</span>
              {nombre}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ResumenPreferencias({ pref }) {
  const colores = pref.colores.map((hex) => PALETA.find((p) => p.hex === hex)?.nombre ?? hex);
  const partes = [
    pref.ocasion,
    ...pref.estilos,
    pref.presupuesto ? `Hasta ${formatPrecio(pref.presupuesto)}` : null,
    pref.calce,
  ].filter(Boolean);

  return (
    <div className="sty-resumen">
      <ul className="sty-chips">
        {partes.map((p) => <li key={p} className="sty-chip sty-chip--tag">{p}</li>)}
      </ul>
      {pref.colores.length > 0 && (
        <div className="sty-resumen__colores" title={colores.join(", ")}>
          {pref.colores.map((hex) => <span key={hex} className="sty-swatch sty-swatch--mini" style={{ "--sw": hex }} />)}
        </div>
      )}
    </div>
  );
}

function ViewStylist() {
  const navigate = useNavigate();
  const { estaLogueado } = useAuth();
  const { mostrarToast } = useToast();

  const [pref, setPref] = useState(PREFERENCIAS_INICIALES);
  const [paso, setPaso] = useState(1);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null); // { mensaje, outfits, avisos, preferencias }
  const [elegido, setElegido] = useState(null);     // índice del outfit elegido
  const [pedido, setPedido] = useState(""); // texto libre: se escribe en el paso 1 y se puede ajustar en el 2
  const [usarPropias, setUsarPropias] = useState(false);
  const [prendasPropias, setPrendasPropias] = useState("");
  const resultadosRef = useRef(null);

  useEffect(() => {
    if (!estaLogueado) return;
    let activo = true;
    getPreferencias()
      .then((p) => { if (activo && p) setPref(normalizar(p)); })
      .catch(() => {});
    return () => { activo = false; };
  }, [estaLogueado]);

  const irAResultados = () =>
    requestAnimationFrame(() => resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  const generar = async () => {
    if (!estaLogueado) {
      mostrarToast("Iniciá sesión para que el estilista arme tus looks", "info");
      navigate("/login");
      return;
    }
    setGenerando(true);
    irAResultados();
    try {
      const prefLimpias = { ...pref, presupuesto: Number(pref.presupuesto) || null };
      // guardar el estilo no debe frenar la generación si falla
      guardarPreferencias(prefLimpias).catch(() => {});
      const { mensaje, outfits, avisos } = await generarOutfits({
        preferencias: prefLimpias,
        pedido: pedido.trim(),
        prendasPropias: usarPropias ? prendasPropias : "",
      });
      setResultado({ mensaje, outfits, avisos: avisos ?? [], preferencias: prefLimpias });
      setElegido(null);
      setPaso(2);
      irAResultados();
    } catch (err) {
      mostrarToast(err.message || "El estilista no pudo armar tus looks", "error");
    } finally {
      setGenerando(false);
    }
  };

  const actualizarOutfit = useCallback((i, outfit) => {
    setResultado((r) => ({ ...r, outfits: r.outfits.map((o, j) => (j === i ? outfit : o)) }));
  }, []);

  const elegir = (i) => {
    setElegido(i);
    setPaso(3);
    irAResultados();
  };

  const maxPaso = elegido !== null ? 3 : resultado ? 2 : 1;
  const look = elegido !== null ? resultado?.outfits[elegido] : null;

  return (
    <div className="view-stylist">
      <Header />

      {/* ============ HERO ============ */}
      <section className="sty-hero">
        <div className="sty-hero__foto" aria-hidden="true">
          <img src={fotoHero} alt="" />
        </div>
        <div className="sty-wrap sty-hero__wrap">
          <div className="sty-hero__texto">
            <span className="sty-badge"><IconChispa size={13} strokeWidth={2} /> Nuevo en Pilchix</span>
            <h1 className="sty-hero__titulo">AI Stylist</h1>
            <p className="sty-hero__sub">
              Contale qué necesitás y te armamos looks personalizados con las mejores marcas, en base
              a tu estilo, ocasión y presupuesto. Simple, rápido y 100% a tu medida.
            </p>
            <ul className="sty-hero__features">
              <li><IconChispa size={26} strokeWidth={1.5} /><span>Looks<br />personalizados</span></li>
              <li><IconPercha /><span>Las mejores<br />marcas</span></li>
              <li><IconEscudo /><span>Ahorra tiempo<br />y elegí mejor</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ INTRO + CARD ============ */}
      <section className="sty-intro">
        <div className="sty-wrap sty-intro__grid">
          <div className="sty-intro__texto">
            <p className="sty-eyebrow">Tu estilo, nuestra tecnología</p>
            <h2 className="sty-intro__titulo">Descubrí looks que van con vos</h2>
            <p className="sty-intro__sub">
              Nuestro AI Stylist analiza tus preferencias y te recomienda outfits completos, con las mejores
              marcas y opciones que se ajustan a tu estilo, ocasión y presupuesto.
            </p>
            <ul className="sty-intro__features">
              <li><span className="sty-naranja"><IconChispa size={26} strokeWidth={1.5} /></span>Looks únicos<br />y personalizados</li>
              <li><IconPercha />Marcas de<br />primer nivel</li>
              <li><IconEscudo />Compras seguras<br />y confiables</li>
              <li><IconHoja />Moda más<br />consciente</li>
            </ul>
          </div>

          <div className="sty-card">
            <Stepper paso={paso} maxPaso={maxPaso} onIr={(n) => { setPaso(n); if (n > 1) irAResultados(); }} />

            {paso === 1 && (
              <PreferenciasStylist
                pref={pref}
                onChange={setPref}
                pedido={pedido}
                onPedidoChange={setPedido}
                onSubmit={generar}
                generando={generando}
              />
            )}

            {paso === 2 && (
              <form className="sty-form" onSubmit={(e) => { e.preventDefault(); generar(); }}>
                <p className="sty-pregunta">Tu pedido</p>
                <ResumenPreferencias pref={pref} />
                <button type="button" className="sty-link" onClick={() => setPaso(1)}>Editar preferencias</button>

                <label className="sty-campo">
                  <span className="sty-label">¿Querés ajustar algo? Contale al estilista</span>
                  <textarea
                    className="sty-input sty-input--area"
                    rows={3}
                    maxLength={600}
                    value={pedido}
                    onChange={(e) => setPedido(e.target.value)}
                    placeholder="Ej.: que combine con zapatillas blancas y sea para el sábado a la noche"
                    disabled={generando}
                  />
                </label>

                <label className="sty-check">
                  <input type="checkbox" checked={usarPropias} onChange={(e) => setUsarPropias(e.target.checked)} />
                  Quiero combinarlo con ropa que ya tengo
                </label>
                {usarPropias && (
                  <input
                    className="sty-input"
                    maxLength={400}
                    value={prendasPropias}
                    onChange={(e) => setPrendasPropias(e.target.value)}
                    placeholder="Ej.: jean negro recto, campera de cuero"
                    disabled={generando}
                  />
                )}

                <div className="sty-form__final sty-form__final--fin">
                  <button type="submit" className="sty-btn-generar" disabled={generando}>
                    {generando ? "Generando tus looks…" : "Generar nuevos looks"}
                    {!generando && <IconFlecha />}
                  </button>
                </div>
              </form>
            )}

            {paso === 3 && look && (
              <div className="sty-form">
                <p className="sty-pregunta">Elegiste</p>
                <p className="sty-elegido__titulo">{look.titulo}</p>
                <p className="sty-elegido__total">{formatPrecio(look.total)} · {look.prendas.length} prendas</p>
                <p className="sty-intro__sub">
                  Abajo podés cambiar cualquier prenda, probártela en el probador virtual o guardar el look en tus favoritos.
                </p>
                <div className="sty-form__final sty-form__final--fin">
                  <button type="button" className="sty-btn-sec" onClick={() => { setPaso(1); }}>
                    Cambiar preferencias
                  </button>
                  <button type="button" className="sty-btn-generar" onClick={() => { setPaso(2); irAResultados(); }}>
                    Ver los otros looks <IconFlecha />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ RESULTADOS / TU LOOK ============ */}
      <div ref={resultadosRef} className="sty-ancla" />
      {generando && (
        <section className="sty-resultados" aria-live="polite">
          <div className="sty-wrap">
            <p className="sty-eyebrow">Resultados</p>
            <h2 className="sty-intro__titulo">Armando tus looks…</h2>
            <p className="sty-intro__sub">El estilista está revisando el catálogo y combinando prendas.</p>
            <div className="sty-looks">
              {[0, 1, 2].map((i) => <div key={i} className="sty-look sty-look--sk"><div className="sty-sk" /></div>)}
            </div>
          </div>
        </section>
      )}

      {!generando && resultado && paso === 2 && (
        <section className="sty-resultados">
          <div className="sty-wrap">
            <p className="sty-eyebrow">Resultados</p>
            <h2 className="sty-intro__titulo">Tus 3 looks</h2>
            {resultado.mensaje && <p className="sty-intro__sub">{resultado.mensaje}</p>}
            {resultado.avisos.length > 0 && (
              <ul className="sty-avisos">
                {resultado.avisos.map((a) => <li key={a}>{a}</li>)}
              </ul>
            )}
            <div className="sty-looks">
              {resultado.outfits.map((o, i) => (
                <OutfitCard
                  key={o.tipo}
                  outfit={o}
                  onChange={(nuevo) => actualizarOutfit(i, nuevo)}
                  preferencias={resultado.preferencias}
                  onElegir={() => elegir(i)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {!generando && look && paso === 3 && (
        <section className="sty-resultados">
          <div className="sty-wrap">
            <p className="sty-eyebrow">Tu look</p>
            <h2 className="sty-intro__titulo">{look.titulo}</h2>
            <OutfitCard
              outfit={look}
              onChange={(nuevo) => actualizarOutfit(elegido, nuevo)}
              preferencias={resultado.preferencias}
              destacado
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default ViewStylist;
