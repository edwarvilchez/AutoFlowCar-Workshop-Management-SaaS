export type Stage =
  | "reception"
  | "diagnosis"
  | "execution"
  | "quality"
  | "ready";

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  client: string;
  stage: Stage;
  entryDate: string;
  priority: "low" | "medium" | "high";
  price?: number;
}

// Extended types for Vehicle History
export interface ServiceRecord {
  id: string;
  date: string;
  serviceType: string;
  description: string;
  mileage: number;
  parts?: string;
  photosUrl?: string;
}

export interface MaintenanceItem {
  item: string;
  due: string;
}

export interface VehicleFullDetails extends Vehicle {
  year: number;
  vin: string;
  mileage: number;
  email: string;
  phone: string;
  history: ServiceRecord[];
  upcomingMaintenance: MaintenanceItem[];
  notes: string;
}

// Payment & Currency Types
export type Currency = 'USD' | 'VES';
export type PaymentMethodType = 'transfer' | 'mobile_payment' | 'zelle' | 'cash' | 'binance';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  bankName?: string; // e.g. Banesco, Mercantil
  accountName?: string;
  accountNumber?: string; // or phone for mobile payment
  email?: string; // for Zelle
  currency: Currency;
  isActive: boolean;
  notes?: string;
}

export interface FinancialConfig {
  exchangeRate: number; // Tasa de cambio (VES/USD)
  lastUpdated: string;
}
