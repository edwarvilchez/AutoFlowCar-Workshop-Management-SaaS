import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import DashboardView from './pages/Dashboard';
import BookingView from './pages/Booking';
import VehiclesView from './pages/Vehicles';
import InventoryView from './pages/Inventory';
import BillingView from './pages/Billing';
import SettingsView from './pages/Settings';
import LoginView from './pages/Login';
import RegisterView from './pages/Register';
import UsersView from './pages/Users';
import VehicleHistory from './components/VehicleHistory';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { Menu } from 'lucide-react';
import { useVehicles } from './hooks/useVehicles';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const { vehicles, setVehicles } = useVehicles();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const deleteBooking = (id: string) => {
    if (window.confirm('¿Desea eliminar esta cita?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="app-container">
            <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
            <main className="main-content">
              <button className="mobile-nav-toggle" aria-label="Abrir menú" title="Abrir menú" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <Routes>
                <Route path="/" element={<DashboardView vehicles={vehicles} setVehicles={setVehicles} />} />
                <Route path="/booking" element={<BookingView vehicles={vehicles} onBookingConfirm={(v: any) => { const newVehicle = { ...v, id: uuidv4(), stage: 'reception', budget: { items: [], total: 0, isApproved: false, createdAt: new Date().toISOString() } }; setVehicles((prev: any[]) => [...prev, newVehicle]); }} onBookingDelete={deleteBooking} />} />
                <Route path="/vehicles" element={<VehiclesView vehicles={vehicles} />} />
                <Route path="/vehicles/:id/history" element={<VehicleHistory vehicles={vehicles} />} />
                <Route path="/inventory" element={<InventoryView />} />
                <Route path="/billing" element={<BillingView vehicles={vehicles} />} />
                <Route path="/users" element={<UsersView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
