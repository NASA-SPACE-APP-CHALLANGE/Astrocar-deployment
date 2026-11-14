import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import { AstroCareLogo } from './Logo';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
    { label: 'Overview', to: '/' },
    { label: 'Live Monitoring', to: '/dashboard' },
    { label: 'AI Insights', to: '/ai-insights' },
    { label: 'Mission Data', to: '/mission-data' },
    { label: 'Spaceflight Research', to: '/research' },
    { label: 'About Project', to: '/about' },
];

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isLinkActive = (to: string) => {
        if (to === '/') return location.pathname === '/';
        if (to === '/dashboard') return location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/');
        return location.pathname === to || location.pathname.startsWith(to + '/');
    };

    return (
        <>
            <nav
                role="navigation"
                aria-label="Main navigation"
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    background: scrolled ? 'rgba(5,8,22,0.95)' : 'rgba(5,8,22,0.7)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: scrolled ? '1px solid rgba(145,160,190,0.15)' : '1px solid rgba(145,160,190,0.08)',
                    transition: 'all 300ms ease',
                }}
            >
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                    <Link to="/" aria-label="AstroCare Home">
                        <AstroCareLogo size={32} />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                        {NAV_LINKS.map(link => {
                            const active = isLinkActive(link.to);
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{
                                        fontSize: '0.88rem',
                                        fontWeight: active ? 600 : 500,
                                        color: active ? 'var(--electric-cyan)' : 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        transition: 'color 150ms ease, border-color 150ms ease',
                                        letterSpacing: '0.01em',
                                        padding: '0.45rem 0',
                                        borderBottom: active ? '2px solid var(--electric-cyan)' : '2px solid transparent',
                                        textShadow: active ? '0 0 10px rgba(83, 231, 255, 0.4)' : 'none',
                                    }}
                                    onMouseEnter={e => {
                                        if (!active) (e.target as HTMLElement).style.color = 'var(--stellar-white)';
                                    }}
                                    onMouseLeave={e => {
                                        if (!active) (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {user && (
                            <div
                                className="hide-mobile"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: '999px',
                                    background: 'rgba(83, 231, 255, 0.06)',
                                    border: '1px solid rgba(83, 231, 255, 0.2)',
                                }}
                                title={`Logged in: ${user.full_name || user.username}`}
                            >
                                <span className="status-dot active" style={{ width: 6, height: 6 }} />
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.7rem',
                                    color: user.role === 'medical_team' ? 'var(--aurora-violet)' : 'var(--electric-cyan)',
                                    fontWeight: 600,
                                    letterSpacing: '0.04em',
                                }}>
                                    {user.role === 'medical_team' ? 'FLIGHT SURGEON' : 'ASTRONAUT'}
                                </span>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-sm hide-mobile"
                            onClick={() => navigate('/dashboard')}
                        >
                            <Rocket size={14} />
                            Launch Mission Console
                        </button>

                        {/* Mobile menu button */}
                        <button
                            className="btn btn-ghost btn-icon show-mobile-only"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            style={{ display: 'none' }}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    style={{
                        position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
                        background: 'rgba(5,8,22,0.98)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(145,160,190,0.15)',
                        padding: '1rem',
                    }}
                >
                    {NAV_LINKS.map(link => {
                        const active = isLinkActive(link.to);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'block',
                                    padding: '0.75rem 1rem',
                                    color: active ? 'var(--electric-cyan)' : 'var(--text-secondary)',
                                    background: active ? 'rgba(83, 231, 255, 0.08)' : 'transparent',
                                    borderLeft: active ? '3px solid var(--electric-cyan)' : '3px solid transparent',
                                    fontSize: '0.95rem',
                                    fontWeight: active ? 600 : 500,
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    marginBottom: '0.25rem',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <div style={{ padding: '0.5rem 1rem 1rem' }}>
                        <button
                            className="btn btn-primary w-full"
                            onClick={() => {
                                setMobileOpen(false);
                                navigate('/dashboard');
                            }}
                        >
                            <Rocket size={15} />
                            Launch Mission Console
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
