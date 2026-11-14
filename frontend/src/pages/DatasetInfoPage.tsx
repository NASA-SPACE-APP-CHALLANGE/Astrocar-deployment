import React, { useEffect, useState } from 'react';
import { Database, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { api } from '@/services/api';
import type { DatasetInfo } from '@/types';

const FALLBACK_DATASET_INFO: DatasetInfo = {
    name: 'AstroCare Human Spaceflight Physiological & Habitat Telemetry Dataset',
    source: 'NASA Human Research Program (HRP) Baseline Norms & Circadian Synthesis Engine',
    documentation_url: 'https://www.nasa.gov/hrp/',
    is_simulated: true,
    total_records: 500,
    date_range: {
        start: '2026-11-01 00:00:00 UTC',
        end: '2026-11-13 23:59:59 UTC',
    },
    license: 'NASA Open Innovation / MIT Permissive Open Access',
    variables: [
        { name: 'heart_rate', unit: 'bpm', description: 'ECG-derived heart rate calibrated to microgravity resting norms (50 – 120 bpm).' },
        { name: 'spo2', unit: '%', description: 'Pulse oximetry arterial oxygen saturation (90 – 100%).' },
        { name: 'body_temp', unit: '°C', description: 'Core body temperature with ~1.0°C microgravity diurnal elevation (36.0 – 37.8°C).' },
        { name: 'resp_rate', unit: 'br/min', description: 'Continuous breath frequency per minute via bio-impedance (10 – 24 br/min).' },
        { name: 'systolic_bp', unit: 'mmHg', description: 'Systolic arterial pressure affected by cephalad fluid shifts (90 – 140 mmHg).' },
        { name: 'diastolic_bp', unit: 'mmHg', description: 'Diastolic arterial pressure (60 – 90 mmHg).' },
        { name: 'radiation_exposure', unit: 'mSv/day', description: 'Daily dosimeter reading incorporating galactic cosmic rays and SAA passes (0.2 – 1.8 mSv/day).' },
    ],
    known_limitations: [
        'Telemetry is mathematically synthesized based on NASA HRP spaceflight clinical literature and circadian models, not real-time astronaut medical records.',
        'High-frequency ECG arrhythmias (e.g. PVCs) are downsampled to 30-minute operational intervals.',
        'Environmental life support CO2 sensors are modeled from ISS Columbus and Destiny module flight telemetry parameters.',
    ],
};

export const DatasetInfoPage: React.FC = () => {
    const [info, setInfo] = useState<DatasetInfo | null>(FALLBACK_DATASET_INFO);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.datasetInfo()
            .then(res => {
                if (res && res.name) setInfo(res);
                else setInfo(FALLBACK_DATASET_INFO);
            })
            .catch(() => {
                setInfo(FALLBACK_DATASET_INFO);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <div className="spinner" />
        </div>
    );

    return (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 900 }}>
            <div>
                <div className="section-eyebrow" style={{ marginBottom: '0.4rem' }}>DATASET INFORMATION</div>
                <h2 style={{ margin: 0 }}>Data <span className="text-cyan">Source Registry</span></h2>
            </div>

            {info.is_simulated && (
                <div className="glass-card" style={{ padding: '0.75rem 1rem', background: 'rgba(255,202,114,0.06)', border: '1px solid rgba(255,202,114,0.2)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <AlertTriangle size={14} color="var(--warning-amber)" />
                        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)' }}>
                            SIMULATED DEMONSTRATION DATA — NOT REAL ASTRONAUT TELEMETRY
                        </span>
                    </div>
                </div>
            )}

            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ background: 'rgba(83,231,255,0.1)', borderRadius: 12, padding: 12, flexShrink: 0 }}>
                        <Database size={24} color="var(--electric-cyan)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.25rem' }}>{info.name}</h3>
                        <p style={{ fontSize: '0.85rem', margin: '0 0 1rem' }}>{info.source}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {[
                                { label: 'Total Records', val: info.total_records.toLocaleString() },
                                { label: 'Date Range Start', val: info.date_range?.start?.slice(0, 16) || '—' },
                                { label: 'Date Range End', val: info.date_range?.end?.slice(0, 16) || '—' },
                                { label: 'License', val: info.license },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="telemetry-label" style={{ marginBottom: '0.2rem' }}>{item.label}</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--stellar-white)' }}>{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Variables */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Documented Variables</h4>
                <table className="data-table">
                    <thead><tr><th>Variable</th><th>Unit</th><th>Description</th></tr></thead>
                    <tbody>
                        {info.variables.map(v => (
                            <tr key={v.name}>
                                <td className="mono-val">{v.name}</td>
                                <td className="mono-val">{v.unit}</td>
                                <td style={{ fontSize: '0.85rem' }}>{v.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Limitations */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Shield size={16} color="var(--warning-amber)" />
                    <h4 style={{ margin: 0 }}>Known Limitations</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {info.known_limitations.map((lim, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem', background: 'rgba(255,202,114,0.05)', borderRadius: 8, borderLeft: '2px solid rgba(255,202,114,0.3)' }}>
                            <span style={{ color: 'var(--warning-amber)', flexShrink: 0, fontSize: '0.8rem', marginTop: 1 }}>⚠</span>
                            <p style={{ fontSize: '0.85rem', margin: 0 }}>{lim}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Link */}
            <a
                href={info.documentation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ alignSelf: 'flex-start' }}
            >
                <ExternalLink size={14} /> View Documentation
            </a>
        </div>
    );
};
