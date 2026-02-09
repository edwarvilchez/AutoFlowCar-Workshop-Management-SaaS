import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Car, Package, FileText, Settings as SettingsIcon, Wrench, User, Lock } from 'lucide-react';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  onLogout: () => void;
};

export default function Sidebar({ isOpen, toggle, onLogout }: Props) {
  const location = useLocation();
  const navItems = [
    { name: 'DASHBOARD', path: '/', icon: LayoutDashboard },
    { name: 'CITAS', path: '/booking', icon: CalendarDays },
    { name: 'VEHÍCULOS', path: '/vehicles', icon: Car },
    { name: 'INVENTARIO', path: '/inventory', icon: Package },
    { name: 'FACTURACIÓN', path: '/billing', icon: FileText },
    { name: 'CONFIGURACIÓN', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={toggle} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Wrench size={20} color="white" /></div>
          <div className="brand-text">
            <h2>AutoFlow</h2>
            <p>PREMIUM SAAS</p>
          </div>
        </div>

        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`sidebar-btn ${isActive ? 'active' : ''}`} onClick={toggle}>
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar"><User size={16} color="white" /></div>
            <div>
              <p className="muted">ADMIN</p>
              <p className="muted small">ACTIVE</p>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onLogout}><Lock size={16} /></button>
        </div>
      </aside>
    </>
  );
}
