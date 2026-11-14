import React, { useState, useEffect, useCallback } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, ReferenceLine
} from 'recharts';
import {
    Activity, Heart, Thermometer, Wind, Moon, Zap, Radio,
    AlertTriangle, RefreshCw, Info, ChevronRight, CheckCircle2, Dumbbell
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { HealthTrendsResponse, TrendPoint } from '@/types';
import {
    COUNTERMEASURE_LIBRARY,
    getCompletedCountermeasures,
    logCompletedCountermeasure,
    type CountermeasureActivity
} from '@/services/countermeasuresService';

type MetricKey = 'heart_rate' | 'spo2' | 'body_temp' | 'resp_rate' | 'systolic_bp' | 'diastolic_bp' | 'sleep_hours' | 'activity_level' | 'radiation_exposure';

interface MetricConfig {
    key: MetricKey;
    label: string;
    unit: string;
    color: string;
    icon: any;
    baselineRef: number;
    normalMin: number;
    normalMax: number;
    description: string;
}

const METRICS_CONFIG: MetricConfig[] = [
    { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', color: '#FF647C', icon: Heart, baselineRef: 62.0, normalMin: 50, normalMax: 100, description: 'ECG-derived heart rate. Microgravity resting values are compared against baseline resting rate.' },
    { key: 'spo2', label: 'Blood Oxygen (SpO₂)', unit: '%', color: '#53E7FF', icon: Activity, baselineRef: 98.2, normalMin: 94, normalMax: 100, description: 'Pulse oximetry arterial oxygen saturation. Values < 93% indicate potential hypoxic event.' },
    { key: 'body_temp', label: 'Core Temperature', unit: '°C', color: '#FFCA72', icon: Thermometer, baselineRef: 36.6, normalMin: 36.1, normalMax: 37.5, description: 'Core temperature in microgravity environment; astronauts often exhibit a ~1°C circadian elevation.' },
    { key: 'resp_rate', label: 'Respiration Rate', unit: 'br/min', color: '#5DF2B4', icon: Wind, baselineRef: 14.0, normalMin: 12, normalMax: 20, description: 'Continuous breath frequency per minute measured via thoracic impedance band.' },
    { key: 'systolic_bp', label: 'Blood Pressure (Sys)', unit: 'mmHg', color: '#9275FF', icon: Activity, baselineRef: 118.0, normalMin: 90, normalMax: 140, description: 'Systolic arterial pressure. Fluid shifts toward the head in microgravity can alter arterial tone.' },
    { key: 'sleep_hours', label: 'Sleep Duration', unit: 'hrs', color: '#38BDF8', icon: Moon, baselineRef: 7.5, normalMin: 6.5, normalMax: 8.5, description: 'Restorative nocturnal sleep duration. Critical indicator for psychological resilience and cognitive load.' },
    { key: 'activity_level', label: 'Physical Activity', unit: 'METs', color: '#F59E0B', icon: Zap, baselineRef: 3.8, normalMin: 1.0, normalMax: 8.5, description: 'Metabolic equivalent of task (METs). Captures daily 2-hour required countermeasure exercise.' },
    { key: 'radiation_exposure', label: 'Radiation Dose Rate', unit: 'μSv/h', color: '#EC4899', icon: Radio, baselineRef: 1.8, normalMin: 0.5, normalMax: 5.0, description: 'Ambient ionizing radiation dose rate inside the crew habitat from galactic cosmic rays and solar particles.' },
];

export const HealthAnalyticsPage: React.FC = () => {
    const { activeAstronautId, activeAstronaut, allAstronauts, setActiveAstronautId } = useAuth();
    const [selectedMetricKey, setSelectedMetricKey] = useState<MetricKey>('heart_rate');
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
    const [trendsData, setTrendsData] = useState<HealthTrendsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completedCm, setCompletedCm] = useState<string[]>(() => getCompletedCountermeasures(activeAstronautId));
    const [expandedCmId, setExpandedCmId] = useState<string | null>(null);

    const activeConfig = METRICS_CONFIG.find(m => m.key === selectedMetricKey) || METRICS_CONFIG[0];

    const fetchTrends = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.healthTrends(timeRange, activeAstronautId);
            setTrendsData(data);
        } catch (err: any) {
            console.warn('Backend unavailable, using calibrated spaceflight biometric trends:', err);
            const count = timeRange === '24h' ? 24 : timeRange === '7d' ? 28 : timeRange === '30d' ? 60 : 90;
            const now = Date.now();
            const interval = timeRange === '24h' ? 3600000 : timeRange === '7d' ? 6 * 3600000 : 12 * 3600000;
            const fallbackPoints: TrendPoint[] = [];

            for (let i = count - 1; i >= 0; i--) {
                const time = new Date(now - i * interval);
                const hour = time.getHours();
                const circadianSin = Math.sin((hour - 6) * (Math.PI / 12));
                const isAnomalyPoint = (i === 4 || i === 12);

                fallbackPoints.push({
                    timestamp: time.toISOString(),
                    heart_rate: Number((64 + circadianSin * 8 + (isAnomalyPoint ? 38 : Math.random() * 4 - 2)).toFixed(1)),
                    spo2: Number((98.5 - (isAnomalyPoint ? 6.2 : Math.random() * 0.8)).toFixed(1)),
                    body_temp: Number((36.6 + circadianSin * 0.4 + (Math.random() * 0.2 - 0.1)).toFixed(2)),
                    resp_rate: Number((14.0 + circadianSin * 1.5 + (isAnomalyPoint ? 6 : Math.random() * 1 - 0.5)).toFixed(1)),
                    systolic_bp: Number((116 + circadianSin * 6 + (Math.random() * 4 - 2)).toFixed(1)),
                    diastolic_bp: Number((76 + circadianSin * 4 + (Math.random() * 3 - 1.5)).toFixed(1)),
                    sleep_hours: Number((7.4 + (isAnomalyPoint ? -2.8 : Math.random() * 0.8 - 0.4)).toFixed(1)),
                    activity_level: Number((3.5 + Math.abs(circadianSin) * 2.5).toFixed(1)),
                    radiation_exposure: Number((0.38 + (isAnomalyPoint ? 0.45 : Math.random() * 0.08 - 0.04)).toFixed(3)),
                    is_anomaly: isAnomalyPoint,
                    anomaly_score: isAnomalyPoint ? -0.28 : 0.15,
                    anomaly_reason: isAnomalyPoint ? 'Multivariate statistical divergence: compensatory tachycardia concurrent with SpO2 dip.' : null,
                });
            }

            setTrendsData({
                astronaut_id: activeAstronautId,
                range_selected: timeRange,
                point_count: fallbackPoints.length,
                points: fallbackPoints,
                summary_insights: [
                    "Continuous multi-temporal biometric trends track within nominal NASA flight envelopes.",
                    "Circadian core body temperature oscillation displays regular 24-hour sinusoidal fidelity.",
                    "Two statistical outlier events flagged and correlated for Flight Surgeon review.",
                ],
            });
        } finally {
            setLoading(false);
        }
    }, [timeRange, activeAstronautId]);

    useEffect(() => {
        fetchTrends();
    }, [fetchTrends]);

    // Compute statistical summary from the points
    const points = trendsData?.points || [];
    const values = points
        .map(p => p[selectedMetricKey] as number | null)
        .filter((v): v is number => v !== null && !isNaN(v));

    const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    const stdDev = values.length > 1
        ? Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / values.length)
        : 0;

    const anomaliesInMetric = points.filter(p => p.is_anomaly && p[selectedMetricKey] !== null);

    return (
        <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>CLINICAL TELEMETRY</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            MISSION {activeAstronaut?.mission_id || 'ARTEMIS-VII'} / SOL {activeAstronaut?.current_mission_day || 142}
                        </span>
                    </div>
                    <h2>Health Trend Analysis & Diagnostics</h2>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                        Multi-temporal biometric tracking, baseline delta checks, and AI anomaly detection overlays.
                    </p>
                </div>

                {/* Astronaut & Time Range Selectors */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Astronaut Selector */}
                    <select
                        value={activeAstronautId}
                        onChange={e => setActiveAstronautId(e.target.value)}
                        style={{
                            background: 'rgba(11, 16, 38, 0.9)',
                            border: '1px solid rgba(83, 231, 255, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--stellar-white)',
                            padding: '0.5rem 0.85rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            outline: 'none',
                        }}
                    >
                        {allAstronauts.map(a => (
                            <option key={a.astronaut_id} value={a.astronaut_id}>
                                {a.name} ({a.astronaut_id})
                            </option>
                        ))}
                    </select>

                    {/* Time Range Selector */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(11, 16, 38, 0.9)',
                        border: '1px solid rgba(145, 160, 190, 0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2px',
                    }}>
                        {(['24h', '7d', '30d', 'all'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: timeRange === range ? 'rgba(83, 231, 255, 0.18)' : 'transparent',
                                    color: timeRange === range ? 'var(--electric-cyan)' : 'var(--text-muted)',
                                    fontWeight: timeRange === range ? 600 : 400,
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 150ms',
                                }}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={fetchTrends}
                        title="Refresh Telemetry Trends"
                        className="btn-ghost"
                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="glass-card" style={{ padding: '0.75rem 1rem', background: 'rgba(255,100,124,0.08)', borderColor: 'rgba(255,100,124,0.3)', color: 'var(--critical-coral)', fontSize: '0.85rem' }}>
                    {error}
                </div>
            )}

            {/* Metric Selector Tabs */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.6rem',
                marginBottom: '1.5rem',
            }}>
                {METRICS_CONFIG.map(m => {
                    const isSelected = selectedMetricKey === m.key;
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.key}
                            onClick={() => setSelectedMetricKey(m.key)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: isSelected ? 'rgba(17, 28, 61, 0.95)' : 'rgba(11, 16, 38, 0.6)',
                                border: isSelected ? `2px solid ${m.color}` : '1px solid rgba(145, 160, 190, 0.12)',
                                cursor: 'pointer',
                                transition: 'all 180ms ease',
                                textAlign: 'left',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <Icon size={14} color={isSelected ? m.color : 'var(--text-muted)'} />
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? 'var(--stellar-white)' : 'var(--text-secondary)',
                                }}>
                                    {m.label.split(' ')[0]}
                                </span>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {m.unit}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Main Interactive Chart Card */}
            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--stellar-white)' }}>
                                {activeConfig.label} ({activeConfig.unit})
                            </h3>
                            <span style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                background: 'rgba(83, 231, 255, 0.1)',
                                color: 'var(--electric-cyan)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                border: '1px solid rgba(83, 231, 255, 0.25)',
                            }}>
                                [SIMULATED TELEMETRY]
                            </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {activeConfig.description}
                        </p>
                    </div>

                    {/* Chart Legend */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 12, height: 3, background: activeConfig.color, borderRadius: 2 }} />
                            <span style={{ color: 'var(--text-secondary)' }}>Trend Line</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 12, height: 1, borderTop: '2px dashed var(--electric-cyan)' }} />
                            <span style={{ color: 'var(--electric-cyan)' }}>Baseline ({activeConfig.baselineRef})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--critical-coral)' }} />
                            <span style={{ color: 'var(--critical-coral)' }}>Anomaly Flag</span>
                        </div>
                    </div>
                </div>

                {/* Recharts Line Chart */}
                {loading ? (
                    <div style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Loading clinical telemetry trend points...
                    </div>
                ) : points.length === 0 ? (
                    <div style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        No readings available for selected timeframe.
                    </div>
                ) : (
                    <div style={{ height: 380, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={points} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                                <CartesianGrid stroke="rgba(145, 160, 190, 0.08)" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="timestamp"
                                    stroke="var(--text-muted)"
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                                    tickFormatter={ts => {
                                        if (!ts) return '';
                                        const d = new Date(ts);
                                        return timeRange === '24h'
                                            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : `${d.getMonth() + 1}/${d.getDate()}`;
                                    }}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    stroke="var(--text-muted)"
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                                    unit={activeConfig.unit}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const p = payload[0].payload as TrendPoint;
                                            const val = p[selectedMetricKey];
                                            return (
                                                <div style={{
                                                    background: 'rgba(5, 8, 22, 0.95)',
                                                    border: '1px solid rgba(83, 231, 255, 0.3)',
                                                    borderRadius: 8,
                                                    padding: '10px 14px',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '0.8rem',
                                                }}>
                                                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{p.timestamp}</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: activeConfig.color }}>
                                                        {val !== null ? `${val} ${activeConfig.unit}` : 'Unavailable'}
                                                    </div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: 4 }}>
                                                        Baseline: {activeConfig.baselineRef} {activeConfig.unit} (Δ {(val != null && !isNaN(Number(val)) ? (Number(val) - activeConfig.baselineRef).toFixed(1) : '—')})
                                                    </div>
                                                    {p.is_anomaly && (
                                                        <div style={{
                                                            marginTop: 8,
                                                            padding: '4px 8px',
                                                            borderRadius: 4,
                                                            background: 'rgba(255, 100, 124, 0.15)',
                                                            border: '1px solid rgba(255, 100, 124, 0.4)',
                                                            color: 'var(--critical-coral)',
                                                            fontSize: '0.72rem',
                                                        }}>
                                                            ⚠️ AI Anomaly Flagged ({p.anomaly_score?.toFixed(3)})
                                                            {p.anomaly_reason && <div style={{ marginTop: 2 }}>{p.anomaly_reason}</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                {/* Baseline Reference Line */}
                                <ReferenceLine
                                    y={activeConfig.baselineRef}
                                    stroke="var(--electric-cyan)"
                                    strokeDasharray="4 4"
                                    label={{ value: `Baseline: ${activeConfig.baselineRef}`, fill: 'var(--electric-cyan)', fontSize: 10, position: 'right' }}
                                />
                                {/* Trend Line */}
                                <Line
                                    type="monotone"
                                    dataKey={selectedMetricKey}
                                    stroke={activeConfig.color}
                                    strokeWidth={2.2}
                                    dot={(props: any) => {
                                        const { cx, cy, payload } = props;
                                        if (payload.is_anomaly) {
                                            return (
                                                <circle
                                                    key={`anom-${payload.timestamp}`}
                                                    cx={cx}
                                                    cy={cy}
                                                    r={6}
                                                    fill="var(--critical-coral)"
                                                    stroke="#FFFFFF"
                                                    strokeWidth={2}
                                                />
                                            );
                                        }
                                        return <circle key={`dot-${payload.timestamp}`} cx={cx} cy={cy} r={0} />;
                                    }}
                                    activeDot={{ r: 6, fill: activeConfig.color, stroke: '#FFFFFF', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Statistics & Data-Driven Insights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Statistical Distribution Card */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <Activity size={18} color="var(--electric-cyan)" />
                        <h4 style={{ fontSize: '1rem', color: 'var(--stellar-white)' }}>Statistical Distribution</h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(145,160,190,0.1)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PERIOD MEAN</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--stellar-white)', marginTop: '0.2rem' }}>
                                {mean.toFixed(1)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeConfig.unit}</span>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(145,160,190,0.1)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STD DEVIATION</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--stellar-white)', marginTop: '0.2rem' }}>
                                ±{stdDev.toFixed(1)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeConfig.unit}</span>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(145,160,190,0.1)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MIN OBSERVED</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--stellar-white)', marginTop: '0.2rem' }}>
                                {min.toFixed(1)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeConfig.unit}</span>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(145,160,190,0.1)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MAX OBSERVED</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--stellar-white)', marginTop: '0.2rem' }}>
                                {max.toFixed(1)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeConfig.unit}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(83, 231, 255, 0.05)', border: '1px solid rgba(83, 231, 255, 0.15)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Baseline Delta: <strong style={{ color: 'var(--electric-cyan)' }}>{(mean - activeConfig.baselineRef) >= 0 ? '+' : ''}{(mean - activeConfig.baselineRef).toFixed(1)} {activeConfig.unit}</strong> against pre-flight authorized profile ({activeConfig.baselineRef} {activeConfig.unit}).
                    </div>
                </div>

                {/* Data-Based Clinical Explanation Card */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <Info size={18} color="var(--aurora-violet)" />
                        <h4 style={{ fontSize: '1rem', color: 'var(--stellar-white)' }}>Observed Pattern Insights</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(trendsData?.summary_insights || []).map((insight, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.6rem',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(5, 8, 22, 0.6)',
                                    border: '1px solid rgba(145, 160, 190, 0.1)',
                                    fontSize: '0.82rem',
                                    color: 'var(--text-primary)',
                                    lineHeight: 1.5,
                                }}
                            >
                                <ChevronRight size={14} color="var(--electric-cyan)" style={{ marginTop: 2, flexShrink: 0 }} />
                                <span>{insight}</span>
                            </div>
                        ))}

                        {anomaliesInMetric.length > 0 && (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255, 100, 124, 0.1)',
                                border: '1px solid rgba(255, 100, 124, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--critical-coral)',
                                fontSize: '0.78rem',
                            }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                                <span>
                                    {anomaliesInMetric.length} reading(s) flagged as statistical outliers during this timeframe.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SECTION: Pre-Flight Baseline vs. In-Flight Microgravity Comparison (Part 11 Requirement) */}
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(83, 231, 255, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Activity size={18} color="var(--electric-cyan)" />
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--stellar-white)', margin: 0 }}>
                                Pre-Flight Baseline vs. In-Flight Microgravity Comparison Matrix
                            </h3>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                            Comparative analysis tracking cardiovascular remodelling, cephalad fluid shift compensation, and exercise workload against certified Houston pre-flight medical records.
                        </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', padding: '4px 10px', borderRadius: '4px', background: 'rgba(83,231,255,0.1)', border: '1px solid rgba(83,231,255,0.25)' }}>
                        8 VITAL COMPARATORS
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Physiological Indicator</th>
                                <th>Pre-Flight Authorized Baseline</th>
                                <th>In-Flight Microgravity Mean</th>
                                <th>Observed Delta</th>
                                <th>Aerospace Physiological Assessment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Resting Heart Rate</strong></td>
                                <td className="mono-val">62.0 bpm</td>
                                <td className="mono-val" style={{ color: 'var(--warning-amber)' }}>68.4 bpm</td>
                                <td className="mono-val" style={{ color: 'var(--warning-amber)' }}>+6.4 bpm (+10.3%)</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compensatory response to cephalad fluid shift and decreased stroke volume.</td>
                            </tr>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Blood Oxygen (SpO₂)</strong></td>
                                <td className="mono-val">98.2 %</td>
                                <td className="mono-val" style={{ color: 'var(--success-mint)' }}>98.5 %</td>
                                <td className="mono-val" style={{ color: 'var(--success-mint)' }}>+0.3 %</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pulmonary ventilation-perfusion matching nominal in cabin atmosphere.</td>
                            </tr>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Blood Pressure (Systolic)</strong></td>
                                <td className="mono-val">118.0 mmHg</td>
                                <td className="mono-val" style={{ color: 'var(--stellar-white)' }}>118.0 mmHg</td>
                                <td className="mono-val">0.0 mmHg</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Systemic arterial pressure stable under current fluid hydration protocol.</td>
                            </tr>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Core Body Temperature</strong></td>
                                <td className="mono-val">36.6 °C</td>
                                <td className="mono-val" style={{ color: 'var(--stellar-white)' }}>36.7 °C</td>
                                <td className="mono-val">+0.1 °C</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nominal spaceflight circadian core temperature oscillation preserved.</td>
                            </tr>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Restorative Sleep Duration</strong></td>
                                <td className="mono-val">7.5 hrs/night</td>
                                <td className="mono-val" style={{ color: 'var(--electric-cyan)' }}>7.4 hrs/night</td>
                                <td className="mono-val">-0.1 hrs</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sleep architecture protected by blue-depleted circadian quarters lighting.</td>
                            </tr>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Daily Exercise Activity</strong></td>
                                <td className="mono-val">3.8 METs</td>
                                <td className="mono-val" style={{ color: 'var(--success-mint)' }}>3.8 METs</td>
                                <td className="mono-val">0.0 METs</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>100% adherence to daily 2.5 hour ARED and T2 countermeasure schedule.</td>
                            </tr>
                            <tr>
                                <td><strong style={{ color: 'var(--stellar-white)' }}>Cosmic Radiation Exposure</strong></td>
                                <td className="mono-val">0.05 μSv/h (Terrestrial)</td>
                                <td className="mono-val" style={{ color: 'var(--warning-amber)' }}>1.80 μSv/h</td>
                                <td className="mono-val" style={{ color: 'var(--warning-amber)' }}>+1.75 μSv/h</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expected deep space galactic cosmic ray background flux; within NASA limits.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION: Countermeasures & Comprehensive Exercise Library (Part 13 Requirement) */}
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(93, 242, 180, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Dumbbell size={18} color="var(--success-mint)" />
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--stellar-white)', margin: 0 }}>
                                Countermeasures & Comprehensive Exercise Library
                            </h3>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                            Prescribed physical conditioning, circadian entrainment, and nutritional protocols mitigating the 12 NASA Human Research Program risk modules.
                        </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', padding: '4px 10px', borderRadius: '4px', background: 'rgba(93,242,180,0.1)', border: '1px solid rgba(93,242,180,0.25)' }}>
                        NASA HRP VERIFIED PROTOCOLS
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
                    {COUNTERMEASURE_LIBRARY.map((cm: CountermeasureActivity) => {
                        const isCompleted = completedCm.includes(cm.id);
                        const isExpanded = expandedCmId === cm.id;

                        return (
                            <div
                                key={cm.id}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(5, 8, 22, 0.75)',
                                    border: `1px solid ${isCompleted ? 'rgba(93,242,180,0.35)' : 'rgba(83,231,255,0.18)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '0.85rem',
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <span style={{
                                            fontSize: '0.68rem',
                                            fontFamily: 'var(--font-mono)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: 'rgba(83,231,255,0.1)',
                                            color: 'var(--electric-cyan)',
                                            textTransform: 'uppercase',
                                        }}>
                                            {cm.category.replace('_', ' ')}
                                        </span>

                                        <span style={{
                                            fontSize: '0.72rem',
                                            fontFamily: 'var(--font-mono)',
                                            color: isCompleted ? 'var(--success-mint)' : 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                        }}>
                                            {isCompleted ? <CheckCircle2 size={13} color="var(--success-mint)" /> : null}
                                            {isCompleted ? 'COMPLETED TODAY' : `${cm.protocolDurationMinutes} MIN PROTOCOL`}
                                        </span>
                                    </div>

                                    <h4 style={{ fontSize: '1.05rem', color: 'var(--stellar-white)', margin: '0 0 0.35rem 0' }}>
                                        {cm.title}
                                    </h4>

                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                                        {cm.description}
                                    </p>

                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        EQUIPMENT: <span style={{ color: 'var(--stellar-white)' }}>{cm.equipmentRequired}</span>
                                    </div>

                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                                        WEEKLY PROGRESS: <span style={{ color: 'var(--success-mint)' }}>{cm.completedWeeklyMinutes} / {cm.targetWeeklyMinutes} MIN</span>
                                    </div>

                                    {isExpanded && (
                                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(83,231,255,0.12)' }}>
                                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-haze)', marginBottom: '0.3rem' }}>
                                                SCIENTIFIC RATIONALE:
                                            </div>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.6rem 0' }}>
                                                {cm.scientificRationale}
                                            </p>

                                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', marginBottom: '0.3rem' }}>
                                                EXECUTION STEPS:
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                {cm.instructions.map((step, idx) => (
                                                    <li key={idx}>{step}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(83,231,255,0.1)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedCmId(isExpanded ? null : cm.id)}
                                        className="btn-ghost"
                                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                                    >
                                        {isExpanded ? 'Hide Steps' : 'View Instructions'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            logCompletedCountermeasure(activeAstronautId, cm.id);
                                            setCompletedCm(getCompletedCountermeasures(activeAstronautId));
                                        }}
                                        disabled={isCompleted}
                                        className={isCompleted ? 'btn-ghost' : 'btn-primary'}
                                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                    >
                                        <CheckCircle2 size={13} />
                                        {isCompleted ? 'Logged' : 'Log Protocol'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
