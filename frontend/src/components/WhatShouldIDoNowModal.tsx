import React from 'react';
import { HelpCircle, CheckCircle2, ChevronRight, X, PhoneCall } from 'lucide-react';
import { generateWhatShouldIDoNowGuide, type WhatShouldIDoNowGuide } from '@/services/symptomCheckerService';

export const WhatShouldIDoNowModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    metricName: string;
    metricValue: number | string;
    severity: string;
}> = ({ isOpen, onClose, metricName, metricValue, severity }) => {
    if (!isOpen) return null;

    const guide: WhatShouldIDoNowGuide = generateWhatShouldIDoNowGuide(metricName, metricValue, severity);

    return (
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
                border: '1px solid rgba(83, 231, 255, 0.3)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: 680,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
            }}>
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
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
                    <HelpCircle size={20} color="var(--electric-cyan)" />
                    <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>STEP-BY-STEP RESPONSE GUIDE</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--stellar-white)', marginBottom: '0.4rem' }}>
                    What Should I Do Now?
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Standard Operational Procedure for <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)' }}>{guide.metricName}</span>.
                </p>

                {/* 1. What Happened */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(5, 8, 22, 0.65)', border: '1px solid rgba(83, 231, 255, 0.15)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600, marginBottom: '0.3rem' }}>
                        1. WHAT HAPPENED?
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--stellar-white)', lineHeight: 1.5 }}>
                        {guide.whatHappened}
                    </div>
                </div>

                {/* 2. Why It Matters */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(5, 8, 22, 0.65)', border: '1px solid rgba(146, 117, 255, 0.2)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-haze)', fontWeight: 600, marginBottom: '0.3rem' }}>
                        2. WHY IT MATTERS
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {guide.whyItMatters}
                    </div>
                </div>

                {/* 3. What Should Be Checked */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(5, 8, 22, 0.65)', border: '1px solid rgba(255, 184, 0, 0.2)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--warning-amber)', fontWeight: 600, marginBottom: '0.4rem' }}>
                        3. WHAT SHOULD BE CHECKED?
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {guide.whatShouldBeChecked.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <ChevronRight size={15} color="var(--warning-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. What Action Should Be Taken */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(5, 8, 22, 0.65)', border: '1px solid rgba(93, 242, 180, 0.2)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--success-mint)', fontWeight: 600, marginBottom: '0.4rem' }}>
                        4. WHAT ACTION SHOULD BE TAKEN?
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {guide.whatActionShouldBeTaken.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--stellar-white)' }}>
                                <CheckCircle2 size={15} color="var(--success-mint)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. When To Contact Flight Surgeon */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 100, 124, 0.1)', border: '1px solid rgba(255, 100, 124, 0.3)', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--critical-coral)', fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <PhoneCall size={14} />
                        <span>5. WHEN SHOULD THE FLIGHT SURGEON BE CONTACTED?</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {guide.whenToContactFlightSurgeon}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.5rem' }}
                    >
                        Understood & Acknowledged
                    </button>
                </div>
            </div>
        </div>
    );
};
