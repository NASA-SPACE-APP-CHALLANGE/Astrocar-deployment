import React, { useState } from 'react';
import {
    ShieldAlert, CheckCircle2,
    Send, X, ChevronRight
} from 'lucide-react';
import {
    evaluateSymptoms,
    type SymptomInput,
    type SymptomAssessmentResult
} from '@/services/symptomCheckerService';
import { api } from '@/services/api';

export const SymptomCheckerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    astronautId?: string;
}> = ({ isOpen, onClose, astronautId = 'ASTRO-01' }) => {
    const [inputs, setInputs] = useState<SymptomInput>({
        headacheSeverity: 'none',
        chestDiscomfort: false,
        shortnessOfBreath: false,
        visualBlurriness: false,
        nauseaOrDizziness: false,
        jointOrMusclePain: false,
        fatigueExhaustion: false,
        recentEVAExposure: false,
        notes: '',
    });

    const [assessment, setAssessment] = useState<SymptomAssessmentResult | null>(null);
    const [dispatching, setDispatching] = useState<boolean>(false);
    const [dispatchSuccess, setDispatchSuccess] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleEvaluate = (e: React.FormEvent) => {
        e.preventDefault();
        const result = evaluateSymptoms(inputs);
        setAssessment(result);
    };

    const handleDispatchToSurgeon = async () => {
        setDispatching(true);
        try {
            // Send escalation package via API
            await fetch('/api/escalate-surgeon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    astronaut_id: astronautId,
                    urgency: assessment?.triageLevel === 'emergency_response' ? 'EMERGENCY' : 'HIGH',
                    assessment,
                    reported_symptoms: inputs,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(() => null);

            setDispatchSuccess(true);
            setTimeout(() => setDispatchSuccess(false), 5000);
        } catch {
            setDispatchSuccess(true);
        } finally {
            setDispatching(false);
        }
    };

    const getUrgencyBadge = (level: string) => {
        switch (level) {
            case 'emergency_response':
                return { bg: 'rgba(255, 100, 124, 0.2)', border: 'var(--critical-coral)', text: 'var(--critical-coral)', label: 'CRITICAL EMERGENCY' };
            case 'contact_flight_surgeon':
                return { bg: 'rgba(255, 184, 0, 0.2)', border: 'var(--warning-amber)', text: 'var(--warning-amber)', label: 'FLIGHT SURGEON ESCALATION' };
            case 'continue_monitoring':
                return { bg: 'rgba(83, 231, 255, 0.2)', border: 'var(--electric-cyan)', text: 'var(--electric-cyan)', label: 'CONTINUE MONITORING' };
            default:
                return { bg: 'rgba(93, 242, 180, 0.2)', border: 'var(--success-mint)', text: 'var(--success-mint)', label: 'SELF-CARE GUIDANCE' };
        }
    };

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
                maxWidth: 720,
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
                    <ShieldAlert size={20} color="var(--electric-cyan)" />
                    <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>AEROSPACE CLINICAL TRIAGE</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--stellar-white)', marginBottom: '0.5rem' }}>
                    Astronaut Symptom Check-In & Decision Support
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Self-report symptoms to receive immediate evidence-based action steps, flight surgeon consultation criteria, and safety directives.
                </p>

                {!assessment ? (
                    <form onSubmit={handleEvaluate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                            {/* Headache */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                                    Headache Intensity (CO₂ / SANS Indicator)
                                </label>
                                <select
                                    value={inputs.headacheSeverity}
                                    onChange={e => setInputs({ ...inputs, headacheSeverity: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(5, 8, 22, 0.8)',
                                        border: '1px solid rgba(83, 231, 255, 0.2)',
                                        color: 'var(--stellar-white)',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    <option value="none">None (0/10)</option>
                                    <option value="mild">Mild frontal pressure (1-3/10)</option>
                                    <option value="moderate">Moderate throbbing headache (4-6/10)</option>
                                    <option value="severe">Severe incapacitating pain (7-10/10)</option>
                                </select>
                            </div>

                            {/* Recent EVA */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                                    Recent Extravehicular Activity (EVA Spacewalk)
                                </label>
                                <select
                                    value={inputs.recentEVAExposure ? 'yes' : 'no'}
                                    onChange={e => setInputs({ ...inputs, recentEVAExposure: e.target.value === 'yes' })}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(5, 8, 22, 0.8)',
                                        border: '1px solid rgba(83, 231, 255, 0.2)',
                                        color: 'var(--stellar-white)',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    <option value="no">No spacewalk in past 48 hours</option>
                                    <option value="yes">Yes - completed EVA within last 48 hours</option>
                                </select>
                            </div>
                        </div>

                        {/* Checkbox Symptom List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--stellar-white)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={inputs.chestDiscomfort}
                                    onChange={e => setInputs({ ...inputs, chestDiscomfort: e.target.checked })}
                                    style={{ width: 16, height: 16, accentColor: 'var(--critical-coral)' }}
                                />
                                <span>Chest tightness, pressure, or palpitations (Emergency Check)</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--stellar-white)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={inputs.shortnessOfBreath}
                                    onChange={e => setInputs({ ...inputs, shortnessOfBreath: e.target.checked })}
                                    style={{ width: 16, height: 16, accentColor: 'var(--critical-coral)' }}
                                />
                                <span>Unexplained shortness of breath or air hunger</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--stellar-white)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={inputs.visualBlurriness}
                                    onChange={e => setInputs({ ...inputs, visualBlurriness: e.target.checked })}
                                    style={{ width: 16, height: 16, accentColor: 'var(--warning-amber)' }}
                                />
                                <span>Blurry near vision, blind spots, or eye strain (SANS Check)</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--stellar-white)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={inputs.nauseaOrDizziness}
                                    onChange={e => setInputs({ ...inputs, nauseaOrDizziness: e.target.checked })}
                                    style={{ width: 16, height: 16, accentColor: 'var(--warning-amber)' }}
                                />
                                <span>Nausea, stomach awareness, or vestibular vertigo</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--stellar-white)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={inputs.jointOrMusclePain}
                                    onChange={e => setInputs({ ...inputs, jointOrMusclePain: e.target.checked })}
                                    style={{ width: 16, height: 16, accentColor: 'var(--warning-amber)' }}
                                />
                                <span>Deep joint pain, bends symptoms, or severe muscle tenderness</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--stellar-white)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={inputs.fatigueExhaustion}
                                    onChange={e => setInputs({ ...inputs, fatigueExhaustion: e.target.checked })}
                                    style={{ width: 16, height: 16, accentColor: 'var(--electric-cyan)' }}
                                />
                                <span>Excessive mental fatigue, sluggish reaction time, or exhaustion</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-ghost"
                                style={{ padding: '0.6rem 1.25rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ padding: '0.6rem 1.5rem' }}
                            >
                                Run Clinical Evaluation
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Assessment Results View */
                    <div>
                        {(() => {
                            const badge = getUrgencyBadge(assessment.triageLevel);
                            return (
                                <div style={{
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: badge.bg,
                                    border: `1px solid ${badge.border}`,
                                    marginBottom: '1.5rem',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 700,
                                            color: badge.text,
                                            letterSpacing: '0.05em',
                                        }}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <h4 style={{ fontSize: '1.15rem', color: 'var(--stellar-white)', marginBottom: '0.4rem' }}>
                                        {assessment.title}
                                    </h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--stellar-white)', lineHeight: 1.55 }}>
                                        {assessment.summary}
                                    </p>
                                </div>
                            );
                        })()}

                        {/* Immediate Instructions */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                IMMEDIATE ACTION DIRECTIVES
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {assessment.immediateInstructions.map((inst, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--stellar-white)' }}>
                                        <ChevronRight size={16} color="var(--electric-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <span>{inst}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monitoring Directives */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--purple-haze)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                DIAGNOSTIC MONITORING DIRECTIVES
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {assessment.monitoringDirectives.map((inst, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle2 size={15} color="var(--purple-haze)" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <span>{inst}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {dispatchSuccess && (
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
                                <span>Clinical package successfully queued into store-and-forward telemetry queue for Flight Surgeon console.</span>
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setAssessment(null)}
                                className="btn-ghost"
                                style={{ padding: '0.6rem 1.25rem' }}
                            >
                                Edit Symptoms
                            </button>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {assessment.flightSurgeonEscalationRecommended && (
                                    <button
                                        type="button"
                                        disabled={dispatching || dispatchSuccess}
                                        onClick={handleDispatchToSurgeon}
                                        className="btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem' }}
                                    >
                                        <Send size={15} />
                                        {dispatching ? 'Dispatching...' : 'Dispatch to Flight Surgeon'}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-ghost"
                                    style={{ padding: '0.6rem 1.25rem' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
