import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Download, CheckCircle2 } from 'lucide-react';
import type { Vehicle, BudgetItem, VehicleBudget } from '../types';
import { useFinancial } from '../hooks/useFinancial';
import { generateBudgetPDF } from '../lib/budgetReport';
import { v4 as uuidv4 } from 'uuid';

interface BudgetModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdateVehicle: (updatedVehicle: Vehicle) => void;
}

const BudgetModal = ({ vehicle, onClose, onUpdateVehicle }: BudgetModalProps) => {
  const { config } = useFinancial();
  const [items, setItems] = useState<BudgetItem[]>(vehicle.budget?.items || []);
  const [newItem, setNewItem] = useState<{ desc: string; cost: string; type: 'parts' | 'labor' }>({
    desc: '',
    cost: '',
    type: 'parts'
  });
  const [isApproved, setIsApproved] = useState(vehicle.budget?.isApproved || false);

  // Calculate Totals Safely
  const calculateTotal = () => items.reduce((acc, item) => acc + (item.cost || 0), 0);
  const totalUSD = calculateTotal();
  const rate = config.exchangeRate || 1; // prevent 0/NaN issues
  const totalVES = totalUSD * rate;

  const handleAddItem = () => {
    if (!newItem.desc.trim()) return;
    
    // Handle comma/dot decimal separator
    const costString = newItem.cost.replace(',', '.');
    const costVal = parseFloat(costString);
    
    if (isNaN(costVal)) return;

    const item: BudgetItem = {
      id: uuidv4(),
      description: newItem.desc,
      category: newItem.type,
      cost: costVal
    };

    setItems([...items, item]);
    setNewItem({ desc: '', cost: '', type: 'parts' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddItem();
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = () => {
    const budget: VehicleBudget = {
      items,
      total: totalUSD,
      isApproved,
      createdAt: new Date().toISOString()
    };

    const updatedVehicle = { ...vehicle, budget };
    onUpdateVehicle(updatedVehicle);
    onClose();
  };

  const handleGeneratePDF = () => {
    if (items.length === 0) return;
    const budget: VehicleBudget = {
      items,
      total: totalUSD,
      isApproved,
      createdAt: new Date().toISOString()
    };
    generateBudgetPDF(vehicle, budget, config.exchangeRate);
  };

  return (
    <div className="mobile-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', background: '#0f172a', border: '1px solid #334155' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: 'white' }}>Presupuesto de Reparación</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Vehículo: {vehicle.model} ({vehicle.plate})</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          {/* Main Content: Items List & Add Controls */}
          <div>
            {/* Add Item Controls (No Form Tag to prevent submission issues) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Descripción</label>
                <input 
                  className="input-field" 
                  style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem', color: 'white' }}
                  placeholder="Ej: Pastillas de Freno"
                  value={newItem.desc}
                  onChange={e => setNewItem({...newItem, desc: e.target.value})}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tipo</label>
                <select 
                  className="input-field"
                  style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem', color: 'white' }}
                  value={newItem.type}
                  onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                  onKeyDown={handleKeyDown}
                >
                  <option value="parts">Repuesto</option>
                  <option value="labor">Mano de Obra</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Costo ($)</label>
                <input 
                  type="number"
                  className="input-field"
                  style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem', color: 'white' }}
                  placeholder="0.00"
                  value={newItem.cost}
                  onChange={e => setNewItem({...newItem, cost: e.target.value})}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleAddItem}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', height: '38px', width: '38px' }}
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Items Table */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'left', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '0.5rem' }}>DESCRIPCIÓN</th>
                    <th style={{ padding: '0.5rem' }}>TIPO</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>COSTO</th>
                    <th style={{ padding: '0.5rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{item.description}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className="badge" style={{ background: item.category === 'labor' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(14, 165, 233, 0.2)', color: item.category === 'labor' ? '#d8b4fe' : '#7dd3fc' }}>
                          {item.category === 'parts' ? 'REPUESTO' : 'MANO OBRA'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600, color: 'white' }}>${item.cost.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No hay items en el presupuesto aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar: Totals & Actions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Resumen</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-muted">Subtotal USD:</span>
              <strong style={{ color: 'white' }}>${totalUSD.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span className="text-muted">Estimado VES:</span>
                 <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Tasa: {config.exchangeRate.toFixed(2)}</small>
              </div>
              <strong style={{ color: 'var(--primary)' }}>Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                className="btn" 
                onClick={handleGeneratePDF}
                disabled={items.length === 0}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '1rem' }}
              >
                <Download size={16} /> Descargar PDF
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                 <div style={{ position: 'relative', width: '44px', height: '24px', background: isApproved ? 'var(--success)' : '#334155', borderRadius: '12px', transition: 'all 0.3s' }}>
                   <div style={{ position: 'absolute', top: '2px', left: isApproved ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' }}></div>
                 </div>
                 <input type="checkbox" checked={isApproved} onChange={e => setIsApproved(e.target.checked)} style={{ display: 'none' }} />
                 <span style={{ fontWeight: 600, color: isApproved ? 'var(--success)' : 'var(--text-muted)' }}>
                   {isApproved ? 'APROBADO' : 'PENDIENTE'}
                 </span>
               </label>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>
              <Save size={18} /> GUARDAR CAMBIOS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
