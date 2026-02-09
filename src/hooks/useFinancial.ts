import { useState, useEffect } from 'react';
import type { FinancialConfig } from '../types';
import { storage } from '../lib/storage';

const INITIAL_CONFIG: FinancialConfig = {
  exchangeRate: 36.50,
  lastUpdated: new Date().toISOString()
};

export const useFinancial = () => {
  const [config, setConfigState] = useState<FinancialConfig>(() => {
    // Ensure we get a valid config object, merging with initial to be safe
    const stored = storage.financial.get();
    return stored ? { ...INITIAL_CONFIG, ...stored } : INITIAL_CONFIG;
  });

  useEffect(() => {
    storage.financial.set(config);
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
