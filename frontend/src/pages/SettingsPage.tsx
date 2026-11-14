import React, { useState } from 'react';
import { Settings, RotateCcw, Info } from 'lucide-react';

const DEFAULT = {
    contamination: '0.05',
    refreshInterval: '30',
    pageSize: '20',
    defaultMetric: 'heart_rate',
    showDisclaimer: true,
};

const SettingRow: React.FC<{ label: string; desc: string; children: React.ReactNode }> = ({ label, desc, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{label}</div>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>{desc}</p>
        </div>
        <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
);

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({ ...DEFAULT });
    const [saved, setSaved] = useState(false);

    const save = () => {
        localStorage.setItem('astrocare_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const reset = () => setSettings({ ...DEFAULT });

    return (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>
            <div>
                <div className="section-eyebrow" style={{ marginBottom: '0.4rem' }}>SYSTEM CONFIGURATION</div>
                <h2 style={{ margin: 0 }}>Platform <span className="text-cyan">Settings</span></h2>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>Local preferences and analysis parameters</p>
            </div>

            <div className="glass-card" style={{ padding: '0.75rem 1rem', background: 'rgba(83,231,255,0.04)', border: '1px solid rgba(83,231,255,0.12)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Info size={14} color="var(--electric-cyan)" />
                    <p style={{ fontSize: '0.78rem', margin: 0, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        Settings are stored in browser local storage and do not affect backend analysis unless explicitly applied.
                    </p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Anomaly Detection</h4>

                <SettingRow label="Contamination Rate" desc="Expected proportion of anomalies in the dataset. Used by Isolation Forest.">
                    <select className="select" style={{ width: 100 }} value={settings.contamination}
                        onChange={e => setSettings(s => ({ ...s, contamination: e.target.value }))}>
                        <option value="0.02">2%</option>
                        <option value="0.05">5%</option>
                        <option value="0.10">10%</option>
                        <option value="0.15">15%</option>
                        <option value="0.20">20%</option>
                    </select>
                </SettingRow>

                <SettingRow label="Default Chart Metric" desc="Metric shown by default on the trend chart.">
                    <select className="select" style={{ width: 160 }} value={settings.defaultMetric}
                        onChange={e => setSettings(s => ({ ...s, defaultMetric: e.target.value }))}>
                        <option value="heart_rate">Heart Rate</option>
                        <option value="spo2">SpO₂</option>
                        <option value="body_temp">Body Temp</option>
                        <option value="resp_rate">Resp Rate</option>
                        <option value="systolic_bp">Systolic BP</option>
                        <option value="diastolic_bp">Diastolic BP</option>
                    </select>
                </SettingRow>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Display Preferences</h4>

                <SettingRow label="Data Refresh Interval" desc="How often the dashboard auto-refreshes data (seconds).">
                    <select className="select" style={{ width: 120 }} value={settings.refreshInterval}
                        onChange={e => setSettings(s => ({ ...s, refreshInterval: e.target.value }))}>
                        <option value="15">15 sec</option>
                        <option value="30">30 sec</option>
                        <option value="60">60 sec</option>
                        <option value="300">5 min</option>
                    </select>
                </SettingRow>

                <SettingRow label="Records Per Page" desc="Number of records shown in the historical data table.">
                    <select className="select" style={{ width: 100 }} value={settings.pageSize}
                        onChange={e => setSettings(s => ({ ...s, pageSize: e.target.value }))}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </SettingRow>

                <SettingRow label="Show Simulated Data Disclaimer" desc="Display the disclaimer banner on dashboard pages.">
                    <button
                        className={`btn btn-sm ${settings.showDisclaimer ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setSettings(s => ({ ...s, showDisclaimer: !s.showDisclaimer }))}
                    >
                        {settings.showDisclaimer ? 'Enabled' : 'Disabled'}
                    </button>
                </SettingRow>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Data Mode</h4>
                <SettingRow label="Current Data Source" desc="The platform is running on simulated demonstration data.">
                    <span className="badge badge-warning">SIMULATED DATA</span>
                </SettingRow>
                <SettingRow label="Mission Mode" desc="Operating in demonstration mode for NASA Space Apps Challenge.">
                    <span className="badge badge-info">DEMO-01</span>
                </SettingRow>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" onClick={save}>
                    <Settings size={14} />
                    {saved ? 'Saved!' : 'Save Settings'}
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                    <RotateCcw size={14} /> Reset to Defaults
                </button>
            </div>
        </div>
    );
};
