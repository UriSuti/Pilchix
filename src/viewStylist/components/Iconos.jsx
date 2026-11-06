// íconos de línea del estilista (mismo trazo que los del header)
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const IconMas = ({ size = 16 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.8}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconFlecha = ({ size = 16 }) => (
  <svg {...base} width={size} height={size} strokeWidth={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// símbolos de género (♀ / ♂) para el filtro de ropa
export const IconMujer = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={2}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="M12 14.5v7.5M8.5 18.5h7" />
  </svg>
);

export const IconHombre = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={2}>
    <circle cx="10" cy="14" r="5.5" />
    <path d="M14 10l6.5-6.5M15 3.5h5.5V9" />
  </svg>
);
