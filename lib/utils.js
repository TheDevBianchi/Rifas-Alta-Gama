import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return '';

  // Handle Firebase Timestamp
  const jsDate = date.seconds ? new Date(date.seconds * 1000) : date;

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(jsDate);
}

export const getInitialDate = (dateValue) => {
  if (!dateValue) return null

  // Si es un timestamp de Firestore
  if (dateValue?.toDate instanceof Function) {
    return dateValue.toDate()
  }

  // Si es un objeto Date
  if (dateValue instanceof Date) {
    return dateValue
  }

  // Si es un timestamp en segundos
  if (dateValue?.seconds) {
    return new Date(dateValue.seconds * 1000)
  }

  // Si es un string o número, intentar convertir
  try {
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}