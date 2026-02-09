import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit3, Trash2 } from 'lucide-react';
import type { Vehicle } from '../types';
import { STAGES } from '../lib/constants';

const VehiclesView = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const navigate = useNavigate();
  return (
  <div className="animate-in">
    <header className="mb-3">
      <span className="section-badge">DATABASE</span>
      <h1>Maestro de Unidades</h1>
      <p className="text-muted">Gestión de flota activa y registro histórico de servicios</p>
    </header>
    <div className="card card-table">
      <table className="table-root">
        <thead className="table-head">
          <tr>
            <th>PLACA</th>
            <th>MODELO / CATEGORÍA</th>
            <th>PROPIETARIO</th>
            <th>ESTADO OPERATIVO</th>
            <th className="th-right">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} className="table-row">
              <td className="table-cell cell-plate">{v.plate}</td>
              <td className="table-cell cell-model">{v.model}</td>
              <td className="table-cell cell-client">{v.client}</td>
              <td className="table-cell">
                <span className={`badge stage-badge stage-${v.stage}`}>{v.stage.toUpperCase()}</span>
              </td>
              <td className="table-cell table-actions">
                <button 
                  className="icon-btn" 
                  onClick={() => navigate(`/vehicles/${v.id}/history`)}
                  title="Ver Historial"
                >
                  <Search size={18} />
                </button>
                <button className="icon-btn" title="Editar (Admin Only)">
                  <Edit3 size={18} />
                </button>
                <button className="icon-btn" title="Eliminar (Admin Only)">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default VehiclesView;
