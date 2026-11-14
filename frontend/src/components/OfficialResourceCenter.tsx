import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Info, Building2 } from 'lucide-react';
import { OFFICIAL_RESOURCES, NASA_DISCLAIMER_TEXT, type OfficialResourceItem } from '@/data/researchData';

interface Props {
    title?: string;
    subtitle?: string;
    filterOrg?: 'ALL' | 'NASA' | 'CSA';
    compact?: boolean;
}

export const OfficialResourceCenter: React.FC<Props> = ({
    title = 'Official Resource Center & Agency References',
    subtitle = 'Primary research portals and peer-verified publications from NASA Human Research Program and the Canadian Space Agency',
    filterOrg: initialFilter = 'ALL',
    compact = false,
}) => {
    const [selectedOrg, setSelectedOrg] = useState<'ALL' | 'NASA' | 'CSA'>(initialFilter);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

    const filteredResources = OFFICIAL_RESOURCES.filter(r => {
        if (selectedOrg === 'ALL') return true;
        return r.organization === selectedOrg;
    });

    return (
        <section aria-labelledby="official-resources-heading" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--electric-cyan)', boxShadow: '0 0 8px var(--electric-cyan)' }} />
                    <span className="section-eyebrow">OFFICIAL REFERENCES // PRIMARY RESEARCH REPOSITORIES</span>
                </div>
                <h3 id="official-resources-heading" style={{ margin: 0, fontSize: compact ? '1.25rem' : '1.75rem', color: 'var(--stellar-white)' }}>
                    {title}
                </h3>
                {subtitle && (
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 850 }}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Filter and View Controls */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(11, 16, 38, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                }}
            >
                {/* Agency Pill Filter */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
                        Filter Agency:
                    </span>
                    {(['ALL', 'NASA', 'CSA'] as const).map(org => {
                        const active = selectedOrg === org;
                        return (
                            <button
                                key={org}
                                type="button"
                                onClick={() => setSelectedOrg(org)}
                                className="btn btn-sm"
                                style={{
                                    padding: '4px 12px',
                                    fontSize: '0.78rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: active
                                        ? org === 'NASA'
                                            ? 'rgba(83, 231, 255, 0.2)'
                                            : org === 'CSA'
                                            ? 'rgba(255, 100, 124, 0.2)'
                                            : 'rgba(146, 117, 255, 0.25)'
                                        : 'rgba(145, 160, 190, 0.08)',
                                    color: active
                                        ? org === 'NASA'
                                            ? 'var(--electric-cyan)'
                                            : org === 'CSA'
                                            ? '#FF8B9E'
                                            : 'var(--stellar-white)'
                                        : 'var(--text-secondary)',
                                    border: active
                                        ? `1px solid ${org === 'NASA' ? 'var(--electric-cyan)' : org === 'CSA' ? 'var(--critical-coral)' : 'var(--aurora-violet)'}`
                                        : '1px solid var(--border-subtle)',
                                    cursor: 'pointer',
                                }}
                            >
                                {org === 'ALL' ? 'All (5 Sources)' : org === 'NASA' ? 'NASA HRP (3 Sources)' : 'Canadian Space Agency (2 Sources)'}
                            </button>
                        );
                    })}
                </div>

                {/* View Toggle */}
                {!compact && (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                            type="button"
                            onClick={() => setViewMode('cards')}
                            className="btn btn-sm"
                            style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                background: viewMode === 'cards' ? 'rgba(83, 231, 255, 0.15)' : 'transparent',
                                color: viewMode === 'cards' ? 'var(--electric-cyan)' : 'var(--text-muted)',
                                border: '1px solid var(--border-subtle)',
                            }}
                        >
                            Card View
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className="btn btn-sm"
                            style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                background: viewMode === 'table' ? 'rgba(83, 231, 255, 0.15)' : 'transparent',
                                color: viewMode === 'table' ? 'var(--electric-cyan)' : 'var(--text-muted)',
                                border: '1px solid var(--border-subtle)',
                            }}
                        >
                            Table View
                        </button>
                    </div>
                )}
            </div>

            {/* Display: Cards or Table */}
            {viewMode === 'cards' || compact ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {filteredResources.map((res: OfficialResourceItem) => {
                        const isNASA = res.organization === 'NASA';
                        return (
                            <div
                                key={res.id}
                                className="glass-card"
                                style={{
                                    padding: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderLeft: `3px solid ${isNASA ? 'var(--electric-cyan)' : 'var(--critical-coral)'}`,
                                }}
                            >
                                <div>
                                    {/* Top meta */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: isNASA ? 'rgba(83, 231, 255, 0.12)' : 'rgba(255, 100, 124, 0.12)',
                                                    borderColor: isNASA ? 'rgba(83, 231, 255, 0.4)' : 'rgba(255, 100, 124, 0.4)',
                                                    color: isNASA ? 'var(--electric-cyan)' : '#FF8B9E',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {res.organization}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                                {res.category}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--success-mint)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle2 size={11} /> {res.verifiedDate}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: 'var(--stellar-white)', lineHeight: 1.3 }}>
                                        {res.resourceTitle}
                                    </h4>

                                    {/* Full Agency Name */}
                                    <div style={{ fontSize: '0.75rem', color: isNASA ? 'var(--text-cyan)' : '#FF8B9E', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Building2 size={12} />
                                        <span>{res.organizationFullName}</span>
                                    </div>

                                    {/* Description */}
                                    <p style={{ fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        {res.shortDescription}
                                    </p>
                                </div>

                                {/* Link button */}
                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                                    <a
                                        href={res.officialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-sm w-full"
                                        style={{
                                            justifyContent: 'center',
                                            borderColor: isNASA ? 'rgba(83, 231, 255, 0.3)' : 'rgba(255, 100, 124, 0.3)',
                                            color: isNASA ? 'var(--electric-cyan)' : '#FF8B9E',
                                            background: isNASA ? 'rgba(83, 231, 255, 0.04)' : 'rgba(255, 100, 124, 0.04)',
                                        }}
                                        title={`Visit official ${res.organization} resource at ${res.officialUrl}`}
                                    >
                                        <span>Access Official {res.organization} Portal</span>
                                        <ExternalLink size={13} style={{ marginLeft: 4 }} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Table View */
                <div className="glass-card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                    <table className="data-table" style={{ width: '100%', minWidth: 640 }}>
                        <thead>
                            <tr>
                                <th style={{ width: 100 }}>Agency</th>
                                <th style={{ width: 220 }}>Resource Title</th>
                                <th>Scientific Description</th>
                                <th style={{ width: 140, textAlign: 'right' }}>Official Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResources.map((res: OfficialResourceItem) => {
                                const isNASA = res.organization === 'NASA';
                                return (
                                    <tr key={res.id}>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: isNASA ? 'rgba(83, 231, 255, 0.1)' : 'rgba(255, 100, 124, 0.1)',
                                                    borderColor: isNASA ? 'rgba(83, 231, 255, 0.3)' : 'rgba(255, 100, 124, 0.3)',
                                                    color: isNASA ? 'var(--electric-cyan)' : '#FF8B9E',
                                                }}
                                            >
                                                {res.organization}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--stellar-white)', fontSize: '0.88rem' }}>
                                                {res.resourceTitle}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                                {res.category}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                                            {res.shortDescription}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <a
                                                href={res.officialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm"
                                                style={{
                                                    display: 'inline-flex',
                                                    gap: '0.35rem',
                                                    color: isNASA ? 'var(--electric-cyan)' : '#FF8B9E',
                                                }}
                                            >
                                                <span>Open</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Official NASA Disclaimer Box */}
            <div
                className="glass-card"
                style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(11, 16, 38, 0.85)',
                    border: '1px solid rgba(255, 202, 114, 0.25)',
                    borderLeft: '4px solid var(--warning-amber)',
                    borderRadius: 'var(--radius-md)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Info size={18} color="var(--warning-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                            Official Space Agency Compliance Disclaimer
                        </div>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--stellar-white)', lineHeight: 1.6 }}>
                            &ldquo;{NASA_DISCLAIMER_TEXT}&rdquo;
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
