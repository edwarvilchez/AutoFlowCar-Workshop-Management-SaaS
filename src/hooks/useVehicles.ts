import { useState, useEffect } from 'react';
import type { Vehicle } from '../types';

const STORAGE_KEY = 'sgt:vehicles';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Failed to save vehicles to persistence:', error);
    }
  }, [vehicles]);

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
  };

  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return {
    vehicles,
    setVehicles, // Keep this for now for compatibility with existing code that passes the setter directly
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
};
