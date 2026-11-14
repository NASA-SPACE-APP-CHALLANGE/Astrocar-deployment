import React, { useState, useMemo } from 'react';
import {
    Activity, Shield, AlertTriangle, ExternalLink, Info, CheckCircle2,
    Eye, Brain, Heart, Wind, Bone, Dumbbell, ShieldAlert, Coffee
} from 'lucide-react';
import { getBodySystemsForAstronaut, type BodySystemData } from '@/services/bodyMapService';

export const HumanBodyMap: React.FC<{ astronautId?: string }> = ({ astronautId = 'ASTRO-01' }) => {
    const systems = useMemo(() => getBodySystemsForAstronaut(astronautId), [astronautId]);
    const [selectedSystemId, setSelectedSystemId] = useState<string>('brain');
    const selectedSystem = systems.find(s => s.id === selectedSystemId) || systems[0];

    const getSystemIcon = (id: string) => {
        switch (id) {
            case 'brain': return <Brain size={18} />;
            case 'eyes': return <Eye size={18} />;
            case 'heart': return <Heart size={18} />;
            case 'lungs': return <Wind size={18} />;
            case 'bones': return <Bone size={18} />;
            case 'muscles': return <Dumbbell size={18} />;
            case 'immune': return <ShieldAlert size={18} />;
            case 'digestive': return <Coffee size={18} />;
            default: return <Activity size={18} />;
        }
    };

    const getStatusColor = (status: 'green' | 'amber' | 'red') => {
        switch (status) {
            case 'green': return 'var(--success-mint)';
            case 'amber': return 'var(--warning-amber)';
            case 'red': return 'var(--critical-coral)';
        }
    };

    return (
        <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>ANATOMICAL TELEMETRY MAPPING</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)' }}>ASTRONAUT: {astronautId}</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>NASA HRP 8 SYSTEMS</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--stellar-white)' }}>
                        Interactive Spaceflight Physiological Body Map
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Select any organ system to inspect spaceflight hazards, live telemetry status, and NASA clinical countermeasures.
                    </p>
                </div>

                {/* Status Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(5,8,22,0.6)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(83,231,255,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--success-mint)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-mint)', display: 'inline-block' }} />
                        <span>Nominal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--warning-amber)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning-amber)', display: 'inline-block' }} />
                        <span>Attention</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--critical-coral)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--critical-coral)', display: 'inline-block' }} />
                        <span>High Priority</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.75rem', alignItems: 'start' }}>
                {/* SVG Human Silhouette & Interactive Points */}
                <div style={{
                    position: 'relative',
                    background: 'radial-gradient(circle at center, rgba(14,24,54,0.7) 0%, rgba(5,8,22,0.95) 100%)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(83,231,255,0.2)',
                    padding: '1.5rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <svg viewBox="0 0 400 480" style={{ width: '100%', height: 'auto', maxHeight: 440, filter: 'drop-shadow(0 0 16px rgba(83,231,255,0.15))' }}>
                        {/* Background Holographic Grid Lines */}
                        <defs>
                            <linearGradient id="bodyGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
                                <stop offset="50%" stopColor="#9D4EDD" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.2" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Coordinate Grid Guides */}
                        <line x1="200" y1="20" x2="200" y2="460" stroke="rgba(83,231,255,0.12)" strokeDasharray="3,3" />
                        <line x1="80" y1="240" x2="320" y2="240" stroke="rgba(83,231,255,0.08)" strokeDasharray="3,3" />
                        <circle cx="200" cy="240" r="140" fill="none" stroke="rgba(83,231,255,0.05)" />

                        {/* Stylized Human Body Silhouette Path */}
                        <path
                            d="
                            M 200,32 
                            C 214,32 224,42 224,56 
                            C 224,68 216,78 209,82 
                            L 214,94 
                            L 238,104 
                            L 272,130 
                            L 295,200 
                            L 282,204 
                            L 255,148 
                            L 235,138 
                            L 234,195 
                            L 236,250 
                            L 226,330 
                            L 232,440 
                            L 218,442 
                            L 208,340 
                            L 200,265 
                            L 192,340 
                            L 182,442 
                            L 168,440 
                            L 174,330 
                            L 164,250 
                            L 166,195 
                            L 165,138 
                            L 145,148 
                            L 118,204 
                            L 105,200 
                            L 128,130 
                            L 162,104 
                            L 186,94 
                            L 191,82 
                            C 184,78 176,68 176,56 
                            C 176,42 186,32 200,32 Z
                            "
                            fill="url(#bodyGlow)"
                            stroke="rgba(83,231,255,0.4)"
                            strokeWidth="1.5"
                        />

                        {/* Interactive Nodes for each system */}
                        {systems.map(sys => {
                            const isSelected = sys.id === selectedSystemId;
                            const color = getStatusColor(sys.status);

                            return (
                                <g
                                    key={sys.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSelectedSystemId(sys.id)}
                                >
                                    {/* Outer pulsing ring if selected */}
                                    {isSelected && (
                                        <circle
                                            cx={sys.svgCoords.x}
                                            cy={sys.svgCoords.y}
                                            r={sys.svgCoords.radius + 10}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth="2"
                                            strokeDasharray="4,3"
                                            opacity="0.8"
                                            filter="url(#glow)"
                                        >
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                from={`0 ${sys.svgCoords.x} ${sys.svgCoords.y}`}
                                                to={`360 ${sys.svgCoords.x} ${sys.svgCoords.y}`}
                                                dur="8s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    )}

                                    {/* Main Target Circle */}
                                    <circle
                                        cx={sys.svgCoords.x}
                                        cy={sys.svgCoords.y}
                                        r={isSelected ? sys.svgCoords.radius + 3 : sys.svgCoords.radius}
                                        fill={isSelected ? 'rgba(5,8,22,0.85)' : 'rgba(11,16,38,0.7)'}
                                        stroke={color}
                                        strokeWidth={isSelected ? 3 : 1.75}
                                        filter="url(#glow)"
                                    />

                                    {/* Inner point */}
                                    <circle
                                        cx={sys.svgCoords.x}
                                        cy={sys.svgCoords.y}
                                        r={isSelected ? 5 : 3.5}
                                        fill={color}
                                    />

                                    {/* System Label Anchor */}
                                    <text
                                        x={sys.svgCoords.x > 200 ? sys.svgCoords.x + sys.svgCoords.radius + 8 : sys.svgCoords.x - sys.svgCoords.radius - 8}
                                        y={sys.svgCoords.y + 4}
                                        textAnchor={sys.svgCoords.x > 200 ? 'start' : 'end'}
                                        fill={isSelected ? '#FFFFFF' : 'rgba(215,225,245,0.7)'}
                                        fontSize={isSelected ? 11 : 9.5}
                                        fontFamily="var(--font-mono)"
                                        fontWeight={isSelected ? 700 : 500}
                                    >
                                        {sys.name.split(' ')[0]}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Quick System Selector Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
                        {systems.map(sys => (
                            <button
                                key={sys.id}
                                type="button"
                                onClick={() => setSelectedSystemId(sys.id)}
                                style={{
                                    fontSize: '0.72rem',
                                    fontFamily: 'var(--font-mono)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: sys.id === selectedSystemId ? 'rgba(83,231,255,0.2)' : 'rgba(5,8,22,0.6)',
                                    border: `1px solid ${sys.id === selectedSystemId ? 'var(--electric-cyan)' : 'rgba(83,231,255,0.15)'}`,
                                    color: sys.id === selectedSystemId ? 'var(--electric-cyan)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                }}
                            >
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor(sys.status) }} />
                                {sys.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected System Detail Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* System Summary Header Card */}
                    <div style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(5,8,22,0.75)',
                        border: `1px solid ${getStatusColor(selectedSystem.status)}33`,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.55rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: `${getStatusColor(selectedSystem.status)}20`,
                                    color: getStatusColor(selectedSystem.status),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {getSystemIcon(selectedSystem.id)}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.15rem', color: 'var(--stellar-white)' }}>
                                        {selectedSystem.name}
                                    </h4>
                                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                        {selectedSystem.subtitle}
                                    </span>
                                </div>
                            </div>

                            <span style={{
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-mono)',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                background: `${getStatusColor(selectedSystem.status)}20`,
                                color: getStatusColor(selectedSystem.status),
                                border: `1px solid ${getStatusColor(selectedSystem.status)}40`,
                                fontWeight: 600,
                            }}>
                                {selectedSystem.statusLabel}
                            </span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                            {selectedSystem.primaryFunction}
                        </p>
                    </div>

                    {/* Contributing Telemetry Indicators Grid */}
                    <div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ACTIVE SENSOR INDICATORS & VITAL READINGS
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {selectedSystem.relevantIndicators.map((ind, idx) => (
                                <div key={idx} style={{
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(11,16,38,0.6)',
                                    border: '1px solid rgba(83,231,255,0.15)',
                                }}>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                                        {ind.name}
                                    </div>
                                    <div style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.92rem',
                                        fontWeight: 600,
                                        color: ind.status === 'nominal' ? 'var(--stellar-white)' : 'var(--warning-amber)',
                                    }}>
                                        {ind.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hazards & Spaceflight Risks */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '0.9rem', borderRadius: 'var(--radius-md)', background: 'rgba(5,8,22,0.6)', border: '1px solid rgba(146,117,255,0.2)' }}>
                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-haze)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                RELATED NASA SPACEFLIGHT HAZARDS
                            </div>
                            <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {selectedSystem.spaceflightHazards.map((h, i) => (
                                    <li key={i}>{h}</li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ padding: '0.9rem', borderRadius: 'var(--radius-md)', background: 'rgba(5,8,22,0.6)', border: '1px solid rgba(255,184,0,0.2)' }}>
                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                ASSOCIATED CLINICAL RISKS
                            </div>
                            <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {selectedSystem.associatedRisks.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Recommended Countermeasures */}
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(5,8,22,0.6)', border: '1px solid rgba(93,242,180,0.2)' }}>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={13} />
                            <span>OFFICIAL COUNTERMEASURES & INTERVENTIONS</span>
                        </div>
                        <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                            {selectedSystem.availableCountermeasures.map((cm, i) => (
                                <li key={i}>{cm}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Scientific Citations */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {selectedSystem.nasaReferences.map((ref, idx) => (
                            <a
                                key={idx}
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    fontSize: '0.75rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--electric-cyan)',
                                    textDecoration: 'none',
                                }}
                            >
                                <ExternalLink size={12} />
                                <span>{ref.title} ({ref.program})</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
