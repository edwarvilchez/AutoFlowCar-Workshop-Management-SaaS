import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Car, User, Wrench, Calendar, ClipboardList, PenTool, Link as LinkIcon, Phone, Mail, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Vehicle, ServiceRecord, MaintenanceItem } from '../types';

// Mock data generator helper
const generateMockHistory = (vehicleId: string): { 
  vehicleInfo: { year: number; vin: string; mileage: number };
  ownerInfo: { phone: string; email: string };
  history: ServiceRecord[];
  upcoming: MaintenanceItem[];
  notes: string;
} => {
  // Deterministic mock based on ID purely for demo consistency
  return {
    vehicleInfo: {
      year: 2019 + (vehicleId.length % 5),
      vin: `1HGBH41JXMN109${vehicleId.toUpperCase().padEnd(3, '0')}`,
      mileage: 45000 + (vehicleId.length * 1250)
    },
    ownerInfo: {
      phone: "+58 412 345 6789",
      email: "cliente.propietario@example.com"
    },
    history: [
      {
        id: 'h1',
        date: '2024-08-10',
        serviceType: 'Cambio de Aceite',
        description: 'Cambio de aceite de motor y filtro. Revisión de niveles.',
        mileage: 45000,
        parts: 'Aceite sintético 5W-30, Filtro de aceite OEM',
        photosUrl: 'https://webyvip.co/carros-descripciones'
      },
      {
        id: 'h2',
        date: '2024-01-20',
        serviceType: 'Frenos',
        description: 'Reemplazo de pastillas de freno delanteras y rectificación de discos.',
        mileage: 40000,
        parts: 'Pastillas cerámicas',
        photosUrl: 'https://webyvip.co/carros-descripciones'
      },
      {
        id: 'h3',
        date: '2023-06-15',
        serviceType: 'Balanceo',
        description: 'Balanceo y alineación computarizada de ruedas.',
        mileage: 35000,
        photosUrl: 'https://webyvip.co/carros-descripciones'
      }
    ],
    upcoming: [
      { item: "Revisión de Batería: Programar revisión en 6 meses", due: "2025-02-10" },
      { item: "Cambio de Filtro de Aire: Programar cambio en 10,000 km", due: "10,000 km" }
    ],
    notes: "Revisar correas de distribución en el próximo mantenimiento mayor (60,000 km)."
  };
};

interface VehicleHistoryProps {
  vehicles: Vehicle[];
}

const VehicleHistory = ({ vehicles }: VehicleHistoryProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const vehicle = vehicles.find(v => v.id === id);
  
  const details = useMemo(() => id ? generateMockHistory(id) : null, [id]);

  if (!vehicle || !details) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>
        <h2>Vehículo no encontrado</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver</button>
      </div>
    );
  }

  // --- CRUD State ---
  const [history, setHistory] = useState<ServiceRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceRecord>>({});

  // LocalStorage persistence helpers
  const STORAGE_KEY = 'sgt:history';

  const loadHistoryFor = (vehicleId: string): ServiceRecord[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return details.history || [];
      const parsed = JSON.parse(raw) as Record<string, ServiceRecord[]>;
      return parsed[vehicleId] ?? details.history ?? [];
    } catch (e) {
      return details.history ?? [];
    }
  };

  const saveHistoryFor = (vehicleId: string, data: ServiceRecord[]) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) as Record<string, ServiceRecord[]> : {};
      parsed[vehicleId] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      // ignore
    }
  };

  // Initialize history from storage or mock details
  useEffect(() => {
    if (!id) return;
    const saved = loadHistoryFor(id);
    setHistory(saved.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [id, details]);

  // Persist history whenever it changes
  useEffect(() => {
    if (!id) return;
    saveHistoryFor(id, history);
  }, [id, history]);

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      const updated = history.map(r => r.id === editingRecord.id ? { ...r, ...formData } as ServiceRecord : r);
      setHistory(updated);
    } else {
      const newRecord: ServiceRecord = {
        ...formData,
        id: uuidv4(),
        photosUrl: formData.photosUrl || ''
      } as ServiceRecord;
      const updated = [newRecord, ...history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHistory(updated);
    }
    setShowModal(false);
  };

  const deleteRecord = (id: string) => {
    if (confirm('¿Eliminar este registro de mantenimiento?')) {
      const updated = history.filter(r => r.id !== id);
      setHistory(updated);
    }
  };

  const openModal = (record?: ServiceRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mileage: details.vehicleInfo.mileage
      });
    }
    setShowModal(true);
  };

  return (
    <div className="animate-in fade-in" style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={20} /> Volver
        </button>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => window.print()}>
          <Printer size={18} /> IMPRIMIR HOJA DE VIDA
        </button>
      </div>

      {/* Main Document */}
      <div className="card" style={{ padding: '4rem', background: 'black', border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '2rem', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Hoja de Vida del Vehículo</h1>
          <p style={{ color: 'var(--primary)', letterSpacing: '4px', fontSize: '0.9rem', fontWeight: 900 }}>REPORTE TÉCNICO OFICIAL - AUTOFLOW</p>
        </div>

        {/* Vehicle Info Section */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Car color="var(--primary)" size={28} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Información del Vehículo</h2>
          </div>
          <div style={{ paddingLeft: '3.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem 3rem' }}>
            <InfoItem label="Placa" value={vehicle.plate} />
            <InfoItem label="Marca / Modelo" value={vehicle.model} />
            <InfoItem label="Año" value={details.vehicleInfo.year.toString()} />
            <InfoItem label="Número de Serie (VIN)" value={details.vehicleInfo.vin} />
            <InfoItem label="Kilometraje Actual" value={`${details.vehicleInfo.mileage.toLocaleString()} km`} />
            <InfoItem label="Color" value="N/A" />
          </div>
        </section>

        {/* Owner Info Section */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <User color="var(--primary)" size={28} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Información del Propietario</h2>
          </div>
          <div style={{ paddingLeft: '3.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem 3rem' }}>
            <InfoItem label="Nombre" value={vehicle.client} />
            <InfoItem label="Teléfono" value={details.ownerInfo.phone} />
            <InfoItem label="Correo Electrónico" value={details.ownerInfo.email} />
          </div>
        </section>

        {/* Maintenance History */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Wrench color="var(--primary)" size={28} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Historial de Mantenimiento</h2>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => openModal()}>
              <Plus size={16} /> NUEVO REGISTRO
            </button>
          </div>
          
          <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {history.map((record) => (
              <div key={record.id} style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid #333', paddingBottom: '1rem' }}>
                {/* Timeline dot */}
                <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.9rem' }}>{record.date}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openModal(record)} className="btn-icon" style={{ padding: '4px', color: '#888', background: 'transparent', border: 'none', cursor: 'pointer' }}><Edit3 size={16} /></button>
                    <button onClick={() => deleteRecord(record.id)} className="btn-icon" style={{ padding: '4px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.2rem', color: 'white' }}>{record.serviceType}</h3>
                
                <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem', color: '#ccc', fontSize: '0.95rem' }}>
                  <p><strong>Descripción:</strong> {record.description}</p>
                  <p><strong>Kilometraje:</strong> {record.mileage.toLocaleString()} km</p>
                  {record.parts && <p><strong>Repuesto(s):</strong> {record.parts}</p>}
                  {record.photosUrl && (
                    <p style={{ marginTop: '0.1rem' }}>
                      <strong style={{ marginRight: '0.5rem' }}>Fotos Repuestos:</strong>
                      <a href={record.photosUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        Ver evidencias <LinkIcon size={14} />
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Maintenance */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Calendar color="var(--primary)" size={28} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Próximos Mantenimientos Recomendados</h2>
          </div>
          <div style={{ paddingLeft: '3.5rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
              {details.upcoming.map((u, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }}></div>
                  <span><strong style={{ color: 'white' }}>{u.item.split(':')[0]}:</strong> {u.item.split(':')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Additional Notes */}
        <section style={{ marginBottom: '5rem', borderBottom: '1px solid #333', paddingBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <ClipboardList color="var(--primary)" size={28} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Notas Adicionales</h2>
          </div>
          <div style={{ paddingLeft: '3.5rem' }}>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#ccc' }}>• {details.notes}</p>
          </div>
        </section>

        {/* Footer Contact Info */}
        <footer style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '1.5rem' }}>Contacto del Taller</h2>
          <div style={{ display: 'inline-block', textAlign: 'left', lineHeight: '1.8', fontSize: '1rem' }}>
             <InfoItemFooter label="Nombre" value="Taller AutoPlus Premium" icon={<PenTool size={16} />} />
             <InfoItemFooter label="Teléfono" value="+58 212 345 6789" icon={<Phone size={16} />} />
             <InfoItemFooter label="Correo Electrónico" value="contacto@autoplus.com" icon={<Mail size={16} />} />
          </div>
        </footer>

      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div className="mobile-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative', background: '#0f172a', border: '1px solid #334155' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', color: 'white' }}>
              {editingRecord ? 'Editar Registro' : 'Nuevo Mantenimiento'}
            </h2>

            <form onSubmit={handleSaveRecord} style={{ display: 'grid', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <div className="input-container">
                    <input 
                      required
                      type="date" 
                      className="input-field" 
                      value={formData.date || ''}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Kilometraje</label>
                  <div className="input-container">
                    <input 
                      required
                      type="number" 
                      className="input-field" 
                      value={formData.mileage || ''}
                      onChange={e => setFormData({...formData, mileage: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Servicio Realizado</label>
                <div className="input-container">
                  <input 
                    required
                    type="text" 
                    className="input-field" 
                    placeholder="Ej: Cambio de Aceite y Filtro"
                    value={formData.serviceType || ''}
                    onChange={e => setFormData({...formData, serviceType: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Detallada</label>
                <div className="input-container">
                  <textarea 
                    className="input-field" 
                    rows={3}
                    placeholder="Detalles del trabajo realizado..."
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Repuestos (Opcional)</label>
                <div className="input-container">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ej: Aceite 5W30, Filtro OEM..."
                    value={formData.parts || ''}
                    onChange={e => setFormData({...formData, parts: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL Fotos / Evidencias (Opcional)</label>
                <div className="input-container">
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="https://..."
                    value={formData.photosUrl || ''}
                    onChange={e => setFormData({...formData, photosUrl: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" style={{ flex: 1, background: '#1e293b', color: 'white' }} onClick={() => setShowModal(false)}>CANCELAR</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '1rem' }}>
                  GUARDAR REGISTRO <Save size={18} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Components
const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
    <span style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>{label}</span>
    <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>{value}</span>
  </div>
);

const InfoItemFooter = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ccc' }}>
    <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <strong>{label}:</strong> {value}
  </div>
);

export default VehicleHistory;
