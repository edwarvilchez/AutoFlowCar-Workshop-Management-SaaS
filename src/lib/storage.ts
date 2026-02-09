import type { Vehicle, PaymentMethod, FinancialConfig } from '../types';

const KEYS = {
  VEHICLES: 'sgt:vehicles',
  METHODS: 'sgt:methods',
  FINANCIAL: 'sgt:financial',
  HISTORY: 'sgt:history'
};

export const storage = {
  vehicles: {
    get: (): Vehicle[] => {
      try {
        const raw = localStorage.getItem(KEYS.VEHICLES);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Error loading vehicles', e);
        return [];
      }
    },
    set: (data: Vehicle[]) => {
      try {
        localStorage.setItem(KEYS.VEHICLES, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving vehicles', e);
      }
    }
  },
  methods: {
    get: (): PaymentMethod[] => {
      try {
        const raw = localStorage.getItem(KEYS.METHODS);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },
    set: (data: PaymentMethod[]) => {
      localStorage.setItem(KEYS.METHODS, JSON.stringify(data));
    }
  },
  financial: {
    get: (): FinancialConfig | null => {
      try {
        const raw = localStorage.getItem(KEYS.FINANCIAL);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    set: (data: FinancialConfig) => {
      localStorage.setItem(KEYS.FINANCIAL, JSON.stringify(data));
    }
  }
};
