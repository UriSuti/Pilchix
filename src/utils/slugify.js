// src/utils/slugify.js
export const slugify = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')                 // separa las letras de sus acentos
    .replace(/[\u0300-\u036f]/g, '')  // borra los acentos
    .trim()
    .replace(/\s+/g, '-')             // espacios → guiones
    .replace(/[^a-z0-9-]/g, '')       // saca cualquier caracter raro