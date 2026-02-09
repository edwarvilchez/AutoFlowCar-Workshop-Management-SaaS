import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Vehicle, VehicleBudget } from '../types';

export const generateBudgetPDF = (vehicle: Vehicle, budget: VehicleBudget, exchangeRate: number) => {
  const doc = new jsPDF();

  // Color Palette
  const primaryColor = [14, 165, 233] as [number, number, number]; // #0ea5e9
  const secondaryColor = [56, 189, 248] as [number, number, number]; // #38bdf8
  const darkColor = [15, 23, 42] as [number, number, number]; // #0f172a

  // Header Background
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESUPUESTO DE SERVICIO', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`NO. PRESUPUESTO: REF-${Math.floor(Math.random() * 10000)}`, 105, 28, { align: 'center' });

  // Reset Colors for Body
  doc.setTextColor(0, 0, 0);
  
  // Client & Vehicle Info Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del Cliente y Vehículo', 14, 50);
  
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 52, 196, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const infoY = 60;
  doc.text(`Cliente: ${vehicle.client}`, 14, infoY);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 140, infoY);
  
  doc.text(`Vehículo: ${vehicle.model}`, 14, infoY + 6);
  doc.text(`Placa: ${vehicle.plate}`, 140, infoY + 6);

  // Budget Items Table
  const tableData = budget.items.map(item => [
    item.description,
    item.category === 'parts' ? 'Repuesto' : 'Mano de Obra',
    `$${item.cost.toFixed(2)}`,
    `Bs. ${(item.cost * exchangeRate).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Descripción', 'Tipo', 'Costo (USD)', 'Costo (VES)']],
    body: tableData,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 249, 255]
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    }
  });

  // Totals Section
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFillColor(245, 245, 245);
  doc.rect(120, finalY, 76, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(120, finalY, 76, 30, 'S');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL A PAGAR', 125, finalY + 8);

  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`USD: $${budget.total.toFixed(2)}`, 190, finalY + 16, { align: 'right' });
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`VES: Bs. ${(budget.total * exchangeRate).toFixed(2)}`, 190, finalY + 24, { align: 'right' });

  // Footer / Approval Note
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('* Este presupuesto tiene una validez de 24 horas.', 14, finalY + 50);
  doc.text('* La aprobación de este presupuesto autoriza el inicio de los trabajos descritos.', 14, finalY + 55);

  // Disclaimer / Signature
  doc.setDrawColor(0, 0, 0);
  doc.line(14, 270, 80, 270);
  doc.text('Firma del Cliente / Aprobación', 14, 275);

  doc.save(`Presupuesto_${vehicle.plate}_${new Date().toISOString().split('T')[0]}.pdf`);
};
