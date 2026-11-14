import React, { useEffect, useState } from 'react';
import { Zap, Database, Brain, Bell } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface TimelineEvent {
    id: string;
    time: string;
    label: string;
    type: 'data' | 'analysis' | 'alert' | 'import' | 'system';
    detail: string;
    icon: React.ElementType;
    color: string;
}

export const MissionTimelinePage: React.FC = () => {
    const { activeAstronautId, setActiveAstronautId, allAstronauts, activeAstronaut } = useAuth();
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buildTimeline = async () => {
            const timeline: TimelineEvent[] = [
                {
                    id: 'sys-init',
                    time: '2025-01-01 00:00:00',
                    label: 'System Initialized',
                    type: 'system',
                    detail: `AstroCare mission telemetry active for ${activeAstronaut?.name || activeAstronautId}. Continuous vitals streaming operational.`,
                    icon: Zap,
                    color: 'var(--muted-blue-gray)',
                },
            ];

            try {
                const dataInfo = await api.datasetInfo();
                if (dataInfo.date_range?.start) {
                    timeline.push({
                        id: 'data-loaded',
                        time: dataInfo.date_range.start,
                        label: 'Simulated Dataset Loaded',
                        type: 'data',
                        detail: `${dataInfo.total_records.toLocaleString()} simulated physiological readings loaded for ${activeAstronaut?.name || activeAstronautId}.`,
                        icon: Database,
                        color: 'var(--electric-cyan)',
                    });
                }
                if (dataInfo.date_range?.end) {
                    timeline.push({
                        id: 'data-end',
                        time: dataInfo.date_range.end,
                        label: 'Dataset Coverage End',
                        type: 'data',
                        detail: 'Last reading in current dataset.',
                        icon: Database,
                        color: 'var(--electric-cyan)',
                    });
                }
            } catch { }

            try {
                const anomalies = await api.anomalies(undefined, true, 10, activeAstronautId);
                if (anomalies.length > 0) {
                    const first = anomalies[anomalies.length - 1];
                    timeline.push({
                        id: 'anomaly-run',
                        time: first.created_at || first.timestamp,
                        label: `Anomaly Analysis Run`,
                        type: 'analysis',
                        detail: `${anomalies.length} anomalies detected for ${activeAstronautId} by ${first.method || 'model'}. Run ID: ${first.run_id || 'N/A'}.`,
                        icon: Brain,
                        color: 'var(--aurora-violet)',
                    });
                    anomalies.slice(0, 3).forEach(a => {
                        timeline.push({
                            id: `anom-${a.id}`,
                            time: a.timestamp,
                            label: `Anomaly Detected: ${a.metric?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}`,
                            type: 'alert',
                            detail: a.reason || `Unusual ${a.metric} value: ${a.value?.toFixed(2)} ${a.unit || ''}`,
                            icon: Bell,
                            color: 'var(--warning-amber)',
                        });
                    });
                }
            } catch { }

            try {
                const alerts = await api.alerts({ limit: 5, astronaut_id: activeAstronautId });
                for (const alert of alerts.alerts.slice(0, 3)) {
                    if (!timeline.some(e => e.time === alert.timestamp)) {
                        timeline.push({
                            id: `alert-${alert.alert_id}`,
                            time: alert.timestamp,
                            label: `${alert.severity.toUpperCase()} Alert — ${alert.metric?.replace('_', ' ') || 'System'}`,
                            type: 'alert',
                            detail: alert.explanation || 'See Alert Center for details.',
                            icon: Bell,
                            color: alert.severity === 'critical' ? 'var(--critical-coral)' : 'var(--warning-amber)',
                        });
                    }
                }
            } catch { }

            timeline.sort((a, b) => a.time.localeCompare(b.time));
            setEvents(timeline);
            setLoading(false);
        };

        buildTimeline();
    }, [activeAstronautId, activeAstronaut]);

    return (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="section-eyebrow" style={{ marginBottom: '0.4rem' }}>MISSION TIMELINE</div>
                    <h2 style={{ margin: 0 }}>Mission <span className="text-cyan">Event Track</span></h2>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
                        Demonstration timeline of data coverage, analysis runs, and detected anomalies for <strong style={{ color: 'var(--electric-cyan)' }}>{activeAstronaut?.name || activeAstronautId}</strong>
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CREW MEMBER:</label>
                    <select
                        className="select"
                        value={activeAstronautId}
                        onChange={e => setActiveAstronautId(e.target.value)}
                        style={{
                            background: 'rgba(11, 16, 38, 0.9)',
                            border: '1px solid rgba(83, 231, 255, 0.35)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--stellar-white)',
                            padding: '0.45rem 0.8rem',
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
            </div>

            <div className="glass-card" style={{ padding: '0.75rem 1rem', background: 'rgba(83,231,255,0.04)', border: '1px solid rgba(83,231,255,0.12)' }}>
                <p style={{ fontSize: '0.78rem', margin: 0, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    DEMO TIMELINE — Events reflect dataset coverage and analysis runs. Not real mission events.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                </div>
            ) : (
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {/* Vertical track line */}
                    <div style={{
                        position: 'absolute', left: '0.85rem', top: 0, bottom: 0,
                        width: 2, background: 'linear-gradient(to bottom, var(--electric-cyan), var(--aurora-violet))',
                        opacity: 0.3,
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {events.map((ev, i) => {
                            const Icon = ev.icon;
                            return (
                                <div key={ev.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative', animation: `fadeInUp 0.4s ease ${i * 60}ms both` }}>
                                    {/* Node */}
                                    <div style={{
                                        position: 'absolute', left: -29,
                                        width: 20, height: 20, borderRadius: '50%',
                                        background: ev.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 0 12px ${ev.color}60`, flexShrink: 0, border: '2px solid var(--midnight-navy)',
                                    }}>
                                        <Icon size={10} color="#050816" />
                                    </div>

                                    <div className="glass-card" style={{ padding: '1rem', flex: 1, borderLeft: `2px solid ${ev.color}40` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--stellar-white)', fontSize: '0.92rem' }}>{ev.label}</div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                {ev.time.slice(0, 16)}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{ev.detail}</p>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <span className="badge" style={{ color: ev.color, borderColor: `${ev.color}40`, background: `${ev.color}10`, fontSize: '0.65rem' }}>
                                                {ev.type.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
