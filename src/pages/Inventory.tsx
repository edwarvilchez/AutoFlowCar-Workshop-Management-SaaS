import React from 'react';
import { Box } from 'lucide-react';
import { INVENTORY_ITEMS } from '../lib/constants';

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

export default InventoryView;
