import React from 'react';
import { Download, TrendingUp, ShieldCheck } from 'lucide-react';
import { generatePDFReport } from '../lib/report';
import { useFinancial } from '../hooks/useFinancial';

const BillingView = ({ vehicles }: any) => {
  const { config } = useFinancial();
  
  const formatCurrency = (amount: number, currency: 'USD' | 'VES') => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-VE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const revenueUSD = 4250;
  const pendingUSD = 840;

  return (
  <div style={{ animation: 'fadeIn 0.5s ease' }}>
    <header className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
      <div>
        <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>REVENUE</span>
        <h1>Módulo Financiero</h1>
        <p className="text-muted">Control de cobros, presupuestos y salud financiera del taller</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
          <span className="text-muted">Tasa de Cambio:</span> <strong style={{ color: 'white' }}>{config.exchangeRate.toFixed(2)} Bs/$</strong>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }} onClick={() => generatePDFReport(vehicles)}><Download size={20} /> DESCARGAR REPORTE</button>
      </div>
    </header>
    <div className="grid-3" style={{ marginBottom: '3rem' }}>
      <div className="card" style={{ background: 'var(--secondary)', color: 'white', border: 'none', position: 'relative' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>INGRESOS TOTALES</h3>
        <div style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '0.5rem', fontStyle: 'italic' }}>
          {formatCurrency(revenueUSD, 'USD')}
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9 }}>
           {formatCurrency(revenueUSD * config.exchangeRate, 'VES')}
        </div>
        <div className="flex-row mt-1" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '2rem', width: 'fit-content', marginTop: '1rem' }}>
          <TrendingUp size={16} /><span style={{ fontWeight: 800, fontSize: '0.8rem' }}>+12% este mes</span>
        </div>
      </div>
      <div className="card">
        <h3 className="text-muted" style={{ fontWeight: 800 }}>FACTURACIÓN PENDIENTE</h3>
        <div style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '0.5rem' }}>
          {formatCurrency(pendingUSD, 'USD')}
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--primary)' }}>
           {formatCurrency(pendingUSD * config.exchangeRate, 'VES')}
        </div>
        <p className="text-muted" style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '1rem' }}>4 órdenes por procesar</p>
      </div>
      <div className="card">
        <h3 className="text-muted" style={{ fontWeight: 800 }}>LIQUIDEZ</h3>
        <div style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '1.25rem' }}>High</div>
        <div className="flex-row mt-1"><ShieldCheck size={18} color="var(--success)" /><span className="text-muted" style={{ fontWeight: 800, fontSize: '0.85rem' }}>Estatus óptimo</span></div>
      </div>
    </div>
  </div>
);
};
export default BillingView;
