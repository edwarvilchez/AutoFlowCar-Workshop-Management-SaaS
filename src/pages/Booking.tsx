import React, { useState } from 'react';
import { User, Phone, Car, ArrowRight, Calendar, Clock, CheckCircle2, CalendarDays, Trash2, Edit, MessageSquare, Mail } from 'lucide-react';
import type { Vehicle } from '../types';
import { WORKSHOP_SERVICES } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { sendWhatsAppNotification, sendEmailNotification } from '../lib/notifications';

interface BookingProps {
  vehicles?: Vehicle[]; // To list existing bookings for rescheduling/deleting
  onBookingConfirm: (vehicle: Omit<Vehicle, 'id'>) => void;
  onBookingDelete?: (id: string) => void;
  onBookingUpdate?: (id: string, updates: Partial<Vehicle>) => void;
}

const BookingView = ({ onBookingConfirm, vehicles = [], onBookingDelete }: BookingProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ clientName: user?.name || '', phone: user?.phone || '', vehicle: '', date: '', time: '', selectedServices: [] as string[] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastCreated, setLastCreated] = useState<Vehicle | null>(null);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Nombre requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!formData.vehicle.trim()) newErrors.vehicle = 'Vehículo requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.selectedServices.length === 0) newErrors.services = 'Selecciona al menos un servicio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Fecha requerida';
    if (!formData.time) newErrors.time = 'Hora requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (targetStep: number) => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && targetStep > 2 && !validateStep2()) return;
    setStep(targetStep);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = {...prev};
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  // Only for Client role, show their current bookings
  const clientVehicles = vehicles.filter(v => v.client === user?.name || user?.role === 'admin');

  return (
    <div className="animate-in">
      <header className="mb-3">
        <span className="section-badge">SISTEMA DE CITAS</span>
        <h1>{user?.role === 'client' ? 'Mis Citas' : 'Agendar Ingreso'}</h1>
        <p className="text-muted">
          {user?.role === 'client' 
            ? 'Gestiona la programación de tus visitas al taller.' 
            : 'Planifica la carga de trabajo de tu taller de forma inteligente.'}
        </p>
      </header>

      {user?.role === 'client' && clientVehicles.length > 0 && (
          <section className="mb-3">
              <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>CITAS PROGRAMADAS</h2>
              <div className="grid-3">
                  {clientVehicles.map(v => (
                      <div key={v.id} className="card" style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)' }}>
                          <div className="flex-row space-between">
                            <strong className="plate-title">{v.plate}</strong>
                            <div className="flex-row gap-0-5">
                                <button className="btn-icon" title="Reagendar" style={{ padding: '0.2rem' }}><Edit size={14} /></button>
                                <button className="btn-icon text-error" title="Eliminar" onClick={() => onBookingDelete?.(v.id)} style={{ padding: '0.2rem' }}><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <p className="small-muted">{v.model}</p>
                          <div className="flex-row mt-1 text-muted" style={{ fontSize: '0.75rem' }}>
                            <Calendar size={12} style={{ marginRight: '0.3rem' }} /> {v.entryDate}
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      )}

      {lastCreated ? (
        <div className="card card-centered animate-in fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="brand-icon" style={{ background: 'var(--success)', margin: '0 auto 2rem', width: '4rem', height: '4rem' }}>
                <CheckCircle2 size={32} color="white" />
            </div>
            <h2 className="section-title">¡Reserva Confirmada!</h2>
            <p className="text-muted mb-2">Tu cita para el {lastCreated.entryDate} ha sido registrada.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => sendWhatsAppNotification(lastCreated, formData.phone)}
                  style={{ background: '#25D366', borderColor: '#25D366' }}
                >
                    <MessageSquare size={18} /> ENVIAR POR WHATSAPP
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => sendEmailNotification(lastCreated, user?.email)}
                  style={{ background: '#EA4335', borderColor: '#EA4335' }}
                >
                    <Mail size={18} /> ENVIAR POR CORREO
                </button>
            </div>
            
            <button className="btn-text mt-3" onClick={() => setLastCreated(null)}>Hacer otra reservación</button>
        </div>
      ) : (
        <div className="card card-centered">
          <div className="progress-row">
            {[1, 2, 3].map(s => (
              <div key={s} className={`progress-seg ${step >= s ? 'active' : ''}`}></div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in">
              <h2>Información Base</h2>
              <div className="grid-auto-fit">
                <div className="form-group">
                  <label className="form-label">Nombre del Cliente</label>
                  <div className="input-container" style={{ borderColor: errors.clientName ? 'var(--error)' : 'transparent' }}>
                    <User size={18} className="input-icon" />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Juan Pérez" 
                      value={formData.clientName} 
                      onChange={e => {
                        setFormData({...formData, clientName: e.target.value});
                        clearError('clientName');
                      }} 
                    />
                  </div>
                  {errors.clientName && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.clientName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp de Contacto</label>
                  <div className="input-container" style={{ borderColor: errors.phone ? 'var(--error)' : 'transparent' }}>
                    <Phone size={18} className="input-icon" />
                    <input 
                      type="tel" 
                      className="input-field" 
                      placeholder="+58 414-1234567" 
                      value={formData.phone} 
                      onChange={e => {
                        setFormData({...formData, phone: e.target.value});
                        clearError('phone');
                      }} 
                    />
                  </div>
                  {errors.phone && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Vehículo / Placa</label>
                  <div className="input-container" style={{ borderColor: errors.vehicle ? 'var(--error)' : 'transparent' }}>
                    <Car size={18} className="input-icon" />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="ABC-123 / SUV Pro" 
                      value={formData.vehicle} 
                      onChange={e => {
                        setFormData({...formData, vehicle: e.target.value});
                        clearError('vehicle');
                      }} 
                    />
                  </div>
                  {errors.vehicle && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.vehicle}</span>}
                </div>
              </div>
              <div className="mt-1">
                <button className="btn btn-primary" onClick={() => handleNextStep(2)}>SIGUIENTE PASO <ArrowRight size={18} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in">
              <h2 className="section-title">Servicios Requeridos</h2>
              {errors.services && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontWeight: 'bold' }}>⚠️ {errors.services}</div>}
              <div className="services-grid">
                {WORKSHOP_SERVICES.map((s: any) => {
                  const selected = formData.selectedServices.includes(s.id);
                  return (
                  <button 
                    key={s.id} 
                    onClick={() => {
                      setFormData(prev => ({...prev, selectedServices: prev.selectedServices.includes(s.id) ? prev.selectedServices.filter(x => x !== s.id) : [...prev.selectedServices, s.id]}));
                      clearError('services');
                    }}
                    className={`service-btn ${selected ? 'selected' : ''}`}
                  >
                    <div className={`service-dot ${selected ? 'selected' : ''}`}>
                        <span>•</span>
                      </div>
                      <span className="service-label">{s.label.toUpperCase()}</span>
                  </button>
                )})}
              </div>
                <div className="actions-row">
                <button className="btn" onClick={() => setStep(1)}>VOLVER</button>
                <button className="btn btn-primary" onClick={() => handleNextStep(3)}>DEFINIR AGENDA <CalendarDays size={18} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in">
              <h2 className="section-title">Agenda de Ingreso</h2>
              <div className="two-col-grid">
                <div className="form-group">
                  <label className="form-label">Fecha de Cita</label>
                  <div className="input-container" style={{ borderColor: errors.date ? 'var(--error)' : 'transparent' }}>
                    <Calendar size={18} className="input-icon" />
                    <input 
                      type="date" 
                      className="input-field" 
                      value={formData.date} 
                      onChange={e => {
                        setFormData({...formData, date: e.target.value});
                        clearError('date');
                      }} 
                    />
                  </div>
                  {errors.date && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.date}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Hora Estimada</label>
                  <div className="input-container" style={{ borderColor: errors.time ? 'var(--error)' : 'transparent' }}>
                    <Clock size={18} className="input-icon" />
                    <select 
                      className="input-field" 
                      value={formData.time} 
                      onChange={e => {
                        setFormData({...formData, time: e.target.value});
                        clearError('time');
                      }}
                    >
                      <option value="">Seleccionar hora...</option>
                      <option>08:30 AM</option>
                      <option>09:30 AM</option>
                      <option>10:30 AM</option>
                      <option>11:30 AM</option>
                      <option>02:30 PM</option>
                      <option>03:30 PM</option>
                    </select>
                  </div>
                  {errors.time && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.time}</span>}
                </div>
              </div>
              <div className="highlight-success">
                <div className="summary-row">
                  <CheckCircle2 color="var(--success)" size={28} />
                  <div>
                    <p className="summary-title">Resumen de Solicitud</p>
                    <p className="text-muted small-muted"><span className="text-strong">Servicios a realizar:</span> {formData.selectedServices.length}</p>
                  </div>
                </div>
              </div>
              <div className="actions-row">
                <button className="btn" onClick={() => setStep(2)}>VOLVER</button>
                <button className="btn btn-primary btn-success" onClick={() => { 
                  if (!validateStep3()) return;

                  const vehicleData: Omit<Vehicle, 'id'> = {
                    plate: formData.vehicle.split('/')[0]?.trim() || 'SIN-PLACA',
                    model: formData.vehicle.split('/')[1]?.trim() || 'Modelo Desconocido',
                    client: formData.clientName,
                    stage: 'reception',
                    entryDate: formData.date || new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    price: 0
                  };
                  
                  onBookingConfirm(vehicleData);
                  setLastCreated(vehicleData as any);
                  setStep(1); 
                  setFormData({clientName: user?.name || '', phone: user?.phone || '', vehicle: '', date: '', time: '', selectedServices: []}); 
                  setErrors({});
                }}>CONFIRMAR RESERVA <CheckCircle2 size={18} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingView;
