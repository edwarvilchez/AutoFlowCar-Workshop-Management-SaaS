import React, { useState } from 'react';
import { X, CheckCircle2, User, Car, Clock, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../types';

interface NewVehicleFormProps {
  onClose: () => void;
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void;
}

const NewVehicleForm = ({ onClose, onSubmit }: NewVehicleFormProps) => {
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    client: '',
    entryDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    price: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.plate.trim()) newErrors.plate = 'La placa es obligatoria';
    if (!formData.model.trim()) newErrors.model = 'El modelo es obligatorio';
    if (!formData.client.trim()) newErrors.client = 'El nombre del cliente es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      stage: 'reception', // Default stage for new entries
    });
    onClose();
  };

  return (
    <div className="mobile-overlay open">
      <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <h2>Nuevo Ingreso</h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Placa del Vehículo</label>
            <div className="input-container" style={{ borderColor: errors.plate ? 'var(--error)' : 'transparent' }}>
              <Car size={18} className="input-icon" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="ABC-123"
                value={formData.plate}
                onChange={e => {
                  setFormData({...formData, plate: e.target.value.toUpperCase()});
                  if (errors.plate) setErrors({...errors, plate: ''});
                }}
              />
            </div>
            {errors.plate && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.plate}</span>}
          </div>

          <div className="form-group">
             <label className="form-label">Modelo / Descripción</label>
             <div className="input-container" style={{ borderColor: errors.model ? 'var(--error)' : 'transparent' }}>
               <Car size={18} className="input-icon" />
               <input 
                 type="text" 
                 className="input-field" 
                 placeholder="Ej: Toyota Corolla 2020"
                 value={formData.model}
                 onChange={e => {
                   setFormData({...formData, model: e.target.value});
                   if (errors.model) setErrors({...errors, model: ''});
                 }}
               />
             </div>
             {errors.model && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.model}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Cliente</label>
            <div className="input-container" style={{ borderColor: errors.client ? 'var(--error)' : 'transparent' }}>
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Nombre del Cliente"
                value={formData.client}
                onChange={e => {
                  setFormData({...formData, client: e.target.value});
                  if (errors.client) setErrors({...errors, client: ''});
                }}
              />
            </div>
            {errors.client && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{errors.client}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Fecha Ingreso</label>
              <div className="input-container">
                <Clock size={18} className="input-icon" />
                <input 
                  type="date" 
                  className="input-field" 
                  value={formData.entryDate}
                  onChange={e => setFormData({...formData, entryDate: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Prioridad</label>
              <div className="input-container">
                <AlertCircle size={18} className="input-icon" />
                <select 
                  className="input-field"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="low">Baja (Normal)</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta (Urgente)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn" onClick={onClose}>CANCELAR</button>
            <button type="submit" className="btn btn-primary">
              REGISTRAR INGRESO <CheckCircle2 size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVehicleForm;
