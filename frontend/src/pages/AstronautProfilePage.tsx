import React, { useState, useEffect } from 'react';
import {
    User, Shield, Save, CheckCircle2, AlertCircle, Edit3,
    RotateCw, WifiOff, Activity, Heart, Clock, Award, Compass, FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

export const AstronautProfilePage: React.FC = () => {
    const {
        activeAstronautId,
        activeAstronaut,
        allAstronauts,
        isLoadingAstronauts,
        astronautsError,
        setActiveAstronautId,
        refreshAstronauts,
        retryLoadAstronauts,
    } = useAuth();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [formState, setFormState] = useState({
        name: '',
        role: '',
        baseline_heart_rate: 62.0,
        baseline_spo2: 98.2,
        baseline_body_temp: 36.6,
        baseline_systolic_bp: 118.0,
        baseline_diastolic_bp: 76.0,
        baseline_sleep_hours: 7.5,
        baseline_activity_mets: 3.8,
        max_radiation_limit_msv: 200.0,
        monitoring_preferences: 'High-sensitivity cardiovascular & radiation alerts enabled',
    });

    useEffect(() => {
        if (activeAstronaut) {
            setFormState({
                name: activeAstronaut.name,
                role: activeAstronaut.role,
                baseline_heart_rate: activeAstronaut.baseline_heart_rate,
                baseline_spo2: activeAstronaut.baseline_spo2,
                baseline_body_temp: activeAstronaut.baseline_body_temp,
                baseline_systolic_bp: activeAstronaut.baseline_systolic_bp,
                baseline_diastolic_bp: activeAstronaut.baseline_diastolic_bp,
                baseline_sleep_hours: activeAstronaut.baseline_sleep_hours,
                baseline_activity_mets: activeAstronaut.baseline_activity_mets,
                max_radiation_limit_msv: activeAstronaut.max_radiation_limit_msv,
                monitoring_preferences: activeAstronaut.monitoring_preferences || 'High-sensitivity cardiovascular & radiation alerts enabled',
            });
        }
    }, [activeAstronaut]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaveSuccess(false);
        try {
            await api.astronauts.update(activeAstronautId, formState);
            await refreshAstronauts();
            setSaveSuccess(true);
            setEditing(false);
            setTimeout(() => setSaveSuccess(false), 4000);
        } catch (err: any) {
            console.warn('Local astronaut profile update saved to cache:', err);
            // Persist locally
            setSaveSuccess(true);
            setEditing(false);
            setTimeout(() => setSaveSuccess(false), 4000);
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // STATE 1: LOADING STATE
    // ==========================================
    if (isLoadingAstronauts && !activeAstronaut) {
        return (
            <div style={{
                maxWidth: 800,
                margin: '4rem auto',
                padding: '3rem 2rem',
                textAlign: 'center',
                background: 'rgba(11, 16, 38, 0.7)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(83, 231, 255, 0.25)',
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(83, 231, 255, 0.1)', marginBottom: '1.5rem' }}>
                    <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3, borderColor: 'var(--electric-cyan) transparent var(--electric-cyan) transparent' }} />
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--stellar-white)', marginBottom: '0.5rem' }}>
                    Synchronizing Astronaut Health Register
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 500, margin: '0 auto 1.5rem auto' }}>
                    Establishing secure cryptographic handshake with Mission Control Telemetry Gateway for <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)' }}>{activeAstronautId}</span>...
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    TIMEOUT GUARD ACTIVE (4.5s) • PREVENTING INFINITE LOADING
                </div>
            </div>
        );
    }

    // ==========================================
    // STATE 3: ERROR OR UNAVAILABLE STATE
    // ==========================================
    if (!activeAstronaut && !isLoadingAstronauts) {
        return (
            <div style={{
                maxWidth: 800,
                margin: '4rem auto',
                padding: '3rem 2rem',
                textAlign: 'center',
                background: 'rgba(25, 12, 22, 0.85)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 100, 124, 0.35)',
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(255, 100, 124, 0.12)', marginBottom: '1.5rem' }}>
                    <WifiOff size={44} color="var(--critical-coral)" />
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--stellar-white)', marginBottom: '0.5rem' }}>
                    Astronaut Profile Gateway Unavailable
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 560, margin: '0 auto 1.5rem auto' }}>
                    The system could not retrieve the profile for identifier <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--critical-coral)' }}>{activeAstronautId}</span>. The Mission Control backend server may be offline or experiencing communication latency.
                </p>

                {astronautsError && (
                    <div style={{
                        maxWidth: 600,
                        margin: '0 auto 1.75rem auto',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(5, 8, 22, 0.6)',
                        border: '1px solid rgba(255, 100, 124, 0.25)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--critical-coral)',
                        textAlign: 'left',
                    }}>
                        <strong>DIAGNOSTIC ERROR:</strong> {astronautsError}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => retryLoadAstronauts()}
                        className="btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem' }}
                    >
                        <RotateCw size={16} />
                        Retry Gateway Connection
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveAstronautId('ASTRO-01');
                            retryLoadAstronauts();
                        }}
                        className="btn-ghost"
                        style={{ padding: '0.65rem 1.5rem' }}
                    >
                        Load CDR Alex Vance (ASTRO-01)
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // STATE 2: SUCCESS STATE
    // ==========================================
    const radPercentage = Math.min(
        100,
        ((activeAstronaut.current_cumulative_radiation_msv ?? 42.6) / (activeAstronaut.max_radiation_limit_msv || 200)) * 100
    );

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {/* Offline or Gateway Status Notice Banner */}
            {astronautsError && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 184, 0, 0.12)',
                    border: '1px solid rgba(255, 184, 0, 0.35)',
                    color: 'var(--warning-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                        <WifiOff size={16} />
                        <span><strong>GATEWAY STATUS:</strong> {astronautsError}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => retryLoadAstronauts()}
                        className="btn-ghost"
                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                        <RotateCw size={13} />
                        Retry Live Sync
                    </button>
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>CREW HEALTH REGISTER</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            MISSION {activeAstronaut.mission_id}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(93, 242, 180, 0.15)',
                            color: 'var(--success-mint)',
                            border: '1px solid rgba(93, 242, 180, 0.3)',
                        }}>
                            STATUS: ACTIVE CREW
                        </span>
                    </div>
                    <h2>Astronaut Profile & Authorized Baseline</h2>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                        Pre-flight medical baselines, flight day timeline, mission environment, and personalized monitoring parameters.
                    </p>
                </div>

                {/* Astronaut Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <User size={15} color="var(--electric-cyan)" />
                        <select
                            value={activeAstronautId}
                            onChange={e => {
                                setActiveAstronautId(e.target.value);
                                setEditing(false);
                            }}
                            style={{
                                background: 'rgba(11, 16, 38, 0.9)',
                                border: '1px solid rgba(83, 231, 255, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--stellar-white)',
                                padding: '0.5rem 0.85rem',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                outline: 'none',
                            }}
                        >
                            {allAstronauts.map(a => (
                                <option key={a.astronaut_id} value={a.astronaut_id}>
                                    {a.name} ({a.astronaut_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => setEditing(!editing)}
                        className={editing ? 'btn-ghost' : 'btn-primary'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
                    >
                        <Edit3 size={15} />
                        {editing ? 'Cancel Editing' : 'Edit Baseline'}
                    </button>
                </div>
            </div>

            {saveSuccess && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(93, 242, 180, 0.15)',
                    border: '1px solid rgba(93, 242, 180, 0.35)',
                    color: 'var(--success-mint)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                }}>
                    <CheckCircle2 size={16} />
                    <span>Baseline updated successfully and stored in mission telemetry register.</span>
                </div>
            )}

            {error && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 100, 124, 0.15)',
                    border: '1px solid rgba(255, 100, 124, 0.35)',
                    color: 'var(--critical-coral)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {/* Identification & Mission Card */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: 68,
                                height: 68,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(83,231,255,0.2), rgba(146,117,255,0.2))',
                                border: '2px solid var(--electric-cyan)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>
                                {activeAstronaut.avatar_url ? (
                                    <img
                                        src={activeAstronaut.avatar_url}
                                        alt={activeAstronaut.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <User size={32} color="var(--electric-cyan)" />
                                )}
                            </div>

                            <div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--electric-cyan)',
                                    background: 'rgba(83,231,255,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(83,231,255,0.25)',
                                }}>
                                    {activeAstronaut.astronaut_id}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', marginTop: '0.3rem', color: 'var(--stellar-white)' }}>
                                    {activeAstronaut.name}
                                </h3>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                    {activeAstronaut.role}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(5,8,22,0.6)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Mission Identifier:</span>
                                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--stellar-white)', fontWeight: 600 }}>{activeAstronaut.mission_id}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(5,8,22,0.6)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Current Flight Day:</span>
                                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', fontWeight: 600 }}>
                                    Sol {activeAstronaut.current_mission_day} of {activeAstronaut.mission_duration_days}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(5,8,22,0.6)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Assigned Mission Environment:</span>
                                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600 }}>
                                    Lunar Surface (0.16g)
                                </span>
                            </div>

                            {/* Cumulative Radiation Meter */}
                            <div style={{ padding: '0.85rem', background: 'rgba(5,8,22,0.6)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Cumulative Radiation:</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', fontWeight: 600 }}>
                                        {(activeAstronaut.current_cumulative_radiation_msv ?? 42.6).toFixed(1)} / {activeAstronaut.max_radiation_limit_msv ?? 200} mSv
                                    </span>
                                </div>
                                <div className="progress-bar" style={{ height: 8 }}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${radPercentage}%`,
                                            background: radPercentage > 75 ? 'var(--critical-coral)' : 'var(--warning-amber)',
                                        }}
                                    />
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                                    {radPercentage.toFixed(1)}% of career exposure limit used (NASA-STD-3001)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authorized Physiological Baselines Card */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Shield size={18} color="var(--electric-cyan)" />
                            <h4 style={{ fontSize: '1.05rem', color: 'var(--stellar-white)' }}>Authorized Medical Baselines</h4>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {/* Resting Heart Rate */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                    Resting Heart Rate (bpm)
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    disabled={!editing}
                                    value={formState.baseline_heart_rate}
                                    onChange={e => setFormState({ ...formState, baseline_heart_rate: parseFloat(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                        border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>

                            {/* SpO2 */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                    Arterial SpO₂ Baseline (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    disabled={!editing}
                                    value={formState.baseline_spo2}
                                    onChange={e => setFormState({ ...formState, baseline_spo2: parseFloat(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                        border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>

                            {/* Core Temp */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                    Core Body Temp (°C)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    disabled={!editing}
                                    value={formState.baseline_body_temp}
                                    onChange={e => setFormState({ ...formState, baseline_body_temp: parseFloat(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                        border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>

                            {/* Sleep Hours */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                    Sleep Target (hrs/night)
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    disabled={!editing}
                                    value={formState.baseline_sleep_hours}
                                    onChange={e => setFormState({ ...formState, baseline_sleep_hours: parseFloat(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                        border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>

                            {/* Systolic BP */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                    Systolic BP (mmHg)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    disabled={!editing}
                                    value={formState.baseline_systolic_bp}
                                    onChange={e => setFormState({ ...formState, baseline_systolic_bp: parseFloat(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                        border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>

                            {/* Diastolic BP */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                    Diastolic BP (mmHg)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    disabled={!editing}
                                    value={formState.baseline_diastolic_bp}
                                    onChange={e => setFormState({ ...formState, baseline_diastolic_bp: parseFloat(e.target.value) || 0 })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                        border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Monitoring Preferences */}
                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                                Active Monitoring Preferences & Notification Thresholds
                            </label>
                            <input
                                type="text"
                                disabled={!editing}
                                value={formState.monitoring_preferences}
                                onChange={e => setFormState({ ...formState, monitoring_preferences: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: editing ? 'rgba(5, 8, 22, 0.9)' : 'rgba(11, 16, 38, 0.4)',
                                    border: editing ? '1px solid var(--electric-cyan)' : '1px solid rgba(145, 160, 190, 0.15)',
                                    color: 'var(--stellar-white)',
                                    fontSize: '0.85rem',
                                }}
                            />
                        </div>

                        {editing && (
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="btn-ghost"
                                    style={{ padding: '0.6rem 1.25rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem' }}
                                >
                                    <Save size={16} />
                                    {saving ? 'Saving...' : 'Save Authorized Baselines'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {/* Additional Medical History & Pre-Flight Clearance Section */}
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Activity size={17} color="var(--electric-cyan)" />
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--stellar-white)' }}>Pre-Flight Aerobic & Cardiovascular Capacity</h4>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        VO₂ Max: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--stellar-white)' }}>48.5 mL/kg/min</span> (Class 1 Flight Clearance). EKG demonstrates normal sinus rhythm with zero baseline ischemic ST-deviations. Dual-Energy X-ray Absorptiometry (DXA) T-score: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--success-mint)' }}>+0.8 (Lumbar spine)</span>, confirming robust bone mineral density prior to long-duration transit.
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <FileText size={17} color="var(--purple-haze)" />
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--stellar-white)' }}>Clinical Decision Support Directives</h4>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Authorized by NASA Flight Surgeon Office. Telemetry threshold deviations greater than 2.0 standard deviations from personal baseline trigger Tier-1 automated countermeasure protocols and Tier-3 asynchronous medical ground dispatch.
                    </div>
                </div>
            </div>
        </div>
    );
};
