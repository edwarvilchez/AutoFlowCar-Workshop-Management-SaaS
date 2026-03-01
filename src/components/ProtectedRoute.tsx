import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ border: '3px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent', width: '3rem', height: '3rem', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p className="text-muted">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
