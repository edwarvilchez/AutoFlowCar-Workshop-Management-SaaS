import { useState, useEffect } from 'react';
import { 
  Building, 
  Smartphone, 
  Banknote, 
  CreditCard, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff,
  Plus,
  RefreshCcw,
  Check,
  X,
  Save
} from 'lucide-react';
import type { PaymentMethod, PaymentMethodType } from '../types';

const INITIAL_METHODS: PaymentMethod[] = [
  { id: '1', type: 'transfer', bankName: 'Banesco', accountName: 'AutoFlow CA', accountNumber: '0134-2222-33-4444555566', currency: 'VES', isActive: true, notes: 'Para transferencias nacionales' },
  { id: '2', type: 'mobile_payment', bankName: 'Mercantil', accountName: 'AutoFlow Pagos', accountNumber: '0414-1234567', currency: 'VES', isActive: true, notes: 'Pago Móvil C2P disponible' },
  { id: '3', type: 'zelle', email: 'pagos@autoflow.com', accountName: 'Juan Pérez LLC', currency: 'USD', isActive: true, notes: 'Indicar número de placa en el memo' },
  { id: '4', type: 'cash', currency: 'USD', isActive: true, notes: 'Pago en caja (Divisas)' },
  { id: '5', type: 'binance', email: 'crypto@autoflow.com', currency: 'USD', isActive: false, notes: 'USDT (TRC20)' }
];


import { v4 as uuidv4 } from 'uuid';

import { useFinancial } from '../hooks/useFinancial';

const PaymentSettings = () => {
  const { config, updateRate: saveRate } = useFinancial();
  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    try {
      const raw = localStorage.getItem('sgt:methods');
      return raw ? JSON.parse(raw) as PaymentMethod[] : INITIAL_METHODS;
    } catch (e) {
      return INITIAL_METHODS;
    }
  });
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(config.exchangeRate.toString());
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleMethod = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  const deleteMethod = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
      setMethods(prev => prev.filter(m => m.id !== id));
    }
  };

  const openModal = (method?: PaymentMethod) => {
    setErrors({});
    if (method) {
      setEditingMethod(method);
      setFormData(method);
    } else {
      setEditingMethod(null);
      setFormData({
        type: 'transfer',
        currency: 'VES',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const type = formData.type;

    if (type === 'transfer' || type === 'mobile_payment') {
      if (!formData.bankName?.trim()) newErrors.bankName = 'El banco es obligatorio';
      if (!formData.accountNumber?.trim()) newErrors.accountNumber = 'El número de cuenta/teléfono es obligatorio';
      if (!formData.accountName?.trim()) newErrors.accountName = 'El nombre del titular es obligatorio';
    }

    if (type === 'zelle' || type === 'binance') {
      if (!formData.email?.trim()) newErrors.email = 'El correo es obligatorio';
      if (type === 'zelle' && !formData.accountName?.trim()) newErrors.accountName = 'El nombre del titular es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingMethod) {
      setMethods(prev => prev.map(m => m.id === editingMethod.id ? { ...m, ...formData } as PaymentMethod : m));
    } else {
      const newMethod: PaymentMethod = {
        ...formData,
        id: uuidv4(),
        isActive: true
      } as PaymentMethod;
      setMethods(prev => [...prev, newMethod]);
    }
    setShowModal(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem('sgt:methods', JSON.stringify(methods));
    } catch (e) {
      // ignore
    }
  }, [methods]);

  const updateRate = () => {
    const rate = parseFloat(tempRate);
    if (!isNaN(rate) && rate > 0) {
      saveRate(rate);
      setIsEditingRate(false);
    }
  };

  const getIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'zelle': return <Smartphone size={20} color="#36e2fe" />;
      case 'mobile_payment': return <Smartphone size={20} color="var(--primary)" />;
      case 'transfer': return <Building size={20} color="#fbbf24" />;
      case 'cash': return <Banknote size={20} color="#4ade80" />;
      case 'binance': return <RefreshCcw size={20} color="#fcd34d" />;
      default: return <CreditCard size={20} />;
    }
  };

  return (
    <div className="animate-in fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>FINANZAS</span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Métodos de Pago</h1>
          <p className="text-muted">Gestiona tus cuentas bancarias, billeteras digitales y tasa de cambio.</p>
        </div>
        
        {/* Exchange Rate Card */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Tasa de Cambio (BCV/Paralelo)</span>
            {isEditingRate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <input 
                  autoFocus
                  type="number" 
                  step="0.01"
                  value={tempRate} 
                  onChange={(e) => setTempRate(e.target.value)}
                  style={{ background: 'black', border: '1px solid var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', width: '80px', fontWeight: 'bold' }}
                />
                <button onClick={updateRate} className="btn-icon" style={{ padding: '4px', background: 'var(--success)' }}><Check size={14} /></button>
              </div>
            ) : (
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={() => setIsEditingRate(true)}>
                {config.exchangeRate.toFixed(2)} <span style={{ fontSize: '0.9rem', color: '#666' }}>Bs/USD</span> <Edit3 size={14} color="#666" />
              </div>
            )}
            <span style={{ fontSize: '0.65rem', color: '#555' }}>Actualizado: {new Date(config.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      {/* Payment Methods List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Cuentas Configuradas</h2>
          <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }} onClick={() => openModal()}><Plus size={16} /> NUEVA CUENTA</button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {methods.map(method => (
            <div key={method.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: method.isActive ? 1 : 0.6, borderLeft: `4px solid ${method.isActive ? 'var(--success)' : '#444'}`, transition: 'all 0.2s' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
                  {getIcon(method.type)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{method.bankName || method.type.toUpperCase().replace('_', ' ')}</h3>
                    <span className="badge" style={{ background: method.currency === 'USD' ? 'var(--success)' : 'var(--primary)', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{method.currency}</span>
                  </div>
                  
                  <div style={{ marginTop: '0.4rem', color: '#aaa', fontSize: '0.9rem' }}>
                    {method.type === 'mobile_payment' ? (
                       <span>Pago Móvil: {method.accountNumber} • {method.accountName}</span>
                    ) : method.type === 'zelle' ? (
                       <span>{method.email} • {method.accountName}</span>
                    ) : (
                       <span>{method.accountNumber || method.email || 'Habilitado en caja'}</span>
                    )}
                  </div>
                  {method.notes && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem', fontStyle: 'italic' }}>{method.notes}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn" 
                  style={{ background: 'transparent', padding: '0.5rem', color: '#888' }}
                  onClick={() => toggleMethod(method.id)}
                  title={method.isActive ? "Desactivar" : "Activar"}
                >
                  {method.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button className="btn" style={{ background: 'transparent', padding: '0.5rem', color: '#888' }} onClick={() => openModal(method)}><Edit3 size={18} /></button>
                <button className="btn" style={{ background: 'transparent', padding: '0.5rem', color: 'var(--error)', opacity: 0.6 }} onClick={() => deleteMethod(method.id)}><Trash2 size={18} /></button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="mobile-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', position: 'relative', animation: 'fadeIn 0.3s ease' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
              {editingMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
            </h2>

            <form onSubmit={handleSaveMethod} style={{ display: 'grid', gap: '1.5rem' }}>
              
              <div className="form-group">
                <label className="form-label">Tipo de Método</label>
                <div className="input-container">
                  <select 
                    className="input-field" 
                    value={formData.type} 
                    onChange={e => {
                      setFormData({...formData, type: e.target.value as PaymentMethodType});
                      setErrors({}); // clear errors on type change
                    }}
                  >
                    <option value="transfer">Transferencia Bancaria</option>
                    <option value="mobile_payment">Pago Móvil</option>
                    <option value="zelle">Zelle</option>
                    <option value="cash">Efectivo (Caja)</option>
                    <option value="binance">Criptomoneda (Binance)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div className="form-group">
                  <label className="form-label">Moneda</label>
                  <div className="input-container">
                    <select 
                      className="input-field" 
                      value={formData.currency} 
                      onChange={e => setFormData({...formData, currency: e.target.value as any})}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="VES">Bolívares (Bs)</option>
                    </select>
                  </div>
                </div>
                {formData.type !== 'cash' && (
                  <div className="form-group">
                    <label className="form-label">Banco / Plataforma</label>
                    <div className="input-container" style={{ borderColor: errors.bankName ? 'var(--error)' : 'transparent' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Ej: Banesco, Mercantil"
                        value={formData.bankName || ''}
                        onChange={e => {
                          setFormData({...formData, bankName: e.target.value});
                          if(errors.bankName) setErrors({...errors, bankName: ''});
                        }}
                      />
                    </div>
                    {errors.bankName && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{errors.bankName}</span>}
                  </div>
                )}
              </div>

              {(formData.type === 'transfer' || formData.type === 'mobile_payment') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Número de Cuenta / Teléfono</label>
                    <div className="input-container" style={{ borderColor: errors.accountNumber ? 'var(--error)' : 'transparent' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder={formData.type === 'mobile_payment' ? "0414-1234567" : "0134-..."}
                        value={formData.accountNumber || ''}
                        onChange={e => {
                          setFormData({...formData, accountNumber: e.target.value});
                          if(errors.accountNumber) setErrors({...errors, accountNumber: ''});
                        }}
                      />
                    </div>
                    {errors.accountNumber && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{errors.accountNumber}</span>}
                  </div>
                   <div className="form-group">
                    <label className="form-label">Beneficiario</label>
                    <div className="input-container" style={{ borderColor: errors.accountName ? 'var(--error)' : 'transparent' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Nombre del Titular"
                        value={formData.accountName || ''}
                        onChange={e => {
                          setFormData({...formData, accountName: e.target.value});
                          if(errors.accountName) setErrors({...errors, accountName: ''});
                        }}
                      />
                    </div>
                    {errors.accountName && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{errors.accountName}</span>}
                  </div>
                </>
              )}

              {(formData.type === 'zelle' || formData.type === 'binance') && (
                 <div className="form-group">
                    <label className="form-label">Correo Electrónico</label>
                    <div className="input-container" style={{ borderColor: errors.email ? 'var(--error)' : 'transparent' }}>
                      <input 
                        type="email" 
                        className="input-field" 
                        placeholder="correo@ejemplo.com"
                        value={formData.email || ''}
                        onChange={e => {
                          setFormData({...formData, email: e.target.value});
                          if (errors.email) setErrors({...errors, email: ''});
                        }}
                      />
                    </div>
                     {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{errors.email}</span>}
                  </div>
              )}
               {(formData.type === 'zelle') && (
                 <div className="form-group">
                    <label className="form-label">Beneficiario</label>
                    <div className="input-container" style={{ borderColor: errors.accountName ? 'var(--error)' : 'transparent' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Nombre del Titular"
                        value={formData.accountName || ''}
                        onChange={e => {
                          setFormData({...formData, accountName: e.target.value});
                          if(errors.accountName) setErrors({...errors, accountName: ''});
                        }}
                      />
                    </div>
                    {errors.accountName && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{errors.accountName}</span>}
                  </div>
               )}

              <div className="form-group">
                <label className="form-label">Notas Adicionales</label>
                <div className="input-container">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Instrucciones para el cliente..."
                    value={formData.notes || ''}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" style={{ flex: 1, background: 'var(--background)' }} onClick={() => setShowModal(false)}>CANCELAR</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '1rem' }}>
                  GUARDAR CAMBIOS <Save size={18} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <section style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(57, 187, 247, 0.05)', borderRadius: '1rem', border: '1px dashed var(--primary)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💡 Nota sobre Moneda Dual
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
          La configuración de <strong style={{ color: 'white' }}>Tasa de Cambio</strong> afectará automáticamente los montos visualizados en los presupuestos y facturas para clientes que deseen pagar en Bolívares. Asegúrate de mantener esta tasa actualizada diariamente según el indicador de tu preferencia (BCV o Paralelo).
        </p>
      </section>
    </div>
  );
};

export default PaymentSettings;
