import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HealthCheck } from '@/types';
import {
    ChevronDown, Activity, Brain, Shield, Satellite, FlaskConical,
    ArrowRight, Radiation, Users, Compass, Orbit, Box, Microscope, BookOpen
} from 'lucide-react';
import { api } from '@/services/api';
import { NASA_FIVE_HAZARDS } from '@/data/researchData';
import { OfficialResourceCenter } from '@/components/OfficialResourceCenter';
import { Footer } from '@/components/Footer';

const FEATURES = [
    {
        icon: Activity,
        title: 'Physiological Telemetry',
        desc: 'Real-time visualization of heart rate, SpO₂, body temperature, respiratory rate, and blood pressure using interactive charts.',
        color: 'var(--electric-cyan)',
    },
    {
        icon: Brain,
        title: 'ML Anomaly Detection',
        desc: 'Isolation Forest algorithm analyzes multivariate physiological data to detect unusual patterns in the measurement history.',
        color: 'var(--aurora-violet)',
    },
    {
        icon: Shield,
        title: 'Alert Management',
        desc: 'Prototype alert system with severity classification, acknowledgment tracking, and visual alert history for operators.',
        color: 'var(--success-mint)',
    },
    {
        icon: Satellite,
        title: 'Mission Data Intelligence',
        desc: 'Searchable historical records, CSV import/export, data quality reporting, and interactive trend exploration.',
        color: 'var(--warning-amber)',
    },
    {
        icon: FlaskConical,
        title: 'Data Science Pipeline',
        desc: 'Reproducible simulated dataset with documented anomaly injection, preprocessing, feature selection, and model evaluation.',
        color: 'var(--electric-cyan)',
    },
];

// Astronaut silhouette SVG
const AstronautSVG = () => (
    <svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 420, height: 'auto' }}>
        {/* Earth glow */}
        <ellipse cx="80" cy="460" rx="160" ry="100" fill="none" stroke="#53E7FF" strokeWidth="0.5" opacity="0.2" />
        <ellipse cx="80" cy="460" rx="120" ry="75" fill="rgba(83,231,255,0.04)" stroke="#9275FF" strokeWidth="0.5" opacity="0.3" />

        {/* Orbital lines */}
        <ellipse cx="200" cy="260" rx="180" ry="50" fill="none" stroke="#53E7FF" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.25"
            style={{ animation: 'orbitPulse 4s ease-in-out infinite' }} />
        <ellipse cx="200" cy="260" rx="160" ry="44" fill="none" stroke="#9275FF" strokeWidth="0.4" strokeDasharray="3 8" opacity="0.2"
            transform="rotate(20 200 260)" />

        {/* Suit body */}
        <path d="M155 280 L155 380 Q155 420 200 420 Q245 420 245 380 L245 280 Z"
            fill="rgba(17,28,61,0.9)" stroke="rgba(83,231,255,0.4)" strokeWidth="1.5" />

        {/* Helmet */}
        <circle cx="200" cy="205" r="68" fill="rgba(11,16,38,0.95)" stroke="rgba(83,231,255,0.5)" strokeWidth="2" />
        <circle cx="200" cy="200" r="55" fill="rgba(5,8,22,0.8)" />
        {/* Visor reflection */}
        <ellipse cx="185" cy="185" rx="22" ry="16" fill="rgba(83,231,255,0.12)" />
        <ellipse cx="178" cy="180" rx="8" ry="6" fill="rgba(83,231,255,0.2)" />

        {/* Helmet ring */}
        <ellipse cx="200" cy="273" rx="62" ry="12" fill="rgba(17,28,61,0.9)" stroke="rgba(83,231,255,0.4)" strokeWidth="1.5" />

        {/* Arms */}
        <path d="M155 295 L108 330 Q98 345 105 355 L130 345 L155 315 Z"
            fill="rgba(17,28,61,0.9)" stroke="rgba(83,231,255,0.3)" strokeWidth="1.5" />
        <path d="M245 295 L292 330 Q302 345 295 355 L270 345 L245 315 Z"
            fill="rgba(17,28,61,0.9)" stroke="rgba(83,231,255,0.3)" strokeWidth="1.5" />

        {/* Gloves */}
        <ellipse cx="110" cy="360" rx="18" ry="12" fill="rgba(83,231,255,0.2)" stroke="rgba(83,231,255,0.6)" strokeWidth="1.5" />
        <ellipse cx="290" cy="360" rx="18" ry="12" fill="rgba(83,231,255,0.2)" stroke="rgba(83,231,255,0.6)" strokeWidth="1.5" />

        {/* Life support backpack indicators */}
        <rect x="183" y="295" width="34" height="50" rx="4" fill="rgba(83,231,255,0.08)" stroke="rgba(83,231,255,0.25)" strokeWidth="1" />
        <rect x="188" y="303" width="10" height="3" rx="1" fill="var(--success-mint)" opacity="0.8" />
        <rect x="188" y="310" width="7" height="3" rx="1" fill="var(--warning-amber)" opacity="0.7" />
        <rect x="188" y="317" width="9" height="3" rx="1" fill="var(--electric-cyan)" opacity="0.8" />

        {/* Telemetry readouts floating */}
        <g opacity="0.7">
            <rect x="10" y="170" width="90" height="30" rx="4" fill="rgba(11,16,38,0.9)" stroke="rgba(83,231,255,0.3)" strokeWidth="0.8" />
            <text x="16" y="182" fontFamily="JetBrains Mono,monospace" fontSize="7" fill="#91A0BE">HEART RATE</text>
            <text x="16" y="193" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="#53E7FF">68.2 BPM</text>
        </g>
        <g opacity="0.7">
            <rect x="300" y="200" width="80" height="30" rx="4" fill="rgba(11,16,38,0.9)" stroke="rgba(146,117,255,0.3)" strokeWidth="0.8" />
            <text x="306" y="212" fontFamily="JetBrains Mono,monospace" fontSize="7" fill="#91A0BE">SPO₂</text>
            <text x="306" y="223" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="#9275FF">97.5 %</text>
        </g>
        <g opacity="0.6">
            <rect x="20" y="320" width="80" height="28" rx="4" fill="rgba(11,16,38,0.85)" stroke="rgba(93,242,180,0.25)" strokeWidth="0.8" />
            <text x="26" y="331" fontFamily="JetBrains Mono,monospace" fontSize="7" fill="#91A0BE">TEMP</text>
            <text x="26" y="341" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="#5DF2B4">36.8 °C</text>
        </g>

        {/* Connecting lines */}
        <line x1="100" y1="185" x2="132" y2="220" stroke="rgba(83,231,255,0.3)" strokeWidth="0.6" strokeDasharray="3 3" />
        <line x1="300" y1="215" x2="268" y2="235" stroke="rgba(146,117,255,0.3)" strokeWidth="0.6" strokeDasharray="3 3" />
    </svg>
);

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [health, setHealth] = useState<HealthCheck | null>(null);

    useEffect(() => {
        api.health().then(setHealth).catch(() => { });
    }, []);

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Hero */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80 }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        {/* Left: Text */}
                        <div style={{ animation: 'fadeInUp 0.7s ease forwards' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ height: 1, width: 40, background: 'var(--electric-cyan)', opacity: 0.6 }} />
                                <span className="section-eyebrow">SPACEFLIGHT HEALTH INTELLIGENCE // MISSION SYSTEM 01</span>
                            </div>

                            <h1 style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #F4F7FF 60%, #53E7FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Humanity's Next Frontier.<br />
                                <span style={{ WebkitTextFillColor: 'var(--electric-cyan)' }}>Health Beyond Earth.</span>
                            </h1>

                            <p style={{ fontSize: '1.05rem', marginBottom: '2rem', maxWidth: 500, lineHeight: 1.8 }}>
                                An intelligent monitoring platform that transforms astronaut health data into meaningful insights through real-time visualization, trend analysis, and explainable anomaly detection.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                                    ENTER MISSION CONTROL <ArrowRight size={16} />
                                </button>
                                <button className="btn btn-outline btn-lg" onClick={() => navigate('/about')}>
                                    EXPLORE THE TECHNOLOGY
                                </button>
                            </div>

                            {/* Indicators */}
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Physiological Data Monitoring', color: 'var(--electric-cyan)' },
                                    { label: 'Machine Learning Analysis', color: 'var(--aurora-violet)' },
                                    { label: 'Space Mission Research', color: 'var(--success-mint)' },
                                ].map(item => (
                                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* System status */}
                            {health && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className="status-dot active" />
                                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                        BACKEND CONNECTED · {(health.total_readings ?? 420).toLocaleString()} RECORDS LOADED
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right: Astronaut visual */}
                        <div style={{ display: 'flex', justifyContent: 'center', animation: 'float 8s ease-in-out infinite' }}>
                            <AstronautSVG />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
                        SCROLL TO EXPLORE
                    </div>
                    <ChevronDown size={16} color="var(--electric-cyan)" style={{ animation: 'float 2s ease-in-out infinite' }} />
                </div>
            </section>

            {/* Simulated data disclaimer banner */}
            <div style={{ background: 'rgba(255,202,114,0.06)', border: '1px solid rgba(255,202,114,0.2)', borderRadius: 0, padding: '0.75rem 2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', letterSpacing: '0.06em' }}>
                    ⚠ SIMULATED DEMONSTRATION DATA — NOT REAL ASTRONAUT TELEMETRY — NASA Space Apps Challenge Prototype · Team AlgoX
                </span>
            </div>

            {/* Features Section */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div className="section-eyebrow" style={{ marginBottom: '1rem' }}>PLATFORM CAPABILITIES</div>
                        <h2>Mission-Grade<br /><span className="text-cyan">Health Intelligence</span></h2>
                        <p style={{ maxWidth: 540, margin: '1rem auto 0' }}>
                            AstroCare combines data science, machine learning, and aerospace UI design to demonstrate how physiological monitoring data could be analyzed and visualized for space missions.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="glass-card" style={{ padding: '1.5rem', animationDelay: `${i * 80}ms` }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10, background: `${f.color}18`,
                                        border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', marginBottom: '1rem',
                                    }}>
                                        <Icon size={18} color={f.color} />
                                    </div>
                                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--stellar-white)' }}>{f.title}</h4>
                                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Five Hazards of Human Spaceflight Section */}
            <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(145, 160, 190, 0.1)', background: 'linear-gradient(180deg, rgba(11, 16, 38, 0.3) 0%, rgba(5, 8, 22, 0.8) 100%)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span className="badge badge-info">NASA Human Research Program (HRP)</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>R-I-D-G-E Hazards Framework</span>
                        </div>
                        <h2>The Five Major Hazards of <br /><span className="text-cyan">Human Spaceflight</span></h2>
                        <p style={{ maxWidth: 640, margin: '1rem auto 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                            Astronauts on deep-space journeys to the Moon and Mars leave Earth’s protective cradle. NASA categorizes the physiological threats under the five hazards below.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {NASA_FIVE_HAZARDS.map(h => {
                            const hazardIcons: Record<string, any> = { Radiation, Users, Compass, Orbit, Box };
                            const HazardIcon = hazardIcons[h.iconName] || Radiation;

                            return (
                                <div
                                    key={h.id}
                                    className="glass-card"
                                    style={{
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        borderTop: `3px solid ${h.color}`,
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <div
                                                style={{
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: 8,
                                                    background: `${h.color}18`,
                                                    border: `1px solid ${h.color}35`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <HazardIcon size={18} color={h.color} />
                                            </div>
                                            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: h.color, fontWeight: 700 }}>
                                                HAZARD #{h.hazardNumber}
                                            </span>
                                        </div>

                                        <h4 style={{ margin: '0 0 0.5rem', color: 'var(--stellar-white)', fontSize: '1.05rem' }}>
                                            {h.title}
                                        </h4>
                                        <p style={{ fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                            {h.simpleExplanation}
                                        </p>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm w-full"
                                            style={{ justifyContent: 'center', color: h.color, fontSize: '0.78rem' }}
                                            onClick={() => navigate('/research')}
                                        >
                                            <span>View Detailed Analysis</span>
                                            <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Button to full research hub */}
                    <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-outline btn-lg" onClick={() => navigate('/research')}>
                            <BookOpen size={16} />
                            EXPLORE ALL HAZARDS & HEALTH RISKS IN RESEARCH HUB
                        </button>
                    </div>
                </div>
            </section>

            {/* CSA & NASA Research Partnership Highlight Section */}
            <section style={{ padding: '4.5rem 0', borderTop: '1px solid rgba(145, 160, 190, 0.1)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span className="badge" style={{ background: 'rgba(255,100,124,0.15)', borderColor: 'rgba(255,100,124,0.4)', color: '#FF8B9E' }}>
                                    Canadian Space Agency (CSA) Partner Research
                                </span>
                            </div>
                            <h2 style={{ marginBottom: '1rem' }}>
                                Monitoring Space Radiation & <br />
                                <span style={{ color: '#FF8B9E' }}>Microgravity Science</span>
                            </h2>
                            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Through the Canadian Space Agency, astronauts deploy specialized radiation detection hardware (such as <strong>EVARM</strong> spacewalk dosimeters, <strong>bubble detectors</strong>, and the <strong>Bio-Monitor</strong>). Furthermore, CSA space biology research uses microgravity as an accelerated model of human aging, delivering life-saving breakthroughs for osteoporosis and neurosurgical robotics (neuroArm and IGAR) back on Earth.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,100,124,0.4)', color: '#FF8B9E' }} onClick={() => navigate('/research')}>
                                    <Microscope size={14} />
                                    Explore CSA Radiation & Science Experiments
                                </button>
                            </div>
                        </div>

                        {/* Visual cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #FF8B9E' }}>
                                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#FF8B9E', marginBottom: '0.35rem' }}>
                                    CSA ARTICLE: MONITORING RADIATION FOR ASTRONAUT HEALTH
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.98rem' }}>Protecting Crews from Cosmic Particles</h4>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    Continuous personal dosimetry and cytogenetic biodosimetry ensure astronauts stay within strict lifetime occupational safety limits.
                                </p>
                            </div>

                            <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--aurora-violet)' }}>
                                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--aurora-violet)', marginBottom: '0.35rem' }}>
                                    CSA SCIENCE: WHY DO WE CONDUCT EXPERIMENTS IN SPACE?
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.98rem' }}>Accelerated Aging & Terrestrial Spinoffs</h4>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    Weightlessness unlocks pure protein crystal growth and provides a reversible accelerated model for osteoporosis and vascular stiffening.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official References Section */}
            <section style={{ padding: '4.5rem 0', borderTop: '1px solid rgba(145, 160, 190, 0.1)', background: 'rgba(11, 16, 38, 0.4)' }}>
                <div className="container">
                    <OfficialResourceCenter compact={false} />
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 0 6rem', textAlign: 'center' }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '3rem 2rem', maxWidth: 700, margin: '0 auto', background: 'rgba(17,28,61,0.6)', border: '1px solid rgba(83,231,255,0.15)' }}>
                        <div className="section-eyebrow" style={{ marginBottom: '1rem' }}>READY TO EXPLORE</div>
                        <h2 style={{ marginBottom: '1rem' }}>Enter the <span className="text-cyan">Mission Console</span></h2>
                        <p style={{ marginBottom: '2rem' }}>
                            Explore live telemetry, run anomaly detection, inspect historical trends, and review alerts — all in one platform.
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                            LAUNCH MISSION CONTROL <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Site Footer */}
            <Footer />
        </div>
    );
};
