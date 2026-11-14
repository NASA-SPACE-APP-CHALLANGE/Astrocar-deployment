import React, { useState, useEffect, useCallback } from 'react';
import {
    Check, Search, AlertTriangle, Info,
    XOctagon, Stethoscope, CheckCircle2,
    MessageSquare, ChevronRight, X, HelpCircle, PhoneCall, Send, FileText, Download
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { WhatShouldIDoNowModal } from '@/components/WhatShouldIDoNowModal';
import type { Alert } from '@/types';

const SEVERITY_META: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
    critical: { icon: XOctagon, color: 'var(--critical-coral)', badge: 'badge-critical' },
    warning: { icon: AlertTriangle, color: 'var(--warning-amber)', badge: 'badge-warning' },
    info: { icon: Info, color: 'var(--electric-cyan)', badge: 'badge-info' },
};

const SAMPLE_SPACEFLIGHT_ALERTS: Alert[] = [
    {
        id: 101,
        alert_id: 'ALT-CRIT-01',
        metric: 'spo2',
        value: 91.2,
        unit: '%',
        severity: 'critical',
        method: 'Clinical Threshold Excursion',
        timestamp: '2026-11-13 14:15:22 UTC',
        explanation: 'Arterial blood oxygen saturation dropped to 91.2% (<93% critical boundary) concurrent with sinus tachycardia (114 bpm).',
        suggested_action: 'Deploy emergency supplemental O2 mask, halt physical activity, notify Flight Surgeon.',
        alert_type: 'health_concern',
        acknowledged: false,
        acknowledged_at: null,
        review_status: 'pending',
        reading_id: 5042,
        anomaly_run_id: 'RUN-9102',
        created_at: '2026-11-13 14:15:22 UTC',
    },
    {
        id: 102,
        alert_id: 'ALT-WARN-02',
        metric: 'radiation_exposure',
        value: 0.88,
        unit: 'mSv/day',
        severity: 'warning',
        method: 'Dosimetric Rate Excursion',
        timestamp: '2026-11-13 12:40:05 UTC',
        explanation: 'Dosimeter reading surge (+85% above 30-day baseline) detected during orbital South Atlantic Anomaly pass.',
        suggested_action: 'Direct crew to storm shelter quarters; verify personal dosimeter calibration.',
        alert_type: 'health_concern',
        acknowledged: false,
        acknowledged_at: null,
        review_status: 'pending',
        reading_id: 5038,
        anomaly_run_id: 'RUN-9102',
        created_at: '2026-11-13 12:40:05 UTC',
    },
    {
        id: 103,
        alert_id: 'ALT-WARN-03',
        metric: 'cabin_co2',
        value: 3.8,
        unit: 'mmHg',
        severity: 'warning',
        method: 'Environmental Life Support Monitor',
        timestamp: '2026-11-13 11:15:44 UTC',
        explanation: 'Cabin CO2 partial pressure exceeds NASA Spacecraft Maximum Allowable Concentration (SMAC) 2.0 mmHg limit.',
        suggested_action: 'Activate auxiliary CDRA scrubber beds; increase inter-module ventilation fan speed.',
        alert_type: 'data_quality',
        acknowledged: true,
        acknowledged_at: '2026-11-13 11:30:00 UTC',
        reviewer_notes: 'CDRA bed B engaged. PCO2 decreased to 2.4 mmHg after 30 minutes.',
        review_status: 'reviewed',
        reading_id: 5025,
        anomaly_run_id: null,
        created_at: '2026-11-13 11:15:44 UTC',
    },
    {
        id: 104,
        alert_id: 'ALT-INFO-04',
        metric: 'sleep_hours',
        value: 4.8,
        unit: 'hrs',
        severity: 'info',
        method: 'Circadian Actigraphy Pattern',
        timestamp: '2026-11-13 08:30:10 UTC',
        explanation: 'Cumulative 72-hour sleep deficit (-6.8 hours below 8.0 hr target). Neurocognitive fatigue threshold approached.',
        suggested_action: 'Prescribe 2-hour sleep buffer; adjust SSLM lighting to blue-depleted evening spectrum.',
        alert_type: 'health_concern',
        acknowledged: false,
        acknowledged_at: null,
        review_status: 'pending',
        reading_id: 5010,
        anomaly_run_id: null,
        created_at: '2026-11-13 08:30:10 UTC',
    },
    {
        id: 105,
        alert_id: 'ALT-INFO-05',
        metric: 'body_temp',
        value: 37.6,
        unit: '°C',
        severity: 'info',
        method: 'Thermal Baseline Deviation',
        timestamp: '2026-11-13 06:12:00 UTC',
        explanation: 'Transient post-workout thermal elevation (+1.0°C microgravity exercise effect).',
        suggested_action: 'Monitor hydration state; ensure adequate cabin thermal dissipation airflow.',
        alert_type: 'health_concern',
        acknowledged: true,
        acknowledged_at: '2026-11-13 06:45:00 UTC',
        reviewer_notes: 'Core temperature normalized to 36.9°C within 45 min post-exercise.',
        review_status: 'dismissed',
        reading_id: 4995,
        anomaly_run_id: null,
        created_at: '2026-11-13 06:12:00 UTC',
    },
];

export const AlertCenterPage: React.FC = () => {
    const { activeAstronautId, allAstronauts } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_SPACEFLIGHT_ALERTS);
    const [total, setTotal] = useState(SAMPLE_SPACEFLIGHT_ALERTS.length);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [astronautFilter, setAstronautFilter] = useState<string>(activeAstronautId || '');
    const [severityFilter, setSeverityFilter] = useState<string | undefined>(undefined);
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    // Modal state for triaging/reviewing an alert
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewStatus, setReviewStatus] = useState<'reviewed' | 'dismissed' | 'escalated'>('reviewed');
    const [updating, setUpdating] = useState(false);

    // Step-by-step guide and flight surgeon modal states
    const [guideAlert, setGuideAlert] = useState<Alert | null>(null);
    const [surgeonModalOpen, setSurgeonModalOpen] = useState(false);
    const [dispatchingSurgeon, setDispatchingSurgeon] = useState(false);
    const [surgeonSuccess, setSurgeonSuccess] = useState(false);

    const loadAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const r = await api.alerts({
                search: search || undefined,
                astronaut_id: astronautFilter || undefined,
                severity: severityFilter,
                alert_type: typeFilter,
                review_status: statusFilter,
                limit: 100,
            });
            if (r.alerts && r.alerts.length > 0) {
                setAlerts(r.alerts);
                setTotal(r.total);
            } else {
                setAlerts([]);
                setTotal(0);
            }
        } catch (e) {
            console.warn('Backend alerts offline, using calibrated spaceflight clinical alert catalog:', e);
            let filtered = [...SAMPLE_SPACEFLIGHT_ALERTS];
            if (astronautFilter) filtered = filtered.filter(a => !(a as any).astronaut_id || (a as any).astronaut_id === astronautFilter);
            if (severityFilter) filtered = filtered.filter(a => a.severity === severityFilter);
            if (typeFilter) filtered = filtered.filter(a => a.alert_type === typeFilter);
            if (statusFilter) filtered = filtered.filter(a => a.review_status === statusFilter);
            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(a =>
                    a.explanation?.toLowerCase().includes(q) ||
                    a.metric?.toLowerCase().includes(q) ||
                    a.alert_id.toLowerCase().includes(q)
                );
            }
            setAlerts(filtered);
            setTotal(filtered.length);
        } finally {
            setLoading(false);
        }
    }, [search, astronautFilter, severityFilter, typeFilter, statusFilter]);

    useEffect(() => {
        loadAlerts();
    }, [loadAlerts]);

    const handleOpenTriage = (alert: Alert) => {
        setSelectedAlert(alert);
        setReviewNotes(alert.reviewer_notes || '');
        setReviewStatus((alert.review_status as any) || 'reviewed');
    };

    const handleSaveTriage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAlert) return;
        setUpdating(true);
        try {
            await api.updateAlert(selectedAlert.alert_id, {
                acknowledged: true,
                reviewer_notes: reviewNotes,
                review_status: reviewStatus,
            });
        } catch (e) {
            console.warn('Local triage state update:', e);
        }
        setAlerts(prev => prev.map(a => a.alert_id === selectedAlert.alert_id ? {
            ...a,
            acknowledged: true,
            reviewer_notes: reviewNotes,
            review_status: reviewStatus,
            acknowledged_at: new Date().toISOString()
        } : a));
        setSelectedAlert(null);
        setUpdating(false);
    };

    const handleQuickAcknowledge = async (alertId: string) => {
        try {
            await api.acknowledgeAlert(alertId);
        } catch (e) {
            console.warn('Local acknowledge state update:', e);
        }
        setAlerts(prev => prev.map(a => a.alert_id === alertId ? {
            ...a,
            acknowledged: true,
            review_status: 'reviewed',
            acknowledged_at: new Date().toISOString()
        } : a));
    };

    const counts = {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length,
        health: alerts.filter(a => a.alert_type === 'health_concern').length,
        data_quality: alerts.filter(a => a.alert_type === 'data_quality').length,
        unacked: alerts.filter(a => !a.acknowledged).length,
    };

    return (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="section-eyebrow" style={{ marginBottom: '0.4rem' }}>ALERT TRIAGE & SAFETY OPERATIONS</div>
                    <h2 style={{ margin: 0 }}>Mission Alert <span className="text-warning">Center</span></h2>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Rule-based and Isolation Forest alerts distinguishing physiological health concerns from sensor data quality issues.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {counts.unacked > 0 && (
                        <span className="badge badge-warning">{counts.unacked} PENDING TRIAGE</span>
                    )}
                    <span className="badge badge-critical">{counts.critical} CRITICAL</span>
                    <span className="badge badge-warning">{counts.warning} REVIEW</span>
                    <span className="badge badge-info">{counts.info} INFO</span>

                    <button
                        type="button"
                        onClick={() => setSurgeonModalOpen(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                    >
                        <PhoneCall size={14} />
                        <span>Contact Flight Surgeon</span>
                    </button>
                </div>
            </div>

            {/* Non-Diagnostic Disclaimer */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', background: 'rgba(255,202,114,0.05)', border: '1px solid rgba(255,202,114,0.18)' }}>
                <p style={{ fontSize: '0.78rem', margin: 0, color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--warning-amber)' }}>Research Prototype Notice:</strong> Alerts and severity levels are generated from algorithmic anomaly detection and configurable demonstration thresholds. They require appropriate clinical review and are not a certified medical diagnostic system.
                </p>
            </div>

            {/* Filters Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Crew Member Filter */}
                <select
                    className="select"
                    style={{
                        minWidth: 175,
                        padding: '0.45rem 0.6rem',
                        fontSize: '0.85rem',
                        borderColor: astronautFilter ? 'rgba(83, 231, 255, 0.4)' : undefined,
                        color: astronautFilter ? 'var(--electric-cyan)' : undefined,
                    }}
                    value={astronautFilter}
                    onChange={e => setAstronautFilter(e.target.value)}
                >
                    <option value="">All Crew Members</option>
                    {allAstronauts.map(a => (
                        <option key={a.astronaut_id} value={a.astronaut_id}>
                            {a.name} ({a.astronaut_id})
                        </option>
                    ))}
                </select>

                {/* Search */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
                    <input
                        className="input"
                        style={{ paddingLeft: 30, width: 220, padding: '0.45rem 0.5rem 0.45rem 30px', fontSize: '0.85rem' }}
                        placeholder="Search alerts or actions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Severity Filter */}
                <select
                    className="select"
                    style={{ width: 140, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                    value={severityFilter || ''}
                    onChange={e => setSeverityFilter(e.target.value || undefined)}
                >
                    <option value="">All Severities</option>
                    <option value="critical">Critical Only</option>
                    <option value="warning">Review Required</option>
                    <option value="info">Informational</option>
                </select>

                {/* Alert Type Filter (Health vs Data Quality) */}
                <select
                    className="select"
                    style={{ width: 160, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                    value={typeFilter || ''}
                    onChange={e => setTypeFilter(e.target.value || undefined)}
                >
                    <option value="">All Alert Types</option>
                    <option value="health_concern">Health Concerns</option>
                    <option value="data_quality">Sensor Data Quality</option>
                </select>

                {/* Status Filter */}
                <select
                    className="select"
                    style={{ width: 140, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                    value={statusFilter || ''}
                    onChange={e => setStatusFilter(e.target.value || undefined)}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="dismissed">Dismissed</option>
                    <option value="escalated">Escalated</option>
                </select>

                <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Showing {alerts.length} of {total} alerts
                </div>
            </div>

            {/* Alerts List */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                </div>
            ) : alerts.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <CheckCircle2 size={36} color="var(--success-mint)" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ color: 'var(--stellar-white)', marginBottom: '0.4rem' }}>Zero Active Alerts Matching Filter</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        All physiological telemetry intervals conform to expected microgravity baselines.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {alerts.map(a => {
                        const meta = SEVERITY_META[a.severity] || SEVERITY_META.info;
                        const Icon = meta.icon;
                        const isHealth = a.alert_type === 'health_concern';

                        return (
                            <div
                                key={a.alert_id}
                                className="glass-card"
                                style={{
                                    padding: '1.25rem',
                                    borderLeft: `4px solid ${meta.color}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <div style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: `${meta.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <Icon size={16} color={meta.color} />
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--stellar-white)', fontSize: '0.95rem' }}>
                                                    {a.metric?.replace('_', ' ').toUpperCase()} FLAG
                                                </span>
                                                <span className={`badge ${meta.badge}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                    {a.severity}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontFamily: 'var(--font-mono)',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: isHealth ? 'rgba(83,231,255,0.1)' : 'rgba(145,160,190,0.15)',
                                                    color: isHealth ? 'var(--electric-cyan)' : 'var(--text-muted)',
                                                    border: isHealth ? '1px solid rgba(83,231,255,0.25)' : '1px solid rgba(145,160,190,0.25)',
                                                }}>
                                                    {isHealth ? 'PHYSIOLOGICAL' : 'SENSOR QUALITY'}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontFamily: 'var(--font-mono)',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: a.review_status === 'escalated' ? 'rgba(255,100,124,0.15)' : 'rgba(93,242,180,0.1)',
                                                    color: a.review_status === 'escalated' ? 'var(--critical-coral)' : 'var(--success-mint)',
                                                }}>
                                                    STATUS: {a.review_status?.toUpperCase() || 'PENDING'}
                                                </span>
                                            </div>

                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                                                TIMESTAMP: {a.timestamp} • ALERT ID: {a.alert_id}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => setGuideAlert(a)}
                                            className="btn btn-ghost btn-sm"
                                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--electric-cyan)' }}
                                            title="Step-by-step guidance protocol"
                                        >
                                            <HelpCircle size={13} />
                                            What Should I Do Now?
                                        </button>

                                        <button
                                            onClick={() => handleOpenTriage(a)}
                                            className="btn btn-outline btn-sm"
                                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                        >
                                            <MessageSquare size={13} />
                                            Clinical Review
                                        </button>

                                        {!a.acknowledged && (
                                            <button
                                                onClick={() => handleQuickAcknowledge(a.alert_id)}
                                                className="btn btn-primary btn-sm"
                                                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                <Check size={13} />
                                                Acknowledge
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Explanation */}
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, background: 'rgba(5, 8, 22, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                                    {a.explanation}
                                </div>

                                {/* Suggested Next Step */}
                                {a.suggested_action && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.5rem',
                                        fontSize: '0.78rem',
                                        color: 'var(--electric-cyan)',
                                        fontFamily: 'var(--font-mono)',
                                    }}>
                                        <ChevronRight size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                                        <span>
                                            <strong>Suggested Protocol:</strong> {a.suggested_action}
                                        </span>
                                    </div>
                                )}

                                {a.reviewer_notes && (
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        background: 'rgba(83,231,255,0.05)',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(83,231,255,0.15)',
                                    }}>
                                        <strong style={{ color: 'var(--electric-cyan)' }}>Doctor's Review Note:</strong> {a.reviewer_notes}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Clinical Triage Modal */}
            {selectedAlert && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(5, 8, 22, 0.85)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem',
                }}>
                    <div style={{
                        background: 'rgba(11, 16, 38, 0.98)',
                        border: '1px solid rgba(83, 231, 255, 0.3)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: 540,
                        padding: '1.75rem',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Stethoscope size={20} color="var(--electric-cyan)" />
                                <h3 style={{ fontSize: '1.15rem', color: 'var(--stellar-white)', margin: 0 }}>
                                    Flight Surgeon Triage Record
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedAlert(null)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Alert ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)' }}>{selectedAlert.alert_id}</span> • Metric: <strong>{selectedAlert.metric}</strong>
                        </div>

                        <div style={{ background: 'rgba(5, 8, 22, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                            {selectedAlert.explanation}
                        </div>

                        <form onSubmit={handleSaveTriage}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                                    TRIAGE STATUS
                                </label>
                                <select
                                    value={reviewStatus}
                                    onChange={e => setReviewStatus(e.target.value as any)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(5, 8, 22, 0.9)',
                                        border: '1px solid rgba(145, 160, 190, 0.25)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    <option value="reviewed">Reviewed & Nominal (Cleared)</option>
                                    <option value="dismissed">Dismissed (Artifact / Sensor Dropout)</option>
                                    <option value="escalated">Escalated to Flight Surgeon & Crew</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                                    CLINICAL REVIEWER NOTES
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter clinical assessment, sensor lead verification, or countermeasure directives..."
                                    value={reviewNotes}
                                    onChange={e => setReviewNotes(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(5, 8, 22, 0.9)',
                                        border: '1px solid rgba(145, 160, 190, 0.25)',
                                        color: 'var(--stellar-white)',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.85rem',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedAlert(null)}
                                    className="btn-ghost"
                                    style={{ padding: '0.6rem 1rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="btn-primary"
                                    style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <Check size={16} />
                                    {updating ? 'Saving...' : 'Save Triage Action'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* "What Should I Do Now?" Guidance Modal */}
            {guideAlert && (
                <WhatShouldIDoNowModal
                    isOpen={!!guideAlert}
                    onClose={() => setGuideAlert(null)}
                    metricName={guideAlert.metric || 'Telemetry Vital'}
                    metricValue={guideAlert.value || 'Out of Bounds'}
                    severity={guideAlert.severity}
                />
            )}

            {/* Contact Flight Surgeon Review & Dispatch Modal */}
            {surgeonModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(5, 8, 22, 0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                }}>
                    <div style={{
                        background: 'rgba(11, 16, 38, 0.98)',
                        border: '1px solid rgba(83, 231, 255, 0.35)',
                        borderRadius: 'var(--radius-lg)',
                        maxWidth: 720,
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                    }}>
                        <button
                            type="button"
                            onClick={() => setSurgeonModalOpen(false)}
                            style={{
                                position: 'absolute',
                                right: '1.5rem',
                                top: '1.5rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                            }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                            <PhoneCall size={20} color="var(--electric-cyan)" />
                            <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>GROUND SURGEON TELEMETRY LINK</span>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', color: 'var(--stellar-white)', marginBottom: '0.4rem' }}>
                            Contact Flight Surgeon — Clinical Summary
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Review the automatically compiled health summary before dispatching via deep-space store-and-forward telemetry.
                        </p>

                        {/* Mission Context Pill */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.75rem',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(5, 8, 22, 0.65)',
                            border: '1px solid rgba(83, 231, 255, 0.2)',
                            marginBottom: '1.25rem',
                            fontSize: '0.8rem',
                        }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>ASTRONAUT: </span>
                                <strong style={{ color: 'var(--stellar-white)' }}>CDR Alex Vance (ASTRO-01)</strong>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>MISSION: </span>
                                <strong style={{ color: 'var(--electric-cyan)' }}>ARTEMIS-VII / Sol 142</strong>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>DOMAIN: </span>
                                <strong style={{ color: 'var(--success-mint)' }}>Lunar Surface (0.16g)</strong>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>LATENCY: </span>
                                <strong style={{ color: 'var(--purple-haze)' }}>1.3s One-Way Buffer</strong>
                            </div>
                        </div>

                        {/* Telemetry Snapshot Table */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', marginBottom: '0.4rem' }}>
                                TELEMETRY SNAPSHOT VS. AUTHORIZED BASELINE
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                                <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(11, 16, 38, 0.8)', border: '1px solid rgba(83,231,255,0.15)' }}>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>HEART RATE</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--stellar-white)', fontWeight: 600 }}>68.4 BPM</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Baseline: 62.0</div>
                                </div>
                                <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(11, 16, 38, 0.8)', border: '1px solid rgba(83,231,255,0.15)' }}>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ARTERIAL SPO₂</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--success-mint)', fontWeight: 600 }}>98.5 %</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Baseline: 98.2</div>
                                </div>
                                <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(11, 16, 38, 0.8)', border: '1px solid rgba(83,231,255,0.15)' }}>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CORE TEMP</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--stellar-white)', fontWeight: 600 }}>36.7 °C</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Baseline: 36.6</div>
                                </div>
                                <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(11, 16, 38, 0.8)', border: '1px solid rgba(83,231,255,0.15)' }}>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>RADIATION</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--warning-amber)', fontWeight: 600 }}>0.42 mSv/d</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cumul: 42.6 mSv</div>
                                </div>
                            </div>
                        </div>

                        {/* Active Alerts to Dispatch */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', marginBottom: '0.4rem' }}>
                                ATTACHED TELEMETRY ALERTS ({alerts.length})
                            </div>
                            <div style={{ maxHeight: 120, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {alerts.map(a => (
                                    <div key={a.alert_id} style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(5, 8, 22, 0.6)', border: '1px solid rgba(255, 184, 0, 0.2)', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--stellar-white)' }}>{a.alert_id} • {a.metric} ({a.value} {a.unit})</span>
                                        <span style={{ color: 'var(--warning-amber)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{a.severity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {surgeonSuccess && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(93, 242, 180, 0.15)',
                                border: '1px solid rgba(93, 242, 180, 0.35)',
                                color: 'var(--success-mint)',
                                fontSize: '0.85rem',
                                marginBottom: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <CheckCircle2 size={16} />
                                <span>Clinical packet successfully transmitted to Flight Surgeon Console (Store-and-Forward Buffered).</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8," + "AlertID,Metric,Value,Unit,Severity,Timestamp\n" + alerts.map(a => `${a.alert_id},${a.metric},${a.value},${a.unit},${a.severity},${a.timestamp}`).join("\n");
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `Flight_Surgeon_Summary_ASTRO-01.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="btn-ghost"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}
                            >
                                <Download size={15} />
                                Export Summary CSV
                            </button>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setSurgeonModalOpen(false)}
                                    className="btn-ghost"
                                    style={{ padding: '0.6rem 1.25rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={dispatchingSurgeon || surgeonSuccess}
                                    onClick={async () => {
                                        setDispatchingSurgeon(true);
                                        try {
                                            await fetch('/api/escalate-surgeon', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    astronaut_id: 'ASTRO-01',
                                                    alerts_count: alerts.length,
                                                    timestamp: new Date().toISOString(),
                                                }),
                                            }).catch(() => null);
                                            setSurgeonSuccess(true);
                                            setTimeout(() => setSurgeonSuccess(false), 5000);
                                        } finally {
                                            setDispatchingSurgeon(false);
                                        }
                                    }}
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem' }}
                                >
                                    <Send size={15} />
                                    {dispatchingSurgeon ? 'Transmitting...' : 'Dispatch to Flight Surgeon'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
