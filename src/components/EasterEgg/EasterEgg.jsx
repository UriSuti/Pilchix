import { useEffect, useState } from "react";
import imagen from "../../assets/ye-olde.png"; // ajustá el nombre
import "./EasterEgg.css";

function EasterEgg({ activo, onClose }) {
  const [fase, setFase] = useState("oculto"); // oculto → asomando → completo

  useEffect(() => {
    if (!activo) { setFase("oculto"); return; }

    // asoma un poco...
    setFase("asomando");
    // ...y al ratito sube del todo
    const t1 = setTimeout(() => setFase("completo"), 700);
    // se va solo después de un rato
    const t2 = setTimeout(() => onClose(), 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [activo, onClose]);

  if (!activo && fase === "oculto") return null;

  return (
    <div className={`easter-egg easter-egg--${fase}`} onClick={onClose}>
      <img src={imagen} alt="" />
    </div>
  );
}

export default EasterEgg;