import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield } from 'lucide-react';
import { AstroCareLogo } from './Logo';
import { NASA_DISCLAIMER_TEXT, OFFICIAL_RESOURCES } from '@/data/researchData';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
    return (
        <footer
            role="contentinfo"
            aria-label="AstroCare Project Footer"
            style={{
                background: 'rgba(5, 8, 22, 0.95)',
                borderTop: '1px solid rgba(145, 160, 190, 0.12)',
                position: 'relative',
                zIndex: 10,
                marginTop: 'auto',
            }}
        >
            <div className="container" style={{ padding: '3.5rem var(--space-6) 2rem' }}>
                {/* Main 4-column footer grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: '3rem',
                    }}
                >
                    {/* Col 1: Brand & Project */}
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <AstroCareLogo size={32} />
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                            Astronaut physiological telemetry intelligence, AI anomaly detection, and deep-space mission health platform built for the NASA Space Apps Challenge by Team AlgoX.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>NASA Space Apps</span>
                            <span className="badge badge-violet" style={{ fontSize: '0.68rem' }}>Team AlgoX</span>
                            <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Artemis VII Ready</span>
                        </div>
                    </div>

                    {/* Col 2: Navigation Links */}
                    <div>
                        <div className="section-eyebrow" style={{ marginBottom: '1rem', color: 'var(--electric-cyan)' }}>
                            MISSION NAVIGATION
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {[
                                { label: 'Mission Overview', to: '/' },
                                { label: 'Live Health Dashboard', to: '/dashboard' },
                                { label: 'AI Anomaly Insights', to: '/ai-insights' },
                                { label: 'Telemetry Archive', to: '/mission-data' },
                                { label: 'NASA & CSA Research Hub', to: '/research' },
                                { label: 'Project Story & Architecture', to: '/about' },
                            ].map(item => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            transition: 'color 150ms',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                        }}
                                        onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--electric-cyan)')}
                                        onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                                    >
                                        <span>•</span> {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: NASA & CSA Research Sources */}
                    <div>
                        <div className="section-eyebrow" style={{ marginBottom: '1rem', color: 'var(--aurora-violet)' }}>
                            OFFICIAL RESEARCH PORTALS
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {OFFICIAL_RESOURCES.map(res => (
                                <li key={res.id}>
                                    <a
                                        href={res.officialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: '0.82rem',
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            transition: 'color 150ms',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                        }}
                                        onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--stellar-white)')}
                                        onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                                        title={res.shortDescription}
                                    >
                                        <span style={{
                                            fontSize: '0.65rem',
                                            padding: '1px 4px',
                                            borderRadius: '4px',
                                            background: res.organization === 'NASA' ? 'rgba(83,231,255,0.15)' : 'rgba(255,100,124,0.15)',
                                            color: res.organization === 'NASA' ? 'var(--electric-cyan)' : '#FF8B9E',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 600,
                                        }}>
                                            {res.organization}
                                        </span>
                                        <span>{res.resourceTitle}</span>
                                        <ExternalLink size={11} style={{ opacity: 0.7 }} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Scientific Attribution & Data Integrity */}
                    <div>
                        <div className="section-eyebrow" style={{ marginBottom: '1rem', color: 'var(--success-mint)' }}>
                            DATA & INTEGRITY
                        </div>
                        <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Research datasets and scientific hazard frameworks are integrated from official publications of the <strong>NASA Human Research Program (HRP)</strong> and the <strong>Canadian Space Agency (CSA)</strong>.
                        </p>
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(93, 242, 180, 0.05)',
                            border: '1px solid rgba(93, 242, 180, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success-mint)', fontWeight: 600, marginBottom: 2 }}>
                                <Shield size={12} />
                                <span>Academic & Hackathon Purpose</span>
                            </div>
                            Simulated demonstration prototype engineered for educational exploration and research data visualization.
                        </div>
                    </div>
                </div>

                {/* NASA Disclaimer Box (Mandatory wording) */}
                <div
                    style={{
                        padding: '1.25rem 1.5rem',
                        background: 'rgba(11, 16, 38, 0.8)',
                        border: '1px solid rgba(255, 202, 114, 0.25)',
                        borderLeft: '4px solid var(--warning-amber)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '2rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                            NASA Non-Endorsement & External Data Use Disclaimer
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--stellar-white)', lineHeight: 1.65 }}>
                        &ldquo;{NASA_DISCLAIMER_TEXT}&rdquo;
                    </p>
                </div>

                {/* Bottom Bar: Copyright & Credits */}
                <div
                    style={{
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(145, 160, 190, 0.1)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    <div>
                        © {CURRENT_YEAR} AstroCare • Team AlgoX • NASA Space Apps Challenge
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <span>NASA HRP COMPLIANT</span>
                        <span>•</span>
                        <span>CSA RESEARCH PARTNER</span>
                        <span>•</span>
                        <a
                            href="https://github.com/NASA-SPACE-APP-CHALLANGE"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--electric-cyan)', textDecoration: 'none' }}
                        >
                            Open Source
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
