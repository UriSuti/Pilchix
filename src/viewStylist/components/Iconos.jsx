// íconos de línea del AI Stylist (mismo trazo que los del header)
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const IconChispa = ({ size = 16, strokeWidth = 1.8 }) => (
  <svg {...base} width={size} height={size} strokeWidth={strokeWidth}>
    <path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5z" />
    <path d="M18.5 17.5v4M16.5 19.5h4" />
  </svg>
);

export const IconPercha = ({ size = 26 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.6}>
    <path d="M12 7.5a2 2 0 1 1 2-2c0 1.2-2 1.6-2 3.2v.6" />
    <path d="M12 9.3 2.8 16.4a1.2 1.2 0 0 0 .7 2.1h17a1.2 1.2 0 0 0 .7-2.1z" />
  </svg>
);

export const IconEscudo = ({ size = 26 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.6}>
    <path d="M12 2.8 4.5 5.6v5.7c0 4.7 3.2 8.4 7.5 9.9 4.3-1.5 7.5-5.2 7.5-9.9V5.6z" />
    <path d="m8.8 12 2.2 2.2 4.3-4.4" />
  </svg>
);

export const IconHoja = ({ size = 26 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.6}>
    <path d="M5 19c0-8 5.5-13.5 15-14-.4 9.6-6 15-14 15" />
    <path d="M5 19 13 11" />
  </svg>
);

export const IconSol = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.7}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const IconValija = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.7}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M10.5 12.5v1.5h3v-1.5" />
  </svg>
);

export const IconLuna = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.7}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>
);

export const IconEstrella = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.7}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
);

export const IconPesos = ({ size = 16 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.6 9.2c-.4-.8-1.4-1.3-2.6-1.3-1.5 0-2.6.8-2.6 1.9 0 2.6 5.4 1.4 5.4 4.2 0 1.1-1.2 2-2.8 2-1.3 0-2.4-.6-2.8-1.5M12 6.5v1.4M12 16v1.5" />
  </svg>
);

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

export const IconCandado = ({ size = 12 }) => (
  <svg {...base} width={size} height={size} strokeWidth={1.8}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

