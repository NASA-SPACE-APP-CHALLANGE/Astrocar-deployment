import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, UserCheck, Stethoscope, AlertCircle, Sparkles } from 'lucide-react';
import { AstroCareLogo } from '@/components/Logo';

export const LoginPage: React.FC = () => {
    const { login, loginAsRole } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('astronaut');
    const [password, setPassword] = useState('astro2025');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const success = await login(username, password);
        setLoading(false);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Authentication failed. Check credentials or use quick demo login.');
        }
    };

    const handleQuickRole = async (role: 'astronaut' | 'medical_team') => {
        setLoading(true);
        setError(null);
        await loginAsRole(role);
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative',
            zIndex: 2,
        }}>
            <div style={{
                width: '100%',
                maxWidth: 480,
                background: 'rgba(11, 16, 38, 0.85)',
                border: '1px solid rgba(83, 231, 255, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 2rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(83,231,255,0.1)',
            }}>
                {/* Header Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <AstroCareLogo size={42} showText={true} />
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--electric-cyan)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                    }}>
                        Mission Health Authentication Gateway
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        Secure access for crew members and ground medical flight surgeons.
                    </p>
                </div>

                {/* Quick 1-Click Role Login Buttons */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                    }}>
                        <Sparkles size={12} color="var(--electric-cyan)" />
                        Select Role for Prototype Demo:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => handleQuickRole('astronaut')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(83, 231, 255, 0.08)',
                                border: '1px solid rgba(83, 231, 255, 0.3)',
                                color: 'var(--stellar-white)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 200ms',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(83, 231, 255, 0.16)';
                                e.currentTarget.style.borderColor = 'var(--electric-cyan)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(83, 231, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(83, 231, 255, 0.3)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <UserCheck size={16} color="var(--electric-cyan)" />
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Astronaut</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                CDR Alex Vance
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleQuickRole('medical_team')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(146, 117, 255, 0.08)',
                                border: '1px solid rgba(146, 117, 255, 0.3)',
                                color: 'var(--stellar-white)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 200ms',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(146, 117, 255, 0.16)';
                                e.currentTarget.style.borderColor = 'var(--aurora-violet)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(146, 117, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(146, 117, 255, 0.3)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <Stethoscope size={16} color="var(--aurora-violet)" />
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Flight Surgeon</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                Dr. Evelyn Reed
                            </div>
                        </button>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '1.25rem 0',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(145, 160, 190, 0.15)' }} />
                    <span>OR ENTER CREDENTIALS</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(145, 160, 190, 0.15)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(255, 100, 124, 0.15)',
                            border: '1px solid rgba(255, 100, 124, 0.3)',
                            color: 'var(--critical-coral)',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            <AlertCircle size={16} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                            Username / Call-Sign
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(5, 8, 22, 0.8)',
                                border: '1px solid rgba(145, 160, 190, 0.25)',
                                color: 'var(--stellar-white)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                            Access Code / Security Token
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(5, 8, 22, 0.8)',
                                border: '1px solid rgba(145, 160, 190, 0.25)',
                                color: 'var(--stellar-white)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            marginTop: '0.75rem',
                            padding: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <ShieldCheck size={18} />
                        {loading ? 'Authenticating with Station Gateway...' : 'Initialize Session'}
                    </button>
                </form>

                {/* Footer disclaimer */}
                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    AstroCare AI Research Prototype • Space Health Analytics Demo<br />
                    Not a certified medical diagnostic system
                </div>
            </div>
        </div>
    );
};
