import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import DashboardView from './pages/Dashboard';
import BookingView from './pages/Booking';
import VehiclesView from './pages/Vehicles';
import InventoryView from './pages/Inventory';
import BillingView from './pages/Billing';
import SettingsView from './pages/Settings';
import VehicleHistory from './components/VehicleHistory';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';
import { useVehicles } from './hooks/useVehicles';

function App() {
  const { vehicles, setVehicles } = useVehicles();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} onLogout={() => {}} />
        <main className="main-content">
          <button className="mobile-nav-toggle" aria-label="Abrir menú" title="Abrir menú" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <Routes>
            <Route path="/" element={<DashboardView vehicles={vehicles} setVehicles={setVehicles} />} />
            <Route path="/booking" element={<BookingView onBookingConfirm={(v: any) => { const newVehicle = { ...v, id: uuidv4(), stage: 'reception' }; setVehicles((prev: any[]) => [...prev, newVehicle]); }} />} />
            <Route path="/vehicles" element={<VehiclesView vehicles={vehicles} />} />
            <Route path="/vehicles/:id/history" element={<VehicleHistory vehicles={vehicles} />} />
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/billing" element={<BillingView vehicles={vehicles} />} />
            <Route path="/settings" element={<SettingsView onLogout={() => {}} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
