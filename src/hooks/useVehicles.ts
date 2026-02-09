import { useState, useEffect } from 'react';
import type { Vehicle } from '../types';
import { storage } from '../lib/storage';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    return storage.vehicles.get();
  });

  useEffect(() => {
    storage.vehicles.set(vehicles);
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
    setVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
};
