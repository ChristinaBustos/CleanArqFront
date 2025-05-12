import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';

// Configuración de plugins
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);

// Establecer idioma español
dayjs.locale('es');

export type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'D [de] MMMM [de] YYYY' | 'D MMM YYYY' | string;

/**
 * Formatea una fecha en el formato especificado
 * @param date Fecha a formatear (string, Date o dayjs object)
 * @param format Formato de salida deseado
 * @returns Fecha formateada como string
 */
export const formatDate = (date: string | Date | dayjs.Dayjs, format: DateFormat = 'D [de] MMMM [de] YYYY'): string => {
  if (!date) return 'Fecha no disponible';
  return dayjs(date).format(format);
};

/**
 * Formatea un rango de fechas
 * @param startDate Fecha de inicio
 * @param endDate Fecha de fin
 * @param format Formato para las fechas
 * @returns String formateado "Del {startDate} al {endDate}"
 */
export const formatDateRange = (
  startDate: string | Date | dayjs.Dayjs,
  endDate: string | Date | dayjs.Dayjs,
  format: DateFormat = 'D [de] MMMM [de] YYYY'
): string => {
  if (!startDate || !endDate) return 'Fecha no disponible';
  return `Del ${formatDate(startDate, format)} al ${formatDate(endDate, format)}`;
};

/**
 * Verifica si una fecha está dentro de un rango
 * @param date Fecha a verificar
 * @param startDate Fecha de inicio del rango
 * @param endDate Fecha de fin del rango
 * @param inclusivity (opcional) '[)' incluye inicio pero no fin, '()' excluye ambos, etc.
 * @returns true si la fecha está dentro del rango, false en caso contrario
 */
export const isDateInRange = (
  date: string | Date | dayjs.Dayjs,
  startDate: string | Date | dayjs.Dayjs,
  endDate: string | Date | dayjs.Dayjs,
  inclusivity: '()' | '[)' | '(]' | '[]' = '[]'
): boolean => {
  return dayjs(date).isBetween(startDate, endDate, null, inclusivity);
};

/**
 * Verifica si una fecha está en el pasado
 * @param date Fecha a verificar
 * @returns true si la fecha está en el pasado, false en caso contrario
 */
export const isDateInPast = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isBefore(dayjs());
};

/**
 * Verifica si una fecha está en el futuro
 * @param date Fecha a verificar
 * @returns true si la fecha está en el futuro, false en caso contrario
 */
export const isDateInFuture = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isAfter(dayjs());
};

/**
 * Verifica si un período (rango de fechas) está actualmente activo
 * @param startDate Fecha de inicio del período
 * @param endDate Fecha de fin del período
 * @returns true si la fecha actual está dentro del período, false en caso contrario
 */
export const isPeriodActive = (
  startDate: string | Date | dayjs.Dayjs,
  endDate: string | Date | dayjs.Dayjs
): boolean => {
  const now = dayjs();
  return now.isBetween(startDate, endDate, null, '[]');
};

/**
 * Convierte una fecha al formato requerido por el backend
 * @param date Fecha a convertir
 * @param format Formato de salida (por defecto YYYY-MM-DD)
 * @returns Fecha en formato string lista para enviar al backend
 */
export const formatDateForBackend = (
  date: string | Date | dayjs.Dayjs,
  format: DateFormat = 'YYYY-MM-DD'
): string => {
  return dayjs(date).format(format);
};

/**
 * Verifica si dos fechas son iguales (mismo día)
 * @param date1 Primera fecha a comparar
 * @param date2 Segunda fecha a comparar
 * @returns true si ambas fechas son el mismo día, false en caso contrario
 */
export const isSameDay = (
  date1: string | Date | dayjs.Dayjs,
  date2: string | Date | dayjs.Dayjs
): boolean => {
  return dayjs(date1).isSame(dayjs(date2), 'day');
};

/**
 * Verifica si una fecha es hoy
 * @param date Fecha a verificar
 * @returns true si la fecha es hoy, false en caso contrario
 */
export const isTodayDate = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isToday();
};

export default {
  formatDate,
  formatDateRange,
  isDateInRange,
  isDateInPast,
  isDateInFuture,
  isPeriodActive,
  formatDateForBackend,
  isSameDay,
  isTodayDate
}; 