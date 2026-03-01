import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, User, Lock, Mail, ChevronRight, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await register(email, password, name);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1a1a2e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', pointerEvents: 'none' }}></div>

            <div className="animate-in slide-up" style={{ width: '100%', maxWidth: '600px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', borderRadius: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: 'var(--success)', width: '3.5rem', height: '3.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px -5px var(--success)' }}>
                        <ShieldCheck color="white" size={28} />
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Crea tu Cuenta</h2>
                    <p className="text-muted">Únete a la red premium para talleres de élite</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <AlertCircle size={20} color="var(--error)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--error)' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Nombre del Taller / Dueño</label>
                        <div className="input-container">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Ej: Taller Mecánico Pro" 
                                required 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Correo Profesional</label>
                        <div className="input-container">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                className="input-field" 
                                placeholder="taller@autoflow.com" 
                                required 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Contraseña de Seguridad</label>
                        <div className="input-container">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                className="input-field" 
                                placeholder="••••••••" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                        type="submit" 
                        disabled={loading}
                        style={{ gridColumn: 'span 2', padding: '1rem', marginTop: '1rem', fontSize: '1.1rem', height: '3.5rem', background: 'var(--success)' }}
                    >
                        {loading ? 'CREANDO CUENTA...' : 'COMIENZA TU PRUEBA GRATUITA'}
                        {!loading && <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />}
                    </button>
                    
                    <div style={{ gridColumn: 'span 2', marginTop: '3rem', textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                            ¿Ya tienes una cuenta registrada? <Link to="/login" style={{ color: 'white', fontWeight: 700, textDecoration: 'none' }}>Ingresa aquí</Link>
                        </p>
                    </div>
                </form>
            </div>
            
            <style>{`
                @keyframes slideUp { from {opacity: 0; transform: translateY(20px);} to {opacity: 1; transform: translateY(0);} }
                .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .btn.loading { opacity: 0.8 !important; pointer-events: none; }
                @media (max-width: 600px) {
                    form { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Register;
