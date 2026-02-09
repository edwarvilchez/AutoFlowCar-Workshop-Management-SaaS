import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Vehicle, Stage } from '../types'
import NewVehicleForm from '../components/NewVehicleForm'
import BudgetModal from '../components/BudgetModal';
import { AlertCircle, Plus, Download, FileText } from 'lucide-react'
import { STAGES } from '../lib/constants'
import { generatePDFReport } from '../lib/report'

interface DashboardProps {
  vehicles: Vehicle[];
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;
}

const DashboardView = ({ vehicles, setVehicles }: DashboardProps) => {
  const [showNewVehicleModal, setShowNewVehicleModal] = useState(false);
  const [editingBudgetVehicle, setEditingBudgetVehicle] = useState<Vehicle | null>(null);

  const moveVehicle = (id: string, newStage: Stage) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    // Budget Approval Check
    if (vehicle.stage === 'diagnosis' && newStage === 'execution') {
      if (!vehicle.budget?.isApproved) {
        alert('⛔ Bloqueo de Proceso: No se puede avanzar a EJECUCIÓN sin un presupuesto aprobado por el cliente.');
        return;
      }
    }

    setVehicles((prev) => prev.map(v => v.id === id ? { ...v, stage: newStage } : v));
  };
  
  const handleAddNew = (vehicleData: Omit<Vehicle, 'id'>) => {
     // ... (existing logic)
     const newVehicle: Vehicle = { 
      ...vehicleData, 
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2,9),
      stage: 'reception', 
      price: vehicleData.price || 0
    };
    setVehicles(prev => [...prev, newVehicle]);
    setShowNewVehicleModal(false);
  };
  
  const handleUpdateVehicle = (updated: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v));
  };


  return (
    <>
      {showNewVehicleModal && (
        <NewVehicleForm 
          onClose={() => setShowNewVehicleModal(false)}
          onSubmit={handleAddNew}
        />
      )}

      {editingBudgetVehicle && (
        <BudgetModal 
          vehicle={editingBudgetVehicle}
          onClose={() => setEditingBudgetVehicle(null)}
          onUpdateVehicle={handleUpdateVehicle}
        />
      )}

      {/* ... Header and Stats sections remain same ... */}
      <header className="flex-row space-between wrap gap-1-5 mb-3">
        <div>
          <span className="badge badge-highlight">PANEL DE CONTROL</span>
          <h1>Dashboard Operativo</h1>
          <p className="text-muted muted-italic">Estado del flujo de trabajo en tiempo real</p>
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => setShowNewVehicleModal(true)}><Plus size={18} /> NUEVO INGRESO</button>
          <button className="btn" onClick={() => generatePDFReport(vehicles)}><Download size={18} /> EXPORTAR PDF</button>
        </div>
      </header>
      
      <section className="grid-3 mb-3">
        <div className="card card-decorated">
             {/* ... stats content ... */}
          <div className="card-deco"></div>
          <h3 className="text-muted">TOTAL ACTIVOS</h3>
          <div className="stat-number">{vehicles.length}</div>
          <p className="text-muted stat-sub">Unidades en taller</p>
        </div>
        <div className="card">
          <h3 className="text-muted">PROCESOS EN CURSO</h3>
          <div className="stat-number primary">{vehicles.filter(v => ['diagnosis', 'execution'].includes(v.stage)).length}</div>
          <div className="flex-row mt-1"><AlertCircle size={16} className="text-muted" /><span className="text-muted efficiency-text">Eficiencia: 92%</span></div>
        </div>
        <div className="card">
          <h3 className="text-muted">CITAS PARA HOY</h3>
          <div className="stat-number success">{vehicles.filter(v => v.stage === 'ready').length}</div>
          <p className="text-muted efficiency-text">Egresos programados</p>
        </div>
      </section>

      <section className="stages-flow">
        {STAGES.map(stage => (
          <div key={stage.id} className="stage-column">
            <div className="stage-header">
              <h3 className="stage-title">{stage.label.toUpperCase()}</h3>
              <span className={`badge stage-badge stage-${stage.id}`}>{vehicles.filter(v => v.stage === stage.id).length}</span>
            </div>
            {vehicles.filter(v => v.stage === stage.id).map(vehicle => (
              <div key={vehicle.id} className={`card vehicle-card ${vehicle.stage}`}>
                <div className="flex-row space-between mb-1">
                  <strong className="plate-title">{vehicle.plate}</strong>
                  {vehicle.priority === 'high' && <AlertCircle size={18} color="var(--error)" />}
                </div>
                <p className="vehicle-model">{vehicle.model}</p>
                
                {/* Budget Indicator / Button */}
                {vehicle.stage === 'diagnosis' && (
                  <div style={{ margin: '0.5rem 0' }}>
                    <button 
                      onClick={() => setEditingBudgetVehicle(vehicle)}
                      className="btn-text" 
                      style={{ 
                        width: '100%', 
                        fontSize: '0.75rem', 
                        padding: '0.4rem', 
                        background: vehicle.budget?.isApproved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                        border: vehicle.budget?.isApproved ? '1px solid var(--success)' : '1px solid rgba(255,255,255,0.1)',
                        color: vehicle.budget?.isApproved ? 'var(--success)' : 'var(--text-muted)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText size={14} />
                      {vehicle.budget ? (vehicle.budget.isApproved ? 'PRESUPUESTO APROBADO' : 'VER PRESUPUESTO') : 'CREAR PRESUPUESTO'}
                    </button>
                  </div>
                )}

                <div className="card-footer mt-1">
                  <span className="text-muted entry-date">{vehicle.entryDate}</span>
                  <select value={vehicle.stage} onChange={(e) => moveVehicle(vehicle.id, e.target.value as Stage)} className="input-field small-select">
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

export default DashboardView;
