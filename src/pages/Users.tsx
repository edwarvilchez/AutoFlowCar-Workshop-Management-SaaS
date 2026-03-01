import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Shield, Trash2, Edit, Search, UserCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

const UsersView = () => {
    const { user } = useAuth();
    if (user?.role !== 'admin') return <Navigate to="/" />;
    const [searchTerm, setSearchTerm] = useState('');
    const [analysts, setAnalysts] = useState<User[]>([
        { id: 'a1', name: 'ROBERTO GONZALEZ', email: 'analyst1@autoflow.com', role: 'analyst', phone: '+58 412-1111111' },
        { id: 'a2', name: 'MARIA LOPEZ', email: 'analyst2@autoflow.com', role: 'analyst', phone: '+58 424-2222222' },
        { id: 'a3', name: 'CARLOS RUIZ', email: 'analyst3@autoflow.com', role: 'analyst', phone: '+58 416-3333333' },
    ]);

    const filteredAnalysts = analysts.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteAnalyst = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este analista? Perderá acceso inmediato.')) {
            setAnalysts(prev => prev.filter(a => a.id !== id));
        }
    };

    return (
        <div className="animate-in">
            <header className="flex-row space-between wrap gap-1-5 mb-3">
                <div>
                    <span className="badge badge-highlight">ADMINISTRACIÓN</span>
                    <h1>Gestión de Analistas</h1>
                    <p className="text-muted">Control de acceso y personal operativo del taller</p>
                </div>
                <button className="btn btn-primary"><UserPlus size={18} /> ASIGNAR NUEVO ANALISTA</button>
            </header>

            <div className="card mb-3" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                <div className="input-container" style={{ maxWidth: '400px' }}>
                    <Search size={18} className="input-icon" />
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Buscar por nombre o correo..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid-3">
                {filteredAnalysts.map(analyst => (
                    <div key={analyst.id} className="card card-decorated">
                        <div className="card-deco"></div>
                        <div className="flex-row space-between mb-1-5">
                            <div className="avatar" style={{ width: '3rem', height: '3rem', background: 'var(--primary)', borderRadius: '1rem' }}>
                                <UserCircle size={24} color="white" />
                            </div>
                            <div className="flex-row gap-0-5">
                                <button className="btn-icon"><Edit size={16} /></button>
                                <button className="btn-icon text-error" onClick={() => deleteAnalyst(analyst.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                        
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{analyst.name}</h3>
                        <div className="flex-row gap-0-5 mb-0-5" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                            <Shield size={14} color="var(--primary)" /> 
                            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>ANALISTA OPERATIVO</span>
                        </div>
                        
                        <div className="mt-1-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                            <div className="flex-row gap-0-5 mb-0-5 text-muted" style={{ fontSize: '0.85rem' }}>
                                <Mail size={14} /> {analyst.email}
                            </div>
                            <div className="flex-row gap-0-5 text-muted" style={{ fontSize: '0.85rem' }}>
                                <Phone size={14} /> {analyst.phone}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAnalysts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p className="text-muted">No se encontraron analistas que coincidan con la búsqueda.</p>
                </div>
            )}
        </div>
    );
};

export default UsersView;
