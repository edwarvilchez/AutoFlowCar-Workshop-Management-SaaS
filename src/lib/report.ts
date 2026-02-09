import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Vehicle } from '../types'

export const generatePDFReport = (vehicles: Vehicle[]) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(29, 29, 27);
  doc.text('AutoFlow - Reporte Operativo', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);
  autoTable(doc, {
    startY: 45,
    head: [['Placa', 'Modelo', 'Cliente', 'Estado', 'Fecha Ingreso', 'Venta']],
    body: vehicles.map(v => [v.plate, v.model, v.client, v.stage.toUpperCase(), v.entryDate, `$${v.price || 0}`]),
    headStyles: { fillColor: [78, 108, 139] },
    alternateRowStyles: { fillColor: [248, 250, 251] },
  });
  doc.save('AutoFlow_Reporte_Taller.pdf');
};
