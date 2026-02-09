import { useState, useEffect } from 'react';
import type { FinancialConfig } from '../types';

const STORAGE_KEY = 'sgt:financial';

const INITIAL_CONFIG: FinancialConfig = {
  exchangeRate: 36.50,
  lastUpdated: new Date().toISOString()
};

export const useFinancial = () => {
  const [config, setConfigState] = useState<FinancialConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save financial config:', error);
    }
  }, [config]);

  const updateRate = (newRate: number) => {
    setConfigState({
      exchangeRate: newRate,
      lastUpdated: new Date().toISOString()
    });
  };

  return {
    config,
    updateRate
  };
};
