import type { Vehicle } from '../types';

export const sendWhatsAppNotification = (vehicle: Vehicle, phone: string = '') => {
  const message = encodeURIComponent(`🔖 *Confirmación de Cita - AutoFlow*\n\nHola ${vehicle.client},\n\nTu cita para el vehículo *${vehicle.plate} (${vehicle.model})* ha sido programada exitosamente.\n\n📅 *Fecha:* ${vehicle.entryDate}\n📍 *Taller:* AutoFlow Workshop\n\n_Tu vehículo está en buenas manos._`);
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '') || '584140000000'}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

export const sendEmailNotification = (vehicle: Vehicle, email: string = '') => {
  const subject = encodeURIComponent(`Resumen de Cita: ${vehicle.plate}`);
  const body = encodeURIComponent(`Hola ${vehicle.client},\n\nEste es un resumen de tu cita programada en AutoFlow:\n\nVehículo: ${vehicle.plate} (${vehicle.model})\nFecha: ${vehicle.entryDate}\n\nSi necesitas reagendar o cancelar, puedes hacerlo desde tu panel de cliente.\n\nSaludos,\nEquipo AutoFlow`);
  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
};
