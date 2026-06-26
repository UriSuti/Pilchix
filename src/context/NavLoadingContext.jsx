import { createContext, useContext, useState, useEffect } from "react";
import OverlayCarga from "../components/OverlayCarga/OverlayCarga.jsx";

const NavLoadingContext = createContext(null);

export function NavLoadingProvider({ children }) {
  const [cargando, setCargando] = useState(false);

  return (
    <NavLoadingContext.Provider value={{ setCargando }}>
      {children}
      <OverlayCarga visible={cargando} />
    </NavLoadingContext.Provider>
  );
}

function useNavLoading() {
  const ctx = useContext(NavLoadingContext);
  if (!ctx) throw new Error("useNavLoading debe usarse dentro de <NavLoadingProvider>");
  return ctx;
}

// Hook que cada página usa con UNA línea: usePaginaCargando(cargando)
export function usePaginaCargando(cargando) {
    const { setCargando } = useNavLoading();

    useEffect(() => {
        setCargando(cargando);
        return () => setCargando(false); // al desmontar la página, apaga el overlay
    }, [cargando, setCargando]);
}