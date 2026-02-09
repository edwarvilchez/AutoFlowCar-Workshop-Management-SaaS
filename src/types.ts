export type Stage =
  | "reception"
  | "diagnosis"
  | "execution"
  | "quality"
  | "ready";

// Original Vehicle definition removed to avoid duplication. See bottom of file.

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

// Budget Types
export interface BudgetItem {
  id: string;
  description: string;
  category: 'parts' | 'labor';
  cost: number;
}

export interface VehicleBudget {
  items: BudgetItem[];
  total: number;
  isApproved: boolean; // Controls advance to next stage
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  client: string;
  stage: Stage;
  entryDate: string;
  priority: "low" | "medium" | "high";
  price?: number;
  budget?: VehicleBudget; // Linked budget
}

