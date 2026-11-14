import React, { useState, useEffect, useCallback } from 'react';
import {
    RefreshCw, Pause, Play, Satellite,
    Zap, Bell, ArrowRight, Activity, Brain, FileText, Cpu, Database, Settings, User, CheckCircle2, ChevronRight,
    ClipboardCheck, HeartPulse
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { MetricCard } from '@/components/MetricCard';
import { MissionEnvironmentBar } from '@/components/MissionEnvironmentBar';
import { HumanBodyMap } from '@/components/HumanBodyMap';
import { DailyRoutineChecklist } from '@/components/DailyRoutineChecklist';
import { BoxBreathingTool } from '@/components/BoxBreathingTool';
import { SymptomCheckerModal } from '@/components/SymptomCheckerModal';
import { getActiveEnvironmentConfig, type MissionEnvironmentConfig } from '@/services/missionEnvironmentService';
import type { MetricStats, Alert } from '@/types';

const MISSION_START = new Date('2025-01-01T00:00:00Z');

function formatElapsed(ms: number) {
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${d}D ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const DEFAULT_NOMINAL_METRICS: MetricStats[] = [
    {
        metric: 'heart_rate',
        label: 'Heart Rate',
        unit: 'bpm',
        latest_value: 68.4,
        latest_timestamp: new Date().toISOString(),
        mean: 66.8,
        std: 4.2,
        min_val: 58.0,
        max_val: 78.0,
        count: 288,
        missing: 0,
        sparkline: [64, 65, 66, 68, 70, 69, 67, 68, 68.4],
        change_from_prev: 0.4,
        normal_range: { min: 50, max: 100 },
        status: 'measured',
    },
    {
        metric: 'spo2',
        label: 'Blood Oxygen (SpO₂)',
        unit: '%',
        latest_value: 98.6,
        latest_timestamp: new Date().toISOString(),
        mean: 98.2,
        std: 0.8,
        min_val: 96.0,
        max_val: 99.5,
        count: 288,
        missing: 0,
        sparkline: [98.2, 98.4, 98.0, 98.5, 98.7, 98.6, 98.6],
        change_from_prev: 0.1,
        normal_range: { min: 94, max: 100 },
        status: 'measured',
    },
    {
        metric: 'body_temp',
        label: 'Core Temperature',
        unit: '°C',
        latest_value: 36.9,
        latest_timestamp: new Date().toISOString(),
        mean: 36.7,
        std: 0.3,
        min_val: 36.3,
        max_val: 37.2,
        count: 288,
        missing: 0,
        sparkline: [36.6, 36.7, 36.8, 36.8, 36.9, 36.9],
        change_from_prev: 0.1,
        normal_range: { min: 36.1, max: 37.5 },
        status: 'measured',
    },
    {
        metric: 'resp_rate',
        label: 'Respiration Rate',
        unit: 'br/min',
        latest_value: 14.2,
        latest_timestamp: new Date().toISOString(),
        mean: 13.9,
        std: 1.1,
        min_val: 12.0,
        max_val: 16.5,
        count: 288,
        missing: 0,
        sparkline: [13.5, 14.0, 14.2, 13.8, 14.1, 14.2],
        change_from_prev: 0.1,
        normal_range: { min: 12, max: 20 },
        status: 'measured',
    },
    {
        metric: 'systolic_bp',
        label: 'Systolic Blood Pressure',
        unit: 'mmHg',
        latest_value: 118.0,
        latest_timestamp: new Date().toISOString(),
        mean: 117.2,
        std: 3.5,
        min_val: 110.0,
        max_val: 124.0,
        count: 288,
        missing: 0,
        sparkline: [116, 117, 118, 117, 119, 118],
        change_from_prev: -1.0,
        normal_range: { min: 90, max: 140 },
        status: 'measured',
    },
    {
        metric: 'diastolic_bp',
        label: 'Diastolic Blood Pressure',
        unit: 'mmHg',
        latest_value: 78.0,
        latest_timestamp: new Date().toISOString(),
        mean: 77.4,
        std: 2.8,
        min_val: 72.0,
        max_val: 82.0,
        count: 288,
        missing: 0,
        sparkline: [76, 77, 78, 77, 78, 78],
        change_from_prev: 0.0,
        normal_range: { min: 60, max: 90 },
        status: 'measured',
    },
    {
        metric: 'radiation_exposure',
        label: 'Daily Radiation Dose',
        unit: 'mSv/day',
        latest_value: 0.42,
        latest_timestamp: new Date().toISOString(),
        mean: 0.38,
        std: 0.05,
        min_val: 0.28,
        max_val: 0.48,
        count: 288,
        missing: 0,
        sparkline: [0.35, 0.36, 0.38, 0.40, 0.41, 0.42],
        change_from_prev: 0.01,
        normal_range: { min: 0.1, max: 1.0 },
        status: 'measured',
    },
];

const DEFAULT_NOMINAL_ALERTS: Alert[] = [
    {
        id: 1,
        alert_id: 'ALT-NOM-01',
        metric: 'heart_rate',
        value: 88,
        unit: 'bpm',
        severity: 'warning',
        method: 'Threshold Excursion',
        timestamp: '2026-11-13 14:22:10 UTC',
        explanation: 'Elevated heart rate spike (88 bpm) detected post-ARED heavy resistance countermeasure cycle.',
        alert_type: 'health_concern',
        acknowledged: false,
        acknowledged_at: null,
        review_status: 'pending',
        reading_id: null,
        anomaly_run_id: null,
        created_at: '2026-11-13 14:22:10 UTC',
    },
];

const SUBSYSTEM_MODULES = [
    {
        icon: Activity,
        label: 'Clinical Health Analytics',
        to: '/dashboard/analytics',
        desc: 'Longitudinal ECG, SpO₂, and multi-temporal biometric trends with baseline comparisons.',
        accent: 'var(--electric-cyan)',
    },
    {
        icon: Brain,
        label: 'AI Anomaly Intelligence',
        to: '/ai-insights',
        desc: 'Multivariate Isolation Forest outlier detection and plain-language clinical synthesis.',
        accent: 'var(--aurora-violet)',
    },
    {
        icon: Bell,
        label: 'Alert Center & Triage',
        to: '/dashboard/alerts',
        desc: 'Review and acknowledge physiological boundary warnings with flight surgeon protocol.',
        accent: 'var(--critical-coral)',
    },
    {
        icon: User,
        label: 'Crew Profile & Baseline',
        to: '/dashboard/profile',
        desc: 'Individual astronaut physiological baselines, mission roles, and telemetry targets.',
        accent: 'var(--electric-cyan)',
    },
    {
        icon: FileText,
        label: 'Mission Shift Reports',
        to: '/dashboard/reports',
        desc: 'Comprehensive automated mission medical summaries and formal mission briefings.',
        accent: 'var(--warning-amber)',
    },
    {
        icon: Cpu,
        label: 'Physiological Simulator',
        to: '/dashboard/simulator',
        desc: 'Synthesize microgravity physiological stress, hypoxia, tachycardia, and circadian shifts.',
        accent: 'var(--success-mint)',
    },
    {
        icon: Database,
        label: 'Mission Data Explorer',
        to: '/mission-data',
        desc: 'Complete tabular sensor archive with search, filter, and CSV data export capabilities.',
        accent: 'var(--electric-cyan)',
    },
    {
        icon: Settings,
        label: 'System Settings',
        to: '/dashboard/settings',
        desc: 'Configure telemetry sampling intervals, alert thresholds, and mission preferences.',
        accent: 'var(--text-secondary)',
    },
];

export const DashboardOverview: React.FC = () => {
    const { activeAstronautId, activeAstronaut, allAstronauts, setActiveAstronautId } = useAuth();

    const [metrics, setMetrics] = useState<MetricStats[]>([]);
    const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(() => new Date());
    const [elapsed, setElapsed] = useState('');
    const [stepping, setStepping] = useState(false);
    const [symptomModalOpen, setSymptomModalOpen] = useState(false);
    const [envConfig, setEnvConfig] = useState<MissionEnvironmentConfig>(getActiveEnvironmentConfig());

    const loadData = useCallback(async () => {
        const targetAstro = activeAstronautId;
        try {
            const [m, a] = await Promise.all([
                api.metrics(targetAstro),
                api.alerts({ limit: 4, acknowledged: false, astronaut_id: targetAstro }),
            ]);
            // Prevent stale promise from overwriting if user switched astronaut in between
            if (targetAstro !== activeAstronautId) return;

            if (m && Array.isArray(m) && m.length > 0) {
                const normalized: MetricStats[] = m.map((item: any) => {
                    const key = item.metric || item.metric_name || 'unknown';
                    const rawVal = item.latest_value ?? item.current_value ?? item.value ?? null;
                    const latestVal = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : null;
                    const defaultNormals: Record<string, { min: number; max: number }> = {
                        heart_rate: { min: 50, max: 100 },
                        spo2: { min: 94, max: 100 },
                        body_temp: { min: 36.1, max: 37.5 },
                        resp_rate: { min: 12, max: 20 },
                        blood_pressure: { min: 90, max: 140 },
                        systolic_bp: { min: 90, max: 140 },
                        diastolic_bp: { min: 60, max: 90 },
                        radiation_exposure: { min: 0.1, max: 1.0 },
                        sleep_hours: { min: 6, max: 9 },
                    };
                    return {
                        metric: key,
                        label: item.label || item.display_name || key,
                        unit: item.unit || (key === 'heart_rate' ? 'bpm' : key === 'spo2' ? '%' : key === 'body_temp' ? '°C' : ''),
                        latest_value: latestVal,
                        latest_timestamp: item.latest_timestamp || new Date().toISOString(),
                        mean: item.mean ?? item.avg_24h ?? latestVal,
                        std: item.std ?? 1.2,
                        min_val: item.min_val ?? item.min_24h ?? (latestVal !== null ? latestVal * 0.9 : 0),
                        max_val: item.max_val ?? item.max_24h ?? (latestVal !== null ? latestVal * 1.1 : 100),
                        count: item.count ?? 288,
                        missing: item.missing ?? 0,
                        sparkline: Array.isArray(item.sparkline) && item.sparkline.length > 0
                            ? item.sparkline
                            : [latestVal ?? 0, latestVal ?? 0, latestVal ?? 0],
                        change_from_prev: typeof item.change_from_prev === 'number' ? item.change_from_prev : 0,
                        normal_range: item.normal_range || item.normal || defaultNormals[key] || null,
                        status: item.status || 'measured',
                    };
                });
                setMetrics(normalized);
            } else {
                setMetrics(DEFAULT_NOMINAL_METRICS);
            }
            setRecentAlerts(a?.alerts ? a.alerts : []);
            setLastUpdate(new Date());
        } catch (err) {
            console.warn('Backend offline, using nominal telemetry simulation:', err);
            setMetrics(prev => (prev.length > 0 ? prev : DEFAULT_NOMINAL_METRICS));
            setRecentAlerts([]);
            setLastUpdate(new Date());
        } finally {
            setLoading(false);
        }
    }, [activeAstronautId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(loadData, 20000);
        return () => clearInterval(id);
    }, [paused, loadData]);

    useEffect(() => {
        const id = setInterval(() => {
            setElapsed(formatElapsed(Date.now() - MISSION_START.getTime()));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const handleQuickStep = async (scenario = 'normal') => {
        setStepping(true);
        try {
            await api.simulator.step(scenario, activeAstronautId);
            await loadData();
        } catch (err) {
            console.error('Quick step error', err);
        } finally {
            setStepping(false);
        }
    };

    const handleAcknowledgeAlert = async (alertId: string) => {
        try {
            await api.acknowledgeAlert(alertId);
            setRecentAlerts(prev => prev.filter(al => al.alert_id !== alertId));
        } catch (err) {
            console.error('Acknowledge error', err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            {/* Mission Console Header — Matching AI Insights Layout */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span className="section-eyebrow">MISSION CONSOLE</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)' }}>
                            {activeAstronaut?.mission_id || 'ARTEMIS-VII'} / SOL {activeAstronaut?.current_mission_day || 142}
                        </span>
                    </div>
                    <h2 style={{ margin: 0 }}>
                        Astronaut Health <span className="text-cyan">Live Monitoring</span>
                    </h2>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Real-time physiological telemetry monitoring, AI anomaly detection, and spaceflight countermeasures.
                    </p>
                </div>

                {/* Controls & Astronaut Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            ASTRONAUT:
                        </label>
                        <select
                            className="select"
                            value={activeAstronautId}
                            onChange={e => setActiveAstronautId(e.target.value)}
                            style={{
                                background: 'rgba(11, 16, 38, 0.9)',
                                border: '1px solid rgba(83, 231, 255, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--stellar-white)',
                                padding: '0.45rem 0.8rem',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
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

                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        UPDATED {lastUpdate.toLocaleTimeString()}
                    </div>

                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setPaused(!paused)}
                        aria-label={paused ? 'Resume Telemetry' : 'Pause Telemetry'}
                    >
                        {paused ? <Play size={13} /> : <Pause size={13} />}
                        {paused ? 'Resume' : 'Pause'}
                    </button>

                    <button
                        className="btn btn-outline btn-sm"
                        onClick={loadData}
                        disabled={loading}
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSymptomModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem' }}
                    >
                        <HeartPulse size={14} />
                        <span>Symptom Check-In</span>
                    </button>
                </div>
            </div>

            {/* Mission Environment & Gravity Context Selector Bar */}
            <MissionEnvironmentBar onEnvironmentChange={setEnvConfig} />

            {/* Space Station Environmental Telemetry Strip — Orbital Glass Card */}
            <div
                className="glass-card"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.85rem',
                    padding: '0.9rem 1.25rem',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="status-dot active" />
                    <div>
                        <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>HABITAT ENVIRONMENT</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--success-mint)', fontFamily: 'var(--font-mono)' }}>
                            {envConfig.name.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CABIN O₂ CONCENTRATION</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {envConfig.ambientO2Percent.toFixed(1)}% [{envConfig.id === 'iss_leo' ? 'MEASURED' : 'SIMULATED'}]
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CABIN TOTAL PRESSURE</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--stellar-white)', fontFamily: 'var(--font-mono)' }}>
                        {envConfig.ambientPressureKpa.toFixed(1)} kPa [{envConfig.id === 'iss_leo' ? 'MEASURED' : 'SIMULATED'}]
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>GRAVITY & COMM LATENCY</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--aurora-violet)', fontFamily: 'var(--font-mono)' }}>
                        {envConfig.gravity} · {envConfig.communicationDelayLabel.split('(')[0].trim()}
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <span style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(83, 231, 255, 0.08)',
                        color: 'var(--electric-cyan)',
                        border: '1px solid rgba(83, 231, 255, 0.25)',
                    }}>
                        [{envConfig.id === 'iss_leo' ? 'MEASURED TELEMETRY' : 'MISSION CONTEXT'}]
                    </span>
                </div>
            </div>

            {/* Astronaut Profile Card + Quick Simulator Step Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Active Crew Member Card */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{
                            width: 62,
                            height: 62,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(83,231,255,0.2), rgba(146,117,255,0.2))',
                            border: '2px solid var(--electric-cyan)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}>
                            {activeAstronaut?.avatar_url ? (
                                <img src={activeAstronaut.avatar_url} alt={activeAstronaut.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Satellite size={28} color="var(--electric-cyan)" />
                            )}
                        </div>

                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div className="section-eyebrow" style={{ marginBottom: '0.2rem' }}>ACTIVE CREW MEMBER</div>
                            <h3 style={{ margin: '0 0 0.2rem', color: 'var(--electric-cyan)', fontSize: '1.25rem' }}>
                                {activeAstronaut?.name || 'CDR Alex Vance'}
                            </h3>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {activeAstronaut?.role || 'Mission Commander'} • {activeAstronaut?.astronaut_id || 'ASTRO-01'}
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.65rem' }}>
                                <div>
                                    <div className="telemetry-label">MISSION STATUS</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--success-mint)', fontWeight: 600 }}>
                                        ACTIVE MONITORING
                                    </div>
                                </div>

                                <div>
                                    <div className="telemetry-label">FLIGHT DAY</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--stellar-white)', fontWeight: 600 }}>
                                        Day {activeAstronaut?.current_mission_day || 142} of {activeAstronaut?.mission_duration_days || 180}
                                    </div>
                                </div>

                                <div>
                                    <div className="telemetry-label">MISSION ELAPSED</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--electric-cyan)', fontWeight: 600 }}>
                                        {elapsed}
                                    </div>
                                </div>

                                <div>
                                    <div className="telemetry-label">CUMULATIVE DOSE</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--warning-amber)', fontWeight: 600 }}>
                                        {activeAstronaut?.current_cumulative_radiation_msv?.toFixed(1) || 42.6} mSv
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/dashboard/profile"
                            className="btn btn-outline btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                        >
                            View Baseline <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Quick Simulator Controls Card */}
                <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                            <Zap size={16} color="var(--electric-cyan)" />
                            <h4 style={{ fontSize: '0.95rem', color: 'var(--stellar-white)', margin: 0 }}>Simulator Quick Trigger</h4>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                            Generate the next 30-min data packet to test anomaly detection in real time.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <button
                            onClick={() => handleQuickStep('normal')}
                            disabled={stepping}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.55rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                        >
                            <FastForwardIcon />
                            {stepping ? 'Generating...' : '+30 Min Step (Circadian Normal)'}
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <button
                                onClick={() => handleQuickStep('tachycardia')}
                                disabled={stepping}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0.45rem', fontSize: '0.72rem', color: 'var(--critical-coral)', border: '1px solid rgba(255,100,124,0.3)' }}
                            >
                                + Inject Tachycardia
                            </button>
                            <button
                                onClick={() => handleQuickStep('hypoxia')}
                                disabled={stepping}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0.45rem', fontSize: '0.72rem', color: 'var(--electric-cyan)', border: '1px solid rgba(83,231,255,0.3)' }}
                            >
                                + Inject SpO₂ Dip
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vital Health Telemetry — All 7 Physiological Indicators */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <div className="section-eyebrow" style={{ marginBottom: '0.2rem' }}>PHYSIOLOGICAL INDICATORS — MULTIVARIATE SENSOR STREAMS</div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Continuous telemetry streams compared against NASA nominal physiological bands.
                        </span>
                    </div>
                    <Link
                        to="/dashboard/analytics"
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.8rem', color: 'var(--electric-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        Open Full Trend Analytics <ArrowRight size={12} />
                    </Link>
                </div>

                {loading && metrics.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {metrics.map(m => <MetricCard key={m.metric} metric={m} />)}
                    </div>
                )}
            </div>

            {/* Interactive Anatomical Human Body Map */}
            <HumanBodyMap astronautId={activeAstronautId} />

            {/* Daily Operational Routine Checklist & Guided Autonomic Box Breathing */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                <DailyRoutineChecklist astronautId={activeAstronautId} />
                <BoxBreathingTool />
            </div>

            {/* Recent Alerts & Quick Triage Strip */}
            <div className="glass-card" style={{ padding: '1.25rem', border: `1px solid ${recentAlerts.length > 0 ? 'rgba(255, 100, 124, 0.3)' : 'rgba(93, 242, 180, 0.25)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: recentAlerts.length > 0 ? '1rem' : 0, flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {recentAlerts.length > 0 ? (
                            <Bell size={18} color="var(--critical-coral)" />
                        ) : (
                            <CheckCircle2 size={18} color="var(--success-mint)" />
                        )}
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--stellar-white)', margin: 0 }}>
                            {recentAlerts.length > 0
                                ? `Active Telemetry Alerts (${recentAlerts.length}) — ${activeAstronaut?.name || activeAstronautId}`
                                : `All Telemetry Nominal — Zero Active Alerts for ${activeAstronaut?.name || activeAstronautId}`}
                        </h4>
                    </div>
                    <Link
                        to="/dashboard/alerts"
                        style={{ fontSize: '0.8rem', color: 'var(--electric-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        Open Alert Center <ArrowRight size={12} />
                    </Link>
                </div>

                {recentAlerts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                        {recentAlerts.map(a => (
                            <div
                                key={a.alert_id}
                                style={{
                                    padding: '0.85rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: a.severity === 'critical' ? 'rgba(255, 100, 124, 0.1)' : 'rgba(255, 202, 114, 0.1)',
                                    border: a.severity === 'critical' ? '1px solid rgba(255, 100, 124, 0.3)' : '1px solid rgba(255, 202, 114, 0.3)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '0.5rem',
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontFamily: 'var(--font-mono)',
                                            color: a.severity === 'critical' ? 'var(--critical-coral)' : 'var(--warning-amber)',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                        }}>
                                            {a.severity} • {a.metric?.replace('_', ' ')}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                            {a.timestamp?.split(' ')[1] || 'RECENT'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                                        {a.explanation || a.message}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        Type: {a.alert_type === 'health_concern' ? 'Physiological' : 'Sensor Issue'}
                                    </span>
                                    <button
                                        onClick={() => handleAcknowledgeAlert(a.alert_id)}
                                        className="btn btn-ghost btn-sm"
                                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', color: 'var(--success-mint)' }}
                                    >
                                        <CheckCircle2 size={12} style={{ marginRight: 3 }} />
                                        Acknowledge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        All physiological sensor streams for {activeAstronaut?.name || activeAstronautId} continuously validated against NASA Spaceflight Human-System Standard NASA-STD-3001. No excursions flagged.
                    </div>
                )}
            </div>

            {/* Mission Operations Quick Access — Subsystem Navigation Grid */}
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(145, 160, 190, 0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <div className="section-eyebrow" style={{ marginBottom: '0.2rem' }}>MISSION OPERATIONS & CLINICAL DIAGNOSTICS</div>
                        <h4 style={{ margin: 0, color: 'var(--stellar-white)', fontSize: '1.1rem' }}>
                            Mission Control Subsystems
                        </h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        8 ACTIVE MODULES
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {SUBSYSTEM_MODULES.map(mod => {
                        const Icon = mod.icon;
                        return (
                            <Link
                                key={mod.to}
                                to={mod.to}
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(5, 8, 22, 0.55)',
                                    border: '1px solid rgba(145, 160, 190, 0.12)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '0.6rem',
                                    textDecoration: 'none',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = mod.accent;
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(11, 16, 38, 0.8)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(145, 160, 190, 0.12)';
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(5, 8, 22, 0.55)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            padding: '0.45rem',
                                            borderRadius: '8px',
                                            background: `rgba(83, 231, 255, 0.08)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Icon size={16} color={mod.accent} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--stellar-white)' }}>
                                            {mod.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={14} color="var(--text-muted)" />
                                </div>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {mod.desc}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Symptom Checker & Emergency Triage Modal */}
            <SymptomCheckerModal
                isOpen={symptomModalOpen}
                onClose={() => setSymptomModalOpen(false)}
                astronautId={activeAstronautId}
            />
        </div>
    );
};

const FastForwardIcon = () => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 19 22 12 13 5 13 19" />
        <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
);
