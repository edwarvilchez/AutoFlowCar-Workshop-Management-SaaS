import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Car, Package, FileText, Settings as SettingsIcon, Wrench, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export default function Sidebar({ isOpen, toggle }: Props) {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  
  const navItems = [
    { name: 'DASHBOARD', path: '/', icon: LayoutDashboard, roles: ['admin', 'analyst'] },
    { name: 'CITAS', path: '/booking', icon: CalendarDays, roles: ['admin', 'analyst', 'client'] },
    { name: 'VEHÍCULOS', path: '/vehicles', icon: Car, roles: ['admin', 'analyst'] },
    { name: 'INVENTARIO', path: '/inventory', icon: Package, roles: ['admin', 'analyst'] },
    { name: 'FACTURACIÓN', path: '/billing', icon: FileText, roles: ['admin'] },
    { name: 'USUARIOS', path: '/users', icon: User, roles: ['admin'] },
    { name: 'CONFIGURACIÓN', path: '/settings', icon: SettingsIcon, roles: ['admin', 'analyst', 'client'] },
  ];

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={toggle} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            {profile?.workshopLogo ? (
              <img src={profile.workshopLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <Wrench size={20} color="white" />
            )}
          </div>
          <div className="brand-text">
            <h2>{profile?.workshopName || 'AutoFlow'}</h2>
            <p>PREMIUM SAAS</p>
          </div>
        </div>

        <nav>
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isChildActive = location.pathname.startsWith(item.path) && item.path !== '/';
            return (
              <Link key={item.path} to={item.path} className={`sidebar-btn ${isActive || isChildActive ? 'active' : ''}`} onClick={toggle}>
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                <User size={16} color="white" />
              )}
            </div>
            <div style={{ maxWidth: '120px', overflow: 'hidden' }}>
              <p className="user-name" style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'Usuario'}</p>
              <p className="muted small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role || 'Admin'}</p>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout} title="Cerrar Sesión"><LogOut size={18} /></button>
        </div>
      </aside>
    </>
  );
}
