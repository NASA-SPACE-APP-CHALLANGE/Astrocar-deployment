import React, { useState, useEffect, useRef } from 'react';
import { Compass, Info, ChevronDown, Check } from 'lucide-react';
import {
    MISSION_ENVIRONMENTS,
    type EnvironmentId,
    getActiveEnvironmentConfig,
    setActiveEnvironmentConfig,
    type MissionEnvironmentConfig
} from '@/services/missionEnvironmentService';

export const MissionEnvironmentBar: React.FC<{ onEnvironmentChange?: (config: MissionEnvironmentConfig) => void }> = ({ onEnvironmentChange }) => {
    const [activeConfig, setActiveConfig] = useState<MissionEnvironmentConfig>(() => getActiveEnvironmentConfig());
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click or escape key
    useEffect(() => {
        if (!dropdownOpen) return;

        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [dropdownOpen]);

    const handleSelect = (envId: EnvironmentId) => {
        const updated = setActiveEnvironmentConfig(envId);
        setActiveConfig(updated);
        setDropdownOpen(false);
        if (onEnvironmentChange) onEnvironmentChange(updated);
    };

    return (
        <div style={{
            position: 'relative',
            zIndex: dropdownOpen ? 1000 : 20,
            overflow: 'visible',
            background: 'rgba(11, 16, 38, 0.85)',
            border: '1px solid rgba(83, 231, 255, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            backdropFilter: 'blur(12px)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Active Environment Header & Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(83, 231, 255, 0.15)',
                        color: 'var(--electric-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Compass size={20} />
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>ACTIVE MISSION ENVIRONMENT</span>
                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)' }}>
                                PHASE: {activeConfig.defaultPhase.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <h4 style={{ fontSize: '1.05rem', color: 'var(--stellar-white)', margin: 0 }}>
                                {activeConfig.name}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Dynamic Telemetry Parameters Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Gravity */}
                    <div style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(5, 8, 22, 0.7)',
                        border: '1px solid rgba(83, 231, 255, 0.15)',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        <span style={{ color: 'var(--text-muted)' }}>GRAVITY: </span>
                        <span style={{ color: 'var(--electric-cyan)', fontWeight: 600 }}>{activeConfig.gravity} ({activeConfig.gravityNumericG}g)</span>
                    </div>

                    {/* Comm Delay */}
                    <div style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(5, 8, 22, 0.7)',
                        border: '1px solid rgba(146, 117, 255, 0.2)',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        <span style={{ color: 'var(--text-muted)' }}>COMM LATENCY: </span>
                        <span style={{ color: 'var(--purple-haze)', fontWeight: 600 }}>{activeConfig.communicationDelayLabel.split(' ')[0]} {activeConfig.communicationDelayLabel.split(' ')[1]}</span>
                    </div>

                    {/* Radiation Field */}
                    <div style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(5, 8, 22, 0.7)',
                        border: '1px solid rgba(255, 184, 0, 0.2)',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        <span style={{ color: 'var(--text-muted)' }}>RAD FLUX: </span>
                        <span style={{ color: 'var(--warning-amber)', fontWeight: 600 }}>{activeConfig.radiationFluxExpected.split(' ')[0]} mSv/d</span>
                    </div>

                    {/* Switch Environment Dropdown Trigger */}
                    <div ref={dropdownRef} style={{ position: 'relative', zIndex: 1001 }}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer' }}
                            aria-expanded={dropdownOpen}
                            aria-haspopup="listbox"
                        >
                            <span>Switch Environment</span>
                            <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 8px)',
                                width: 320,
                                maxWidth: '90vw',
                                background: 'rgba(7, 12, 30, 0.98)',
                                border: '1px solid var(--border-cyan, rgba(83, 231, 255, 0.45))',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 16px 48px rgba(0,0,0,0.85), 0 0 24px rgba(83,231,255,0.2)',
                                zIndex: 9999,
                                padding: '0.5rem',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                            }}>
                                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(83,231,255,0.1)' }}>
                                    SELECT OPERATIONAL DOMAIN
                                </div>
                                {Object.values(MISSION_ENVIRONMENTS).map(env => (
                                    <button
                                        key={env.id}
                                        type="button"
                                        onClick={() => handleSelect(env.id)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.6rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: env.id === activeConfig.id ? 'rgba(83, 231, 255, 0.15)' : 'transparent',
                                            color: env.id === activeConfig.id ? 'var(--electric-cyan)' : 'var(--stellar-white)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.82rem',
                                            transition: 'background 0.15s ease',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{env.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                                                {env.gravity} • Comm: {env.communicationDelayLabel.split(' ')[0]} {env.communicationDelayLabel.split(' ')[1]}
                                            </div>
                                        </div>
                                        {env.id === activeConfig.id && <Check size={14} color="var(--electric-cyan)" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setDetailsModalOpen(!detailsModalOpen)}
                        className="btn-ghost"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        title="View Environment Parameters & Protocols"
                    >
                        <Info size={14} />
                        <span>Rules</span>
                    </button>
                </div>
            </div>

            {/* Expanded Environment Rules & Safety Protocols Banner */}
            {detailsModalOpen && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(5, 8, 22, 0.85)',
                    border: '1px solid rgba(83, 231, 255, 0.2)',
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--electric-cyan)', fontWeight: 600, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                                ACTIVE CLINICAL MONITORING RULES:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                                {activeConfig.activeMonitoringRules.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div style={{ color: 'var(--warning-amber)', fontWeight: 600, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                                OPERATIONAL FLIGHT DIRECTIVES:
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                                {activeConfig.specialReminders.map((rem, idx) => (
                                    <li key={idx}>{rem}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
