import React, { useState, useEffect } from 'react';
import PaymentSettings from '../components/PaymentSettings';
import { ArrowRight, CreditCard, User, Plus, Lock } from 'lucide-react';

const SettingsView = ({ onLogout }: any) => {
  const [activeTab, setActiveTab] = useState<'general' | 'payments'>('general');
  const [showProfile, setShowProfile] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [themeColor, setThemeColor] = useState<string>(() => getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#009ec7');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sgt:profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const saveProfile = () => {
    try { localStorage.setItem('sgt:profile', JSON.stringify(profile)); } catch {}
    setShowProfile(false);
  };

  const applyTheme = () => {
    try { document.documentElement.style.setProperty('--primary', themeColor); localStorage.setItem('sgt:theme', JSON.stringify({ primary: themeColor })); } catch {}
    setShowCustomize(false);
  };

  if (activeTab === 'payments') {
    return (
      <div className="animate-in fade-in">
        <button onClick={() => setActiveTab('general')} className="btn btn-back">
          <ArrowRight size={18} className="icon-rotated" /> Volver a Ajustes
        </button>
        <PaymentSettings />
      </div>
    );
  }

  return (
  <div className="animate-in">
    <header className="mb-3">
      <span className="section-badge">CONFIG</span>
      <h1>Ajustes Globales</h1>
    </header>
      <div className="grid-3">
        <div className="card card-pad-2-5" onClick={() => setActiveTab('payments')}>
          <div className="icon-square"><CreditCard size={24} /></div>
          <h3 className="card-title">MÉTODOS DE PAGO</h3>
          <p className="text-muted card-desc">Gestiona cuentas bancarias, pago móvil, Zelle y tasa de cambio (Divisas/Bolívares).</p>
          <button className="btn btn-block" onClick={() => setActiveTab('payments')}>ADMINISTRAR</button>
        </div>

        <div className="card card-pad-2-5">
          <div className="icon-square"><User size={24} /></div>
          <h3 className="card-title">PERFIL Y ACCESO</h3>
          <p className="text-muted card-desc">Gestiona tus credenciales de seguridad y perfiles administrativos.</p>
          <button className="btn btn-block" onClick={() => setShowProfile(true)}>EDITAR PERFIL</button>
        </div>

        <div className="card card-pad-2-5">
          <div className="icon-square"><Plus size={24} /></div>
          <h3 className="card-title">PERSONALIZACIÓN</h3>
          <p className="text-muted card-desc">Ajusta los colores y el logotipo de tu instancia de AutoFlow.</p>
          <button className="btn btn-block" onClick={() => setShowCustomize(true)}>CONFIGURAR</button>
        </div>

        <div className="card dashed-error">
          <div className="icon-square icon-square-danger"><Lock size={24} color="var(--error)" /></div>
          <h3 className="error-title">SESIÓN</h3>
          <p className="text-muted card-desc">Finaliza tu jornada de trabajo actual de forma segura.</p>
          <button className="btn btn-danger" onClick={onLogout}>LOGOUT</button>
        </div>
      </div>

      {/* Modals */}
      {showProfile && (
        <div className="mobile-overlay open" onClick={() => setShowProfile(false)}>
          <div className="card" style={{ maxWidth: 720, margin: '6rem auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="card-title">Editar Perfil</h3>
            <div style={{ marginTop: '1rem' }}>
              <label className="form-label">Nombre</label>
              <div className="input-container"><input className="input-field" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label className="form-label">Email</label>
              <div className="input-container"><input className="input-field" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn" onClick={() => setShowProfile(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveProfile}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showCustomize && (
        <div className="mobile-overlay open" onClick={() => setShowCustomize(false)}>
          <div className="card" style={{ maxWidth: 720, margin: '6rem auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="card-title">Personalización</h3>
            <div style={{ marginTop: '1rem' }}>
              <label className="form-label">Color primario</label>
              <div className="input-container"><input className="input-field" type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} /></div>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn" onClick={() => setShowCustomize(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={applyTheme}>Aplicar</button>
            </div>
          </div>
        </div>
      )}
  </div>
  );
};

export default SettingsView;
