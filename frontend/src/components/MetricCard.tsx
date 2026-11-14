import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MetricStats } from '@/types';

interface MetricCardProps {
    metric: MetricStats;
    onClick?: () => void;
}

function getStatusColor(metric: string, value: number | null, range: { min: number; max: number } | null): string {
    if (value === null || !range) return 'var(--text-muted)';
    if (value < range.min || value > range.max) return 'var(--critical-coral)';
    const buffer = (range.max - range.min) * 0.12;
    if (value < range.min + buffer || value > range.max - buffer) return 'var(--warning-amber)';
    return 'var(--success-mint)';
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const val = payload[0]?.value;
        return (
            <div style={{
                background: 'rgba(11,16,38,0.95)',
                border: '1px solid rgba(83,231,255,0.2)',
                borderRadius: 8, padding: '6px 10px',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: 'var(--electric-cyan)',
            }}>
                {typeof val === 'number' && !isNaN(val) ? val.toFixed(1) : 'Unavailable'}
            </div>
        );
    }
    return null;
};

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
    const rawVal = metric?.latest_value ?? (metric as any)?.current_value ?? (metric as any)?.value ?? null;
    const latest_value = typeof rawVal === 'number' && !isNaN(rawVal) ? rawVal : null;
    const label = metric?.label || (metric as any)?.display_name || metric?.metric || 'Metric';
    const unit = metric?.unit || '';
    const rawChange = metric?.change_from_prev;
    const change_from_prev = typeof rawChange === 'number' && !isNaN(rawChange) ? rawChange : null;
    const sparkline = metric?.sparkline || [];
    const normal_range = metric?.normal_range || (metric as any)?.normal || null;
    const latest_timestamp = metric?.latest_timestamp || null;
    const count = metric?.count ?? 288;
    const status = metric?.status || (latest_value !== null ? 'measured' : 'unavailable');

    const isUnavailable = latest_value === null;
    const metricKey = metric?.metric || (metric as any)?.metric_name || '';
    const statusColor = isUnavailable ? 'var(--text-muted)' : getStatusColor(metricKey, latest_value, normal_range);
    const sparkData = (sparkline || []).map((v, i) => ({ i, v: typeof v === 'number' ? v : 0 }));

    const changeIcon = change_from_prev === null ? null
        : change_from_prev > 0 ? <TrendingUp size={13} />
            : change_from_prev < 0 ? <TrendingDown size={13} />
                : <Minus size={13} />;

    const changeColor = change_from_prev === null ? 'var(--text-muted)'
        : Math.abs(change_from_prev) > 5 ? 'var(--warning-amber)'
            : 'var(--text-mint)';

    // Source badge style
    const badgeText = isUnavailable ? 'UNAVAILABLE' : (status === 'measured' ? 'MEASURED' : 'SIMULATED');
    const badgeBg = isUnavailable ? 'rgba(145,160,190,0.15)' : (status === 'measured' ? 'rgba(93,242,180,0.12)' : 'rgba(83,231,255,0.1)');
    const badgeColor = isUnavailable ? 'var(--text-muted)' : (status === 'measured' ? 'var(--success-mint)' : 'var(--electric-cyan)');
    const badgeBorder = isUnavailable ? 'rgba(145,160,190,0.2)' : (status === 'measured' ? 'rgba(93,242,180,0.3)' : 'rgba(83,231,255,0.25)');

    return (
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}>
            {/* Corner accent glow */}
            <div style={{
                position: 'absolute', top: 0, right: 0, width: 70, height: 70,
                background: `radial-gradient(circle at top right, ${statusColor}18, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Header with Title and Measured/Simulated/Unavailable badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                    <div className="telemetry-label" style={{ marginBottom: '0.25rem', fontSize: '0.82rem', fontWeight: 600 }}>{label}</div>
                    {latest_timestamp && (
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {new Date(latest_timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                        fontSize: '0.62rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                        letterSpacing: '0.05em',
                        fontWeight: 600,
                    }}>
                        [{badgeText}]
                    </span>
                    <div style={{
                        width: 9, height: 9, borderRadius: '50%',
                        background: statusColor, flexShrink: 0,
                        boxShadow: `0 0 8px ${statusColor}80`,
                    }} />
                </div>
            </div>

            {/* Value Display */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.25rem 0' }}>
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '2.1rem', fontWeight: 600,
                    color: isUnavailable ? 'var(--text-muted)' : statusColor, lineHeight: 1,
                    letterSpacing: '-0.02em',
                }}>
                    {latest_value !== null ? latest_value.toFixed(1) : '—'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{unit}</span>
            </div>

            {/* Sparkline mini-graph */}
            {sparkData.length > 2 && (
                <div style={{ height: 42, margin: '0 -0.5rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparkData}>
                            <Line
                                type="monotone" dataKey="v" stroke={statusColor}
                                strokeWidth={1.8} dot={false} isAnimationActive={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Change & Record Count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: changeColor }}>
                    {changeIcon}
                    {change_from_prev !== null ? `${change_from_prev > 0 ? '+' : ''}${change_from_prev.toFixed(1)} ${unit}` : '—'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    {count} records
                </div>
            </div>

            {/* Reference Range Bar */}
            {normal_range && latest_value !== null && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        <span>REF: {normal_range.min}–{normal_range.max} {unit}</span>
                        <span style={{ color: statusColor, textTransform: 'uppercase', fontWeight: 600 }}>
                            {statusColor === 'var(--success-mint)' ? 'NOMINAL' :
                                statusColor === 'var(--warning-amber)' ? 'REVIEW' : 'FLAGGED'}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{
                            width: `${Math.min(100, Math.max(0, ((latest_value - normal_range.min) / ((normal_range.max - normal_range.min) || 1)) * 100))}%`,
                            background: statusColor,
                        }} />
                    </div>
                </div>
            )}

            <Link
                to="/dashboard/analytics"
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '0.72rem', color: 'var(--electric-cyan)', opacity: 0.8,
                    textDecoration: 'none', transition: 'opacity 150ms', marginTop: '0.2rem',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
            >
                View trend analysis <ArrowRight size={11} />
            </Link>
        </div>
    );
};
