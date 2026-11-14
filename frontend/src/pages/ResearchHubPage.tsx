import React, { useState, useMemo } from 'react';
import {
    Radiation, Users, Compass, Orbit, Box,
    Bone, Heart, Eye, ShieldAlert, Radio, Moon, Brain, Sparkles,
    ExternalLink, Search, Microscope,
    ChevronDown, ChevronUp,
    Activity, ArrowRight
} from 'lucide-react';
import {
    NASA_FIVE_HAZARDS,
    NASA_HEALTH_RISKS,
    NASA_HRP_OVERVIEW,
    NASA_ONGOING_STUDIES,
    CSA_RADIATION_RESOURCE,
    CSA_SCIENCE_IN_SPACE_RESOURCE
} from '@/data/researchData';
import { OfficialResourceCenter } from '@/components/OfficialResourceCenter';

const HAZARD_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
    Radiation,
    Users,
    Compass,
    Orbit,
    Box,
};

const RISK_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
    Bone,
    Heart,
    Eye,
    ShieldAlert,
    Radio,
    Moon,
    Brain,
    Sparkles,
};

interface Props {
    inDashboard?: boolean;
}

export const ResearchHubPage: React.FC<Props> = ({ inDashboard = false }) => {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'hazards' | 'risks' | 'hrp-studies' | 'csa-radiation' | 'csa-science' | 'resources'
    >('overview');

    const [agencyFilter, setAgencyFilter] = useState<'ALL' | 'NASA' | 'CSA'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedHazard, setExpandedHazard] = useState<string | null>('space-radiation');
    const [expandedRisk, setExpandedRisk] = useState<string | null>('bone-muscle-loss');

    // Filtered Hazards
    const filteredHazards = useMemo(() => {
        if (!searchQuery.trim()) return NASA_FIVE_HAZARDS;
        const q = searchQuery.toLowerCase();
        return NASA_FIVE_HAZARDS.filter(h =>
            h.title.toLowerCase().includes(q) ||
            h.simpleExplanation.toLowerCase().includes(q) ||
            h.whyAstronautsExposed.toLowerCase().includes(q) ||
            h.longTermConsequences.some(c => c.toLowerCase().includes(q))
        );
    }, [searchQuery]);

    // Filtered Health Risks
    const filteredRisks = useMemo(() => {
        if (!searchQuery.trim()) return NASA_HEALTH_RISKS;
        const q = searchQuery.toLowerCase();
        return NASA_HEALTH_RISKS.filter(r =>
            r.riskTitle.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.whatHappens.toLowerCase().includes(q) ||
            r.whyItHappens.toLowerCase().includes(q) ||
            r.relatedOrgans.some(o => o.toLowerCase().includes(q))
        );
    }, [searchQuery]);

    // Filtered Ongoing Studies
    const filteredStudies = useMemo(() => {
        if (!searchQuery.trim()) return NASA_ONGOING_STUDIES;
        const q = searchQuery.toLowerCase();
        return NASA_ONGOING_STUDIES.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.objective.toLowerCase().includes(q) ||
            s.scientificSignificance.toLowerCase().includes(q) ||
            s.element.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    return (
        <div style={{ padding: inDashboard ? '1.5rem' : '2.5rem 0 4rem' }}>
            <div className={inDashboard ? undefined : 'container'}>
                {/* Hero Header */}
                <header style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ height: 1, width: 36, background: 'var(--electric-cyan)', opacity: 0.8 }} />
                        <span className="section-eyebrow">SPACEFLIGHT HEALTH KNOWLEDGE BASE // NASA & CSA INTEGRATION</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <h1 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--stellar-white)' }}>
                                Spaceflight Research & <span className="text-cyan">Human Hazards</span>
                            </h1>
                            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 780, lineHeight: 1.7 }}>
                                Official research integration from the <strong>NASA Human Research Program (HRP)</strong> and the <strong>Canadian Space Agency (CSA)</strong>. Comprehensive scientific evidence on the five hazards of spaceflight, clinical health risks, ongoing space experiments, and radiation protection protocols.
                            </p>
                        </div>

                        {/* Agency Badges */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div className="glass-card" style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'rgba(83,231,255,0.3)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--electric-cyan)', boxShadow: '0 0 6px var(--electric-cyan)' }} />
                                <div>
                                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>RESEARCH AUTHORITY</div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--electric-cyan)' }}>NASA HRP</div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'rgba(255,100,124,0.3)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--critical-coral)', boxShadow: '0 0 6px var(--critical-coral)' }} />
                                <div>
                                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PARTNER AGENCY</div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FF8B9E' }}>Canadian Space Agency (CSA)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Search & Agency Filter Bar */}
                <div
                    className="glass-card"
                    style={{
                        padding: '1rem 1.25rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        background: 'rgba(11, 16, 38, 0.75)',
                    }}
                >
                    {/* Search Input */}
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            className="input"
                            placeholder="Search hazards, health risks, studies (e.g., SANS, CIPHER, radiation, bone, Canadarm)..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: 38, fontSize: '0.88rem' }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                style={{
                                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem'
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Agency Filter Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Filter Content:
                        </span>
                        {(['ALL', 'NASA', 'CSA'] as const).map(org => {
                            const active = agencyFilter === org;
                            return (
                                <button
                                    key={org}
                                    type="button"
                                    onClick={() => setAgencyFilter(org)}
                                    className="btn btn-sm"
                                    style={{
                                        padding: '4px 12px',
                                        fontSize: '0.78rem',
                                        background: active
                                            ? org === 'NASA'
                                                ? 'rgba(83, 231, 255, 0.2)'
                                                : org === 'CSA'
                                                ? 'rgba(255, 100, 124, 0.2)'
                                                : 'rgba(146, 117, 255, 0.25)'
                                            : 'transparent',
                                        color: active
                                            ? org === 'NASA'
                                                ? 'var(--electric-cyan)'
                                                : org === 'CSA'
                                                ? '#FF8B9E'
                                                : 'var(--stellar-white)'
                                            : 'var(--text-secondary)',
                                        borderColor: active ? 'currentColor' : 'var(--border-subtle)',
                                    }}
                                >
                                    {org === 'ALL' ? 'All Agencies' : org === 'NASA' ? 'NASA Only' : 'CSA Only'}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section Navigation Tabs */}
                <nav
                    aria-label="Research sections"
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '0.75rem',
                        marginBottom: '2rem',
                        borderBottom: '1px solid var(--border-subtle)',
                    }}
                >
                    {[
                        { id: 'overview', label: 'Executive Summary', agency: 'ALL' },
                        { id: 'hazards', label: 'NASA 5 Major Hazards', agency: 'NASA', badge: '5 Hazards' },
                        { id: 'risks', label: 'Human Health Risks', agency: 'NASA', badge: '8 Risks' },
                        { id: 'hrp-studies', label: 'Ongoing NASA HRP Studies', agency: 'NASA', badge: '6 Flagships' },
                        { id: 'csa-radiation', label: 'CSA: Radiation Monitoring', agency: 'CSA', badge: 'CSA Report' },
                        { id: 'csa-science', label: 'CSA: Science in Space', agency: 'CSA', badge: 'CSA Science' },
                        { id: 'resources', label: 'Official Resource Center', agency: 'ALL', badge: '5 Portals' },
                    ].filter(tab => {
                        if (agencyFilter === 'ALL') return true;
                        return tab.agency === 'ALL' || tab.agency === agencyFilter;
                    }).map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.65rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: active ? 'rgba(83, 231, 255, 0.12)' : 'rgba(11, 16, 38, 0.5)',
                                    color: active ? 'var(--electric-cyan)' : 'var(--text-secondary)',
                                    border: active ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.85rem',
                                    fontWeight: active ? 600 : 400,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span
                                        style={{
                                            fontSize: '0.68rem',
                                            padding: '1px 6px',
                                            borderRadius: 'var(--radius-full)',
                                            background: tab.agency === 'NASA' ? 'rgba(83, 231, 255, 0.15)' : tab.agency === 'CSA' ? 'rgba(255, 100, 124, 0.15)' : 'rgba(146, 117, 255, 0.15)',
                                            color: tab.agency === 'NASA' ? 'var(--electric-cyan)' : tab.agency === 'CSA' ? '#FF8B9E' : 'var(--aurora-violet)',
                                            fontFamily: 'var(--font-mono)',
                                        }}
                                    >
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ------------------------------------------------------------------ */}
                {/* TAB 1: EXECUTIVE SUMMARY / OVERVIEW */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Highlights Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {/* Card 1: NASA HRP Framework */}
                            <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '3px solid var(--electric-cyan)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                    <Radiation size={20} color="var(--electric-cyan)" />
                                    <span className="badge badge-info">NASA Human Research Program</span>
                                </div>
                                <h3 style={{ margin: '0 0 0.75rem', color: 'var(--stellar-white)' }}>The 5 Major Hazards Framework</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                    NASA’s Human Research Program organizes the perils of space exploration under the <strong>R-I-D-G-E</strong> acronym: <strong>Radiation</strong>, <strong>Isolation</strong>, <strong>Distance from Earth</strong>, <strong>Gravity fields</strong>, and <strong>Hostile/closed Environments</strong>. Understanding and mitigating these hazards is the cornerstone of the Artemis lunar missions and human Mars expeditions.
                                </p>
                                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('hazards')}>
                                    Explore the 5 Hazards <ArrowRight size={13} />
                                </button>
                            </div>

                            {/* Card 2: Canadian Space Agency Partner Science */}
                            <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '3px solid var(--critical-coral)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                    <Microscope size={20} color="var(--critical-coral)" />
                                    <span className="badge" style={{ background: 'rgba(255,100,124,0.15)', borderColor: 'rgba(255,100,124,0.4)', color: '#FF8B9E' }}>
                                        Canadian Space Agency (CSA)
                                    </span>
                                </div>
                                <h3 style={{ margin: '0 0 0.75rem', color: 'var(--stellar-white)' }}>Radiation Monitoring & Microgravity Science</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                    Canada pioneers critical space health technologies, including <strong>EVARM</strong> spacewalk dosimeters, <strong>bubble detectors</strong> for secondary neutrons, and the <strong>Bio-Monitor</strong> smart garment. CSA research leverages microgravity as an accelerated model of human aging to advance osteoporosis treatments and surgical robotics (neuroArm/IGAR) on Earth.
                                </p>
                                <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,100,124,0.4)', color: '#FF8B9E' }} onClick={() => setActiveTab('csa-radiation')}>
                                    View CSA Research <ArrowRight size={13} />
                                </button>
                            </div>

                            {/* Card 3: Deep-Space Exploration Medical Capability */}
                            <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '3px solid var(--aurora-violet)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                    <Brain size={20} color="var(--aurora-violet)" />
                                    <span className="badge badge-violet">Autonomous Clinical AI</span>
                                </div>
                                <h3 style={{ margin: '0 0 0.75rem', color: 'var(--stellar-white)' }}>Mission Intelligence & Clinical Countermeasures</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                    On a 3-year journey to Mars, real-time communications with Earth ground doctors will encounter up to 22 minutes of one-way latency. Astronauts must rely on onboard intelligent platforms—like <strong>AstroCare</strong>—to detect physiological anomalies, monitor cumulative radiation exposure, and suggest evidence-based countermeasure protocols autonomously.
                                </p>
                                <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(146,117,255,0.4)', color: 'var(--aurora-violet)' }} onClick={() => setActiveTab('hrp-studies')}>
                                    Inspect Ongoing Studies <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Hazard Quick-Cards */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>NASA's Five Hazards at a Glance</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('hazards')}>
                                    Detailed Breakdown <ArrowRight size={13} />
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                {NASA_FIVE_HAZARDS.map(h => {
                                    const Icon = HAZARD_ICONS[h.iconName] || Radiation;
                                    return (
                                        <div
                                            key={h.id}
                                            className="glass-card"
                                            style={{
                                                padding: '1.25rem',
                                                cursor: 'pointer',
                                                transition: 'transform 150ms ease, border-color 150ms ease',
                                                borderTop: `3px solid ${h.color}`,
                                            }}
                                            onClick={() => {
                                                setExpandedHazard(h.id);
                                                setActiveTab('hazards');
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${h.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Icon size={18} color={h.color} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: h.color, fontWeight: 700 }}>
                                                    HAZARD #{h.hazardNumber}
                                                </span>
                                            </div>
                                            <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.95rem', color: 'var(--stellar-white)' }}>{h.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {h.simpleExplanation}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Official Resource Center Embed */}
                        <div style={{ marginTop: '1rem' }}>
                            <OfficialResourceCenter compact={true} />
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* TAB 2: NASA FIVE MAJOR HAZARDS OF HUMAN SPACEFLIGHT */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'hazards' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span className="badge badge-info">NASA Human Research Program (HRP)</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>5 Core Hazards Framework</span>
                            </div>
                            <h2 style={{ margin: '0 0 0.5rem' }}>The Five Hazards of Human Spaceflight</h2>
                            <p style={{ margin: 0, maxWidth: 850, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                Space is an uncompromising environment. NASA categorizes the physiological and psychological dangers into five major hazards. Below is the complete scientific breakdown, explaining why astronauts are exposed, bodily effects, long-term risks, and countermeasure technologies.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {filteredHazards.map(hazard => {
                                const isExpanded = expandedHazard === hazard.id;
                                const Icon = HAZARD_ICONS[hazard.iconName] || Radiation;

                                return (
                                    <div
                                        key={hazard.id}
                                        id={hazard.id}
                                        className="glass-card"
                                        style={{
                                            padding: '1.5rem',
                                            borderLeft: `4px solid ${hazard.color}`,
                                            transition: 'all 200ms ease',
                                        }}
                                    >
                                        {/* Header Row */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                cursor: 'pointer',
                                                gap: '1rem',
                                            }}
                                            onClick={() => setExpandedHazard(isExpanded ? null : hazard.id)}
                                        >
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 'var(--radius-md)',
                                                        background: `${hazard.color}18`,
                                                        border: `1px solid ${hazard.color}35`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Icon size={22} color={hazard.color} />
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: hazard.color, fontWeight: 700, textTransform: 'uppercase' }}>
                                                            Hazard #{hazard.hazardNumber} • Acronym [{hazard.acronym}]
                                                        </span>
                                                        <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>NASA HRP</span>
                                                    </div>
                                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--stellar-white)' }}>
                                                        {hazard.title}
                                                    </h3>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                        {hazard.subtitle}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'none' }} className="hide-mobile">
                                                    {isExpanded ? 'Collapse' : 'Expand Details'}
                                                </span>
                                                {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                                            </div>
                                        </div>

                                        {/* Simple Explanation Callout */}
                                        <div
                                            style={{
                                                marginTop: '1.25rem',
                                                padding: '1rem',
                                                background: 'rgba(83, 231, 255, 0.04)',
                                                border: '1px solid rgba(83, 231, 255, 0.12)',
                                                borderRadius: 'var(--radius-md)',
                                            }}
                                        >
                                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                                Simple English Explanation (For Students & General Audiences)
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--stellar-white)' }}>
                                                {hazard.simpleExplanation}
                                            </p>
                                        </div>

                                        {/* Expanded Deep Scientific Details */}
                                        {isExpanded && (
                                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                                {/* Why Astronauts Are Exposed */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.4rem', color: 'var(--warning-amber)' }}>
                                                        Why Astronauts Are Exposed To This Hazard
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                                        {hazard.whyAstronautsExposed}
                                                    </p>
                                                </div>

                                                {/* Effects on Human Body & Mind */}
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                                    {/* Physical effects */}
                                                    <div style={{ padding: '1rem', background: 'rgba(11, 16, 38, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--critical-coral)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <Activity size={14} /> Physical & Physiological Effects
                                                        </div>
                                                        <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                            {hazard.bodyAndMindEffects.physical.map((eff, i) => (
                                                                <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                                    {eff}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Psychological effects */}
                                                    <div style={{ padding: '1rem', background: 'rgba(11, 16, 38, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--aurora-violet)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <Brain size={14} /> Psychological & Cognitive Effects
                                                        </div>
                                                        <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                            {hazard.bodyAndMindEffects.psychological.map((eff, i) => (
                                                                <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                                    {eff}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Long-term consequences */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.4rem', color: 'var(--critical-coral)' }}>
                                                        Potential Long-Term Consequences
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                                                        {hazard.longTermConsequences.map((cons, i) => (
                                                            <div key={i} style={{ padding: '0.6rem 0.75rem', background: 'rgba(255, 100, 124, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 100, 124, 0.15)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                                                • {cons}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Protection Strategies: Current vs Emerging */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.4rem', color: 'var(--success-mint)' }}>
                                                        Protection Strategies & Countermeasures
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                                        <div style={{ padding: '0.85rem', background: 'rgba(93, 242, 180, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(93, 242, 180, 0.15)' }}>
                                                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', fontWeight: 600, marginBottom: '0.4rem' }}>
                                                                ✓ CURRENT OPERATIONAL COUNTERMEASURES
                                                            </div>
                                                            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                                {hazard.protectionStrategies.current.map((strat, i) => (
                                                                    <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{strat}</li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div style={{ padding: '0.85rem', background: 'rgba(83, 231, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(83, 231, 255, 0.15)' }}>
                                                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600, marginBottom: '0.4rem' }}>
                                                                🚀 EMERGING & FUTURE DEEP-SPACE TECHNOLOGIES
                                                            </div>
                                                            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                                {hazard.protectionStrategies.emerging.map((strat, i) => (
                                                                    <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{strat}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Official Link */}
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                                                    <a
                                                        href={hazard.officialUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ color: hazard.color }}
                                                    >
                                                        <span>NASA HRP Hazards Reference</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* TAB 3: HUMAN SPACEFLIGHT HEALTH RISKS (NASA HRP) */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'risks' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span className="badge badge-info">NASA Human Research Program (HRP)</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Clinical Health Risk Catalog</span>
                            </div>
                            <h2 style={{ margin: '0 0 0.5rem' }}>Human Spaceflight Health Risks</h2>
                            <p style={{ margin: 0, maxWidth: 850, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                Detailed medical analysis of the primary physiological changes astronauts experience. Each risk includes the biological mechanism, clinical impact, long-term consequences, monitoring methods, and a strict scientific distinction between established clinical facts and active ongoing research frontiers.
                            </p>
                        </div>

                        {/* Risk Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {filteredRisks.map(risk => {
                                const isExpanded = expandedRisk === risk.id;
                                const Icon = RISK_ICONS[risk.iconName] || Activity;
                                const isEstablished = risk.scientificStatus === 'Established Finding';

                                return (
                                    <div
                                        key={risk.id}
                                        id={risk.id}
                                        className="glass-card"
                                        style={{
                                            padding: '1.5rem',
                                            borderLeft: `4px solid ${risk.color}`,
                                        }}
                                    >
                                        {/* Header */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                cursor: 'pointer',
                                                gap: '1rem',
                                            }}
                                            onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
                                        >
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        width: 42,
                                                        height: 42,
                                                        borderRadius: 'var(--radius-md)',
                                                        background: `${risk.color}15`,
                                                        border: `1px solid ${risk.color}30`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Icon size={20} color={risk.color} />
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: risk.color, fontWeight: 700, textTransform: 'uppercase' }}>
                                                            {risk.category}
                                                        </span>
                                                        <span
                                                            className="badge"
                                                            style={{
                                                                background: isEstablished ? 'rgba(93, 242, 180, 0.12)' : 'rgba(255, 202, 114, 0.12)',
                                                                borderColor: isEstablished ? 'rgba(93, 242, 180, 0.4)' : 'rgba(255, 202, 114, 0.4)',
                                                                color: isEstablished ? 'var(--success-mint)' : 'var(--warning-amber)',
                                                                fontSize: '0.65rem',
                                                            }}
                                                        >
                                                            {risk.scientificStatus}
                                                        </span>
                                                    </div>
                                                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--stellar-white)' }}>
                                                        {risk.riskTitle}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                                            </div>
                                        </div>

                                        {/* Organ Tags */}
                                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', alignSelf: 'center' }}>
                                                Target Systems:
                                            </span>
                                            {risk.relatedOrgans.map(org => (
                                                <span key={org} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(145, 160, 190, 0.1)', color: 'var(--text-secondary)' }}>
                                                    {org}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Brief Overview Preview */}
                                        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                            {risk.whatHappens}
                                        </div>

                                        {/* Expanded 5 Required Breakdown Items */}
                                        {isExpanded && (
                                            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {/* Item 1: Why does it happen? */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.3rem', color: 'var(--electric-cyan)' }}>
                                                        1. Why Does It Happen? (Physiological Mechanism)
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                                        {risk.whyItHappens}
                                                    </p>
                                                </div>

                                                {/* Item 2: How does it affect astronauts? */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.3rem', color: 'var(--warning-amber)' }}>
                                                        2. How Does It Affect Astronauts? (Operational & Clinical Manifestations)
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                                        {risk.howItAffectsAstronauts}
                                                    </p>
                                                </div>

                                                {/* Item 3: Possible consequences */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.3rem', color: 'var(--critical-coral)' }}>
                                                        3. What Are The Possible Consequences?
                                                    </div>
                                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                        {risk.possibleConsequences.map((cons, i) => (
                                                            <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{cons}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Item 4: How can it be monitored or reduced? */}
                                                <div>
                                                    <div className="telemetry-label" style={{ marginBottom: '0.3rem', color: 'var(--success-mint)' }}>
                                                        4. How Can It Be Monitored Or Reduced?
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                                                        <div style={{ padding: '0.75rem', background: 'rgba(83, 231, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(83, 231, 255, 0.15)' }}>
                                                            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600, marginBottom: '0.3rem' }}>
                                                                DIAGNOSTIC MONITORING METHODS
                                                            </div>
                                                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                                {risk.monitoringAndMitigation.monitoring.map((m, i) => (
                                                                    <li key={i}>{m}</li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div style={{ padding: '0.75rem', background: 'rgba(93, 242, 180, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(93, 242, 180, 0.15)' }}>
                                                            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', fontWeight: 600, marginBottom: '0.3rem' }}>
                                                                MITIGATION & COUNTERMEASURES
                                                            </div>
                                                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                                {risk.monitoringAndMitigation.mitigation.map((m, i) => (
                                                                    <li key={i}>{m}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Item 5: Scientific Status Distinction Callout */}
                                                <div style={{ padding: '0.75rem', background: 'rgba(146, 117, 255, 0.06)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--aurora-violet)' }}>
                                                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--aurora-violet)', fontWeight: 600, marginBottom: '0.2rem' }}>
                                                        SCIENTIFIC RIGOR NOTE // EVIDENCE STATUS: {risk.scientificStatus.toUpperCase()}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        {risk.statusNotes}
                                                    </p>
                                                </div>

                                                {/* Official link */}
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                                                    <a href={risk.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ color: risk.color }}>
                                                        <span>Official NASA Risk Registry</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* TAB 4: NASA ONGOING HUMAN RESEARCH PROGRAM (HRP) */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'hrp-studies' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* HRP Overview Banner */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--electric-cyan)', background: 'linear-gradient(135deg, rgba(11,16,38,0.9), rgba(17,28,61,0.6))' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span className="badge badge-info">NASA Human Research Program (HRP)</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Official Research Portfolio</span>
                            </div>
                            <h2 style={{ margin: '0 0 0.75rem', color: 'var(--stellar-white)' }}>{NASA_HRP_OVERVIEW.title}</h2>
                            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {NASA_HRP_OVERVIEW.description}
                            </p>

                            <div style={{ padding: '1rem', background: 'rgba(83, 231, 255, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(83, 231, 255, 0.15)', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                    Why NASA Conducts Human Spaceflight Research
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--stellar-white)', lineHeight: 1.6 }}>
                                    {NASA_HRP_OVERVIEW.whyNASAConductsResearch}
                                </p>
                            </div>

                            {/* Core 5 Elements */}
                            <div>
                                <div className="telemetry-label" style={{ marginBottom: '0.75rem', color: 'var(--aurora-violet)' }}>
                                    NASA HRP Core Research Elements
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                                    {NASA_HRP_OVERVIEW.coreElements.map((elem, i) => (
                                        <div key={i} style={{ padding: '0.75rem', background: 'rgba(11, 16, 38, 0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--stellar-white)', marginBottom: '0.2rem' }}>
                                                {elem.name}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
                                                {elem.lead}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                {elem.focus}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Flagship Experiments List */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Active & Landmark NASA HRP Experiments</h3>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        Peer-verified research studies supporting astronaut health on ISS, Artemis Moon missions, and future Mars journeys.
                                    </p>
                                </div>
                                <a href="https://www.nasa.gov/hrp/ongoing-hrp-research/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                    <span>NASA HRP Research Portal</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                                {filteredStudies.map(study => (
                                    <div
                                        key={study.id}
                                        className="glass-card"
                                        style={{
                                            padding: '1.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            borderTop: '3px solid var(--electric-cyan)',
                                        }}
                                    >
                                        <div>
                                            {/* Status and Element */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        background: study.currentStatus.includes('Active') ? 'rgba(93, 242, 180, 0.12)' : 'rgba(146, 117, 255, 0.12)',
                                                        borderColor: study.currentStatus.includes('Active') ? 'rgba(93, 242, 180, 0.4)' : 'rgba(146, 117, 255, 0.4)',
                                                        color: study.currentStatus.includes('Active') ? 'var(--success-mint)' : 'var(--aurora-violet)',
                                                        fontSize: '0.68rem',
                                                    }}
                                                >
                                                    {study.currentStatus}
                                                </span>
                                                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                                    {study.statusVerificationDate}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', color: 'var(--stellar-white)', lineHeight: 1.3 }}>
                                                {study.title}
                                            </h4>

                                            <div style={{ fontSize: '0.72rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                                                {study.elementFullName}
                                            </div>

                                            {/* Objective */}
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <div className="telemetry-label" style={{ marginBottom: '0.2rem' }}>Research Objective</div>
                                                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                    {study.objective}
                                                </p>
                                            </div>

                                            {/* Scientific Significance */}
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <div className="telemetry-label" style={{ marginBottom: '0.2rem' }}>Scientific Significance</div>
                                                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                    {study.scientificSignificance}
                                                </p>
                                            </div>

                                            {/* Moon & Mars Relevance */}
                                            <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(83, 231, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(83, 231, 255, 0.12)', marginBottom: '0.75rem' }}>
                                                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                    Contribution To Moon (Artemis) & Mars Missions
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--stellar-white)' }}>
                                                    {study.futureMissionRelevance}
                                                </div>
                                            </div>

                                            {/* Key Verified Findings */}
                                            <div style={{ marginBottom: '1rem' }}>
                                                <div className="telemetry-label" style={{ marginBottom: '0.3rem' }}>Key Scientific Discoveries</div>
                                                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    {study.keyFindings.map((kf, i) => (
                                                        <li key={i}>{kf}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Official link */}
                                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                                            <a
                                                href={study.officialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline btn-sm w-full"
                                                style={{ justifyContent: 'center' }}
                                            >
                                                <span>Official NASA HRP Article</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* TAB 5: CSA PARTNER RESOURCE 1 - RADIATION MONITORING */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'csa-radiation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* CSA Attribution Banner */}
                        <div
                            className="glass-card"
                            style={{
                                padding: '1.75rem',
                                borderLeft: '4px solid var(--critical-coral)',
                                background: 'linear-gradient(135deg, rgba(255, 100, 124, 0.08), rgba(11, 16, 38, 0.9))',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                                <span className="badge" style={{ background: 'rgba(255,100,124,0.15)', borderColor: 'rgba(255,100,124,0.4)', color: '#FF8B9E', fontWeight: 700 }}>
                                    Canadian Space Agency (CSA) Official Resource
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    Partner Research Integration
                                </span>
                            </div>
                            <h2 style={{ margin: '0 0 0.5rem', color: 'var(--stellar-white)' }}>
                                {CSA_RADIATION_RESOURCE.title}
                            </h2>
                            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {CSA_RADIATION_RESOURCE.summary}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <a
                                    href={CSA_RADIATION_RESOURCE.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm"
                                    style={{ background: 'linear-gradient(135deg, #FF647C, #cc3b52)', color: 'white' }}
                                >
                                    <span>Read Official CSA Article</span>
                                    <ExternalLink size={13} />
                                </a>
                                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                    URL: asc-csa.gc.ca • Verified Canadian Space Agency Publication
                                </span>
                            </div>
                        </div>

                        {/* Core Sections Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {CSA_RADIATION_RESOURCE.coreSections.map((sec, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', color: '#FF8B9E' }}>
                                        {sec.title}
                                    </h3>
                                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                                        {sec.content}
                                    </p>
                                    {sec.points && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {sec.points.map((pt, pi) => (
                                                <div key={pi} style={{ padding: '0.65rem 0.85rem', background: 'rgba(11,16,38,0.7)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid rgba(255, 100, 124, 0.4)', fontSize: '0.83rem', color: 'var(--stellar-white)', lineHeight: 1.5 }}>
                                                    {pt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Canadian Radiation Technologies */}
                        {CSA_RADIATION_RESOURCE.technologiesOrProjects && (
                            <div className="glass-card" style={{ padding: '1.75rem' }}>
                                <div className="section-eyebrow" style={{ color: '#FF8B9E', marginBottom: '0.4rem' }}>
                                    CANADIAN SPACE AGENCY HARDWARE
                                </div>
                                <h3 style={{ margin: '0 0 1rem' }}>Canadian Technologies Measuring Space Radiation</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                    {CSA_RADIATION_RESOURCE.technologiesOrProjects.map((tech, i) => (
                                        <div key={i} style={{ padding: '1rem', background: 'rgba(11, 16, 38, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--stellar-white)', marginBottom: '0.25rem' }}>
                                                {tech.name}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                                                {tech.application}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                {tech.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* TAB 6: CSA PARTNER RESOURCE 2 - SCIENCE IN SPACE */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'csa-science' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* CSA Header Banner */}
                        <div
                            className="glass-card"
                            style={{
                                padding: '1.75rem',
                                borderLeft: '4px solid var(--aurora-violet)',
                                background: 'linear-gradient(135deg, rgba(146, 117, 255, 0.08), rgba(11, 16, 38, 0.9))',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                                <span className="badge" style={{ background: 'rgba(146, 117, 255, 0.15)', borderColor: 'rgba(146, 117, 255, 0.4)', color: 'var(--aurora-violet)', fontWeight: 700 }}>
                                    Canadian Space Agency (CSA) Official Resource
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    Microgravity Science & Spinoffs
                                </span>
                            </div>
                            <h2 style={{ margin: '0 0 0.5rem', color: 'var(--stellar-white)' }}>
                                {CSA_SCIENCE_IN_SPACE_RESOURCE.title}
                            </h2>
                            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {CSA_SCIENCE_IN_SPACE_RESOURCE.summary}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <a
                                    href={CSA_SCIENCE_IN_SPACE_RESOURCE.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-violet btn-sm"
                                >
                                    <span>Read Official CSA Science Portal</span>
                                    <ExternalLink size={13} />
                                </a>
                                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                    URL: asc-csa.gc.ca • Canadian Space Agency ISS Science
                                </span>
                            </div>
                        </div>

                        {/* Core Sections */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {CSA_SCIENCE_IN_SPACE_RESOURCE.coreSections.map((sec, i) => (
                                <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', color: 'var(--aurora-violet)' }}>
                                        {sec.title}
                                    </h3>
                                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                                        {sec.content}
                                    </p>
                                    {sec.points && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {sec.points.map((pt, pi) => (
                                                <div key={pi} style={{ padding: '0.65rem 0.85rem', background: 'rgba(11,16,38,0.7)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid rgba(146, 117, 255, 0.4)', fontSize: '0.83rem', color: 'var(--stellar-white)', lineHeight: 1.5 }}>
                                                    {pt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {sec.callout && (
                                        <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(83, 231, 255, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(83, 231, 255, 0.2)' }}>
                                            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                Scientific Highlight // Accelerated Human Aging Model
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--stellar-white)', lineHeight: 1.55 }}>
                                                {sec.callout}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CSA Flagship Experiments */}
                        {CSA_SCIENCE_IN_SPACE_RESOURCE.technologiesOrProjects && (
                            <div className="glass-card" style={{ padding: '1.75rem' }}>
                                <div className="section-eyebrow" style={{ color: 'var(--aurora-violet)', marginBottom: '0.4rem' }}>
                                    CANADIAN SPACE AGENCY EXPERIMENTS
                                </div>
                                <h3 style={{ margin: '0 0 1rem' }}>Key Canadian Studies Aboard the International Space Station</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                    {CSA_SCIENCE_IN_SPACE_RESOURCE.technologiesOrProjects.map((exp, i) => (
                                        <div key={i} style={{ padding: '1rem', background: 'rgba(11, 16, 38, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--stellar-white)', marginBottom: '0.25rem' }}>
                                                {exp.name}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--aurora-violet)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                                                {exp.application}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* In Space vs On Earth Benefits Comparison Table */}
                        {CSA_SCIENCE_IN_SPACE_RESOURCE.earthAndSpaceBenefits && (
                            <div className="glass-card" style={{ padding: '1.75rem' }}>
                                <div className="section-eyebrow" style={{ color: 'var(--success-mint)', marginBottom: '0.4rem' }}>
                                    DUAL BENEFIT ARCHITECTURE
                                </div>
                                <h3 style={{ margin: '0 0 1rem' }}>How Space Experiments Directly Benefit People on Earth</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {CSA_SCIENCE_IN_SPACE_RESOURCE.earthAndSpaceBenefits.map((item, i) => (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.85rem', background: 'rgba(11, 16, 38, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', marginBottom: '0.25rem' }}>
                                                    IN SPACE (ASTRONAUT SAFETY)
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                    {item.inSpace}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', marginBottom: '0.25rem' }}>
                                                    ON EARTH (CLINICAL PATIENT CARE)
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--stellar-white)', lineHeight: 1.5 }}>
                                                    {item.onEarth}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* TAB 7: OFFICIAL RESOURCE CENTER */}
                {/* ------------------------------------------------------------------ */}
                {activeTab === 'resources' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <OfficialResourceCenter compact={false} />
                    </div>
                )}
            </div>
        </div>
    );
};
