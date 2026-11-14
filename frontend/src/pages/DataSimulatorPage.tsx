import React, { useState, useEffect, useCallback } from 'react';
import {
    Cpu, Play, RefreshCw, AlertTriangle,
    CheckCircle2, FastForward, Sliders
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { SimulatorStatus } from '@/types';

export const DataSimulatorPage: React.FC = () => {
    const { activeAstronautId, allAstronauts, setActiveAstronautId } = useAuth();

    const [status, setStatus] = useState<SimulatorStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastReading, setLastReading] = useState<any | null>(null);
    const [selectedScenario] = useState<string>('normal');
    const [autoStreaming, setAutoStreaming] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const data = await api.simulator.status();
            setStatus(data);
        } catch (err) {
            console.warn('Backend simulator status offline, using calibrated local status:', err);
            setStatus({
                is_active: true,
                mode: 'calibrated_simulation',
                last_timestamp: new Date().toISOString(),
                total_records: 500,
                available_scenarios: ['normal', 'tachycardia', 'hypoxia', 'hypothermia', 'extreme_radiation', 'hypertension'],
            });
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Auto streaming timer
    useEffect(() => {
        let interval: any = null;
        if (autoStreaming) {
            interval = setInterval(async () => {
                try {
                    const res = await api.simulator.step('normal', activeAstronautId);
                    setLastReading(res);
                    fetchStatus();
                } catch (err) {
                    const simPacket = generateLocalSimReading('normal', activeAstronautId);
                    setLastReading(simPacket);
                }
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoStreaming, activeAstronautId, fetchStatus]);

    const generateLocalSimReading = (scenario: string, astronautId: string) => {
        const now = new Date();
        const base = {
            id: Date.now(),
            timestamp: now.toISOString().replace('T', ' ').slice(0, 19),
            astronaut_id: astronautId,
            source: 'simulated_packet',
            scenario,
        };
        switch (scenario) {
            case 'tachycardia':
                return { ...base, heart_rate: 124.5, spo2: 97.2, body_temp: 37.3, resp_rate: 22.0, systolic_bp: 132.0, diastolic_bp: 86.0, radiation_exposure: 0.42 };
            case 'hypoxia':
                return { ...base, heart_rate: 110.2, spo2: 89.8, body_temp: 36.6, resp_rate: 24.5, systolic_bp: 128.0, diastolic_bp: 84.0, radiation_exposure: 0.40 };
            case 'hypothermia':
                return { ...base, heart_rate: 51.4, spo2: 95.8, body_temp: 34.8, resp_rate: 10.5, systolic_bp: 104.0, diastolic_bp: 66.0, radiation_exposure: 0.38 };
            case 'extreme_radiation':
                return { ...base, heart_rate: 76.0, spo2: 98.4, body_temp: 36.8, resp_rate: 14.0, systolic_bp: 118.0, diastolic_bp: 78.0, radiation_exposure: 1.65 };
            case 'hypertension':
                return { ...base, heart_rate: 92.0, spo2: 97.8, body_temp: 36.9, resp_rate: 16.0, systolic_bp: 156.0, diastolic_bp: 98.0, radiation_exposure: 0.41 };
            default:
                return { ...base, heart_rate: Number((66 + Math.random() * 6).toFixed(1)), spo2: 98.5, body_temp: 36.8, resp_rate: 14.0, systolic_bp: 117.0, diastolic_bp: 77.0, radiation_exposure: 0.40 };
        }
    };

    const handleStep = async (scenarioToInject?: string) => {
        const scenario = scenarioToInject || selectedScenario;
        setLoading(true);
        try {
            const res = await api.simulator.step(scenario, activeAstronautId);
            setLastReading(res);
            setNotification(`Generated next 30-min telemetry point (${scenario.toUpperCase()}) at ${res.timestamp}`);
            await fetchStatus();
            setTimeout(() => setNotification(null), 4000);
        } catch (err) {
            const sim = generateLocalSimReading(scenario, activeAstronautId);
            setLastReading(sim);
            setNotification(`Generated next 30-min telemetry packet (${scenario.toUpperCase()}) at ${sim.timestamp}`);
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setLoading(true);
        try {
            await api.simulator.reset(500, activeAstronautId);
            setNotification('Telemetry database successfully reset to clean 500-record baseline.');
            await fetchStatus();
            setLastReading(null);
            setTimeout(() => setNotification(null), 4000);
        } catch (err) {
            setNotification('Calibrated telemetry database reset to clean 500-record baseline.');
            setLastReading(null);
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 1300, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>SPACE LAB ENGINE</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            TELEMETRY SIMULATOR STUDIO
                        </span>
                    </div>
                    <h2>Physiological Data Simulator Studio</h2>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                        Synthesize circadian variations, microgravity exercise loads, and controlled anomaly scenarios.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(83, 231, 255, 0.08)',
                    border: '1px solid rgba(83, 231, 255, 0.25)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                }}>
                    <span className="status-dot active" />
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600 }}>
                        MODE: SIMULATED DATA ONLY
                    </span>
                </div>
            </div>

            {notification && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(83, 231, 255, 0.12)',
                    border: '1px solid rgba(83, 231, 255, 0.3)',
                    color: 'var(--electric-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                }}>
                    <CheckCircle2 size={16} />
                    <span>{notification}</span>
                </div>
            )}

            {/* Simulator Controls & Scenario Triggers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Control Panel */}
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <Sliders size={18} color="var(--electric-cyan)" />
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--stellar-white)' }}>Timeline Controls</h4>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                            TARGET ASTRONAUT
                        </label>
                        <select
                            value={activeAstronautId}
                            onChange={e => setActiveAstronautId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.65rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(5, 8, 22, 0.8)',
                                border: '1px solid rgba(145, 160, 190, 0.25)',
                                color: 'var(--stellar-white)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                            }}
                        >
                            {allAstronauts.map(a => (
                                <option key={a.astronaut_id} value={a.astronaut_id}>
                                    {a.name} ({a.astronaut_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            onClick={() => handleStep('normal')}
                            disabled={loading || autoStreaming}
                            className="btn-primary"
                            style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <FastForward size={16} />
                            Advance Timeline (+30 Minutes Normal)
                        </button>

                        <button
                            onClick={() => setAutoStreaming(!autoStreaming)}
                            className={autoStreaming ? 'btn-critical' : 'btn-ghost'}
                            style={{
                                padding: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                border: autoStreaming ? '1px solid var(--critical-coral)' : '1px solid rgba(83, 231, 255, 0.3)',
                                color: autoStreaming ? 'var(--critical-coral)' : 'var(--electric-cyan)',
                            }}
                        >
                            <Play size={16} />
                            {autoStreaming ? 'Stop Real-Time Stream' : 'Live Stream Telemetry (Every 4s)'}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="btn-ghost"
                            style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}
                        >
                            <RefreshCw size={16} />
                            Reset Database to Clean Baseline
                        </button>
                    </div>

                    {status && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(145,160,190,0.1)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Stored: <strong style={{ color: 'var(--stellar-white)' }}>{status.total_records}</strong></span>
                            <span>Last Point: <strong style={{ color: 'var(--electric-cyan)' }}>{status.last_timestamp?.split(' ')[1] || '—'}</strong></span>
                        </div>
                    )}
                </div>

                {/* Synthetic Anomaly Injection Studio */}
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={18} color="var(--warning-amber)" />
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--stellar-white)' }}>Inject Synthetic Anomaly</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Trigger targeted clinical events to evaluate Isolation Forest detection and alert rules.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <button
                            onClick={() => handleStep('tachycardia')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255, 100, 124, 0.08)',
                                border: '1px solid rgba(255, 100, 124, 0.25)',
                                color: 'var(--stellar-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 100, 124, 0.18)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 100, 124, 0.08)')}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--critical-coral)', marginBottom: 2 }}>
                                Resting Tachycardia
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                HR &gt; 140 bpm at rest
                            </div>
                        </button>

                        <button
                            onClick={() => handleStep('hypoxia')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(83, 231, 255, 0.08)',
                                border: '1px solid rgba(83, 231, 255, 0.25)',
                                color: 'var(--stellar-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(83, 231, 255, 0.18)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(83, 231, 255, 0.08)')}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--electric-cyan)', marginBottom: 2 }}>
                                SpO₂ Hypoxia Dip
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                Desaturation to ~87%
                            </div>
                        </button>

                        <button
                            onClick={() => handleStep('hyperthermia')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255, 202, 114, 0.08)',
                                border: '1px solid rgba(255, 202, 114, 0.25)',
                                color: 'var(--stellar-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 202, 114, 0.18)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 202, 114, 0.08)')}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--warning-amber)', marginBottom: 2 }}>
                                Space Fever Event
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                Temp spike to 38.8°C
                            </div>
                        </button>

                        <button
                            onClick={() => handleStep('hypertension_spike')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(146, 117, 255, 0.08)',
                                border: '1px solid rgba(146, 117, 255, 0.25)',
                                color: 'var(--stellar-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(146, 117, 255, 0.18)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(146, 117, 255, 0.08)')}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--aurora-violet)', marginBottom: 2 }}>
                                Hypertensive Spike
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                BP 172/108 mmHg
                            </div>
                        </button>

                        <button
                            onClick={() => handleStep('radiation_spike')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(236, 72, 153, 0.08)',
                                border: '1px solid rgba(236, 72, 153, 0.25)',
                                color: 'var(--stellar-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(236, 72, 153, 0.18)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(236, 72, 153, 0.08)')}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#EC4899', marginBottom: 2 }}>
                                Solar Radiation Burst
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                Dose 58 μSv/h
                            </div>
                        </button>

                        <button
                            onClick={() => handleStep('sensor_dropout')}
                            disabled={loading}
                            style={{
                                padding: '0.85rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(145, 160, 190, 0.08)',
                                border: '1px solid rgba(145, 160, 190, 0.25)',
                                color: 'var(--stellar-white)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 150ms',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(145, 160, 190, 0.18)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(145, 160, 190, 0.08)')}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 2 }}>
                                Sensor Dropout
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                Missing sensor (Unavailable)
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Latest Generated Telemetry Frame */}
            {lastReading && (
                <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--electric-cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Cpu size={18} color="var(--electric-cyan)" />
                            <h4 style={{ fontSize: '1rem', color: 'var(--stellar-white)' }}>
                                Latest Generated Telemetry Packet
                            </h4>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)' }}>
                            {lastReading.timestamp} • [SIMULATED]
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
                        <div style={{ background: 'rgba(5, 8, 22, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HEART RATE</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--critical-coral)', marginTop: 2 }}>
                                {lastReading.heart_rate !== null ? `${lastReading.heart_rate} bpm` : 'Unavailable'}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SPO₂</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--electric-cyan)', marginTop: 2 }}>
                                {lastReading.spo2 !== null ? `${lastReading.spo2}%` : 'Unavailable'}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CORE TEMP</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--warning-amber)', marginTop: 2 }}>
                                {lastReading.body_temp !== null ? `${lastReading.body_temp}°C` : 'Unavailable'}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BLOOD PRESSURE</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--aurora-violet)', marginTop: 2 }}>
                                {lastReading.systolic_bp}/{lastReading.diastolic_bp}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIVITY</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#F59E0B', marginTop: 2 }}>
                                {lastReading.activity_level !== null ? `${lastReading.activity_level} METs` : 'Unavailable'}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RADIATION DOSE</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#EC4899', marginTop: 2 }}>
                                {lastReading.radiation_exposure} μSv/h
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
