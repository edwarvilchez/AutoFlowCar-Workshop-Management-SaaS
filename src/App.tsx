import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Vehicle, Stage } from './types'
import NewVehicleForm from './components/NewVehicleForm'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './index.css'
import { 
  LayoutDashboard, 
  Car, 
  Package, 
  FileText, 
  Settings, 
  Plus, 
  Clock, 
  User,
  AlertCircle,
  Wrench,
  Search,
  TrendingUp,

  Box,

  Menu,

  Download,
  Calendar,
  Phone,

  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Building
} from 'lucide-react'

// --- Constants ---
const WORKSHOP_SERVICES = [
  { id: 'mantenimiento', label: 'Mantenimiento Preventivo', icon: Wrench },
  { id: 'frenos', label: 'Sistema de Frenos', icon: ShieldCheck },
  { id: 'motor', label: 'Reparación de Motor', icon: Wrench },
  { id: 'suspension', label: 'Suspensión y Dirección', icon: TrendingUp },
  { id: 'aire', label: 'Aire Acondicionado', icon: Clock },
  { id: 'latoneria', label: 'Latonería y Pintura', icon: Package },
  { id: 'scanner', label: 'Diagnóstico por Escáner', icon: Search },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: '1', plate: 'ABC-123', model: 'SUV Compact Pro', client: 'Juan Perez', stage: 'reception', entryDate: '2024-01-20', priority: 'medium', price: 120 },
  { id: '2', plate: 'XYZ-789', model: 'Pickup Heavy Duty', client: 'Maria Garcia', stage: 'diagnosis', entryDate: '2024-01-21', priority: 'high', price: 450 },
  { id: '3', plate: 'GHI-456', model: 'Sedan Comfort Plus', client: 'Carlos Ruiz', stage: 'execution', entryDate: '2024-01-19', priority: 'low', price: 85 },
  { id: '4', plate: 'JKL-012', model: 'SUV Luxury Edition', client: 'Ana Lopez', stage: 'execution', entryDate: '2024-01-18', priority: 'medium', price: 1200 },
  { id: '5', plate: 'MNO-345', model: 'Truck Work Series', client: 'Roberto Sosa', stage: 'quality', entryDate: '2024-01-21', priority: 'high', price: 320 },
  { id: '6', plate: 'PQR-678', model: 'City Car Urban', client: 'Elena Gomez', stage: 'ready', entryDate: '2024-01-17', priority: 'low', price: 55 },
];

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: 'reception', label: 'Recepción', color: 'var(--secondary)' },
  { id: 'diagnosis', label: 'Diagnóstico', color: 'var(--warning)' },
  { id: 'execution', label: 'Ejecución', color: 'var(--primary)' },
  { id: 'quality', label: 'C. Calidad', color: '#a855f7' },
  { id: 'ready', label: 'Egreso', color: 'var(--success)' },
];

const INVENTORY_ITEMS = [
  { id: 'i1', name: 'Aceite Sintético 5W-30', stock: 45, unit: 'Lts', status: 'normal' },
  { id: 'i2', name: 'Filtro de Aceite Genérico', stock: 12, unit: 'Und', status: 'low' },
  { id: 'i3', name: 'Pastillas de Freno (Del)', stock: 8, unit: 'Und', status: 'low' },
  { id: 'i4', name: 'Bujías Iridium', stock: 24, unit: 'Und', status: 'normal' },
  { id: 'i5', name: 'Refrigerante 50/50', stock: 15, unit: 'Lts', status: 'normal' },
];

// --- Utilities ---
const generatePDFReport = (vehicles: Vehicle[]) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(29, 29, 27);
  doc.text('AutoFlow - Reporte Operativo', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);
  autoTable(doc, {
    startY: 45,
    head: [['Placa', 'Modelo', 'Cliente', 'Estado', 'Fecha Ingreso', 'Venta']],
    body: vehicles.map(v => [v.plate, v.model, v.client, v.stage.toUpperCase(), v.entryDate, `$${v.price || 0}`]),
    headStyles: { fillColor: [78, 108, 139] },
    alternateRowStyles: { fillColor: [248, 250, 251] },
  });
  doc.save('AutoFlow_Reporte_Taller.pdf');
};

// --- Authentication Views ---

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-dark)', animation: 'fadeIn 0.8s ease' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', width: '70px', height: '70px', borderRadius: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px -5px rgba(0, 158, 199, 0.4)' }}>
            <Wrench size={36} color="white" />
          </div>
          <h1 style={{ color: 'var(--color-dark)', fontSize: '2rem', fontStyle: 'italic' }}>AutoFlow</h1>
          <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Inicia sesión en tu gestión operativa</p>
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Corporativo</label>
          <div className="input-container">
            <Mail size={18} className="input-icon" />
            <input type="email" placeholder="admin@autoflow.com" className="input-field" />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label className="form-label">Contraseña</label>
          <div className="input-container">
            <Lock size={18} className="input-icon" />
            <input type="password" placeholder="••••••••" className="input-field" />
          </div>
        </div>

        <button onClick={() => { onLogin(); navigate('/'); }} className="btn btn-primary" style={{ width: '100%', padding: '1.15rem' }}>
          ACCEDER AL PANEL <ArrowRight size={18} />
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }} className="text-muted">
          ¿Nuevo usuario? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800 }}>Regístrate AQUÍ</Link>
        </p>
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-dark)', animation: 'fadeIn 0.8s ease' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--color-dark)', fontSize: '2rem', fontStyle: 'italic' }}>Únete a AutoFlow</h1>
          <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>La plataforma líder para talleres premium</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input type="text" className="input-field" placeholder="Carlos" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Taller</label>
            <div className="input-container">
              <Building size={18} className="input-icon" />
              <input type="text" className="input-field" placeholder="Premium Tech" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <div className="input-container">
            <Mail size={18} className="input-icon" />
            <input type="email" className="input-field" placeholder="carlos@correo.com" />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label className="form-label">Contraseña</label>
          <div className="input-container">
            <Lock size={18} className="input-icon" />
            <input type="password" placeholder="••••••••" className="input-field" />
          </div>
        </div>

        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%', padding: '1.15rem' }}>
          CREAR MI CUENTA <CheckCircle2 size={18} />
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }} className="text-muted">
          ¿Ya eres miembro? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

// --- Booking Module ---

const BookingView = ({ onBookingConfirm }: { onBookingConfirm: (vehicle: Omit<Vehicle, 'id'>) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ clientName: '', phone: '', vehicle: '', date: '', time: '', selectedServices: [] as string[] });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <header style={{ marginBottom: '3rem' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>SISTEMA DE CITAS</span>
        <h1>Agendar Ingreso</h1>
        <p className="text-muted">Planifica la carga de trabajo de tu taller de forma inteligente</p>
      </header>

      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '8px', background: step >= s ? 'var(--primary)' : 'var(--background)', borderRadius: '4px', transition: 'all 0.4s ease' }}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in">
            <h2 style={{ marginBottom: '2.5rem', fontSize: '1.5rem' }}>Información Base</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre del Cliente</label>
                <div className="input-container">
                  <User size={18} className="input-icon" />
                  <input type="text" className="input-field" placeholder="Juan Pérez" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp de Contacto</label>
                <div className="input-container">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" className="input-field" placeholder="+58 414-1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label className="form-label">Vehículo / Placa</label>
                <div className="input-container">
                  <Car size={18} className="input-icon" />
                  <input type="text" className="input-field" placeholder="ABC-123 / SUV Pro" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} />
                </div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '3.5rem', width: '100%', padding: '1.15rem' }} onClick={() => setStep(2)}>SIGUIENTE PASO <ArrowRight size={18} /></button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in">
            <h2 style={{ marginBottom: '2.5rem', fontSize: '1.5rem' }}>Servicios Requeridos</h2>
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {WORKSHOP_SERVICES.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setFormData(prev => ({...prev, selectedServices: prev.selectedServices.includes(s.id) ? prev.selectedServices.filter(x => x !== s.id) : [...prev.selectedServices, s.id]}))}
                  style={{ 
                    padding: '1.75rem', borderRadius: '1.5rem', border: '2px solid', 
                    borderColor: formData.selectedServices.includes(s.id) ? 'var(--primary)' : 'var(--input-border)',
                    background: formData.selectedServices.includes(s.id) ? 'rgba(0,158,199,0.06)' : 'var(--background)',
                    display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'all 0.2s', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ background: formData.selectedServices.includes(s.id) ? 'var(--primary)' : 'white', padding: '0.6rem', borderRadius: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={20} color={formData.selectedServices.includes(s.id) ? 'white' : 'var(--text-muted)'} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: formData.selectedServices.includes(s.id) ? 'var(--primary)' : 'var(--text)' }}>{s.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem' }}>
              <button className="btn" style={{ background: 'var(--background)', flex: 1 }} onClick={() => setStep(1)}>VOLVER</button>
              <button className="btn btn-primary" style={{ flex: 2, padding: '1.15rem' }} onClick={() => setStep(3)}>DEFINIR AGENDA <CalendarDays size={18} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in">
            <h2 style={{ marginBottom: '2.5rem', fontSize: '1.5rem' }}>Agenda de Ingreso</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Fecha de Cita</label>
                <div className="input-container">
                  <Calendar size={18} className="input-icon" />
                  <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hora Estimada</label>
                <div className="input-container">
                  <Clock size={18} className="input-icon" />
                  <select className="input-field" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                    <option value="">Seleccionar hora...</option>
                    <option>08:30 AM</option>
                    <option>09:30 AM</option>
                    <option>10:30 AM</option>
                    <option>11:30 AM</option>
                    <option>02:30 PM</option>
                    <option>03:30 PM</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1.5rem', border: '2px dashed var(--success)' }}>
              <div className="flex-row" style={{ gap: '1.25rem' }}>
                <CheckCircle2 color="var(--success)" size={28} />
                <div>
                  <p style={{ fontWeight: 800, color: 'var(--text)' }}>Resumen de Solicitud</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Servicios a realizar: {formData.selectedServices.length}</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem' }}>
              <button className="btn" style={{ background: 'var(--background)', flex: 1 }} onClick={() => setStep(2)}>VOLVER</button>
              <button className="btn btn-primary" style={{ flex: 2, background: 'var(--success)', padding: '1.15rem' }} onClick={() => { 
                const newVehicle: Omit<Vehicle, 'id'> = {
                  plate: formData.vehicle.split('/')[0]?.trim() || 'SIN-PLACA',
                  model: formData.vehicle.split('/')[1]?.trim() || 'Modelo Desconocido',
                  client: formData.clientName,
                  stage: 'reception',
                  entryDate: formData.date || new Date().toISOString().split('T')[0],
                  priority: 'medium',
                  price: 0
                };
                onBookingConfirm(newVehicle);
                alert('Cita Confirmada en el Sistema'); 
                setStep(1); 
                setFormData({clientName: '', phone: '', vehicle: '', date: '', time: '', selectedServices: []}); 
              }}>CONFIRMAR RESERVA <CheckCircle2 size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Operational Modules ---

const DashboardView = ({ vehicles, setVehicles }: { vehicles: Vehicle[], setVehicles: Dispatch<SetStateAction<Vehicle[]>> }) => {
  const [showNewVehicleModal, setShowNewVehicleModal] = useState(false);

  const moveVehicle = (id: string, newStage: Stage) => {
    setVehicles((prev) => prev.map(v => v.id === id ? { ...v, stage: newStage } : v));
  };
  
  const handleAddNew = (vehicleData: Omit<Vehicle, 'id'>) => {
    // Generate a random ID (in production use uuid)
    const newVehicle: Vehicle = { 
      ...vehicleData, 
      id: Math.random().toString(36).substr(2, 9),
      // Ensure stage is typed correctly if omitted or needs override
      stage: 'reception', 
      price: vehicleData.price || 0
    }; 
    setVehicles(prev => [...prev, newVehicle]);
    setShowNewVehicleModal(false);
  };

  return (
    <>
      {showNewVehicleModal && (
        <NewVehicleForm 
          onClose={() => setShowNewVehicleModal(false)}
          onSubmit={handleAddNew}
        />
      )}

      <header className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>PANEL DE CONTROL</span>
          <h1>Dashboard Operativo</h1>
          <p className="text-muted" style={{ fontStyle: 'italic', fontWeight: 500 }}>Estado del flujo de trabajo en tiempo real</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 'fit-content' }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: '0.85rem 1.5rem' }} onClick={() => setShowNewVehicleModal(true)}><Plus size={18} /> NUEVO INGRESO</button>
          <button className="btn" style={{ background: 'var(--surface-dark)', color: 'white', flex: 1, padding: '0.85rem 1.5rem' }} onClick={() => generatePDFReport(vehicles)}><Download size={18} /> EXPORTAR PDF</button>
        </div>
      </header>

      <section className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ background: 'var(--surface-dark)', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', background: 'var(--primary)', width: '100px', height: '100px', borderRadius: '50%', opacity: 0.1 }}></div>
          <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>TOTAL ACTIVOS</h3>
          <div style={{ fontSize: '3.75rem', fontWeight: 900, color: 'white', fontStyle: 'italic', margin: '0.5rem 0' }}>{vehicles.length}</div>
          <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Unidades en taller</p>
        </div>
        <div className="card">
          <h3 className="text-muted" style={{ fontWeight: 800 }}>PROCESOS EN CURSO</h3>
          <div style={{ fontSize: '3.75rem', fontWeight: 900, color: 'var(--primary)', fontStyle: 'italic', margin: '0.5rem 0' }}>{vehicles.filter(v => ['diagnosis', 'execution'].includes(v.stage)).length}</div>
          <div className="flex-row mt-1"><Clock size={16} className="text-muted" /><span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Eficiencia: 92%</span></div>
        </div>
        <div className="card">
          <h3 className="text-muted" style={{ fontWeight: 800 }}>CITAS PARA HOY</h3>
          <div style={{ fontSize: '3.75rem', fontWeight: 900, color: 'var(--success)', fontStyle: 'italic', margin: '0.5rem 0' }}>{vehicles.filter(v => v.stage === 'ready').length}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Egresos programados</p>
        </div>
      </section>

      <section className="stages-flow">
        {STAGES.map(stage => (
          <div key={stage.id} className="stage-column">
            <div className="stage-header">
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900 }}>{stage.label.toUpperCase()}</h3>
              <span className="badge" style={{ background: stage.color, color: 'white' }}>{vehicles.filter(v => v.stage === stage.id).length}</span>
            </div>
            {vehicles.filter(v => v.stage === stage.id).map(vehicle => (
              <div key={vehicle.id} className={`card vehicle-card ${vehicle.stage}`} style={{ padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 900 }}>{vehicle.plate}</strong>
                  {vehicle.priority === 'high' && <AlertCircle size={18} color="var(--error)" />}
                </div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{vehicle.model}</p>
                <div className="flex-row mt-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', justifyContent: 'space-between' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{vehicle.entryDate}</span>
                  <select value={vehicle.stage} onChange={(e) => moveVehicle(vehicle.id, e.target.value as Stage)} style={{ border: 'none', background: 'var(--input-bg)', fontWeight: 900, fontSize: '0.65rem', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer', outline: 'none', color: 'var(--text)' }}>
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
};

// --- Vehicles & Inventory Views ---

const VehiclesView = ({ vehicles }: { vehicles: Vehicle[] }) => (
  <div style={{ animation: 'fadeIn 0.5s ease' }}>
    <header style={{ marginBottom: '3rem' }}>
      <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>DATABASE</span>
      <h1>Maestro de Unidades</h1>
      <p className="text-muted">Gestión de flota activa y registro histórico de servicios</p>
    </header>
    <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead style={{ background: 'var(--background)', fontSize: '0.75rem', fontWeight: 800 }}>
          <tr>
            <th style={{ padding: '1.75rem', textAlign: 'left' }}>PLACA</th>
            <th style={{ padding: '1.75rem', textAlign: 'left' }}>MODELO / CATEGORÍA</th>
            <th style={{ padding: '1.75rem', textAlign: 'left' }}>PROPIETARIO</th>
            <th style={{ padding: '1.75rem', textAlign: 'left' }}>ESTADO OPERATIVO</th>
            <th style={{ padding: '1.75rem', textAlign: 'right' }}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
              <td style={{ padding: '1.75rem', fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem' }}>{v.plate}</td>
              <td style={{ padding: '1.75rem', fontWeight: 700 }}>{v.model}</td>
              <td style={{ padding: '1.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{v.client}</td>
              <td style={{ padding: '1.75rem' }}>
                <span className="badge" style={{ background: STAGES.find(s => s.id === v.stage)?.color, color: 'white', padding: '0.5rem 1rem' }}>{v.stage.toUpperCase()}</span>
              </td>
              <td style={{ padding: '1.75rem', textAlign: 'right' }}>
                <button className="btn" style={{ padding: '0.6rem', background: 'var(--background)', borderRadius: '0.75rem' }}><Search size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const InventoryView = () => (
  <div style={{ animation: 'fadeIn 0.5s ease' }}>
    <header style={{ marginBottom: '3rem' }}>
      <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>STOCK</span>
      <h1>Almacén y Suministros</h1>
      <p className="text-muted">Control inteligente de inventario para repuestos y consumibles</p>
    </header>
    <div className="grid-3">
      {INVENTORY_ITEMS.map(item => (
        <div key={item.id} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--background)', padding: '0.85rem', borderRadius: '1.25rem' }}>
              <Box size={28} className="text-muted" />
            </div>
            {item.status === 'low' && <span className="badge" style={{ background: 'var(--error)', color: 'white', fontWeight: 900 }}>CRÍTICO</span>}
          </div>
          <h3 style={{ marginTop: '2rem', fontSize: '1.1rem', fontWeight: 800 }}>{item.name}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, fontStyle: 'italic' }}>{item.stock}</span>
            <span className="text-muted" style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.unit.toUpperCase()}</span>
          </div>
          <div style={{ marginTop: '1.5rem', height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
             <div style={{ width: `${(item.stock/60)*100}%`, height: '100%', background: item.status === 'low' ? 'var(--error)' : 'var(--primary)', transition: 'width 1s ease-out' }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BillingView = ({ vehicles }: any) => (
  <div style={{ animation: 'fadeIn 0.5s ease' }}>
    <header className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
      <div>
        <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>REVENUE</span>
        <h1>Módulo Financiero</h1>
        <p className="text-muted">Control de cobros, presupuestos y salud financiera del taller</p>
      </div>
      <button className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }} onClick={() => generatePDFReport(vehicles)}><Download size={20} /> DESCARGAR REPORTE</button>
    </header>
    <div className="grid-3" style={{ marginBottom: '3rem' }}>
      <div className="card" style={{ background: 'var(--secondary)', color: 'white', border: 'none', position: 'relative' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>INGRESOS TOTALES</h3>
        <div style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '1.25rem', fontStyle: 'italic' }}>$4,250.00</div>
        <div className="flex-row mt-1" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '2rem', width: 'fit-content' }}>
          <TrendingUp size={16} /><span style={{ fontWeight: 800, fontSize: '0.8rem' }}>+12% este mes</span>
        </div>
      </div>
      <div className="card">
        <h3 className="text-muted" style={{ fontWeight: 800 }}>FACTURACIÓN PENDIENTE</h3>
        <div style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '1.25rem' }}>$840.00</div>
        <p className="text-muted" style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>4 órdenes por procesar</p>
      </div>
      <div className="card">
        <h3 className="text-muted" style={{ fontWeight: 800 }}>LIQUIDEZ</h3>
        <div style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '1.25rem' }}>High</div>
        <div className="flex-row mt-1"><ShieldCheck size={18} color="var(--success)" /><span className="text-muted" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Estatus óptimo</span></div>
      </div>
    </div>
  </div>
);

const SettingsView = ({ onLogout }: any) => (
  <div style={{ animation: 'fadeIn 0.5s ease' }}>
    <header style={{ marginBottom: '3rem' }}>
      <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>CONFIG</span>
      <h1>Ajustes Globales</h1>
    </header>
    <div className="grid-3">
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ background: 'var(--background)', width: '50px', height: '50px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><User size={24} /></div>
        <h3 style={{ fontWeight: 900 }}>PERFIL Y ACCESO</h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.6' }}>Gestiona tus credenciales de seguridad y perfiles administrativos.</p>
        <button className="btn" style={{ width: '100%', marginTop: '2rem', background: 'var(--background)', fontWeight: 900 }}>EDITAR PERFIL</button>
      </div>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ background: 'var(--background)', width: '50px', height: '50px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><Plus size={24} /></div>
        <h3 style={{ fontWeight: 900 }}>PERSONALIZACIÓN</h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.6' }}>Ajusta los colores y el logotipo de tu instancia de AutoFlow.</p>
        <button className="btn" style={{ width: '100%', marginTop: '2rem', background: 'var(--background)', fontWeight: 900 }}>CONFIGURAR</button>
      </div>
      <div className="card" style={{ border: '2px dashed var(--error)', padding: '2.5rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', width: '50px', height: '50px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><Lock size={24} color="var(--error)" /></div>
        <h3 style={{ color: 'var(--error)', fontWeight: 900 }}>SESIÓN</h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.6' }}>Finaliza tu jornada de trabajo actual de forma segura.</p>
        <button className="btn" style={{ width: '100%', marginTop: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', fontWeight: 900 }} onClick={onLogout}>LOGOUT</button>
      </div>
    </div>
  </div>
);

// --- Main Application Implementation ---

const Sidebar = ({ isOpen, toggle, onLogout }: { isOpen: boolean, toggle: () => void, onLogout: () => void }) => {
  const location = useLocation();
  const navItems = [
    { name: 'DASHBOARD', path: '/', icon: LayoutDashboard },
    { name: 'CITAS', path: '/booking', icon: CalendarDays },
    { name: 'VEHÍCULOS', path: '/vehicles', icon: Car },
    { name: 'INVENTARIO', path: '/inventory', icon: Package },
    { name: 'FACTURACIÓN', path: '/billing', icon: FileText },
    { name: 'CONFIGURACIÓN', path: '/settings', icon: Settings },
  ];

  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={toggle}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3.5rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.65rem', borderRadius: '1.15rem', boxShadow: '0 8px 16px -4px rgba(0, 158, 199, 0.4)' }}><Wrench size={26} color="white" /></div>
          <div><h2 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0', fontStyle: 'italic', fontWeight: 900 }}>AutoFlow</h2><p style={{ fontSize: '0.55rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>PREMIUM SAAS</ p></div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`sidebar-btn ${isActive ? 'active' : ''}`} onClick={() => toggle()}>
                <Icon size={20} /> <span style={{ letterSpacing: '0.05em' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5rem' }}>
          <div className="flex-row" style={{ justifyContent: 'space-between' }}>
            <div className="flex-row">
              <div style={{ width: '42px', height: '42px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="white" /></div>
              <div style={{ marginLeft: '0.75rem' }}><p style={{ fontSize: '0.85rem', fontWeight: 900, color: 'white' }}>ADMIN</p><p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>ACTIVE SESSION</p></div>
            </div>
            <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}><Lock size={18} /></button>
          </div>
        </div>
      </aside>
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} onLogout={() => setIsAuthenticated(false)} />
          <main className="main-content">
            <button className="mobile-nav-toggle" onClick={() => setSidebarOpen(true)}><Menu size={24} /><span style={{ fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.05em' }}>NAV PANEL</span></button>
            <Routes>
              <Route path="/" element={<DashboardView vehicles={vehicles} setVehicles={setVehicles} />} />
              <Route path="/booking" element={<BookingView onBookingConfirm={(v) => {
                const newVehicle: Vehicle = { ...v, id: Math.random().toString(36).substr(2, 9), stage: 'reception' };
                setVehicles(prev => [...prev, newVehicle]);
              }} />} />
              <Route path="/vehicles" element={<VehiclesView vehicles={vehicles} />} />
              <Route path="/inventory" element={<InventoryView />} />
              <Route path="/billing" element={<BillingView vehicles={vehicles} />} />
              <Route path="/settings" element={<SettingsView onLogout={() => setIsAuthenticated(false)} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App
