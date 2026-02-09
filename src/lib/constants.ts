import type { Stage } from '../types'

export const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: 'reception', label: 'Recepción', color: 'var(--secondary)' },
  { id: 'diagnosis', label: 'Diagnóstico', color: 'var(--warning)' },
  { id: 'execution', label: 'Ejecución', color: 'var(--primary)' },
  { id: 'quality', label: 'C. Calidad', color: '#a855f7' },
  { id: 'ready', label: 'Egreso', color: 'var(--success)' },
];

export const INVENTORY_ITEMS = [
  { id: 'i1', name: 'Aceite Sintético 5W-30', stock: 45, unit: 'Lts', status: 'normal' },
  { id: 'i2', name: 'Filtro de Aceite Genérico', stock: 12, unit: 'Und', status: 'low' },
  { id: 'i3', name: 'Pastillas de Freno (Del)', stock: 8, unit: 'Und', status: 'low' },
  { id: 'i4', name: 'Bujías Iridium', stock: 24, unit: 'Und', status: 'normal' },
  { id: 'i5', name: 'Refrigerante 50/50', stock: 15, unit: 'Lts', status: 'normal' },
];

export const WORKSHOP_SERVICES = [
  { id: 'mantenimiento', label: 'Mantenimiento Preventivo', icon: 'Wrench' },
  { id: 'frenos', label: 'Sistema de Frenos', icon: 'ShieldCheck' },
  { id: 'motor', label: 'Reparación de Motor', icon: 'Wrench' },
  { id: 'suspension', label: 'Suspensión y Dirección', icon: 'TrendingUp' },
  { id: 'aire', label: 'Aire Acondicionado', icon: 'Clock' },
  { id: 'latoneria', label: 'Latonería y Pintura', icon: 'Package' },
  { id: 'scanner', label: 'Diagnóstico por Escáner', icon: 'Search' },
];
