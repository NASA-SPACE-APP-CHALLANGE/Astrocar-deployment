import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Rocket, Users, Code2, FlaskConical, BookOpen, Microscope } from 'lucide-react';
import { OfficialResourceCenter } from '@/components/OfficialResourceCenter';

const TECH_STACK = [
    { cat: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Recharts', 'Lucide React', 'Framer Motion', 'React Router'] },
    { cat: 'Backend', items: ['Python 3.13', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-learn', 'SQLite', 'Uvicorn'] },
    { cat: 'ML / Data Science', items: ['Isolation Forest', 'StandardScaler', 'Pydantic v2', 'Reproducible seed (42)', 'Statistical z-score baseline'] },
    { cat: 'DevOps / Tooling', items: ['npm / pip', 'Vite proxy', 'CORS middleware', 'REST API', 'python-multipart'] },
];

// Architecture diagram as SVG
const ArchDiagram = () => (
    <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 700, height: 'auto' }}>
        {/* Boxes */}
        {[
            { x: 20, y: 120, w: 110, h: 50, label: 'Dataset / CSV', color: '#53E7FF' },
            { x: 160, y: 120, w: 110, h: 50, label: 'Validation &\nParsing', color: '#9275FF' },
            { x: 300, y: 60, w: 110, h: 50, label: 'Feature\nPreparation', color: '#9275FF' },
            { x: 300, y: 180, w: 110, h: 50, label: 'Missing Value\nHandling', color: '#9275FF' },
            { x: 440, y: 120, w: 110, h: 50, label: 'Isolation\nForest ML', color: '#FF647C' },
            { x: 580, y: 60, w: 100, h: 50, label: 'Anomaly\nResults', color: '#FFCA72' },
            { x: 580, y: 180, w: 100, h: 50, label: 'Dashboard\n& Alerts', color: '#5DF2B4' },
        ].map((b, i) => (
            <g key={i}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8}
                    fill="rgba(11,16,38,0.9)" stroke={b.color} strokeWidth={1.5} />
                {b.label.split('\n').map((line, li) => (
                    <text key={li} x={b.x + b.w / 2} y={b.y + 18 + li * 16}
                        textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize={10} fill={b.color}>
                        {line}
                    </text>
                ))}
            </g>
        ))}

        {/* Arrows */}
        {[
            [[130, 145], [160, 145]],
            [[270, 145], [300, 85]],
            [[270, 145], [300, 205]],
            [[410, 85], [440, 145]],
            [[410, 205], [440, 145]],
            [[550, 145], [580, 85]],
            [[550, 145], [580, 205]],
        ].map(([from, to], i) => (
            <line key={i} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
                stroke="rgba(145,160,190,0.4)" strokeWidth={1.2} markerEnd="url(#arrow)" />
        ))}

        <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(145,160,190,0.5)" />
            </marker>
        </defs>

        {/* Labels */}
        <text x="350" y="305" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize={9} fill="rgba(145,160,190,0.5)">
            ASTROCARE DATA PIPELINE — SIMULATED DEMONSTRATION
        </text>
    </svg>
);

export const AboutPage: React.FC = () => (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 900 }}>
        {/* Header */}
        <div>
            <div className="section-eyebrow" style={{ marginBottom: '0.4rem' }}>PROJECT STORY</div>
            <h2 style={{ margin: 0 }}>About <span className="text-violet">AstroCare</span></h2>
            <p style={{ margin: '0.5rem 0 0' }}>
                Built for the NASA Space Apps Challenge by Team AlgoX
            </p>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-violet">NASA Space Apps Challenge</span>
            <span className="badge badge-info">Team AlgoX</span>
            <span className="badge badge-warning">DEMO PROTOTYPE</span>
            <span className="badge badge-success">Open Source</span>
        </div>

        {/* Challenge */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Rocket size={18} color="var(--electric-cyan)" />
                <h3 style={{ margin: 0 }}>A. The Challenge</h3>
            </div>
            <p>Monitoring physiological data in a spaceflight research context involves time-series analysis, data quality challenges, and unusual-pattern detection across multiple simultaneous physiological variables. Astronauts in microgravity exhibit measurable deviations from Earth-baseline physiology, making automated trend analysis and anomaly flagging a meaningful research problem.</p>
        </div>

        {/* Solution */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <FlaskConical size={18} color="var(--aurora-violet)" />
                <h3 style={{ margin: 0 }}>B. Our Solution</h3>
            </div>
            <p>AstroCare is a full-stack web platform that provides a visual command interface for inspecting simulated physiological measurements, exploring trends across multiple metrics, running real machine-learning anomaly detection (Isolation Forest), and reviewing generated alerts — all with a space-mission aesthetic designed for immediate comprehension.</p>
        </div>

        {/* How it works */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Code2 size={18} color="var(--success-mint)" />
                <h3 style={{ margin: 0 }}>C. How It Works</h3>
            </div>
            <ArchDiagram />
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                    'A reproducible simulated telemetry dataset (500 records, seed=42) with injected anomalies (~5%) is generated on startup.',
                    'FastAPI backend validates, stores, and serves readings via REST endpoints to the React frontend.',
                    'Isolation Forest (Scikit-learn) is trained on the full dataset with configurable contamination and returns anomaly scores per observation.',
                    'Anomalies are persisted to SQLite, alerts are generated with documented severity rules, and both are displayed in the dashboard.',
                    'Users can import real CSVs, which are validated, range-checked, and merged into the dataset for re-analysis.',
                ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem', background: 'rgba(83,231,255,0.04)', borderRadius: 8 }}>
                        <span style={{ color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', flexShrink: 0 }}>
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>{step}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Technology */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>D. Technology Stack</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {TECH_STACK.map(group => (
                    <div key={group.cat}>
                        <div className="telemetry-label" style={{ marginBottom: '0.5rem' }}>{group.cat}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {group.items.map(item => (
                                <div key={item} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--electric-cyan)', display: 'inline-block', flexShrink: 0 }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Limitations */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,202,114,0.2)' }}>
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--warning-amber)' }}>E. Limitations & Honesty</h3>
            {[
                'All physiological data is synthetically generated. No real astronaut telemetry was used.',
                'Isolation Forest is an unsupervised algorithm — anomaly scores reflect statistical unusualness, not medical risk.',
                'The system has no clinical validation and must not be used for medical decision-making.',
                'Simulated data does not capture the full physiological complexity of long-duration spaceflight.',
                'Alert severity thresholds are prototype application rules, not a validated clinical triage system.',
                'This is a hackathon demonstration prototype, not a production system.',
            ].map((lim, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(145,160,190,0.06)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--warning-amber)', flexShrink: 0 }}>⚠</span>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>{lim}</p>
                </div>
            ))}
        </div>

        {/* Future scope */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>F. Future Scope</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[
                    'Integration with NASA Open Data APIs for real physiology datasets',
                    'SHAP-based explainable anomaly reasons',
                    'Longitudinal trend detection algorithms',
                    'Multi-astronaut comparison dashboard',
                    'Real-time WebSocket telemetry streaming',
                    'Research collaboration and paper citation linking',
                ].map((item, i) => (
                    <div key={i} style={{ padding: '0.75rem', background: 'rgba(146,117,255,0.06)', borderRadius: 8, border: '1px solid rgba(146,117,255,0.15)' }}>
                        <p style={{ fontSize: '0.82rem', margin: 0 }}>{item}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Scientific Foundation: NASA HRP & CSA Research Integration */}
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--electric-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Microscope size={20} color="var(--electric-cyan)" />
                <h3 style={{ margin: 0 }}>G. Scientific Foundation — NASA HRP & CSA Integration</h3>
            </div>
            <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                AstroCare directly incorporates official scientific research frameworks from the <strong>NASA Human Research Program (HRP)</strong> and the <strong>Canadian Space Agency (CSA)</strong>. Rather than monitoring telemetry in a clinical vacuum, our alert thresholds and countermeasure suggestions are rooted in peer-verified spaceflight health findings:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(83, 231, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(83, 231, 255, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600, marginBottom: '0.35rem' }}>
                        NASA 5 HAZARDS & HEALTH RISKS
                    </div>
                    <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-secondary)' }}>
                        Telemetry metrics map to NASA's five hazards (Radiation, Isolation, Distance, Gravity, Environment) and clinical risks like SANS, cephalad fluid shift, and bone-muscle loss.
                    </p>
                </div>

                <div style={{ padding: '0.85rem', background: 'rgba(255, 100, 124, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 100, 124, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#FF8B9E', fontWeight: 600, marginBottom: '0.35rem' }}>
                        CSA RADIATION & SPACE SCIENCE
                    </div>
                    <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-secondary)' }}>
                        Continuous dosimetry (EVARM, bubble detectors, Bio-Monitor) and microgravity accelerated aging research inform our cumulative radiation and physical strain heuristics.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/research" className="btn btn-outline btn-sm">
                    <BookOpen size={14} />
                    Open Dedicated Spaceflight Research Hub
                </Link>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Includes 5 official portals & full hazard breakdowns
                </span>
            </div>
        </div>

        {/* Embedded Official Resource Center */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <OfficialResourceCenter compact={true} />
        </div>

        {/* Team */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Users size={18} color="var(--aurora-violet)" />
                <h3 style={{ margin: 0 }}>Team AlgoX</h3>
            </div>
            <p>Participating in the NASA Space Apps Challenge. Built AstroCare as a full-stack space health intelligence platform combining data science, machine learning, and aerospace-grade UI design.</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href="https://github.com/NASA-SPACE-APP-CHALLANGE" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                    <Github size={14} /> GitHub
                </a>
                <span className="badge badge-muted" style={{ alignSelf: 'center' }}>NASA Space Apps Challenge 2026</span>
            </div>
        </div>
    </div>
);
