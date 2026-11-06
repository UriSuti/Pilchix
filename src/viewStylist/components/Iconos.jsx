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

// personitas para el filtro de género
export const IconMujer = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.8}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M12 8.5c-1.6 0-2.5.9-2.9 2.3L7.5 16.5h9l-1.6-5.7c-.4-1.4-1.3-2.3-2.9-2.3z" />
    <path d="M10.5 16.5v5M13.5 16.5v5" />
  </svg>
);

export const IconHombre = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.8}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M9 21.5v-7.5H8v-3.5c0-1.2.8-2 2-2h4c1.2 0 2 .8 2 2V14h-1v7.5" />
    <path d="M12 14.5v7" />
  </svg>
);
