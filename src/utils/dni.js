export const SUFIJO_MAIL_ORT = '@est.ort.edu.ar'

// devuelve el mensaje de error, o null si el DNI es válido
export function validarDni(dni) {
  if (!dni) return 'Ingresá tu DNI.'
  if (dni.includes('@')) return `Escribí solo el DNI, sin ${SUFIJO_MAIL_ORT}.`
  if (/[.,\s-]/.test(dni)) return 'Escribilo sin puntos, guiones ni espacios.'
  if (!/^[0-9]+$/.test(dni)) return 'El DNI solo puede tener números.'
  if (dni.length !== 8) return 'El DNI tiene que tener 8 dígitos.'
  if (dni.startsWith('0')) return 'El DNI no puede empezar con 0.'
  if (/^(\d)\1{7}$/.test(dni)) return 'Ese DNI no es válido.'
  return null
}
