import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, Lock, Mail, ChevronRight, AlertCircle, Wrench } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/';
    
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
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
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', pointerEvents: 'none' }}></div>

            <div className="animate-in fade-in" style={{ width: '100%', maxWidth: '1000px', display: 'flex', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                {/* Visual Side */}
                <div className="login-visual" style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ background: 'var(--primary)', width: '4rem', height: '4rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 10px 20px -5px var(--primary)' }}>
                            <Wrench color="white" size={32} />
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            AutoFlow <br /><span className="text-primary italic">Workshop SaaS</span>
                        </h1>
                        <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.6 }}>
                            Potencia la gestión de tu taller con herramientas de vanguardia, análisis inteligente y un flujo de trabajo impecable.
                        </p>
                        
                        <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '0.2rem' }}>+500</h4>
                                <p className="text-muted small-muted">Talleres Activos</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '0.2rem' }}>99.9%</h4>
                                <p className="text-muted small-muted">Uptime Mensual</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="login-form-area" style={{ flex: 1, padding: '4rem', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bienvenido de nuevo</h2>
                            <p className="text-muted">Ingresa tus credenciales para acceder al panel</p>
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <AlertCircle size={20} color="var(--error)" />
                                <span style={{ fontSize: '0.85rem', color: 'var(--error)' }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Correo Electrónico</label>
                                <div className="input-container" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                    <Mail size={18} className="input-icon" />
                                    <input 
                                        type="email" 
                                        className="input-field" 
                                        placeholder="admin@autoflow.com" 
                                        required 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contraseña</label>
                                <div className="input-container" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
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

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>¿Olvidaste tu contraseña?</a>
                            </div>

                            <button 
                                className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                                type="submit" 
                                disabled={loading}
                                style={{ padding: '1rem', marginTop: '1rem', fontSize: '1rem', height: '3.5rem' }}
                            >
                                {loading ? 'PROCESANDO...' : 'INICIAR SESIÓN'}
                                {!loading && <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />}
                            </button>
                        </form>

                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                ¿Aún no eres parte de AutoFlow? <Link to="/register" style={{ color: 'white', fontWeight: 700, textDecoration: 'none' }}>Crea tu cuenta gratis</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes spin { from {transform: rotate(0deg)} to {transform: rotate(360deg)} }
                .btn.loading { opacity: 0.8 !important; pointer-events: none; }
                @media (max-width: 900px) {
                    .login-visual { display: none !important; }
                    .login-form-area { padding: 3rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
